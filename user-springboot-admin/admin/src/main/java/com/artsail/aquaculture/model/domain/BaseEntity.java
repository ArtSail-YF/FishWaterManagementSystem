package com.artsail.aquaculture.model.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}