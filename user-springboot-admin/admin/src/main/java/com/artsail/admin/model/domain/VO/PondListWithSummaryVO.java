package com.artsail.admin.model.domain.VO;


import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * @author 13372
 */
@Getter
@Builder
public class PondListWithSummaryVO {
    private PondSummaryStatsVO pondSummary;
    private List<PondListItemVO> ponds;
    

}