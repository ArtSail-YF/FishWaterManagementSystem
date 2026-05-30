package com.artsail.aquaculture.model.domain;

import com.artsail.common.domain.LogicDeleteEntity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * @author 13372
 */
@TableName("base_info")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class BaseInfo extends LogicDeleteEntity {
    private String baseCode;
    private String baseName;
    private Long breederId;
    private Long deptId;
    private String address;
    private Double longitude;
    private Double latitude;
    private Double totalArea;
    private Double waterArea;
    private String waterSource;
    private String waterQualityGrade;
    private String soilType;
    private Double phValue;
    private String powerSupply;
    private Integer transformerCapacity;
    private String roadCondition;
    private String drainageSystem;
    private Integer isPollutionFree;
    private Integer taiwanCooperation;
    private String greenCertification;
    private String certificationImg;
    private Integer deepSeaCertified;
    private String seaAreaLicense;
    private String environmentalAssessment;
    private String remark;
    private Integer status;
}