package com.artsail.iot.service;

import com.artsail.iot.mapper.IotDeviceMapper;
import com.artsail.iot.model.domain.IotDevice;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class MqttPublishService {

    @Value("")
    private String broker;

    private final IotDeviceMapper iotDeviceMapper;

    public boolean publishTestData(Long deviceId) {
        IotDevice device = iotDeviceMapper.selectById(deviceId);
        if (device == null) {
            log.warn("Device not found: {}", deviceId);
            return false;
        }

        String topic = String.format("aquaculture/%d/%s/data", device.getBaseId(), device.getDeviceSn());
        String now = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String payload = String.format(
            "{\"deviceSn\":\"%s\",\"metrics\":[{\"key\":\"dissolved_oxygen\",\"value\":6.5}],\"time\":\"%s\"}",
            device.getDeviceSn(), now
        );

        String clientId = "test-pub-" + deviceId + "-" + System.currentTimeMillis();

        try {
            MqttConnectOptions options = new MqttConnectOptions();
            options.setServerURIs(new String[]{broker});
            options.setConnectionTimeout(5);
            options.setKeepAliveInterval(30);
            options.setCleanSession(true);

            MqttClient client = new MqttClient(broker, clientId, new MemoryPersistence());
            client.connect(options);
            
            MqttMessage message = new MqttMessage(payload.getBytes(StandardCharsets.UTF_8));
            message.setQos(1);
            message.setRetained(false);
            
            client.publish(topic, message);
            client.disconnect();
            client.close();

            log.info("Test data published: topic={}, payload={}", topic, payload);
            return true;
        } catch (Exception e) {
            log.error("Failed to publish test data for device {}: {}", deviceId, e.getMessage());
            return false;
        }
    }
}