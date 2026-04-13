package com.artsail.admin.model.domain.VO;

import lombok.Value;
import lombok.Builder;


/**
 * @author 13372
 */
@Value
@Builder
public class BaseDistributionVO {
    String id;
    String name;
    double[] location;
    // [lng, lat]
    String status;
    // "normal" | "warning" | "todo"
    WaterQualityVO waterQuality;

    // 静态辅助方法：方便传 lng/lat
    public static BaseDistributionVO of(String id, String name, double lng, double lat,
                                        String status, WaterQualityVO waterQuality) {
        return new BaseDistributionVO(id, name, new double[]{lng, lat}, status, waterQuality);
    }
}