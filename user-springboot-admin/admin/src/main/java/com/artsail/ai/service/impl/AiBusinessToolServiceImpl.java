package com.artsail.ai.service.impl;

import com.artsail.ai.dto.AiToolCall;
import com.artsail.ai.service.AiBusinessToolService;
import com.artsail.aquaculture.model.domain.Query.PondQuery;
import com.artsail.aquaculture.model.domain.VO.PondVO;
import com.artsail.aquaculture.service.PondService;
import com.artsail.iot.model.domain.IotAlert;
import com.artsail.iot.model.vo.WaterDataVO;
import com.artsail.iot.model.vo.WaterTrendVO;
import com.artsail.iot.service.IotAlertService;
import com.artsail.iot.service.IotTsDataService;
import com.artsail.production.model.domain.FeedingRecord;
import com.artsail.production.model.domain.HarvestRecord;
import com.artsail.production.model.domain.MedicationRecord;
import com.artsail.production.model.domain.ProdTask;
import com.artsail.production.model.domain.StkUsage;
import com.artsail.production.model.domain.Query.FeedingRecordQuery;
import com.artsail.production.model.domain.Query.HarvestRecordQuery;
import com.artsail.production.model.domain.Query.MedicationRecordQuery;
import com.artsail.production.model.domain.Query.ProdPlanQuery;
import com.artsail.production.model.domain.Query.ProdTaskQuery;
import com.artsail.production.model.domain.Query.StkUsageQuery;
import com.artsail.production.model.domain.VO.ProdPlanVO;
import com.artsail.production.model.domain.VO.ProdTaskVO;
import com.artsail.production.service.FeedingRecordService;
import com.artsail.production.service.HarvestRecordService;
import com.artsail.production.service.MedicationRecordService;
import com.artsail.production.service.ProdPlanService;
import com.artsail.production.service.ProdTaskService;
import com.artsail.production.service.StkUsageService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiBusinessToolServiceImpl implements AiBusinessToolService {
    private static final int RESULT_LIMIT = 10;
    private static final Pattern POND_NUMBER = Pattern.compile("(\\d+)\\s*号?\\s*(?:塘|池)");
    private static final Pattern POND_ID = Pattern.compile("(?:塘口|池塘|pond)\\s*(?:ID|id|编号)?\\s*[#：:]?\\s*(\\d+)");

    private final PondService pondService;
    private final ProdPlanService prodPlanService;
    private final ProdTaskService prodTaskService;
    private final FeedingRecordService feedingRecordService;
    private final MedicationRecordService medicationRecordService;
    private final HarvestRecordService harvestRecordService;
    private final StkUsageService stkUsageService;
    private final IotTsDataService iotTsDataService;
    private final IotAlertService iotAlertService;
    private final ObjectMapper objectMapper;

    public AiBusinessToolServiceImpl(
            PondService pondService,
            ProdPlanService prodPlanService,
            ProdTaskService prodTaskService,
            FeedingRecordService feedingRecordService,
            MedicationRecordService medicationRecordService,
            HarvestRecordService harvestRecordService,
            StkUsageService stkUsageService,
            IotTsDataService iotTsDataService,
            IotAlertService iotAlertService,
            ObjectMapper objectMapper) {
        this.pondService = pondService;
        this.prodPlanService = prodPlanService;
        this.prodTaskService = prodTaskService;
        this.feedingRecordService = feedingRecordService;
        this.medicationRecordService = medicationRecordService;
        this.harvestRecordService = harvestRecordService;
        this.stkUsageService = stkUsageService;
        this.iotTsDataService = iotTsDataService;
        this.iotAlertService = iotAlertService;
        this.objectMapper = objectMapper;
    }

    @Override
    public ToolResult query(String question, String requestedTool) {
        List<AiToolCall> calls = new ArrayList<>();
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate queryDate = question.contains("昨天") ? LocalDate.now().minusDays(1) : LocalDate.now();
        Long pondId = resolvePondId(question);

        if (selected(requestedTool, "pond")
                || noTool(requestedTool) && containsAny(question, "塘口", "池塘", "养殖池")
                && !containsAny(question, "水质", "溶氧", "温度", "PH", "pH")) {
            runTool(calls, data, "pond.search", "塘口查询", "查询塘口基础信息与养殖状态",
                    () -> pondData(question));
        }
        if (selected(requestedTool, "plan")
                || noTool(requestedTool) && containsAny(question, "生产计划", "养殖计划", "投喂计划", "用药计划", "收获计划")) {
            runTool(calls, data, "production.plan.search", "生产计划查询", "查询生产计划及其执行状态",
                    () -> planData(question, pondId));
        }
        if (selected(requestedTool, "task")
                || noTool(requestedTool) && containsAny(question, "任务", "待办", "今天要做", "今日工作", "昨天做了",
                "生产情况", "生产进度", "经营情况")) {
            runTool(calls, data, "production.task.search", "生产任务查询", "查询指定日期的生产任务",
                    () -> taskData(queryDate, pondId));
        }
        if (selected(requestedTool, "feeding")
                || noTool(requestedTool) && containsAny(question, "投喂记录", "喂料记录", "饲料记录", "投喂了多少",
                "投喂多少", "今天投喂", "今日投喂")) {
            runTool(calls, data, "production.feeding.search", "投喂记录查询", "查询投喂执行记录",
                    () -> feedingData(question, queryDate, pondId));
        }
        if (selected(requestedTool, "medication")
                || noTool(requestedTool) && containsAny(question, "用药记录", "药品记录", "用过什么药", "用药了多少",
                "用药多少", "今天用药", "今日用药")) {
            runTool(calls, data, "production.medication.search", "用药记录查询", "查询用药执行记录",
                    () -> medicationData(question, queryDate, pondId));
        }
        if (selected(requestedTool, "harvest")
                || noTool(requestedTool) && containsAny(question, "收获记录", "捕捞记录", "出鱼记录", "收了多少")) {
            runTool(calls, data, "production.harvest.search", "收获记录查询", "查询收获和捕捞记录",
                    () -> harvestData(question, queryDate, pondId));
        }
        if (selected(requestedTool, "input")
                || noTool(requestedTool) && containsAny(question, "投入品", "物资使用", "成本记录", "用了多少物料", "使用记录")) {
            runTool(calls, data, "production.input.search", "投入品使用查询", "查询生产物资使用与成本记录",
                    () -> usageData(question, queryDate, pondId));
        }
        if (selected(requestedTool, "water") || selected(requestedTool, "trend")
                || noTool(requestedTool) && containsAny(question, "水质", "溶氧", "水温", "PH", "pH", "酸碱度")) {
            if (selected(requestedTool, "trend") || question.contains("趋势") && pondId != null) {
                runTool(calls, data, "iot.water.trend", "水质趋势查询", "查询指定塘口最近24小时水质趋势",
                        () -> waterTrendData(pondId));
            } else {
                runTool(calls, data, "iot.water.summary", "实时水质查询", "查询各塘口最新水质指标",
                        () -> waterSummaryData(question, pondId));
            }
        }
        if (selected(requestedTool, "alert")
                || noTool(requestedTool) && containsAny(question, "告警", "报警", "异常提醒", "预警")) {
            runTool(calls, data, "iot.alert.recent", "IoT告警查询", "查询最近未处理告警与告警统计",
                    this::alertData);
        }

        if (calls.isEmpty()) {
            return ToolResult.empty();
        }
        return new ToolResult(writeJson(data), calls);
    }

    private List<Map<String, Object>> pondData(String question) {
        PondQuery query = new PondQuery();
        pondName(question).ifPresent(query::setPondName);
        return pondService.search(new Page<>(1, RESULT_LIMIT), query).getRecords().stream()
                .map(item -> mapOf(
                        "id", item.getId(), "塘口编码", item.getPondCode(), "塘口名称", item.getPondName(),
                        "基地", item.getBaseName(), "面积亩", item.getArea(), "品种", item.getCurrentSpecies(),
                        "放养日期", item.getStockingDate(), "预计产量", item.getEstimatedOutput(), "状态", item.getStatus()))
                .toList();
    }

    private List<Map<String, Object>> planData(String question, Long pondId) {
        ProdPlanQuery query = new ProdPlanQuery();
        query.setTargetId(pondId);
        query.setTargetType(pondId == null ? null : "pond");
        if (question.contains("投喂")) query.setPlanType("feeding");
        if (question.contains("用药")) query.setPlanType("medication");
        if (question.contains("收获")) query.setPlanType("harvest");
        return prodPlanService.search(new Page<>(1, RESULT_LIMIT), query).getRecords().stream()
                .map(item -> mapOf(
                        "id", item.getId(), "标题", item.getTitle(), "类型", item.getPlanType(),
                        "目标", item.getTargetName(), "开始时间", item.getStartTime(), "结束时间", item.getEndTime(),
                        "状态", item.getStatus(), "投喂量kg", item.getFeedAmount(), "药品", item.getDrugName()))
                .toList();
    }

    private List<Map<String, Object>> taskData(LocalDate date, Long pondId) {
        ProdTaskQuery query = new ProdTaskQuery();
        query.setActionDate(date);
        query.setTargetId(pondId);
        query.setTargetType(pondId == null ? null : "pond");
        List<ProdTaskVO> records = prodTaskService.search(new Page<>(1, RESULT_LIMIT), query).getRecords();
        return records.stream().map(item -> mapOf(
                "id", item.getId(), "任务", item.getTaskTitle(), "目标", item.getTargetName(),
                "执行时间", item.getActionTime(), "截止时间", item.getDeadlineTime(),
                "状态", item.getStatus(), "优先级", item.getPriority(), "执行人ID", item.getAssigneeId()))
                .toList();
    }

    private List<Map<String, Object>> feedingData(String question, LocalDate date, Long pondId) {
        FeedingRecordQuery query = new FeedingRecordQuery();
        query.setTargetId(pondId);
        query.setTargetType(pondId == null ? null : "pond");
        applyDateRange(question, date, query::setActionTimeStart, query::setActionTimeEnd);
        return feedingRecordService.search(new Page<>(1, RESULT_LIMIT), query).getRecords().stream()
                .map(item -> mapOf(
                        "id", item.getId(), "目标", item.getTargetName(), "饲料", item.getFeedType(),
                        "数量", item.getQuantity(), "单位", item.getUnit(), "执行时间", item.getActionTime(),
                        "来源", item.getSource(), "核验状态", item.getVerifyStatus()))
                .toList();
    }

    private List<Map<String, Object>> medicationData(String question, LocalDate date, Long pondId) {
        MedicationRecordQuery query = new MedicationRecordQuery();
        query.setTargetId(pondId);
        query.setTargetType(pondId == null ? null : "pond");
        applyDateRange(question, date, query::setActionTimeStart, query::setActionTimeEnd);
        return medicationRecordService.search(new Page<>(1, RESULT_LIMIT), query).getRecords().stream()
                .map(item -> mapOf(
                        "id", item.getId(), "目标", item.getTargetName(), "药品", item.getDrugName(),
                        "剂量", item.getDosage(), "单位", item.getUnit(), "方式", item.getMethod(),
                        "休药期天数", item.getWithdrawalDays(), "执行时间", item.getActionTime(),
                        "核验状态", item.getVerifyStatus()))
                .toList();
    }

    private List<Map<String, Object>> harvestData(String question, LocalDate date, Long pondId) {
        HarvestRecordQuery query = new HarvestRecordQuery();
        query.setPondId(pondId);
        applyDateRange(question, date, query::setHarvestTimeStart, query::setHarvestTimeEnd);
        return harvestRecordService.search(new Page<>(1, RESULT_LIMIT), query).getRecords().stream()
                .map(item -> mapOf(
                        "id", item.getId(), "记录号", item.getRecordNo(), "塘口ID", item.getPondId(),
                        "品种", item.getSpecies(), "重量", item.getWeight(), "单位", item.getUnit(),
                        "收获时间", item.getHarvestTime(), "状态", item.getStatus()))
                .toList();
    }

    private List<Map<String, Object>> usageData(String question, LocalDate date, Long pondId) {
        StkUsageQuery query = new StkUsageQuery();
        query.setPondId(pondId);
        applyDateRange(question, date, query::setStartTime, query::setEndTime);
        return stkUsageService.search(new Page<>(1, RESULT_LIMIT), query).getRecords().stream()
                .map(item -> mapOf(
                        "id", item.getId(), "使用单号", item.getUsageNo(), "塘口", item.getPondName(),
                        "物资", item.getMatName(), "分类", item.getCategoryName(), "数量", item.getUseQty(),
                        "单位", item.getUnit(), "总价", item.getTotalPrice(), "使用时间", item.getUseTime()))
                .toList();
    }

    private List<Map<String, Object>> waterSummaryData(String question, Long pondId) {
        return iotTsDataService.getPondSummary().stream()
                .filter(item -> pondId == null || String.valueOf(pondId).equals(item.getId()))
                .filter(item -> pondName(question).map(name -> item.getName() != null && item.getName().contains(name)).orElse(true))
                .limit(RESULT_LIMIT)
                .map(item -> mapOf(
                        "塘口ID", item.getId(), "塘口", item.getName(), "基地", item.getBaseName(),
                        "状态", item.getStatus(), "溶氧", indicatorValue(item.getOxygen()),
                        "水温", indicatorValue(item.getTemp()), "pH", indicatorValue(item.getPh())))
                .toList();
    }

    private List<Map<String, Object>> waterTrendData(Long pondId) {
        List<WaterTrendVO> trend = iotTsDataService.getPondTrend(pondId);
        int fromIndex = Math.max(0, trend.size() - RESULT_LIMIT);
        return trend.subList(fromIndex, trend.size()).stream()
                .map(item -> mapOf(
                        "时间", item.getTimestamp(), "溶氧", item.getDissolvedOxygen(),
                        "水温", item.getWaterTemperature(), "pH", item.getPH()))
                .toList();
    }

    private List<Map<String, Object>> alertData() {
        List<Map<String, Object>> result = new ArrayList<>();
        result.add(mapOf("告警统计", iotAlertService.getStats()));
        for (IotAlert item : iotAlertService.getRecentUnhandled(RESULT_LIMIT)) {
            result.add(mapOf(
                    "id", item.getId(), "标题", item.getTitle(), "内容", item.getContent(),
                    "级别", item.getSeverity(), "状态", item.getStatus(), "触发时间", item.getTriggerTime()));
        }
        return result;
    }

    private Long resolvePondId(String question) {
        Matcher idMatcher = POND_ID.matcher(question);
        if (idMatcher.find()) {
            return Long.valueOf(idMatcher.group(1));
        }
        return pondName(question)
                .flatMap(name -> pondService.search(new Page<>(1, 1), pondQuery(name)).getRecords().stream().findFirst())
                .map(PondVO::getId)
                .orElse(null);
    }

    private java.util.Optional<String> pondName(String question) {
        Matcher matcher = POND_NUMBER.matcher(question);
        return matcher.find() ? java.util.Optional.of(matcher.group(1) + "号") : java.util.Optional.empty();
    }

    private PondQuery pondQuery(String name) {
        PondQuery query = new PondQuery();
        query.setPondName(name);
        return query;
    }

    private void runTool(List<AiToolCall> calls, List<Map<String, Object>> data,
                         String name, String label, String description,
                         Supplier<List<Map<String, Object>>> supplier) {
        try {
            List<Map<String, Object>> result = supplier.get();
            data.add(mapOf("工具", name, "结果数", result.size(), "数据", result));
            calls.add(new AiToolCall(name, label, description + "，返回 " + result.size() + " 条"));
        } catch (Exception e) {
            data.add(mapOf("工具", name, "查询失败", safeMessage(e)));
            calls.add(new AiToolCall(name, label, description + "，查询失败"));
        }
    }

    private void applyDateRange(String question, LocalDate date,
                                java.util.function.Consumer<LocalDateTime> startSetter,
                                java.util.function.Consumer<LocalDateTime> endSetter) {
        if (containsAny(question, "今天", "今日", "昨天", "昨日")) {
            startSetter.accept(date.atStartOfDay());
            endSetter.accept(date.plusDays(1).atStartOfDay());
        }
    }

    private static Object indicatorValue(WaterDataVO.IndicatorVO indicator) {
        return indicator == null ? null : mapOf("值", indicator.getValue(), "趋势", indicator.getTrend());
    }

    private static boolean containsAny(String text, String... words) {
        for (String word : words) {
            if (text.contains(word)) return true;
        }
        return false;
    }

    private static boolean selected(String requestedTool, String expected) {
        return expected.equals(requestedTool);
    }

    private static boolean noTool(String requestedTool) {
        return requestedTool == null || requestedTool.isBlank();
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            return "业务数据序列化失败：" + safeMessage(e);
        }
    }

    private static String safeMessage(Exception e) {
        String message = e.getMessage();
        return message == null ? e.getClass().getSimpleName() : message.substring(0, Math.min(message.length(), 200));
    }

    private static Map<String, Object> mapOf(Object... values) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (int i = 0; i + 1 < values.length; i += 2) {
            if (values[i + 1] != null) {
                result.put(String.valueOf(values[i]), values[i + 1]);
            }
        }
        return result;
    }
}
