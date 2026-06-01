package com.artsail.production.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("feeding_record")
public class FeedingRecord implements Serializable {
    private static final long serialVersionUID = 1L;
    @TableId(type = IdType.AUTO) private Long id;
    private Long taskId; private Long planId; private Long baseId;
    private String targetType; private Long targetId;
    private BigDecimal quantity; private String unit;
    private String feedType; private String source;
    private String photoUrls; private Long actualWorkerId;
    private String verifyStatus; private String remark;
    @TableField(exist = false) private String baseName;
    @TableField(exist = false) private String targetName;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8") private LocalDateTime actionTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8") private LocalDateTime createTime;
}
