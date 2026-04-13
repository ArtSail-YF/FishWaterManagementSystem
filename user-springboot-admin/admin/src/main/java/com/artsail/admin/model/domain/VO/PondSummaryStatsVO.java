package com.artsail.admin.model.domain.VO;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * @author 13372
 */
@Getter
@Builder
public class PondSummaryStatsVO {
    private Integer totalPonds;
    private Integer breedingCount;
    private Integer emptyCount;
    private Integer lockedCount;
    private Double totalArea;
    private Double avgDepth;
    private Double totalBiomass;
    private List<String> species;
    private Double estimatedValue;
    private Double growthRate;

}
