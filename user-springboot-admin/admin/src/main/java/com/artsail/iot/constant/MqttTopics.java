package com.artsail.iot.constant;

import java.util.regex.Pattern;

/**
 * MQTT 主题常量与工具
 * <p>
 * 三个主题格式：
 * <ul>
 *   <li>data       — 设备上报数据: aquaculture/{baseId}/{deviceSn}/data</li>
 *   <li>command    — 下发指令:      aquaculture/{baseId}/{deviceSn}/command</li>
 *   <li>cmd_response — 指令回复:    aquaculture/{baseId}/{deviceSn}/command/response</li>
 * </ul>
 */
public final class MqttTopics {

    private MqttTopics() {}

    // ── 订阅用（通配符 +） ──
    public static final String DATA_SUBSCRIBE = "aquaculture/+/+/data";
    public static final String CMD_RESPONSE_SUBSCRIBE = "aquaculture/+/+/command/response";

    // ── 解析用（正则捕获组） ──
    private static final Pattern DATA_PATTERN = Pattern.compile("aquaculture/(\\d+)/([^/]+)/data");
    private static final Pattern CMD_RESP_PATTERN = Pattern.compile("aquaculture/(\\d+)/([^/]+)/command/response");

    // ── 构建主题 ──

    public static String dataTopic(Long baseId, String deviceSn) {
        return String.format("aquaculture/%d/%s/data", baseId, deviceSn);
    }

    public static String commandTopic(Long baseId, String deviceSn) {
        return String.format("aquaculture/%d/%s/command", baseId, deviceSn);
    }

    public static String cmdResponseTopic(Long baseId, String deviceSn) {
        return String.format("aquaculture/%d/%s/command/response", baseId, deviceSn);
    }

    // ── 解析结果 ──

    public record TopicInfo(Long baseId, String deviceSn) {}

    public static TopicInfo parseDataTopic(String topic) {
        var m = DATA_PATTERN.matcher(topic);
        if (!m.matches()) return null;
        return new TopicInfo(Long.parseLong(m.group(1)), m.group(2));
    }

    public static TopicInfo parseCmdResponseTopic(String topic) {
        var m = CMD_RESP_PATTERN.matcher(topic);
        if (!m.matches()) return null;
        return new TopicInfo(Long.parseLong(m.group(1)), m.group(2));
    }
}
