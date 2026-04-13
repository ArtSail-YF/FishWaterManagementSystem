package com.artsail.admin.model.domain.VO;

import lombok.Builder;
import lombok.Getter;

/**
 * @author 13372
 */
@Getter
@Builder
public class WaterQualityVO {

    private Double oxygen;
    private Double temp;
    private Double ph;


    public WaterQualityVO(Double oxygen, Double temp, Double ph) {
        this.oxygen = oxygen;
        this.temp = temp;
        this.ph = ph;
    }

}
