package com.artsail.iot.service;

import com.artsail.iot.constant.MqttTopics;
import com.artsail.iot.mapper.IotCommandLogMapper;
import com.artsail.iot.mapper.IotDeviceMapper;
import com.artsail.iot.mapper.IotDeviceProtocolMapMapper;
import com.artsail.iot.model.domain.IotAlert;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.artsail.iot.model.domain.IotCommandLog;
import com.artsail.iot.model.domain.IotAlertRule;
import com.artsail.iot.model.domain.IotDevice;
import com.artsail.iot.model.domain.IotDeviceProtocolMap;
import com.artsail.iot.model.domain.IotMetricDef;
import com.artsail.iot.model.domain.IotTsData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttSubscriberService {

    private static final DateTimeFormatter DT_FMT_ISO = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss[.SSSSSSSSS][.SSS]");
    private static final DateTimeFormatter DT_FMT_SPACE = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss[.SSSSSSSSS][.SSS]");

    private final IotDeviceMapper iotDeviceMapper;
    private final IotTsDataService iotTsDataService;
    private final IotAlertService iotAlertService;
    private final IotAlertRuleService iotAlertRuleService;
    private final IotMetricDefService iotMetricDefService;
    private final IotDeviceProtocolMapMapper iotDeviceProtocolMapMapper;
    private final IotCommandLogMapper iotCommandLogMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<?> message) {
        String topic = (String) message.getHeaders().get("mqtt_receivedTopic");
        String payload = message.getPayload().toString();
        log.debug("MQTT received: topic={}, payload={}", topic, payload);

        try {
            MqttTopics.TopicInfo info = MqttTopics.parseDataTopic(topic);
            if (info == null) {
                log.warn("Invalid topic format: {}", topic);
                return;
            }

            IotDevice device = iotDeviceMapper.selectOne(
                    new LambdaQueryWrapper<IotDevice>()
                            .eq(IotDevice::getDeviceSn, info.deviceSn()));
            if (device == null) {
                log.warn("Device not found: {}", info.deviceSn());
                return;
            }

            JsonNode root = objectMapper.readTree(payload);
            String timeStr = root.has("time") ? root.get("time").asText() : LocalDateTime.now().toString();
            LocalDateTime recordTime = parseTime(timeStr);

            // format 1: metrics array  [{"key": "dissolved_oxygen", "value": 6.8}]
            if (root.has("metrics") && root.get("metrics").isArray()) {
                for (JsonNode metric : root.get("metrics")) {
                    saveMetric(device, metric.get("key").asText(),
                            metric.get("value").asDouble(), recordTime);
                }
            } else {
                // format 2: flat JSON  {"DO": 6.8, "TEMP": 25.3}
                Map<String, String> fieldMap = new HashMap<>();
                List<IotDeviceProtocolMap> mappings = iotDeviceProtocolMapMapper
                        .selectByDeviceTypeAndSn(device.getTypeId(), device.getDeviceSn());
                for (IotDeviceProtocolMap m : mappings) {
                    fieldMap.put(m.getSourceField(), m.getMetricKey());
                }

                List<IotMetricDef> validMetrics = iotMetricDefService.getMetricsByDeviceType(device.getTypeId());

                for (java.util.Iterator<Map.Entry<String, JsonNode>> it = root.fields(); it.hasNext(); ) {
                    Map.Entry<String, JsonNode> entry = it.next();
                    String fieldName = entry.getKey();
                    if (fieldName.equals("time") || fieldName.equals("deviceSn")) continue;

                    String metricKey = fieldMap.getOrDefault(fieldName, fieldName);

                    boolean isValid = false;
                    for (IotMetricDef def : validMetrics) {
                        if (def.getMetricKey().equals(metricKey)) {
                            isValid = true;
                            break;
                        }
                    }
                    if (isValid && entry.getValue().isNumber()) {
                        saveMetric(device, metricKey, entry.getValue().asDouble(), recordTime);
                    }
                }
            }

            // update heartbeat
            device.setLastHeartbeat(LocalDateTime.now());
            device.setStatus(1);
            iotDeviceMapper.updateById(device);
        } catch (Exception e) {
            log.error("Failed to process MQTT message: topic={}, error={}", topic, e.getMessage());
        }
    }

    private LocalDateTime parseTime(String timeStr) {
        if (timeStr == null || timeStr.isEmpty()) {
            return LocalDateTime.now();
        }
        try {
            return LocalDateTime.parse(timeStr, DT_FMT_ISO);
        } catch (DateTimeParseException e) {
            try {
                return LocalDateTime.parse(timeStr, DT_FMT_SPACE);
            } catch (DateTimeParseException e2) {
                log.warn("Failed to parse time: {}, fallback to now", timeStr);
                return LocalDateTime.now();
            }
        }
    }

    @ServiceActivator(inputChannel = "mqttCmdResponseChannel")
    public void handleCommandResponse(Message<?> message) {
        String topic = (String) message.getHeaders().get("mqtt_receivedTopic");
        String payload = message.getPayload().toString();
        log.info("Command response received: topic={}, payload={}", topic, payload);
        try {
            // 从主题提取设备标识（优先于 payload 中的 deviceSn）
            MqttTopics.TopicInfo info = MqttTopics.parseCmdResponseTopic(topic);
            JsonNode root = objectMapper.readTree(payload);
            String deviceSn = info != null ? info.deviceSn() : root.has("deviceSn") ? root.get("deviceSn").asText() : "unknown";
            String command = root.has("command") ? root.get("command").asText() : "unknown";
            String result = root.has("result") ? root.get("result").asText() : "unknown";
            log.info("Device {} executed command '{}' with result: {}", deviceSn, command, result);

            IotDevice device = iotDeviceMapper.selectOne(
                    new LambdaQueryWrapper<IotDevice>()
                            .eq(IotDevice::getDeviceSn, deviceSn));
            if (device != null) {
                IotCommandLog cmdLog = iotCommandLogMapper.selectOne(
                        new LambdaQueryWrapper<IotCommandLog>()
                                .eq(IotCommandLog::getDeviceId, device.getId())
                                .eq(IotCommandLog::getCommandKey, command)
                                .eq(IotCommandLog::getStatus, "SENT")
                                .orderByDesc(IotCommandLog::getTriggerTime)
                                .last("LIMIT 1"));
                if (cmdLog != null) {
                    cmdLog.setStatus("SUCCESS");
                    cmdLog.setResponseTime(LocalDateTime.now());
                    cmdLog.setResponseData(payload);
                    if ("FAILED".equals(result) || "ERROR".equalsIgnoreCase(result)) {
                        cmdLog.setStatus("FAILED");
                        cmdLog.setErrorMsg(result);
                    }
                    iotCommandLogMapper.updateById(cmdLog);
                    log.info("Command log updated: deviceId={}, command={}, status={}",
                            device.getId(), command, cmdLog.getStatus());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to parse command response: {}", e.getMessage());
        }
    }

    private void saveMetric(IotDevice device, String metricKey, double value, LocalDateTime recordTime) {
        IotTsData data = new IotTsData();
        data.setDeviceId(device.getId());
        data.setMetricKey(metricKey);
        data.setMetricValue(value);
        data.setRecordTime(recordTime);
        data.setSourceType("IOT");
        data.setQualityFlag(1);
        iotTsDataService.save(data);

        checkAlertRules(device, metricKey, value, recordTime);
    }

    private void checkAlertRules(IotDevice device, String metricKey, double value, LocalDateTime recordTime) {
        List<IotAlertRule> rules = iotAlertRuleService.lambdaQuery()
                .eq(IotAlertRule::getDeviceTypeId, device.getTypeId())
                .eq(IotAlertRule::getMetricKey, metricKey)
                .eq(IotAlertRule::getIsEnabled, 1)
                .list();

        for (IotAlertRule rule : rules) {
            if (evaluateCondition(rule.getConditionExpr(), value)) {
                IotAlert alert = new IotAlert();
                alert.setAlertNo("ALT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                alert.setDeviceId(device.getId());
                alert.setAlertType("DATA_OVERFLOW");
                alert.setTitle(rule.getRuleName());
                alert.setContent(String.format("Device %s: %s = %.2f (rule: %s)",
                        device.getDeviceName(), metricKey, value, rule.getConditionExpr()));
                alert.setSeverity(rule.getSeverity());
                alert.setStatus("UNHANDLED");
                alert.setTriggerTime(recordTime);
                iotAlertService.save(alert);
                log.warn("Alert triggered: {} for device {}", rule.getRuleName(), device.getDeviceName());
            }
        }
    }

    private boolean evaluateCondition(String conditionExpr, double value) {
        try {
            String expr = conditionExpr.trim();
            if (expr.contains(">=")) {
                double threshold = Double.parseDouble(expr.split(">=")[1].trim());
                return value >= threshold;
            } else if (expr.contains("<=")) {
                double threshold = Double.parseDouble(expr.split("<=")[1].trim());
                return value <= threshold;
            } else if (expr.contains(">")) {
                double threshold = Double.parseDouble(expr.split(">")[1].trim());
                return value > threshold;
            } else if (expr.contains("<")) {
                double threshold = Double.parseDouble(expr.split("<")[1].trim());
                return value < threshold;
            } else if (expr.contains("==")) {
                double threshold = Double.parseDouble(expr.split("==")[1].trim());
                return value == threshold;
            }
        } catch (Exception e) {
            log.error("Failed to evaluate condition: {}", conditionExpr);
        }
        return false;
    }
}
