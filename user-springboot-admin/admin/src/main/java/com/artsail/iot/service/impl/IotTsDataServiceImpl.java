package com.artsail.iot.service.impl;

import com.artsail.iot.mapper.IotTsDataMapper;
import com.artsail.iot.model.domain.IotTsData;
import com.artsail.iot.model.domain.query.IotTsDataQuery;
import com.artsail.iot.model.vo.*;
import com.artsail.iot.service.IotTsDataService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IotTsDataServiceImpl extends ServiceImpl<IotTsDataMapper, IotTsData> implements IotTsDataService {

    private final IotTsDataMapper iotTsDataMapper;

    @Override
    public Page<IotTsData> search(Page<IotTsData> page, IotTsDataQuery query) {
        return iotTsDataMapper.searchWithDevice(page, query);
    }

    @Override
    public List<IotTsData> getLatestByDevice(IotTsDataQuery query) {
        return iotTsDataMapper.selectLatestByDevice(query);
    }

    @Override
    public List<WaterDataVO> getPondSummary() {
        List<WaterDataRawRow> rows = iotTsDataMapper.selectLatestByPond();

        Map<Long, List<WaterDataRawRow>> grouped = rows.stream()
                .collect(Collectors.groupingBy(WaterDataRawRow::getPondId));

        List<WaterDataVO> result = new ArrayList<>();
        for (Map.Entry<Long, List<WaterDataRawRow>> entry : grouped.entrySet()) {
            List<WaterDataRawRow> pondRows = entry.getValue();
            WaterDataRawRow first = pondRows.get(0);

            WaterDataVO vo = new WaterDataVO();
            vo.setId(String.valueOf(first.getPondId()));
            vo.setName(first.getPondName());
            vo.setBaseName(first.getBaseName());

            Integer ps = first.getPondStatus();
            if (ps == null || ps == 2) {
                vo.setStatus("error");
            } else {
                boolean hasError = false;
                for (WaterDataRawRow r : pondRows) {
                    if (r.getMetricValue() == null) continue;
                    double v = r.getMetricValue();
                    if ("dissolved_oxygen".equals(r.getMetricKey()) && v < 3.0) hasError = true;
                    if ("ph".equals(r.getMetricKey()) && (v < 6.5 || v > 8.8)) hasError = true;
                    if ("temperature".equals(r.getMetricKey()) && (v > 32.0 || v < 5.0)) hasError = true;
                }
                vo.setStatus(hasError ? "error" : "normal");
            }

            WaterDataVO.IndicatorVO oxygen = new WaterDataVO.IndicatorVO();
            WaterDataVO.IndicatorVO temp = new WaterDataVO.IndicatorVO();
            WaterDataVO.IndicatorVO ph = new WaterDataVO.IndicatorVO();

            for (WaterDataRawRow r : pondRows) {
                if (r.getMetricValue() == null) continue;
                double v = r.getMetricValue();
                switch (r.getMetricKey()) {
                    case "dissolved_oxygen":
                        oxygen.setValue(v);
                        oxygen.setTrend(calcTrend(v, 5.0, 8.0));
                        break;
                    case "temperature":
                        temp.setValue(v);
                        temp.setTrend(calcTrend(v, 20.0, 28.0));
                        break;
                    case "ph":
                        ph.setValue(v);
                        ph.setTrend(calcTrend(v, 7.0, 8.0));
                        break;
                }
            }

            if (oxygen.getValue() == null) { oxygen.setValue(6.5); oxygen.setTrend("stable"); }
            if (temp.getValue() == null) { temp.setValue(25.0); temp.setTrend("stable"); }
            if (ph.getValue() == null) { ph.setValue(7.5); ph.setTrend("stable"); }

            vo.setOxygen(oxygen);
            vo.setTemp(temp);
            vo.setPh(ph);
            result.add(vo);
        }

        return result;
    }

    @Override
    public List<WaterTrendVO> getPondTrend(Long pondId) {
        if (pondId == null) return Collections.emptyList();

        List<WaterTrendRawRow> rows = iotTsDataMapper.selectTrendByPond(pondId);

        Map<String, WaterTrendVO> grouped = new LinkedHashMap<>();
        for (WaterTrendRawRow row : rows) {
            String t = row.getRecordTime();
            WaterTrendVO vo = grouped.computeIfAbsent(t, k -> {
                WaterTrendVO v = new WaterTrendVO();
                v.setTimestamp(k);
                return v;
            });
            if (row.getMetricValue() == null) continue;
            switch (row.getMetricKey()) {
                case "dissolved_oxygen":
                    vo.setDissolvedOxygen(row.getMetricValue());
                    break;
                case "temperature":
                    vo.setWaterTemperature(row.getMetricValue());
                    break;
                case "ph":
                    vo.setPH(row.getMetricValue());
                    break;
            }
        }

        return new ArrayList<>(grouped.values());
    }

    private String calcTrend(double value, double low, double high) {
        double mid = (low + high) / 2;
        if (value > mid * 1.1) return "up";
        if (value < mid * 0.9) return "down";
        return "stable";
    }
}
