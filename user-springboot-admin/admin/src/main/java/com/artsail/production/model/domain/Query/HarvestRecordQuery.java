package com.artsail.production.model.domain.Query;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HarvestRecordQuery {
    private Long baseId;
    private Long pondId;
    private String species;
    private String status;
    private LocalDateTime harvestTimeStart;
    private LocalDateTime harvestTimeEnd;
}
