-- ============================================================
-- Migration: biz_breeder + base_info optimization
-- For existing databases
-- ============================================================

-- 1. biz_breeder: drop enterprise fields, add user_id
ALTER TABLE biz_breeder
    DROP COLUMN IF EXISTS legal_person,
    DROP COLUMN IF EXISTS email,
    DROP COLUMN IF EXISTS business_license,
    DROP COLUMN IF EXISTS license_no,
    DROP COLUMN IF EXISTS reg_capital,
    DROP COLUMN IF EXISTS establish_date,
    DROP COLUMN IF EXISTS longitude,
    DROP COLUMN IF EXISTS latitude,
    ADD COLUMN IF NOT EXISTS user_id bigint DEFAULT NULL COMMENT'link to user' AFTER hire_date;

-- 2. base_info: add enterprise fields (move from biz_breeder)
ALTER TABLE base_info
    ADD COLUMN IF NOT EXISTS legal_person varchar(64) DEFAULT NULL COMMENT'legal rep' AFTER base_name,
    ADD COLUMN IF NOT EXISTS business_license varchar(255) DEFAULT NULL COMMENT'license' AFTER legal_person,
    ADD COLUMN IF NOT EXISTS license_no varchar(64) DEFAULT NULL COMMENT'credit code' AFTER business_license,
    ADD COLUMN IF NOT EXISTS reg_capital decimal(12,2) DEFAULT NULL COMMENT'capital' AFTER license_no,
    ADD COLUMN IF NOT EXISTS establish_date date DEFAULT NULL COMMENT'established' AFTER reg_capital;
