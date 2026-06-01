package com.artsail.production.model.domain.Query;
import lombok.Data; import java.time.LocalDateTime;
@Data
public class FeedingRecordQuery {
    private Long baseId; private Long targetId; private String targetType;
    private String feedType; private String source; private String verifyStatus;
    private LocalDateTime actionTimeStart; private LocalDateTime actionTimeEnd;
}
