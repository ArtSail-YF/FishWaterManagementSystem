package com.artsail.iot.service;

import com.artsail.iot.mapper.IotDeviceMapper;
import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.domain.IotAlertRule;
import com.artsail.iot.model.domain.IotDevice;
import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.service.IotAlertRuleService;
import com.artsail.iot.service.IotAlertService;
import com.artsail.iot.service.IotTsDataService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttSubscriberService {

    private static final Pattern TOPIC_PATTERN = Pattern.compile("aquaculture/(\\d+)/([^/]+)/data");
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    private final IotDeviceMapper iotDeviceMapper;
    private final IotTsDataService iotTsDataService;
    private final IotAlertService iotAlertService;
    private final IotAlertRuleService iotAlertRuleService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<?> message) {
        String topic = (String) message.getHeaders().get("mqtt_receivedTopic");
        String payload = message.getPayload().toString();
        log.debug("MQTT received: topic={}, payload={}", topic, payload);

        try {
            Matcher matcher = TOPIC_PATTERN.matcher(topic);
            if (!matcher.matches()) {
                log.warn("Invalid topic format: {}", topic);
                return;
            }

            String deviceSn = matcher.group(2);
            IotDevice device = iotDeviceMapper.selectOne(
                    new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<IotDevice>()
                            .eq(IotDevice::getDeviceSn, deviceSn));
            if (device == null) {
                log.warn("Device not found: {}", deviceSn);
                return;
            }

            JsonNode root = objectMapper.readTree(payload);
            String timeStr = root.has("time") ? root.get("time").asText() : LocalDateTime.now().toString();
            LocalDateTime recordTime = LocalDateTime.parse(timeStr, DT_FMT);

            if (root.has("metrics") && root.get("metrics").isArray()) {
                for (JsonNode metric : root.get("metrics")) {
                    saveMetric(device, metric.get("key").asText(),
                            metric.get("value").asDouble(), recordTime);
                }
            } else {
                String[] knownKeys = {"temperature", "dissolved_oxygen", "ph",
                        "salinity", "turbidity", "ammonia"};
                for (String key : knownKeys) {
                    if (root.has(key)) {
                        saveMetric(device, key, root.get(key).asDouble(), recordTime);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to process MQTT message: topic={}, error={}", topic, e.getMessage());
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
            if (expr.contains(">")) {
                double threshold = Double.parseDouble(expr.split(">")[1].trim());
                return value > threshold;
            } else if (expr.contains("<")) {
                double threshold = Double.parseDouble(expr.split("<")[1].trim());
                return value < threshold;
            } else if (expr.contains(">=")) {
                double threshold = Double.parseDouble(expr.split(">=")[1].trim());
                return value >= threshold;
            } else if (expr.contains("<=")) {
                double threshold = Double.parseDouble(expr.split("<=")[1].trim());
                return value <= threshold;
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
