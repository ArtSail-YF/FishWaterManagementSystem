package com.artsail.iot.service;

import com.artsail.iot.config.MqttGateway;
import com.artsail.iot.constant.MqttTopics;
import com.artsail.iot.mapper.IotCommandLogMapper;
import com.artsail.iot.mapper.IotDeviceMapper;
import com.artsail.iot.model.domain.IotCommandLog;
import com.artsail.iot.model.domain.IotDevice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttPublishService {

    private final IotDeviceMapper iotDeviceMapper;
    private final IotCommandLogMapper iotCommandLogMapper;
    private final MqttGateway mqttGateway;

    public boolean publishCommand(Long deviceId, String commandKey) {
        IotDevice device = iotDeviceMapper.selectById(deviceId);
        if (device == null) {
            log.warn("Device not found: {}", deviceId);
            return false;
        }

        String topic = MqttTopics.commandTopic(device.getBaseId(), device.getDeviceSn());
        String payload = String.format(
            "{\"command\":\"%s\",\"deviceSn\":\"%s\",\"timestamp\":\"%s\"}",
            commandKey, device.getDeviceSn(), LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );

        IotCommandLog cmdLog = new IotCommandLog();
        cmdLog.setDeviceId(deviceId);
        cmdLog.setCommandKey(commandKey);
        cmdLog.setTriggerTime(LocalDateTime.now());
        cmdLog.setStatus("SENT");

        try {
            mqttGateway.sendToMqtt(topic, payload);
            iotCommandLogMapper.insert(cmdLog);
            log.info("Command published: topic={}, payload={}", topic, payload);
            return true;
        } catch (Exception e) {
            cmdLog.setStatus("FAILED");
            cmdLog.setErrorMsg(e.getMessage());
            iotCommandLogMapper.insert(cmdLog);
            log.error("Failed to publish command for device {}: {}", deviceId, e.getMessage());
            return false;
        }
    }
}
