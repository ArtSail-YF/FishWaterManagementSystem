-- 修复物资相关表缺少 create_time 和 update_time 字段的问题

-- mat_category 表
ALTER TABLE `mat_category` 
ADD COLUMN `create_time` datetime COMMENT '创建时间' AFTER `status`,
ADD COLUMN `update_time` datetime COMMENT '更新时间' AFTER `create_time`;

-- mat_info 表
ALTER TABLE `mat_info`
    ADD COLUMN `create_time` datetime COMMENT '创建时间' AFTER `manufacturer`,
    ADD COLUMN `update_time` datetime COMMENT '更新时间' AFTER `create_time`;



-- mat_supplier 表
ALTER TABLE `mat_supplier` 
ADD COLUMN `create_time` datetime COMMENT '创建时间' AFTER `status`,
ADD COLUMN `update_time` datetime COMMENT '更新时间' AFTER `create_time`;
