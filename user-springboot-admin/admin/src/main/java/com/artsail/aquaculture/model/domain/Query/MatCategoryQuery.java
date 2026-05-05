package com.artsail.aquaculture.model.domain.Query;

import lombok.Data;

@Data
public class MatCategoryQuery {
    
    private String catCode;
    private String catName;
    private Long parentId;
    private Integer status;
}
