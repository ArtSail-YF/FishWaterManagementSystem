-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: artsail_admin
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 显式禁用外键检查（兼容不支持 MySQL 条件注释的 SQL 执行工具）
SET FOREIGN_KEY_CHECKS = 0;

--
-- Table structure for table `base_info`
--

DROP TABLE IF EXISTS `base_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_code` varchar(50) NOT NULL COMMENT '基地编码',
  `base_name` varchar(100) NOT NULL COMMENT '基地名称',
  `breeder_id` bigint NOT NULL COMMENT '归属主体ID',
  `dept_id` bigint NOT NULL COMMENT '【映射键】这里填 sys_dept.id',
  `address` varchar(255) DEFAULT NULL COMMENT '基地详细地址',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '中心经度',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '中心纬度',
  `total_area` decimal(12,2) DEFAULT NULL COMMENT '总占地面积(亩)',
  `water_area` decimal(12,2) DEFAULT NULL COMMENT '实际养殖水面(亩)',
  `water_source` varchar(100) DEFAULT NULL COMMENT '水源类型(河流/湖泊/地下水/海水)',
  `water_quality_grade` varchar(20) DEFAULT NULL COMMENT '水质等级',
  `soil_type` varchar(100) DEFAULT NULL COMMENT '底质土壤类型',
  `ph_value` decimal(3,1) DEFAULT NULL COMMENT '土壤pH值',
  `power_supply` varchar(100) DEFAULT NULL COMMENT '电力供应情况',
  `transformer_capacity` int DEFAULT NULL COMMENT '变压器容量(KVA)',
  `road_condition` varchar(200) DEFAULT NULL COMMENT '道路通达情况',
  `drainage_system` varchar(100) DEFAULT NULL COMMENT '排污系统类型',
  `is_pollution_free` tinyint DEFAULT '0' COMMENT '是否无公害认证',
  `taiwan_cooperation` tinyint DEFAULT '0' COMMENT '是否台资合作',
  `green_certification` varchar(50) DEFAULT NULL COMMENT '绿色认证等级',
  `certification_img` varchar(255) DEFAULT NULL COMMENT '认证证书图片',
  `deep_sea_certified` tinyint DEFAULT '0' COMMENT '是否深远海认证基地',
  `sea_area_license` varchar(255) DEFAULT NULL COMMENT '海域使用权证路径',
  `environmental_assessment` varchar(255) DEFAULT NULL COMMENT '环评报告路径',
  `remark` varchar(500) DEFAULT NULL COMMENT '基地备注说明',
  `status` tinyint DEFAULT '1' COMMENT '1-正常 0-停用',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `base_code` (`base_code`),
  UNIQUE KEY `dept_id` (`dept_id`),
  KEY `breeder_id` (`breeder_id`),
  CONSTRAINT `base_info_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_info`
--

LOCK TABLES `base_info` WRITE;
/*!40000 ALTER TABLE `base_info` DISABLE KEYS */;
INSERT INTO `base_info` VALUES (1,'BASE_XM2026','厦门蓝海现代渔业示范基地',1001,101,'福建省厦门市翔安区大嶝街道',118.2654321,24.5678901,500.00,420.50,'海水','一类','泥沙质',7.8,'双回路供电',500,'硬化沥青路直达','生态化三级过滤系统',1,0,'绿色食品认证 A 级','/upload/cert/xm_green_2025.jpg',0,'国海证 101002026001 号','厦环审 [2025] 056 号','厦门市级现代农业产业园，重点发展石斑鱼工厂化养殖',1,'2026-05-03 08:00:00','2026-05-04 00:10:00',0,NULL),(2,'BASE_ND2026','宁德三都澳深海大黄鱼产业园',1001,102,'福建省宁德市蕉城区三都镇海域',119.7543210,26.5812345,1200.00,1150.00,'深海海水','一类','深海沉积物',8.1,'海上风力发电+柴油发电机',800,'快艇接驳','深海自循环系统',1,1,'有机产品认证','/upload/cert/nd_organic_2025.jpg',1,'国海证 102002026008 号','闽环审 [2025] 112 号','国家级海洋牧场示范区，配备 5G 网络覆盖',1,'2026-05-03 09:00:00','2026-05-04 00:10:00',0,NULL);
/*!40000 ALTER TABLE `base_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_ai_diagnosis`
--

DROP TABLE IF EXISTS `biz_ai_diagnosis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biz_ai_diagnosis` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '请求人ID (老板/管理员)',
  `diag_type` varchar(50) DEFAULT 'DAILY' COMMENT '诊断类型: DAILY(日报), EVENT(事件触发)',
  `input_time` datetime NOT NULL COMMENT '诊断请求时间',
  `input_data` text COMMENT '输入的原始数据摘要 (快照ID列表或JSON)',
  `analysis_text` text COMMENT 'AI生成的自然语言分析 (Markdown格式)',
  `action_items` text COMMENT '提取的待办事项 (JSON Array)',
  `report_file_url` varchar(255) DEFAULT NULL COMMENT '生成的PDF/Word报告路径',
  `status` varchar(20) DEFAULT 'SUCCESS' COMMENT 'SUCCESS, FAILED, PROCESSING',
  `create_time` datetime DEFAULT NULL COMMENT '报告生成时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `biz_ai_diagnosis_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_ai_diagnosis`
--

LOCK TABLES `biz_ai_diagnosis` WRITE;
/*!40000 ALTER TABLE `biz_ai_diagnosis` DISABLE KEYS */;
/*!40000 ALTER TABLE `biz_ai_diagnosis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_breeder`
--

DROP TABLE IF EXISTS `biz_breeder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biz_breeder` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `breeder_code` varchar(50) NOT NULL COMMENT '主体编码',
  `breeder_name` varchar(100) NOT NULL COMMENT '主体名称',
  `legal_person` varchar(50) DEFAULT NULL COMMENT '法人代表',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `email` varchar(100) DEFAULT NULL COMMENT '电子邮箱',
  `id_card` varchar(20) DEFAULT NULL COMMENT '法人身份证号',
  `business_license` varchar(255) DEFAULT NULL COMMENT '营业执照路径',
  `license_no` varchar(100) DEFAULT NULL COMMENT '统一社会信用代码',
  `reg_capital` decimal(15,2) DEFAULT NULL COMMENT '注册资本(万元)',
  `establish_date` date DEFAULT NULL COMMENT '成立日期',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `county` varchar(50) DEFAULT NULL COMMENT '区县',
  `address` varchar(255) DEFAULT NULL COMMENT '详细注册地址',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '中心经度',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '中心纬度',
  `status` tinyint DEFAULT '1' COMMENT '1-正常 0-停用',
  `position` varchar(50) DEFAULT NULL COMMENT '岗位：养殖工/技术员/管理员/船长/质检员',
  `hire_date` date DEFAULT NULL COMMENT '入职日期',
  `base_id` bigint DEFAULT NULL COMMENT '所属基地ID',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `breeder_code` (`breeder_code`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `biz_breeder_ibfk_base` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_breeder`
--

LOCK TABLES `biz_breeder` WRITE;
/*!40000 ALTER TABLE `biz_breeder` DISABLE KEYS */;
INSERT INTO `biz_breeder` VALUES (1001,'BREEDER_001','陈大海','陈大海','13800138000','chen@example.com','35010119800101001X',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'管理员','2025-03-01',1,NULL,NULL,0,NULL),(1002,'BREEDER_002','林明辉','陈志明','13950208888','aming@aqua.cn','350205198503151234',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'养殖工','2025-06-15',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1003,'BREEDER_003','黄志辉','林文辉','13606923456','huilin@shui.com','350205197808152345',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'养殖工','2025-09-01',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1004,'BREEDER_004','吴国栋','黄国栋','13859309999','gdh@ningde.cn','352201198212013456',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'管理员','2024-12-01',2,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1005,'BREEDER_005','张水土','吴建国','15059308888','wjg@deepsea.cn','352201197509214567',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'养殖工','2026-01-10',2,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1006,'BREEDER_006','蔡清泉','蔡清泉','13505952222','cqq@minquan.cn','350521198803216789',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'技术员','2025-04-20',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1007,'BREEDER_007','陈阿财','郑有财','13706031234','youcai@fish.cn','350203199012016789',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'养殖工','2026-02-15',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL);
/*!40000 ALTER TABLE `biz_breeder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_breeder_pond`
--

DROP TABLE IF EXISTS `biz_breeder_pond`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biz_breeder_pond` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `breeder_id` bigint NOT NULL COMMENT '养殖户ID',
  `pond_id` bigint NOT NULL COMMENT '塘口ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_breeder_pond` (`breeder_id`,`pond_id`),
  KEY `pond_id` (`pond_id`),
  CONSTRAINT `fk_breeder_pond_breeder` FOREIGN KEY (`breeder_id`) REFERENCES `biz_breeder` (`id`),
  CONSTRAINT `fk_breeder_pond_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='养殖户-塘口关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_breeder_pond`
--

LOCK TABLES `biz_breeder_pond` WRITE;
/*!40000 ALTER TABLE `biz_breeder_pond` DISABLE KEYS */;
INSERT INTO `biz_breeder_pond` VALUES (3,1003,3,'2026-05-29 21:02:57'),(6,1002,1,'2026-05-29 22:47:38'),(7,1002,2,'2026-05-29 22:47:38'),(8,1004,6,'2026-05-29 23:13:28'),(9,1004,5,'2026-05-29 23:13:28'),(10,1005,8,'2026-05-29 23:13:35');
/*!40000 ALTER TABLE `biz_breeder_pond` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_operation_snap`
--

DROP TABLE IF EXISTS `biz_operation_snap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biz_operation_snap` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `base_id` bigint NOT NULL COMMENT '基地ID',
  `target_type` varchar(20) NOT NULL COMMENT '目标类型: POND(塘口), CYCLE(周期)',
  `target_id` bigint NOT NULL COMMENT '目标ID (pond_info.id 或 周期ID)',
  `calc_date` date NOT NULL COMMENT '计算日期 (YYYY-MM-DD)',
  `current_stock` decimal(12,2) DEFAULT NULL COMMENT '当前存塘量 (斤)',
  `est_yield` decimal(12,2) DEFAULT NULL COMMENT '预计总产量 (斤)',
  `avg_weight` decimal(8,2) DEFAULT NULL COMMENT '平均规格 (g/尾)',
  `cost_feed` decimal(12,2) DEFAULT '0.00' COMMENT '饲料成本',
  `cost_drug` decimal(12,2) DEFAULT '0.00' COMMENT '药品成本',
  `cost_electricity` decimal(12,2) DEFAULT '0.00' COMMENT '电费',
  `cost_fry` decimal(12,2) DEFAULT '0.00' COMMENT '苗种成本',
  `cost_labor` decimal(12,2) DEFAULT '0.00' COMMENT '人工成本',
  `cost_depreciation` decimal(12,2) DEFAULT '0.00' COMMENT '折旧成本',
  `total_cost` decimal(14,2) DEFAULT NULL COMMENT '累计总成本',
  `market_price` decimal(8,2) DEFAULT NULL COMMENT '当前市场参考价 (元/斤)',
  `est_revenue` decimal(14,2) DEFAULT NULL COMMENT '预估总收入 (存塘*市价)',
  `profit` decimal(14,2) DEFAULT NULL COMMENT '预估利润 (收入-成本)',
  `unit_cost` decimal(8,2) DEFAULT NULL COMMENT '单位成本 (元/斤)',
  `fcr` decimal(5,2) DEFAULT NULL COMMENT '饲料系数 (Feed Conversion Ratio)',
  `status` varchar(20) DEFAULT 'valid' COMMENT '数据状态',
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  KEY `target_id` (`target_id`),
  CONSTRAINT `biz_operation_snap_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`),
  CONSTRAINT `biz_operation_snap_ibfk_2` FOREIGN KEY (`target_id`) REFERENCES `pond_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_operation_snap`
--

LOCK TABLES `biz_operation_snap` WRITE;
/*!40000 ALTER TABLE `biz_operation_snap` DISABLE KEYS */;
/*!40000 ALTER TABLE `biz_operation_snap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_purchase_suggest`
--

DROP TABLE IF EXISTS `biz_purchase_suggest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biz_purchase_suggest` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `suggest_no` varchar(50) NOT NULL COMMENT '建议单号',
  `source_type` varchar(20) DEFAULT NULL COMMENT '来源: SYSTEM(库存预警), AI(智能推荐)',
  `base_id` bigint NOT NULL COMMENT '建议采购基地',
  `total_amount` decimal(12,2) DEFAULT NULL COMMENT '预估采购金额',
  `status` varchar(20) DEFAULT 'DRAFT' COMMENT 'DRAFT(草稿), CONFIRMED(已确认), CANCELLED',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `suggest_no` (`suggest_no`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `biz_purchase_suggest_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_purchase_suggest`
--

LOCK TABLES `biz_purchase_suggest` WRITE;
/*!40000 ALTER TABLE `biz_purchase_suggest` DISABLE KEYS */;
/*!40000 ALTER TABLE `biz_purchase_suggest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biz_purchase_suggest_item`
--

DROP TABLE IF EXISTS `biz_purchase_suggest_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biz_purchase_suggest_item` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `suggest_id` bigint NOT NULL COMMENT '关联建议单ID',
  `mat_id` bigint NOT NULL COMMENT '物资ID',
  `suggest_qty` decimal(12,2) NOT NULL COMMENT '建议采购数量',
  `current_stock` decimal(12,2) NOT NULL COMMENT '当前库存',
  `min_stock` decimal(12,2) NOT NULL COMMENT '安全库存',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注 (如: 用于补充3号塘缺口)',
  PRIMARY KEY (`id`),
  KEY `suggest_id` (`suggest_id`),
  KEY `mat_id` (`mat_id`),
  CONSTRAINT `biz_purchase_suggest_item_ibfk_1` FOREIGN KEY (`suggest_id`) REFERENCES `biz_purchase_suggest` (`id`),
  CONSTRAINT `biz_purchase_suggest_item_ibfk_2` FOREIGN KEY (`mat_id`) REFERENCES `mat_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biz_purchase_suggest_item`
--

LOCK TABLES `biz_purchase_suggest_item` WRITE;
/*!40000 ALTER TABLE `biz_purchase_suggest_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `biz_purchase_suggest_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cage_info`
--

DROP TABLE IF EXISTS `cage_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cage_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cage_code` varchar(50) NOT NULL COMMENT '网箱编码',
  `cage_name` varchar(100) NOT NULL COMMENT '网箱名称',
  `base_id` bigint DEFAULT NULL COMMENT '挂靠基地ID(可选)',
  `breeder_id` bigint NOT NULL COMMENT '归属主体ID',
  `longitude` decimal(10,7) NOT NULL COMMENT '中心经度',
  `latitude` decimal(10,7) NOT NULL COMMENT '中心纬度',
  `sea_area_name` varchar(100) DEFAULT NULL COMMENT '所在海域名称',
  `water_depth` decimal(6,1) DEFAULT NULL COMMENT '该处水深(米)',
  `cage_type` varchar(50) DEFAULT NULL COMMENT '类型(重力式/张力腿/升降式)',
  `shape` varchar(20) DEFAULT NULL COMMENT '形状',
  `perimeter` decimal(8,2) DEFAULT NULL COMMENT '周长(米)',
  `volume` decimal(10,2) DEFAULT NULL COMMENT '养殖水体(立方米)',
  `net_bag_depth` decimal(6,2) DEFAULT NULL COMMENT '网衣深度(米)',
  `material` varchar(100) DEFAULT NULL COMMENT '材质(HDPE/钢制)',
  `wind_resistance` int DEFAULT NULL COMMENT '抗风等级(级)',
  `current_resistance` int DEFAULT NULL COMMENT '抗流能力(节)',
  `status` tinyint DEFAULT '1' COMMENT '1-正常 2-维修 3-闲置',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cage_code` (`cage_code`),
  KEY `breeder_id` (`breeder_id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `cage_info_ibfk_2` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cage_info`
--

LOCK TABLES `cage_info` WRITE;
/*!40000 ALTER TABLE `cage_info` DISABLE KEYS */;
INSERT INTO `cage_info` VALUES (1,'CAGE-XM-202605','厦门深海一号网箱',1,1001,118.1234560,24.4567890,'台湾海峡西部',30.5,'升降式','圆形',NULL,15000.00,15.00,'HDPE',NULL,NULL,1,'2026-05-03 08:00:00',NULL,0,NULL);
/*!40000 ALTER TABLE `cage_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cert_detail`
--

DROP TABLE IF EXISTS `cert_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cert_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cert_id` bigint NOT NULL COMMENT '关联合格证ID',
  `target_type` varchar(20) NOT NULL COMMENT '目标类型: pond(塘口), vsl(工船), batch(批次)',
  `target_id` bigint NOT NULL COMMENT '目标实体ID (对应 pond_info.id 或 vsl_info.id)',
  `quantity` decimal(12,2) NOT NULL COMMENT '关联数量 (斤)',
  `is_withdrawal_passed` tinyint DEFAULT '0' COMMENT '休药期是否已过 (0-否 1-是)',
  `is_test_passed` tinyint DEFAULT '0' COMMENT '药残检测是否合格 (0-否 1-是)',
  `test_report_url` varchar(255) DEFAULT NULL COMMENT '检测报告路径',
  PRIMARY KEY (`id`),
  KEY `cert_id` (`cert_id`),
  KEY `target_id` (`target_id`),
  CONSTRAINT `cert_detail_ibfk_1` FOREIGN KEY (`cert_id`) REFERENCES `cert_info` (`id`),
  CONSTRAINT `cert_detail_ibfk_2` FOREIGN KEY (`target_id`) REFERENCES `pond_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cert_detail`
--

LOCK TABLES `cert_detail` WRITE;
/*!40000 ALTER TABLE `cert_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `cert_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cert_info`
--

DROP TABLE IF EXISTS `cert_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cert_info` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cert_no` varchar(50) NOT NULL COMMENT '合格证编号 (全局唯一)',
  `strategy_id` bigint NOT NULL COMMENT '使用的策略ID',
  `issue_date` date NOT NULL COMMENT '开具日期',
  `status` varchar(20) DEFAULT 'valid' COMMENT 'valid(有效), used(已使用), expired(过期)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cert_no` (`cert_no`),
  KEY `strategy_id` (`strategy_id`),
  CONSTRAINT `cert_info_ibfk_1` FOREIGN KEY (`strategy_id`) REFERENCES `cert_strategy` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cert_info`
--

LOCK TABLES `cert_info` WRITE;
/*!40000 ALTER TABLE `cert_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `cert_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cert_strategy`
--

DROP TABLE IF EXISTS `cert_strategy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cert_strategy` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '策略ID',
  `strategy_name` varchar(100) NOT NULL COMMENT '策略名称 (如: 超市专用标准)',
  `spec_type` varchar(50) NOT NULL COMMENT '规格类型 (如: 10kg装, 散装)',
  `required_tests` text COMMENT '必检项目 (JSON或逗号分隔: 氯霉素,孔雀石绿)',
  `status` tinyint DEFAULT '1' COMMENT '1-启用 0-停用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cert_strategy`
--

LOCK TABLES `cert_strategy` WRITE;
/*!40000 ALTER TABLE `cert_strategy` DISABLE KEYS */;
/*!40000 ALTER TABLE `cert_strategy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `env_tide`
--

DROP TABLE IF EXISTS `env_tide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `env_tide` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `base_id` bigint NOT NULL COMMENT '基地ID',
  `tide_date` date NOT NULL COMMENT '日期',
  `tide_time` time NOT NULL COMMENT '时间',
  `tide_type` varchar(20) NOT NULL COMMENT '类型: HIGH(高潮), LOW(低潮)',
  `tide_height` double NOT NULL COMMENT '潮高 (米)',
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `env_tide_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `env_tide`
--

LOCK TABLES `env_tide` WRITE;
/*!40000 ALTER TABLE `env_tide` DISABLE KEYS */;
/*!40000 ALTER TABLE `env_tide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `env_weather`
--

DROP TABLE IF EXISTS `env_weather`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `env_weather` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `base_id` bigint NOT NULL COMMENT '基地ID',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `air_temperature` double DEFAULT NULL COMMENT '气温',
  `humidity` double DEFAULT NULL COMMENT '湿度',
  `wind_speed` double DEFAULT NULL COMMENT '风速',
  `wind_direction` varchar(20) DEFAULT NULL COMMENT '风向',
  `rainfall` double DEFAULT NULL COMMENT '降雨量',
  `weather_condition` varchar(50) DEFAULT NULL COMMENT '天气状况',
  `data_source` varchar(20) DEFAULT 'IOT' COMMENT '最新数据来源: IOT(设备), MANUAL(手动)',
  `last_operator_id` bigint DEFAULT NULL COMMENT '最后操作人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `base_id` (`base_id`),
  KEY `last_operator_id` (`last_operator_id`),
  CONSTRAINT `env_weather_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`),
  CONSTRAINT `env_weather_ibfk_2` FOREIGN KEY (`last_operator_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `env_weather`
--

LOCK TABLES `env_weather` WRITE;
/*!40000 ALTER TABLE `env_weather` DISABLE KEYS */;
/*!40000 ALTER TABLE `env_weather` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `env_weather_hist`
--

DROP TABLE IF EXISTS `env_weather_hist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `env_weather_hist` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `base_id` bigint NOT NULL COMMENT '基地ID',
  `stat_date` date NOT NULL COMMENT '统计日期',
  `max_temp` double DEFAULT NULL COMMENT '最高气温',
  `min_temp` double DEFAULT NULL COMMENT '最低气温',
  `total_rainfall` double DEFAULT NULL COMMENT '累计降雨',
  `max_wind_speed` double DEFAULT NULL COMMENT '最大风速',
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `env_weather_hist_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `env_weather_hist`
--

LOCK TABLES `env_weather_hist` WRITE;
/*!40000 ALTER TABLE `env_weather_hist` DISABLE KEYS */;
/*!40000 ALTER TABLE `env_weather_hist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `env_wq`
--

DROP TABLE IF EXISTS `env_wq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `env_wq` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `pond_id` bigint NOT NULL COMMENT '塘口ID',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `dissolved_oxygen` double DEFAULT NULL COMMENT '溶解氧 (mg/L)',
  `ph_value` double DEFAULT NULL COMMENT 'pH值',
  `water_temperature` double DEFAULT NULL COMMENT '水温 (℃)',
  `ammonia_nitrogen` double DEFAULT NULL COMMENT '氨氮 (mg/L)',
  `nitrite` double DEFAULT NULL COMMENT '亚硝酸盐 (mg/L)',
  `turbidity` double DEFAULT NULL COMMENT '浊度 (NTU)',
  `salinity` double DEFAULT NULL COMMENT '盐度 (‰)',
  `data_source` varchar(20) DEFAULT 'IOT' COMMENT '最新数据来源: IOT(设备), MANUAL(手动)',
  `last_operator_id` bigint DEFAULT NULL COMMENT '最后操作人ID (如果是手动更新)',
  `do_status` varchar(20) DEFAULT NULL COMMENT '溶解氧状态',
  `ph_status` varchar(20) DEFAULT NULL COMMENT 'pH状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `pond_id` (`pond_id`),
  KEY `last_operator_id` (`last_operator_id`),
  CONSTRAINT `env_wq_ibfk_1` FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`),
  CONSTRAINT `env_wq_ibfk_2` FOREIGN KEY (`last_operator_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `env_wq`
--

LOCK TABLES `env_wq` WRITE;
/*!40000 ALTER TABLE `env_wq` DISABLE KEYS */;
/*!40000 ALTER TABLE `env_wq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `env_wq_hist`
--

DROP TABLE IF EXISTS `env_wq_hist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `env_wq_hist` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `pond_id` bigint NOT NULL COMMENT '塘口ID',
  `stat_date` datetime NOT NULL COMMENT '统计时间点 (精确到小时或天)',
  `avg_do` double DEFAULT NULL COMMENT '平均溶氧',
  `min_do` double DEFAULT NULL COMMENT '最低溶氧',
  `max_do` double DEFAULT NULL COMMENT '最高溶氧',
  `avg_temp` double DEFAULT NULL COMMENT '平均水温',
  `avg_ph` double DEFAULT NULL COMMENT '平均pH',
  PRIMARY KEY (`id`),
  KEY `pond_id` (`pond_id`),
  CONSTRAINT `env_wq_hist_ibfk_1` FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `env_wq_hist`
--

LOCK TABLES `env_wq_hist` WRITE;
/*!40000 ALTER TABLE `env_wq_hist` DISABLE KEYS */;
/*!40000 ALTER TABLE `env_wq_hist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fin_cost_record`
--

DROP TABLE IF EXISTS `fin_cost_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fin_cost_record` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_id` bigint DEFAULT NULL,
  `target_type` varchar(20) DEFAULT NULL COMMENT '对象 (pond:塘口, batch:批次)',
  `target_id` bigint DEFAULT NULL,
  `cost_type` varchar(20) DEFAULT NULL COMMENT '费用类型 (feed:饲料, drug:药品, labor:人工, energy:水电)',
  `amount` decimal(12,2) DEFAULT NULL COMMENT '金额',
  `related_log_id` bigint DEFAULT NULL COMMENT '关联的生产日志ID',
  `occur_time` datetime DEFAULT NULL COMMENT '发生时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fin_cost_record`
--

LOCK TABLES `fin_cost_record` WRITE;
/*!40000 ALTER TABLE `fin_cost_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `fin_cost_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_alert`
--

DROP TABLE IF EXISTS `iot_alert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_alert` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `alert_no` varchar(50) NOT NULL COMMENT '告警编号',
  `device_id` bigint NOT NULL COMMENT '触发设备ID',
  `alert_type` varchar(50) NOT NULL COMMENT '告警类型 (OFFLINE, DATA_OVERFLOW)',
  `title` varchar(150) NOT NULL COMMENT '告警标题',
  `content` text COMMENT '告警详情',
  `status` varchar(20) DEFAULT 'UNHANDLED' COMMENT '状态 UNHANDLED, HANDLED',
  `trigger_time` datetime NOT NULL COMMENT '触发时间',
  `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `alert_no` (`alert_no`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `iot_alert_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_alert`
--

LOCK TABLES `iot_alert` WRITE;
/*!40000 ALTER TABLE `iot_alert` DISABLE KEYS */;
/*!40000 ALTER TABLE `iot_alert` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_alert_rule`
--

DROP TABLE IF EXISTS `iot_alert_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_alert_rule` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
  `device_type_id` bigint NOT NULL COMMENT '适用设备类型',
  `condition_expr` text NOT NULL COMMENT '触发表达式 (如: value > 8.5)',
  `severity` varchar(10) DEFAULT 'MEDIUM' COMMENT '严重级别',
  `is_enabled` tinyint DEFAULT '1' COMMENT '是否启用',
  PRIMARY KEY (`id`),
  KEY `device_type_id` (`device_type_id`),
  CONSTRAINT `iot_alert_rule_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `iot_device_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_alert_rule`
--

LOCK TABLES `iot_alert_rule` WRITE;
/*!40000 ALTER TABLE `iot_alert_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `iot_alert_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_device`
--

DROP TABLE IF EXISTS `iot_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_device` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `device_sn` varchar(100) NOT NULL COMMENT '设备唯一序列号',
  `device_name` varchar(100) NOT NULL COMMENT '设备名称',
  `type_id` bigint NOT NULL COMMENT '关联设备类型ID',
  `base_id` bigint NOT NULL COMMENT '所属基地ID',
  `pond_id` bigint DEFAULT NULL COMMENT '所属塘口ID (NULL为基地级气象站)',
  `ip_address` varchar(50) DEFAULT NULL COMMENT 'IP地址/域名',
  `port` int DEFAULT NULL COMMENT '端口号',
  `auth_info` text COMMENT '鉴权信息 (JSON格式,如username/password)',
  `status` tinyint DEFAULT '1' COMMENT '运行状态 1-在线 0-离线 2-维护',
  `last_heartbeat` datetime DEFAULT NULL COMMENT '最后心跳时间',
  `install_time` datetime DEFAULT NULL COMMENT '安装时间',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_sn` (`device_sn`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `iot_device_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `iot_device_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_device`
--

LOCK TABLES `iot_device` WRITE;
/*!40000 ALTER TABLE `iot_device` DISABLE KEYS */;
INSERT INTO `iot_device` VALUES (1,'FD-XM-001','1号自动投喂机',1,1,1,'192.168.1.10',1883,NULL,1,'2026-05-30 01:00:00','2026-01-15 08:00:00','1号鲍鱼育苗车间投喂'),(2,'FD-XM-002','2号自动投喂机',1,1,2,'192.168.1.11',1883,NULL,1,NULL,'2026-01-15 08:00:00','2号石斑鱼高位池投喂'),(3,'FD-XM-003','3号自动投喂机',1,1,3,'192.168.1.12',1883,NULL,0,NULL,'2026-01-15 08:00:00','3号南美白对虾塘'),(4,'DO-XM-001','1号溶解氧传感器',2,1,1,'192.168.1.20',502,NULL,1,'2026-05-30 01:00:00','2026-01-10 09:00:00','鲍鱼车间溶氧监测'),(5,'PH-XM-001','1号pH传感器',3,1,2,'192.168.1.21',502,NULL,1,'2026-05-30 01:00:00','2026-01-10 09:00:00','石斑鱼池pH监测'),(6,'TMP-XM-001','1号温度传感器',4,1,3,'192.168.1.22',502,NULL,0,NULL,'2026-01-10 09:00:00','对虾塘温度监测'),(7,'AR-XM-001','1号增氧机',5,1,3,'192.168.1.30',1883,NULL,1,'2026-05-30 01:00:00','2026-02-01 10:00:00','对虾塘增氧'),(8,'PUMP-XM-001','1号排水泵',6,1,4,'192.168.1.40',1883,NULL,1,'2026-05-30 01:00:00','2026-02-01 10:00:00','4号螠蛏滩涂排水'),(9,'FD-ND-001','宁德1号投喂机',1,2,5,'192.168.2.10',1883,NULL,1,'2026-05-30 01:00:00','2026-03-01 08:00:00','大黄鱼网箱投喂'),(10,'DO-ND-001','宁德1号溶氧传感器',2,2,5,'192.168.2.20',502,NULL,1,'2026-05-30 01:00:00','2026-03-01 09:00:00','深海网箱溶氧监测');
/*!40000 ALTER TABLE `iot_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_device_config`
--

DROP TABLE IF EXISTS `iot_device_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_device_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `device_id` bigint NOT NULL COMMENT '关联设备ID',
  `param_key` varchar(100) NOT NULL COMMENT '参数键 (如: REPORT_INTERVAL, ALARM_THRESHOLD_HIGH)',
  `param_value` varchar(255) NOT NULL COMMENT '参数值',
  `is_active` tinyint DEFAULT '1' COMMENT '是否激活',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `iot_device_config_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_device_config`
--

LOCK TABLES `iot_device_config` WRITE;
/*!40000 ALTER TABLE `iot_device_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `iot_device_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_device_maintenance`
--

DROP TABLE IF EXISTS `iot_device_maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_device_maintenance` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `maint_type` varchar(50) NOT NULL COMMENT '维护类型 (CALIBRATION, REPAIR, REPLACE)',
  `operator_id` bigint NOT NULL COMMENT '操作人ID',
  `before_value` text COMMENT '校准前读数',
  `after_value` text COMMENT '校准后读数',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `maint_time` datetime NOT NULL COMMENT '维护时间',
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `iot_device_maintenance_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_device_maintenance`
--

LOCK TABLES `iot_device_maintenance` WRITE;
/*!40000 ALTER TABLE `iot_device_maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `iot_device_maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_device_type`
--

DROP TABLE IF EXISTS `iot_device_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_device_type` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `type_code` varchar(50) NOT NULL COMMENT '设备类型编码 (如: DO_METER, PH_METER)',
  `type_name` varchar(100) NOT NULL COMMENT '设备类型名称',
  `manufacturer` varchar(100) DEFAULT NULL COMMENT '生产厂家',
  `protocol_type` varchar(50) DEFAULT 'MQTT' COMMENT '通信协议 (MQTT, Modbus, HTTP)',
  `description` varchar(255) DEFAULT NULL COMMENT '设备功能描述',
  `status` tinyint DEFAULT '1' COMMENT '状态 1-正常 0-停用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_code` (`type_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_device_type`
--

LOCK TABLES `iot_device_type` WRITE;
/*!40000 ALTER TABLE `iot_device_type` DISABLE KEYS */;
INSERT INTO `iot_device_type` VALUES (1,'FEEDER','自动投喂机','海兴智能','MQTT','自动定时定量投喂饲料',1),(2,'DO_METER','溶解氧传感器','杭州绿洁','Modbus','实时监测水中溶解氧浓度',1),(3,'PH_METER','pH传感器','杭州绿洁','Modbus','实时监测水体pH值',1),(4,'TEMP_METER','温度传感器','杭州绿洁','Modbus','实时监测水温',1),(5,'AERATOR','增氧机','渔夫科技','MQTT','叶轮式或微孔增氧设备',1),(6,'PUMP','水泵','南方泵业','MQTT','进排水泵，支持远程启停',1);
/*!40000 ALTER TABLE `iot_device_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iot_ts_data`
--

DROP TABLE IF EXISTS `iot_ts_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iot_ts_data` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `metric_key` varchar(50) NOT NULL COMMENT '指标键 (如: dissolved_oxygen, ph_value)',
  `metric_value` double NOT NULL COMMENT '数值',
  `record_time` datetime NOT NULL COMMENT '记录时间',
  `quality_flag` tinyint DEFAULT '1' COMMENT '数据质量 1-正常 0-异常',
  `source_type` varchar(20) DEFAULT 'IOT' COMMENT '数据来源: IOT(设备), MANUAL(手动)',
  `operator_id` bigint DEFAULT NULL COMMENT '操作人ID (仅手动录入时有效)',
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  KEY `operator_id` (`operator_id`),
  CONSTRAINT `iot_ts_data_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`),
  CONSTRAINT `iot_ts_data_ibfk_2` FOREIGN KEY (`operator_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iot_ts_data`
--

LOCK TABLES `iot_ts_data` WRITE;
/*!40000 ALTER TABLE `iot_ts_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `iot_ts_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mat_category`
--

DROP TABLE IF EXISTS `mat_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mat_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cat_code` varchar(50) NOT NULL COMMENT '分类编码',
  `cat_name` varchar(100) NOT NULL COMMENT '分类名称',
  `parent_id` bigint DEFAULT '0' COMMENT '父级ID (用于多级分类)',
  `sort_order` int DEFAULT '0' COMMENT '排序',
  `status` tinyint DEFAULT '1' COMMENT '状态',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cat_code` (`cat_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mat_category`
--

LOCK TABLES `mat_category` WRITE;
/*!40000 ALTER TABLE `mat_category` DISABLE KEYS */;
INSERT INTO `mat_category` VALUES (1,'feed','饲料',0,1,1,NULL,NULL,0,NULL),(2,'drug','渔药',0,2,1,NULL,NULL,0,NULL),(3,'disinfectant','消毒剂',0,3,1,NULL,NULL,0,NULL),(4,'tool','工具设备',0,4,1,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `mat_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mat_info`
--

DROP TABLE IF EXISTS `mat_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mat_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `mat_code` varchar(50) NOT NULL COMMENT '物资编码 (如: FEED-001)',
  `mat_name` varchar(100) NOT NULL COMMENT '物资名称',
  `cat_id` bigint NOT NULL COMMENT '分类ID',
  `spec` varchar(100) DEFAULT NULL COMMENT '规格型号',
  `unit` varchar(20) DEFAULT 'kg' COMMENT '计量单位',
  `supplier_id` bigint DEFAULT NULL COMMENT '默认供应商',
  `min_stock` decimal(10,2) DEFAULT NULL COMMENT '最低库存预警',
  `max_stock` decimal(10,2) DEFAULT NULL COMMENT '最高库存预警',
  `status` tinyint DEFAULT '1' COMMENT '状态',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `withdrawal_days` int DEFAULT '0' COMMENT '休药期 (天)',
  `unit_price` decimal(10,2) DEFAULT '0.00' COMMENT '参考单价 (元)',
  `approval_code` varchar(100) DEFAULT NULL COMMENT '批准文号/生产许可证号',
  `manufacturer` varchar(100) DEFAULT NULL COMMENT '生产厂家',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mat_code` (`mat_code`),
  KEY `cat_id` (`cat_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `mat_info_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `mat_category` (`id`),
  CONSTRAINT `mat_info_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `mat_supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mat_info`
--

LOCK TABLES `mat_info` WRITE;
/*!40000 ALTER TABLE `mat_info` DISABLE KEYS */;
INSERT INTO `mat_info` VALUES (13,'FEED-001','通威草鱼配合饲料 101',1,'颗粒直径 4mm','kg',1,500.00,5000.00,1,0,NULL,0,5.20,'饲审(2023)01-001','通威股份有限公司',NULL,NULL),(14,'FEED-002','海大鲈鱼膨化料 8808',1,'颗粒直径 6mm','kg',2,200.00,2000.00,1,0,NULL,0,8.50,'饲审(2024)05-088','广东海大集团',NULL,NULL),(15,'DRUG-001','恩诺沙星粉',2,'100g:5g','瓶',3,5.00,50.00,1,0,NULL,20,45.00,'兽药字190032345','中牧实业股份有限公司',NULL,NULL),(16,'DRUG-002','氟苯尼考粉',2,'100g:10g','瓶',3,5.00,50.00,1,0,NULL,30,65.00,'兽药字140012233','齐鲁动物保健品',NULL,NULL),(17,'DIS-001','聚维酮碘溶液',3,'10% 500ml','瓶',3,10.00,100.00,1,0,NULL,0,25.00,'兽药字190012345','中牧实业股份有限公司',NULL,NULL);
/*!40000 ALTER TABLE `mat_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mat_supplier`
--

DROP TABLE IF EXISTS `mat_supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mat_supplier` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `supplier_code` varchar(50) NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  `contact_person` varchar(50) DEFAULT NULL COMMENT '联系人',
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `license_img` varchar(255) DEFAULT NULL COMMENT '营业执照',
  `status` tinyint DEFAULT '1',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_code` (`supplier_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mat_supplier`
--

LOCK TABLES `mat_supplier` WRITE;
/*!40000 ALTER TABLE `mat_supplier` DISABLE KEYS */;
INSERT INTO `mat_supplier` VALUES (1,'SUP001','厦门汇贤生物科技有限公司','张经理','13800138001','厦门市集美区',NULL,1,NULL,NULL,0,NULL),(2,'SUP002','福建海大饲料有限公司','李总','13900139002','福州市福清市',NULL,1,NULL,NULL,0,NULL),(3,'SUP003','中牧实业股份有限公司','王销售','13700137003','北京市丰台区',NULL,1,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `mat_supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `med_record`
--

DROP TABLE IF EXISTS `med_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `med_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `base_id` bigint NOT NULL COMMENT '基地ID',
  `pond_id` bigint NOT NULL COMMENT '塘口ID',
  `drug_mat_id` bigint NOT NULL COMMENT '药品物资ID (关联 mat_info.id)',
  `usage_qty` decimal(10,2) NOT NULL COMMENT '使用数量',
  `admin_date` date NOT NULL COMMENT '施药日期 (仅日期)',
  `withdrawal_days` int NOT NULL COMMENT '该药品的休药期天数 (快照)',
  `ban_harvest_until` date NOT NULL COMMENT '禁止收获截止日期 (计算字段: admin_date + withdrawal_days)',
  `log_id` bigint DEFAULT NULL COMMENT '关联的生产日志ID (prod_log.id)',
  `create_time` datetime DEFAULT NULL COMMENT '记录创建时间',
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  KEY `pond_id` (`pond_id`),
  KEY `drug_mat_id` (`drug_mat_id`),
  KEY `log_id` (`log_id`),
  CONSTRAINT `med_record_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`),
  CONSTRAINT `med_record_ibfk_2` FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`),
  CONSTRAINT `med_record_ibfk_3` FOREIGN KEY (`drug_mat_id`) REFERENCES `mat_info` (`id`),
  CONSTRAINT `med_record_ibfk_4` FOREIGN KEY (`log_id`) REFERENCES `prod_log` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `med_record`
--

LOCK TABLES `med_record` WRITE;
/*!40000 ALTER TABLE `med_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `med_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pond_daily_stats`
--

DROP TABLE IF EXISTS `pond_daily_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pond_daily_stats` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_id` bigint DEFAULT NULL COMMENT '基地ID',
  `pond_id` bigint DEFAULT NULL COMMENT '塘口ID',
  `stat_date` date DEFAULT NULL COMMENT '统计日期',
  `total_feed` decimal(10,2) DEFAULT '0.00' COMMENT '今日总投喂量(kg)',
  `total_mortality` decimal(10,2) DEFAULT '0.00' COMMENT '今日总死亡量(kg)',
  `total_harvest` decimal(10,2) DEFAULT '0.00' COMMENT '今日总捕捞量(kg)',
  `current_stock_estimate` decimal(10,2) DEFAULT NULL COMMENT '当前预估存塘量(kg)',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pond_daily_stats`
--

LOCK TABLES `pond_daily_stats` WRITE;
/*!40000 ALTER TABLE `pond_daily_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `pond_daily_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pond_info`
--

DROP TABLE IF EXISTS `pond_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pond_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pond_code` varchar(50) NOT NULL COMMENT '塘口编码',
  `pond_name` varchar(100) NOT NULL COMMENT '塘口名称',
  `base_id` bigint NOT NULL COMMENT '归属基地ID',
  `area` decimal(10,2) DEFAULT NULL COMMENT '水面面积(亩)',
  `depth_avg` decimal(5,2) DEFAULT NULL COMMENT '平均深度(米)',
  `depth_max` decimal(5,2) DEFAULT NULL COMMENT '最深处(米)',
  `shape_type` varchar(20) DEFAULT NULL COMMENT '形状(矩形/圆形/不规则)',
  `bottom_type` varchar(50) DEFAULT NULL COMMENT '底质(泥沙/铺膜/混凝土)',
  `bottom_silt_depth` decimal(4,1) DEFAULT NULL COMMENT '淤泥深度(厘米)',
  `inlet_count` int DEFAULT '0' COMMENT '进水口数量',
  `inlet_diameter` int DEFAULT NULL COMMENT '进水管径(mm)',
  `outlet_count` int DEFAULT '0' COMMENT '出水口数量',
  `outlet_type` varchar(50) DEFAULT NULL COMMENT '出水方式(溢流/底排)',
  `aeration_type` varchar(100) DEFAULT NULL COMMENT '增氧机类型',
  `aeration_count` int DEFAULT '0' COMMENT '增氧机台数',
  `aeration_power` decimal(6,2) DEFAULT NULL COMMENT '总功率(kw)',
  `has_circulating` tinyint DEFAULT '0' COMMENT '是否有循环水系统',
  `has_monitoring` tinyint DEFAULT '0' COMMENT '是否有视频监控',
  `current_species` varchar(100) DEFAULT NULL COMMENT '当前养殖品种',
  `stocking_date` date DEFAULT NULL COMMENT '最近放苗日期',
  `estimated_output` decimal(10,2) DEFAULT NULL COMMENT '预计产量(斤)',
  `status` tinyint DEFAULT '2' COMMENT '1-养殖中 2-空闲 0-废弃',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `pond_code` (`pond_code`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `pond_info_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pond_info`
--

LOCK TABLES `pond_info` WRITE;
/*!40000 ALTER TABLE `pond_info` DISABLE KEYS */;
INSERT INTO `pond_info` VALUES (1,'POND_XM_001','1号鲍鱼育苗车间',1,5.00,1.50,2.00,'矩形','混凝土',NULL,2,NULL,2,NULL,'纯氧微孔',10,15.50,1,1,'皱纹盘鲍','2026-04-01',5000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(2,'POND_XM_002','2号石斑鱼高位池',1,20.00,2.50,3.00,'圆形','铺膜',NULL,1,NULL,1,NULL,'叶轮式',4,12.00,1,1,'东星斑','2026-03-15',15000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(3,'POND_XM_003','3号南美白对虾塘',1,100.00,1.80,2.20,'不规则','泥沙',NULL,3,NULL,3,NULL,'水车式',6,18.00,0,1,'南美白对虾','2026-04-20',50000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(4,'POND_XM_004','4号螠蛏滩涂',1,295.50,0.50,1.00,'不规则','沙质',NULL,0,NULL,0,NULL,'自然潮汐',0,0.00,0,0,'螠蛏','2025-11-01',100000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(5,'POND_ND_001','1号深海抗风浪网箱',2,80.00,8.00,12.00,'圆形','HDPE浮筒',NULL,0,NULL,0,NULL,'底部微孔增氧',20,25.00,1,1,'大黄鱼','2026-02-15',200000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL),(6,'POND_ND_002','2号金鲳鱼养殖区',2,600.00,7.50,10.00,'多边形','尼龙网衣',NULL,0,NULL,0,NULL,'水车式(浮动)',8,15.00,0,1,'金鲳鱼','2026-03-01',120000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL),(7,'POND_ND_003','3号黑鮶深水网箱',2,500.00,9.00,13.00,'圆形','钢制框架',NULL,0,NULL,0,NULL,'纯氧锥',4,10.00,1,1,'黑鮶','2026-01-10',80000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL),(8,'POND_ND_004','岸基苗种暂养池A',2,50.00,2.00,2.50,'矩形','混凝土',NULL,2,NULL,2,NULL,'罗茨风机',4,5.50,1,1,'大黄鱼苗','2026-04-25',5000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL);
/*!40000 ALTER TABLE `pond_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_log`
--

DROP TABLE IF EXISTS `prod_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint DEFAULT NULL COMMENT '关联的任务ID (如果是按计划执行)',
  `plan_id` bigint DEFAULT NULL COMMENT '关联的计划ID (兜底字段)',
  `base_id` bigint DEFAULT NULL COMMENT '所属基地ID (冗余)',
  `target_type` varchar(20) DEFAULT NULL,
  `target_id` bigint DEFAULT NULL,
  `batch_no` varchar(50) DEFAULT NULL COMMENT '物料批次号 (用药/投喂时记录)',
  `log_type` varchar(30) DEFAULT NULL COMMENT '作业类型',
  `action_time` datetime DEFAULT NULL COMMENT '实际发生时间',
  `quantity` decimal(10,2) DEFAULT NULL COMMENT '实际数量/用量',
  `photo_urls` text COMMENT '照片URL列表 (逗号分隔)',
  `env_data` json DEFAULT NULL COMMENT '环境数据快照 (温度/溶氧/PH等)',
  `gps_lat` decimal(8,6) DEFAULT NULL COMMENT '打卡纬度',
  `gps_lng` decimal(9,6) DEFAULT NULL COMMENT '打卡经度',
  `location_city` varchar(50) DEFAULT NULL COMMENT '作业城市 (如: 厦门市)',
  `source` varchar(20) DEFAULT 'app' COMMENT '来源: app(工人), admin(文员代录), system(自动)',
  `created_by` bigint DEFAULT NULL COMMENT '录入账号ID (可能是文员)',
  `actual_worker_id` bigint DEFAULT NULL COMMENT '实际干活的人ID (用于代录场景)',
  `is_backfilled` tinyint(1) DEFAULT '0' COMMENT '是否事后补录',
  `status_flag` varchar(20) DEFAULT 'normal' COMMENT '状态(normal, abnormal)',
  `backfill_reason` varchar(255) DEFAULT NULL COMMENT '补录原因',
  `remark` varchar(255) DEFAULT NULL COMMENT '人工备注/异常描述',
  `verify_status` varchar(20) DEFAULT 'auto' COMMENT 'auto(自动通过), pending(待审), rejected(驳回)',
  `create_time` datetime DEFAULT (now()) COMMENT '创建时间',
  `update_time` datetime DEFAULT (now()) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `plan_id` (`plan_id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `prod_log_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `prod_task` (`id`),
  CONSTRAINT `prod_log_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `prod_plan` (`id`),
  CONSTRAINT `prod_log_ibfk_3` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_log`
--

LOCK TABLES `prod_log` WRITE;
/*!40000 ALTER TABLE `prod_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_plan`
--

DROP TABLE IF EXISTS `prod_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_plan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_id` bigint DEFAULT NULL,
  `parent_plan_id` bigint DEFAULT NULL,
  `target_type` varchar(20) DEFAULT NULL,
  `target_id` bigint DEFAULT NULL,
  `plan_type` varchar(30) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content_desc` text,
  `feed_variety` varchar(100) DEFAULT NULL COMMENT '饲料品种',
  `feed_amount` decimal(10,2) DEFAULT NULL COMMENT '计划投喂量(kg)',
  `drug_name` varchar(100) DEFAULT NULL COMMENT '药品名称',
  `dosage` varchar(100) DEFAULT NULL COMMENT '用量',
  `withdrawal_days` int DEFAULT NULL COMMENT '休药期天数',
  `weather_req` varchar(100) DEFAULT NULL COMMENT '气象要求',
  `est_yield` decimal(10,2) DEFAULT NULL COMMENT '预计产量',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `cycle_rule` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'draft',
  `owner_id` bigint DEFAULT NULL,
  `assignee_group_id` bigint DEFAULT NULL,
  `create_time` datetime DEFAULT (now()),
  `update_time` datetime DEFAULT (now()),
  `is_delete` tinyint NOT NULL DEFAULT '0',
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  KEY `parent_plan_id` (`parent_plan_id`),
  CONSTRAINT `prod_plan_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_plan`
--

LOCK TABLES `prod_plan` WRITE;
/*!40000 ALTER TABLE `prod_plan` DISABLE KEYS */;
INSERT INTO `prod_plan` VALUES (1,1,NULL,'pond',1,'feeding','5月鲍鱼育苗车间投喂计划','每日早晚各投喂一次，投喂前检查水质，清理残饵。雨天减少投喂量。','鲍鱼配合饲料',50.00,NULL,NULL,NULL,'晴天或阴天',NULL,'2026-06-01 06:00:00','2026-06-30 20:00:00','daily','active',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(2,1,NULL,'pond',2,'feeding','石斑鱼高位池日常投喂','使用石斑鱼膨化浮性饲料，日投喂2次，根据水温、溶氧调整投喂量。','石斑鱼膨化饲料',80.00,NULL,NULL,NULL,NULL,NULL,'2026-06-01 07:00:00','2026-06-30 18:00:00','daily','active',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(3,1,NULL,'pond',3,'medication','对虾塘弧菌预防方案','连续3天全池泼洒聚维酮碘，注意增氧。用药期间停止换水。',NULL,NULL,'聚维酮碘','500ml/亩·米',7,'晴天上午使用',NULL,'2026-06-03 08:00:00','2026-06-05 18:00:00',NULL,'published',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(4,1,NULL,'pond',4,'harvest','螠蛏滩涂采捕计划','退潮后组织工人滩涂采捕，分级分拣，活鲜运输至加工厂。',NULL,NULL,NULL,NULL,NULL,NULL,2000.00,'2026-06-10 04:00:00','2026-06-10 12:00:00',NULL,'draft',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(5,1,NULL,'cage',1,'maintenance','深海一号网箱检修维护','检查网衣破损情况，更换老化浮球，清理附着生物，检查锚固系统。',NULL,NULL,NULL,NULL,NULL,'风浪小于3级',NULL,'2026-06-08 09:00:00','2026-06-08 17:00:00',NULL,'draft',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(6,2,NULL,'pond',6,'seeding','金鲳鱼养殖区放苗计划','从苗种基地运输金鲳鱼苗，先暂养适应水温，然后分批次投放。',NULL,NULL,NULL,NULL,NULL,'水温稳定在22°C以上',NULL,'2026-06-05 07:00:00','2026-06-05 12:00:00',NULL,'published',1004,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(7,2,NULL,'pond',5,'feeding','大黄鱼网箱投喂计划','使用大黄鱼专用浮性膨化料，每日投喂2次，注意观察摄食情况。','大黄鱼浮性料',120.00,NULL,NULL,NULL,NULL,NULL,'2026-06-01 06:00:00','2026-06-30 18:00:00','daily','active',1004,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(8,2,NULL,'pond',7,'harvest','黑鮶深水网箱成鱼捕捞','起网分级捕捞，活鱼舱运输，对接厦门批发市场。',NULL,NULL,NULL,NULL,NULL,'风浪小于4级',5000.00,'2026-06-15 04:00:00','2026-06-15 14:00:00',NULL,'draft',1004,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(9,2,NULL,'pond',8,'water_change','苗种池水质调理','排掉1/3老水，注入新水，开启增氧机，检测氨氮亚盐。',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-28 09:00:00','2026-05-28 15:00:00',NULL,'completed',1004,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(10,1,NULL,'vsl',1,'maintenance','国信先锋号制冷系统维保','检查氨压缩机运行状态，更换冷冻油，清洗冷凝器，补充制冷剂。',NULL,NULL,NULL,NULL,NULL,'停泊状态',NULL,'2026-06-12 09:00:00','2026-06-12 17:00:00',NULL,'draft',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(11,1,NULL,'pond',2,'medication','石斑鱼出血病治疗','内服恩诺沙星拌料投喂，连续5天，同时外泼消毒。休药期严格执行。',NULL,NULL,'恩诺沙星','200g/吨饲料',15,NULL,NULL,'2026-06-07 08:00:00','2026-06-11 18:00:00',NULL,'published',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(12,1,NULL,'pond',3,'harvest','南美白对虾塘出虾计划','地笼捕捞+拉网，分级过磅，加冰运输至加工厂。提前停食12小时。',NULL,NULL,NULL,NULL,NULL,NULL,3000.00,'2026-06-20 04:00:00','2026-06-20 10:00:00',NULL,'draft',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL);
/*!40000 ALTER TABLE `prod_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_plan_backup`
--

DROP TABLE IF EXISTS `prod_plan_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_plan_backup` (
  `id` bigint NOT NULL DEFAULT '0',
  `base_id` bigint DEFAULT NULL COMMENT '所属基地ID (冗余字段，用于快速筛选)',
  `parent_plan_id` bigint DEFAULT NULL COMMENT '父计划ID (用于模板生成或计划拆分)',
  `target_type` varchar(20) DEFAULT NULL COMMENT '目标类型: pond(塘口), cage(网箱), vsl(工船)',
  `target_id` bigint DEFAULT NULL COMMENT '目标实体ID',
  `plan_type` varchar(30) DEFAULT NULL COMMENT '类型: feeding(投喂), medication(用药), harvest(收获), maintenance(维护)',
  `title` varchar(255) DEFAULT NULL COMMENT '计划标题',
  `content_desc` text COMMENT '详细描述/操作指南',
  `start_time` datetime DEFAULT NULL COMMENT '计划开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '计划结束时间',
  `cycle_rule` varchar(50) DEFAULT NULL COMMENT '循环规则: 如 "Every Monday"，为空则是一次性计划',
  `status` varchar(20) DEFAULT 'draft' COMMENT '状态: draft(草稿), published(已发布), active(进行中), completed(已完成), cancelled(已取消)',
  `owner_id` bigint DEFAULT NULL COMMENT '制定人/管理员ID',
  `assignee_group_id` bigint DEFAULT NULL COMMENT '指派给哪个班组/角色',
  `create_time` datetime DEFAULT (now()) COMMENT '创建时间',
  `update_time` datetime DEFAULT (now()) COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_plan_backup`
--

LOCK TABLES `prod_plan_backup` WRITE;
/*!40000 ALTER TABLE `prod_plan_backup` DISABLE KEYS */;
INSERT INTO `prod_plan_backup` VALUES (1,1,NULL,'pond',1,'feeding','5月常规投喂计划','每日早晚各一次，根据天气调整投喂量','2026-05-05 06:00:00','2026-05-31 20:00:00','Every Day','active',1001,201,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(2,1,NULL,'cage',5,'medication','网箱杀菌消毒专项','使用二氧化氯进行水体消毒，注意佩戴手套','2026-05-06 08:00:00','2026-05-06 12:00:00',NULL,'published',1001,202,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(3,2,NULL,'vsl',1,'maintenance','工船发电机月度维保','检查机油液位，更换空气滤芯','2026-05-10 09:00:00','2026-05-10 17:00:00',NULL,'draft',1002,203,'2026-05-04 18:39:23','2026-05-04 18:39:23',1,NULL),(4,1,1,'pond',2,'feeding','102号塘加餐计划','针对生长较快的鱼群增加10%投喂量','2026-05-07 07:00:00','2026-05-07 18:00:00',NULL,'completed',1001,201,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(5,2,NULL,'pond',5,'harvest','成鱼捕捞上市计划','准备捕捞网具，联系运输车辆','2026-05-15 04:00:00','2026-05-15 10:00:00',NULL,'cancelled',1002,201,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(6,1,NULL,'pond',3,'harvest','103号塘成鱼上市捕捞','联系收购商王老板，规格大于1kg的挑出来高价卖','2026-05-20 04:00:00','2026-05-20 12:00:00',NULL,'published',1001,201,'2026-05-04 22:21:54','2026-05-04 22:21:54',0,NULL),(7,1,NULL,'pond',4,'medication','104号塘出血病综合治疗','连续3天，内服恩诺沙星，外泼聚维酮碘','2026-05-21 08:00:00','2026-05-23 18:00:00',NULL,'cancelled',1001,202,'2026-05-04 22:24:47','2026-05-04 22:24:47',0,NULL);
/*!40000 ALTER TABLE `prod_plan_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_task`
--

DROP TABLE IF EXISTS `prod_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_task` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `plan_id` bigint DEFAULT NULL COMMENT '来源计划ID (如果是临时任务则为空)',
  `base_id` bigint DEFAULT NULL COMMENT '所属基地ID (冗余)',
  `task_title` varchar(255) DEFAULT NULL COMMENT '任务标题 (生成时复制自计划)',
  `target_type` varchar(20) DEFAULT NULL COMMENT '目标类型 (生成时复制自计划)',
  `target_id` bigint DEFAULT NULL COMMENT '目标ID (生成时复制自计划)',
  `action_time` datetime DEFAULT NULL COMMENT '要求执行的具体时间 (如: 2023-10-27 08:00)',
  `deadline_time` datetime DEFAULT NULL COMMENT '最晚完成时间 (用于计算逾期)',
  `status` varchar(20) DEFAULT 'pending' COMMENT '状态: pending(待办), assigned(已派发), doing(进行中), done(已完成), skipped(跳过/无需执行), expired(已过期)',
  `assignee_id` bigint DEFAULT NULL COMMENT '具体执行工人ID',
  `cancel_reason` varchar(255) DEFAULT NULL COMMENT '取消/跳过原因',
  `device_id` bigint DEFAULT NULL COMMENT '关联 IoT 设备ID',
  `device_action` varchar(50) DEFAULT NULL COMMENT '设备操作指令',
  `create_time` datetime DEFAULT (now()) COMMENT '创建时间',
  `update_time` datetime DEFAULT (now()) COMMENT '更新时间',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `priority` varchar(10) DEFAULT 'medium' COMMENT '优先级 (high, medium, low)',
  `feed_variety` varchar(100) DEFAULT NULL COMMENT '饲料品种',
  `feed_amount` decimal(10,2) DEFAULT NULL COMMENT '投喂量(kg)',
  `drug_name` varchar(100) DEFAULT NULL COMMENT '药品名称',
  `dosage` varchar(100) DEFAULT NULL COMMENT '用量',
  `withdrawal_days` int DEFAULT NULL COMMENT '休药期天数',
  `weather_req` varchar(100) DEFAULT NULL COMMENT '气象要求',
  `source_type` varchar(20) DEFAULT NULL COMMENT '来源类型 (plan:计划, alert:预警, manual:人工)',
  `source_id` bigint DEFAULT NULL COMMENT '来源ID (关联计划ID或预警ID)',
  PRIMARY KEY (`id`),
  KEY `plan_id` (`plan_id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `prod_task_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `prod_plan` (`id`),
  CONSTRAINT `prod_task_ibfk_2` FOREIGN KEY (`base_id`) REFERENCES `base_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_task`
--

LOCK TABLES `prod_task` WRITE;
/*!40000 ALTER TABLE `prod_task` DISABLE KEYS */;
INSERT INTO `prod_task` VALUES (1,1,1,'2026-06-01 早间投喂','pond',1,'2026-06-01 06:00:00','2026-06-01 08:00:00','done',1002,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','鲍鱼配合饲料',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(2,1,1,'2026-06-01 晚间投喂','pond',1,'2026-06-01 17:00:00','2026-06-01 19:00:00','done',1003,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','鲍鱼配合饲料',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(3,1,1,'2026-06-02 早间投喂','pond',1,'2026-06-02 06:00:00','2026-06-02 08:00:00','assigned',1002,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','鲍鱼配合饲料',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(4,1,1,'2026-06-02 晚间投喂','pond',1,'2026-06-02 17:00:00','2026-06-02 19:00:00','pending',1003,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','鲍鱼配合饲料',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(5,2,1,'2026-06-01 早间投喂','pond',2,'2026-06-01 07:00:00','2026-06-01 09:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high','石斑鱼膨化饲料',40.00,NULL,NULL,NULL,NULL,NULL,NULL),(6,2,1,'2026-06-01 午间投喂','pond',2,'2026-06-01 12:00:00','2026-06-01 14:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high','石斑鱼膨化饲料',40.00,NULL,NULL,NULL,NULL,NULL,NULL),(7,2,1,'2026-06-02 早间投喂','pond',2,'2026-06-02 07:00:00','2026-06-02 09:00:00','assigned',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high','石斑鱼膨化饲料',40.00,NULL,NULL,NULL,NULL,NULL,NULL),(8,3,1,'配药-聚维酮碘','pond',3,'2026-06-03 08:00:00','2026-06-03 09:00:00','pending',1006,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'聚维酮碘','500ml/亩·米',NULL,NULL,NULL,NULL),(9,3,1,'第1天全池泼洒','pond',3,'2026-06-03 09:00:00','2026-06-03 11:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'聚维酮碘','500ml/亩·米',NULL,NULL,NULL,NULL),(10,3,1,'第2天全池泼洒','pond',3,'2026-06-04 09:00:00','2026-06-04 11:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'聚维酮碘','500ml/亩·米',NULL,NULL,NULL,NULL),(11,3,1,'第3天全池泼洒','pond',3,'2026-06-05 09:00:00','2026-06-05 11:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'聚维酮碘','500ml/亩·米',NULL,NULL,NULL,NULL),(12,6,2,'放苗准备-检查暂养池','pond',6,'2026-06-05 07:00:00','2026-06-05 08:00:00','pending',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,6,2,'金鲳鱼苗投放','pond',6,'2026-06-05 08:00:00','2026-06-05 11:00:00','pending',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,7,2,'2026-06-01 早间投喂','pond',5,'2026-06-01 06:00:00','2026-06-01 08:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','大黄鱼浮性料',60.00,NULL,NULL,NULL,NULL,NULL,NULL),(15,7,2,'2026-06-01 晚间投喂','pond',5,'2026-06-01 16:00:00','2026-06-01 18:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','大黄鱼浮性料',60.00,NULL,NULL,NULL,NULL,NULL,NULL),(16,7,2,'2026-06-02 早间投喂','pond',5,'2026-06-02 06:00:00','2026-06-02 08:00:00','assigned',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','大黄鱼浮性料',60.00,NULL,NULL,NULL,NULL,NULL,NULL),(17,9,2,'排水及注水操作','pond',8,'2026-05-28 09:00:00','2026-05-28 11:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,9,2,'水质检测记录','pond',8,'2026-05-28 11:00:00','2026-05-28 12:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,9,2,'增氧机运行检查','pond',8,'2026-05-28 14:00:00','2026-05-28 15:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,11,1,'配药-恩诺沙星拌料','pond',2,'2026-06-07 08:00:00','2026-06-07 09:00:00','pending',1006,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'恩诺沙星','200g/吨饲料',15,NULL,NULL,NULL),(21,11,1,'第1天投药饲喂','pond',2,'2026-06-07 09:00:00','2026-06-07 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'恩诺沙星','200g/吨饲料',15,NULL,NULL,NULL),(22,11,1,'第2天投药饲喂','pond',2,'2026-06-08 09:00:00','2026-06-08 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'恩诺沙星','200g/吨饲料',15,NULL,NULL,NULL),(23,11,1,'第3天投药饲喂','pond',2,'2026-06-09 09:00:00','2026-06-09 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'恩诺沙星','200g/吨饲料',15,NULL,NULL,NULL),(24,11,1,'第4天投药饲喂','pond',2,'2026-06-10 09:00:00','2026-06-10 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'恩诺沙星','200g/吨饲料',15,NULL,NULL,NULL),(25,11,1,'第5天投药饲喂','pond',2,'2026-06-11 09:00:00','2026-06-11 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'恩诺沙星','200g/吨饲料',15,NULL,NULL,NULL);
/*!40000 ALTER TABLE `prod_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stk_inventory`
--

DROP TABLE IF EXISTS `stk_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stk_inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_id` bigint NOT NULL COMMENT '基地ID',
  `mat_id` bigint NOT NULL COMMENT '物资ID',
  `batch_no` varchar(50) DEFAULT NULL COMMENT '批次号 (如果分批次管理)',
  `current_qty` decimal(12,4) DEFAULT '0.0000' COMMENT '当前结存数量',
  `lock_qty` decimal(12,4) DEFAULT '0.0000' COMMENT '锁定数量 (已分配给任务但未领用)',
  `last_update_time` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_mat` (`base_id`,`mat_id`,`batch_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='物资实时库存表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stk_inventory`
--

LOCK TABLES `stk_inventory` WRITE;
/*!40000 ALTER TABLE `stk_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `stk_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stk_record`
--

DROP TABLE IF EXISTS `stk_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stk_record` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `record_no` varchar(50) NOT NULL COMMENT '流水单号',
  `base_id` bigint NOT NULL COMMENT '发生基地ID',
  `mat_id` bigint NOT NULL COMMENT '物资ID',
  `batch_no` varchar(50) DEFAULT NULL COMMENT '批次号',
  `type` varchar(20) NOT NULL COMMENT '类型: IN, OUT, ADJUST',
  `change_qty` decimal(12,4) NOT NULL COMMENT '变动数量 (入库填正, 出库填负)',
  `operator_id` bigint DEFAULT NULL COMMENT '操作人ID',
  `remark` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `record_no` (`record_no`),
  KEY `mat_id` (`mat_id`),
  CONSTRAINT `stk_record_ibfk_1` FOREIGN KEY (`mat_id`) REFERENCES `mat_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stk_record`
--

LOCK TABLES `stk_record` WRITE;
/*!40000 ALTER TABLE `stk_record` DISABLE KEYS */;
INSERT INTO `stk_record` VALUES (1,'STK-IN-20260501-001',1,13,'BATCH-20260501','IN',1000.0000,1001,'采购入库 - 通威草鱼配合饲料','2026-05-01 09:00:00'),(2,'STK-IN-20260501-002',1,14,'BATCH-20260501','IN',500.0000,1001,'采购入库 - 海大鲈鱼膨化料','2026-05-01 09:30:00'),(3,'STK-IN-20260502-003',1,15,'BATCH-20260502','IN',50.0000,1001,'采购入库 - 恩诺沙星粉','2026-05-02 10:00:00'),(4,'STK-IN-20260502-004',1,17,'BATCH-20260502','IN',100.0000,1001,'采购入库 - 聚维酮碘溶液','2026-05-02 10:30:00'),(5,'STK-OUT-20260520-005',1,13,'BATCH-20260501','OUT',-50.5000,5001,'投喂出库 - 1号塘早间投喂','2026-05-20 07:15:00'),(6,'STK-OUT-20260520-006',1,14,'BATCH-20260501','OUT',-120.0000,1001,'投喂出库 - 2号塘加餐','2026-05-20 08:00:00'),(7,'STK-OUT-20260521-007',1,13,'BATCH-20260501','OUT',-48.0000,5001,'投喂出库 - 1号塘晚间投喂','2026-05-21 17:30:00'),(8,'STK-OUT-20260521-008',1,15,'BATCH-20260502','OUT',-500.0000,5002,'用药出库 - 恩诺沙星治疗','2026-05-21 09:30:00'),(9,'STK-OUT-20260522-009',1,15,'BATCH-20260502','OUT',-500.0000,5002,'用药出库 - 恩诺沙星第2天','2026-05-22 09:30:00'),(10,'STK-OUT-20260510-010',1,17,'BATCH-20260502','OUT',-2000.0000,1001,'用药出库 - 聚维酮碘消毒','2026-05-10 14:00:00'),(11,'STK-ADJ-20260515-011',1,13,'BATCH-20260501','ADJUST',-10.0000,1001,'盘点调整 - 发现损耗10kg','2026-05-15 16:00:00'),(12,'STK-ADJ-20260515-012',1,14,'BATCH-20260501','ADJUST',5.0000,1001,'盘点调整 - 实际库存多出5kg','2026-05-15 16:30:00');
/*!40000 ALTER TABLE `stk_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stk_usage`
--

DROP TABLE IF EXISTS `stk_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stk_usage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usage_no` varchar(50) NOT NULL COMMENT '使用单号',
  `base_id` bigint NOT NULL,
  `pond_id` bigint NOT NULL COMMENT '针对哪个塘口',
  `task_id` bigint DEFAULT NULL COMMENT '关联的生产任务ID (可选)',
  `mat_id` bigint NOT NULL,
  `use_qty` decimal(10,2) NOT NULL COMMENT '使用数量',
  `unit_price` decimal(10,2) DEFAULT NULL COMMENT '单价 (用于核算成本)',
  `total_price` decimal(12,2) DEFAULT NULL COMMENT '总价',
  `operator_id` bigint DEFAULT NULL COMMENT '操作人',
  `use_time` datetime DEFAULT (now()),
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usage_no` (`usage_no`),
  KEY `mat_id` (`mat_id`),
  KEY `pond_id` (`pond_id`),
  CONSTRAINT `stk_usage_ibfk_1` FOREIGN KEY (`mat_id`) REFERENCES `mat_info` (`id`),
  CONSTRAINT `stk_usage_ibfk_2` FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stk_usage`
--

LOCK TABLES `stk_usage` WRITE;
/*!40000 ALTER TABLE `stk_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `stk_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_config`
--

DROP TABLE IF EXISTS `sys_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` varchar(500) NOT NULL COMMENT '配置值',
  `config_desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_config`
--

LOCK TABLES `sys_config` WRITE;
/*!40000 ALTER TABLE `sys_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dept`
--

DROP TABLE IF EXISTS `sys_dept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dept` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID (系统自动生成)',
  `parent_id` bigint DEFAULT '0' COMMENT '父级ID (0=顶级)',
  `dept_name` varchar(100) NOT NULL COMMENT '部门名称 (实际存: 基地名称)',
  `dept_code` varchar(50) DEFAULT NULL COMMENT '部门编码',
  `sort_order` int DEFAULT '0' COMMENT '排序',
  `status` tinyint DEFAULT '1' COMMENT '状态 1-正常 0-停用',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dept`
--

LOCK TABLES `sys_dept` WRITE;
/*!40000 ALTER TABLE `sys_dept` DISABLE KEYS */;
INSERT INTO `sys_dept` VALUES (101,0,'厦门示范基地管理部','DEPT_XM',0,1,NULL,NULL,0,NULL),(102,0,'宁德深海养殖运营部','DEPT_ND',0,1,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `sys_dept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dict_data`
--

DROP TABLE IF EXISTS `sys_dict_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dict_data` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dict_type` varchar(50) NOT NULL COMMENT '关联类型',
  `dict_label` varchar(100) NOT NULL COMMENT '显示标签',
  `dict_value` varchar(100) NOT NULL COMMENT '存储值',
  `sort_order` int DEFAULT '0',
  `status` tinyint DEFAULT '1',
  `create_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dict_data`
--

LOCK TABLES `sys_dict_data` WRITE;
/*!40000 ALTER TABLE `sys_dict_data` DISABLE KEYS */;
INSERT INTO `sys_dict_data` VALUES (1,'sys_user_sex','男','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(2,'sys_user_sex','女','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(3,'sys_user_sex','未知','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(4,'sys_show_hide','显示','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(5,'sys_show_hide','隐藏','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(6,'sys_normal_disable','正常','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(7,'sys_normal_disable','停用','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(8,'sys_job_status','正常','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(9,'sys_job_status','暂停','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(10,'sys_job_group','系统','DEFAULT',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(11,'sys_job_group','全链','QUANLIAN',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(12,'sys_yes_no','是','Y',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(13,'sys_yes_no','否','N',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(14,'sys_notice_type','通知','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(15,'sys_notice_type','公告','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(16,'sys_oper_type','其它','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(17,'sys_oper_type','新增','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(18,'sys_oper_type','修改','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(19,'sys_oper_type','删除','3',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(20,'sys_common_status','成功','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(21,'sys_common_status','失败','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(22,'pond_status','养殖中','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(23,'pond_status','空闲','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(24,'pond_status','废弃','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(25,'cage_type','重力式','gravity',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(26,'cage_type','张力腿','tension_leg',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(27,'cage_type','升降式','submersible',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(28,'warn_severity','低','low',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(29,'warn_severity','中','medium',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(30,'warn_severity','高','high',1,1,'2026-05-03 01:46:00',0,NULL,NULL);
/*!40000 ALTER TABLE `sys_dict_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_dict_type`
--

DROP TABLE IF EXISTS `sys_dict_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_dict_type` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dict_type` varchar(50) NOT NULL COMMENT '字典类型',
  `dict_name` varchar(100) NOT NULL COMMENT '字典名称',
  `dict_desc` varchar(200) DEFAULT NULL COMMENT '描述',
  `status` tinyint DEFAULT '1',
  `create_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dict_type` (`dict_type`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_dict_type`
--

LOCK TABLES `sys_dict_type` WRITE;
/*!40000 ALTER TABLE `sys_dict_type` DISABLE KEYS */;
INSERT INTO `sys_dict_type` VALUES (1,'sys_user_sex','用户性别',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(2,'sys_show_hide','菜单状态',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(3,'sys_normal_disable','系统开关',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(4,'sys_job_status','任务状态',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(5,'sys_job_group','任务分组',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(6,'sys_yes_no','系统是否',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(7,'sys_notice_type','通知类型',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(8,'sys_oper_type','操作类型',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(9,'sys_common_status','系统状态',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(10,'pond_status','养殖状态',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(11,'cage_type','网箱类型',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(12,'warn_severity','告警级别',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00');
/*!40000 ALTER TABLE `sys_dict_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_log`
--

DROP TABLE IF EXISTS `sys_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL COMMENT '操作人',
  `operation` varchar(200) DEFAULT NULL COMMENT '模块标题',
  `method` varchar(200) DEFAULT NULL COMMENT '请求方法',
  `params` text COMMENT '请求参数',
  `ip` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `time` bigint DEFAULT '0' COMMENT '执行耗时毫秒',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_log`
--

LOCK TABLES `sys_log` WRITE;
/*!40000 ALTER TABLE `sys_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_login_log`
--

DROP TABLE IF EXISTS `sys_login_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_login_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL COMMENT '账号',
  `ip` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `login_time` datetime DEFAULT (now()) COMMENT '登录时间',
  `status` tinyint DEFAULT '1' COMMENT '状态 1-成功 0-失败',
  `msg` varchar(255) DEFAULT NULL COMMENT '提示信息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_login_log`
--

LOCK TABLES `sys_login_log` WRITE;
/*!40000 ALTER TABLE `sys_login_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_login_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_menu`
--

DROP TABLE IF EXISTS `sys_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `parent_id` bigint DEFAULT '0' COMMENT '父菜单ID',
  `menu_type` tinyint NOT NULL COMMENT '类型 1-目录 2-菜单 3-按钮',
  `menu_path` varchar(200) DEFAULT NULL COMMENT '路由地址',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识 system:user:add',
  `icon` varchar(100) DEFAULT NULL COMMENT '图标',
  `sort_order` int DEFAULT '0' COMMENT '排序',
  `visible` tinyint DEFAULT '1' COMMENT '是否可见',
  `status` tinyint DEFAULT '1' COMMENT '状态',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_menu`
--

LOCK TABLES `sys_menu` WRITE;
/*!40000 ALTER TABLE `sys_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notice`
--

DROP TABLE IF EXISTS `sys_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notice` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(255) NOT NULL COMMENT '公告标题',
  `content` text NOT NULL COMMENT '公告内容',
  `publisher_id` bigint NOT NULL COMMENT '发布人ID',
  `publish_time` datetime NOT NULL COMMENT '发布时间',
  `expire_time` datetime DEFAULT NULL COMMENT '过期时间',
  `status` tinyint DEFAULT '1' COMMENT '1-生效 0-撤回',
  PRIMARY KEY (`id`),
  KEY `publisher_id` (`publisher_id`),
  CONSTRAINT `sys_notice_ibfk_1` FOREIGN KEY (`publisher_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notice`
--

LOCK TABLES `sys_notice` WRITE;
/*!40000 ALTER TABLE `sys_notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notice_record`
--

DROP TABLE IF EXISTS `sys_notice_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notice_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `biz_id` bigint DEFAULT NULL COMMENT '关联的业务ID (如 iot_alert.id 或 warn_record.id)',
  `biz_type` varchar(50) DEFAULT NULL COMMENT '业务类型 (ALERT, WARN, NOTICE)',
  `template_id` bigint NOT NULL COMMENT '使用的模板ID',
  `user_id` bigint NOT NULL COMMENT '接收人ID',
  `title` varchar(255) NOT NULL COMMENT '实际标题 (渲染后)',
  `content` text NOT NULL COMMENT '实际内容 (渲染后)',
  `channel` varchar(20) NOT NULL COMMENT '发送渠道',
  `receiver_addr` varchar(100) DEFAULT NULL COMMENT '接收地址 (手机号/邮箱/OpenID)',
  `status` varchar(20) DEFAULT 'PENDING' COMMENT 'PENDING(待发送), SUCCESS(成功), FAILED(失败)',
  `read_status` tinyint DEFAULT '0' COMMENT '0-未读 1-已读',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  PRIMARY KEY (`id`),
  KEY `biz_id` (`biz_id`),
  KEY `template_id` (`template_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sys_notice_record_ibfk_3` FOREIGN KEY (`template_id`) REFERENCES `sys_notice_template` (`id`),
  CONSTRAINT `sys_notice_record_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notice_record`
--

LOCK TABLES `sys_notice_record` WRITE;
/*!40000 ALTER TABLE `sys_notice_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_notice_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notice_template`
--

DROP TABLE IF EXISTS `sys_notice_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notice_template` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `template_code` varchar(50) NOT NULL COMMENT '模板编码 (如: ALARM_DISSOLVED_OXYGEN, WARN_STOCK_LOW)',
  `template_name` varchar(100) NOT NULL COMMENT '模板名称',
  `title` varchar(255) NOT NULL COMMENT '标题模板 (支持{占位符})',
  `content` text NOT NULL COMMENT '内容模板 (支持{占位符})',
  `channel` varchar(20) NOT NULL COMMENT '默认渠道: SMS, APP, WECHAT, EMAIL',
  `status` tinyint DEFAULT '1' COMMENT '是否启用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `template_code` (`template_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notice_template`
--

LOCK TABLES `sys_notice_template` WRITE;
/*!40000 ALTER TABLE `sys_notice_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_notice_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_notice_user`
--

DROP TABLE IF EXISTS `sys_notice_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_notice_user` (
  `user_id` bigint NOT NULL,
  `notice_id` bigint NOT NULL,
  `read_status` tinyint DEFAULT '0' COMMENT '0-未读 1-已读',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  PRIMARY KEY (`user_id`,`notice_id`),
  KEY `notice_id` (`notice_id`),
  CONSTRAINT `sys_notice_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `sys_notice_user_ibfk_2` FOREIGN KEY (`notice_id`) REFERENCES `sys_notice` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_notice_user`
--

LOCK TABLES `sys_notice_user` WRITE;
/*!40000 ALTER TABLE `sys_notice_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_notice_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role`
--

DROP TABLE IF EXISTS `sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) NOT NULL COMMENT '角色权限字符串',
  `role_desc` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `data_scope` tinyint DEFAULT '1' COMMENT '数据范围 1-全部 2-自定义 3-本部门 4-仅本人',
  `sort_order` int DEFAULT '0' COMMENT '排序',
  `status` tinyint DEFAULT '1' COMMENT '状态',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role`
--

LOCK TABLES `sys_role` WRITE;
/*!40000 ALTER TABLE `sys_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_role_menu`
--

DROP TABLE IF EXISTS `sys_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_role_menu` (
  `role_id` bigint NOT NULL,
  `menu_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `sys_role_menu_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`),
  CONSTRAINT `sys_role_menu_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role_menu`
--

LOCK TABLES `sys_role_menu` WRITE;
/*!40000 ALTER TABLE `sys_role_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_role_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user_notice_pref`
--

DROP TABLE IF EXISTS `sys_user_notice_pref`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_notice_pref` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `category` varchar(50) NOT NULL COMMENT '分类: ALARM(告警), WARN(预警), NOTICE(通知)',
  `channel` varchar(20) NOT NULL COMMENT '渠道: SMS, APP, WECHAT',
  `is_enabled` tinyint DEFAULT '1' COMMENT '是否开启该渠道',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sys_user_notice_pref_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user_notice_pref`
--

LOCK TABLES `sys_user_notice_pref` WRITE;
/*!40000 ALTER TABLE `sys_user_notice_pref` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_user_notice_pref` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_user_role`
--

DROP TABLE IF EXISTS `sys_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_role` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `sys_user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `sys_user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user_role`
--

LOCK TABLES `sys_user_role` WRITE;
/*!40000 ALTER TABLE `sys_user_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trade_item`
--

DROP TABLE IF EXISTS `trade_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trade_item` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `order_id` bigint NOT NULL COMMENT '订单ID',
  `cert_id` bigint NOT NULL COMMENT '关联的合格证ID (核心: 确保可溯源)',
  `species` varchar(50) NOT NULL COMMENT '品种 (如: 大黄鱼)',
  `weight` decimal(10,2) NOT NULL COMMENT '重量',
  `unit_price` decimal(10,2) NOT NULL COMMENT '单价',
  `subtotal` decimal(12,2) NOT NULL COMMENT '小计',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `cert_id` (`cert_id`),
  CONSTRAINT `trade_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `trade_order` (`id`),
  CONSTRAINT `trade_item_ibfk_2` FOREIGN KEY (`cert_id`) REFERENCES `cert_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trade_item`
--

LOCK TABLES `trade_item` WRITE;
/*!40000 ALTER TABLE `trade_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `trade_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trade_order`
--

DROP TABLE IF EXISTS `trade_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trade_order` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(50) NOT NULL COMMENT '订单编号',
  `buyer_name` varchar(100) NOT NULL COMMENT '买家姓名/公司',
  `buyer_phone` varchar(20) DEFAULT NULL COMMENT '买家电话',
  `total_amount` decimal(12,2) NOT NULL COMMENT '总金额',
  `status` varchar(20) DEFAULT 'unpaid' COMMENT 'unpaid(待支付), paid(已支付), shipped(已发货), completed(已完成)',
  `create_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trade_order`
--

LOCK TABLES `trade_order` WRITE;
/*!40000 ALTER TABLE `trade_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `trade_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_name` varchar(256) DEFAULT NULL COMMENT '用户昵称',
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_account` varchar(256) DEFAULT NULL COMMENT '账号',
  `avatar_url` varchar(1024) DEFAULT NULL COMMENT '用户头像',
  `gender` tinyint DEFAULT NULL COMMENT '性别',
  `user_password` varchar(512) DEFAULT NULL COMMENT '密码',
  `phone` varchar(128) DEFAULT NULL COMMENT '电话',
  `email` varchar(512) DEFAULT NULL COMMENT '邮箱',
  `user_status` int NOT NULL DEFAULT '0' COMMENT '状态 0 - 正常',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `user_role` int DEFAULT '0' COMMENT '角色 : 0=普通用户, 1= 管理员 ,2 =VIP',
  `dept_id` bigint DEFAULT NULL COMMENT '部门id',
  PRIMARY KEY (`id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('ArtSail',2,NULL,'https://tse1-mm.cn.bing.net/th/id/OIP-C.nK0XeOYsRtt_DesX3QgcsgHaHa?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',0,'123456','13559272451','1337284817@qq.com',0,'2026-03-13 00:34:47','2026-03-13 00:34:47',0,0,NULL),('SailArt',3,'TestUser1773334149699','https://tse1-mm.cn.bing.net/th/id/OIP-C.nK0XeOYsRtt_DesX3QgcsgHaHa?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-03-13 00:49:10','2026-03-18 00:30:11',0,1,NULL),(NULL,4,'123456',NULL,NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-03-15 19:18:50','2026-03-15 19:18:50',0,0,NULL),(NULL,5,'1234567',NULL,NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-03-15 22:17:58','2026-03-15 22:17:58',0,0,NULL),(NULL,6,'12345689',NULL,NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-03-15 23:48:00','2026-03-15 23:48:00',0,0,NULL),(NULL,7,'123456789',NULL,NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-03-16 00:01:42','2026-03-16 00:01:42',0,0,NULL),(NULL,8,'Test',NULL,NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-03-18 23:09:41','2026-03-18 23:09:41',0,0,NULL),('ArtSail',9,NULL,'https://tse1-mm.cn.bing.net/th/id/OIP-C.nK0XeOYsRtt_DesX3QgcsgHaHa?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',0,'123456','13559272451','1337284817@qq.com',0,'2026-03-20 20:49:54','2026-03-20 20:49:54',0,0,NULL),('ArtSail',10,NULL,'https://tse1-mm.cn.bing.net/th/id/OIP-C.nK0XeOYsRtt_DesX3QgcsgHaHa?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',0,'123456','13559272451','1337284817@qq.com',0,'2026-03-20 20:53:12','2026-03-20 20:53:12',0,0,NULL),('ArtSail',11,NULL,'https://tse1-mm.cn.bing.net/th/id/OIP-C.nK0XeOYsRtt_DesX3QgcsgHaHa?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',0,'123456','13559272451','1337284817@qq.com',0,'2026-05-01 15:20:03','2026-05-01 15:20:03',0,0,NULL),('ArtSail',12,NULL,'https://tse1-mm.cn.bing.net/th/id/OIP-C.nK0XeOYsRtt_DesX3QgcsgHaHa?w=154&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',0,'123456','13559272451','1337284817@qq.com',0,'2026-05-01 15:20:03','2026-05-01 15:20:03',0,0,NULL),(NULL,13,'ArtS',NULL,NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-05-01 15:20:03','2026-05-01 15:20:03',0,0,NULL),(NULL,14,'ArtS',NULL,NULL,'2d58eb683250920152a056af8e6e8fa1',NULL,NULL,0,'2026-05-01 15:20:03','2026-05-01 15:20:03',0,0,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vsl_info`
--

DROP TABLE IF EXISTS `vsl_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vsl_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `vsl_code` varchar(50) NOT NULL COMMENT '船舶编号',
  `vsl_name` varchar(100) NOT NULL COMMENT '船名',
  `breeder_id` bigint NOT NULL COMMENT '归属主体ID',
  `mmsi` varchar(20) DEFAULT NULL COMMENT '水上移动通信标识码',
  `imo_number` varchar(20) DEFAULT NULL COMMENT 'IMO编号',
  `registry_port` varchar(50) DEFAULT NULL COMMENT '船籍港',
  `length_overall` decimal(8,2) DEFAULT NULL COMMENT '总长(米)',
  `width` decimal(8,2) DEFAULT NULL COMMENT '型宽(米)',
  `depth` decimal(8,2) DEFAULT NULL COMMENT '型深(米)',
  `gross_tonnage` int DEFAULT NULL COMMENT '总吨位',
  `deadweight` int DEFAULT NULL COMMENT '载重吨位',
  `breeding_volume` decimal(10,2) DEFAULT NULL COMMENT '养殖水体(立方米)',
  `production_capacity` decimal(10,2) DEFAULT NULL COMMENT '年产能力(吨)',
  `engine_power` int DEFAULT NULL COMMENT '主机功率(kw)',
  `max_speed` decimal(5,1) DEFAULT NULL COMMENT '航速(节)',
  `endurance` int DEFAULT NULL COMMENT '自持力(天)',
  `has_processing` tinyint DEFAULT '0' COMMENT '是否有加工车间',
  `has_cold_storage` tinyint DEFAULT '0' COMMENT '是否有冷藏舱',
  `status` tinyint DEFAULT '1' COMMENT '1-在航 2-锚泊 3-维修',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `vsl_code` (`vsl_code`),
  KEY `breeder_id` (`breeder_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vsl_info`
--

LOCK TABLES `vsl_info` WRITE;
/*!40000 ALTER TABLE `vsl_info` DISABLE KEYS */;
INSERT INTO `vsl_info` VALUES (1,'VSL-XM-001','国信先锋号',1001,'412999888',NULL,'厦门',249.90,40.00,NULL,NULL,NULL,80000.00,3000.00,6800,15.0,NULL,1,0,2,'2026-05-03 12:00:00',NULL,0,NULL);
/*!40000 ALTER TABLE `vsl_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warn_record`
--

DROP TABLE IF EXISTS `warn_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warn_record` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `record_no` varchar(50) NOT NULL COMMENT '预警单号',
  `rule_id` bigint NOT NULL COMMENT '触发规则ID',
  `base_id` bigint NOT NULL COMMENT '归属基地',
  `target_type` varchar(20) DEFAULT NULL COMMENT '目标类型 (POND, MAT, TASK)',
  `target_id` bigint DEFAULT NULL COMMENT '目标实体ID',
  `title` varchar(150) NOT NULL COMMENT '预警标题',
  `content` text COMMENT '详细内容 (如: 恩诺沙星休药期还有2天)',
  `severity` varchar(10) NOT NULL COMMENT '严重程度 (low/medium/high)',
  `trigger_time` datetime NOT NULL COMMENT '触发时间',
  `status` varchar(20) DEFAULT 'unhandled' COMMENT '状态: unhandled(未处理), processed(已处理), ignored(已忽略)',
  `handler_id` bigint DEFAULT NULL COMMENT '处理人ID',
  `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
  `handle_remark` varchar(255) DEFAULT NULL COMMENT '处理备注',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `record_no` (`record_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warn_record`
--

LOCK TABLES `warn_record` WRITE;
/*!40000 ALTER TABLE `warn_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `warn_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warn_rule`
--

DROP TABLE IF EXISTS `warn_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warn_rule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rule_code` varchar(50) NOT NULL COMMENT '规则编码 (如: STK_LOW, MED_RISK)',
  `rule_name` varchar(100) NOT NULL COMMENT '规则名称',
  `biz_module` varchar(30) NOT NULL COMMENT '所属业务模块 (STOCK, PROD, TRADE)',
  `trigger_type` varchar(20) NOT NULL COMMENT '触发方式: TIMER(定时扫描), EVENT(实时事件)',
  `check_logic` text COMMENT '校验逻辑脚本/表达式 (可选)',
  `severity_default` varchar(10) DEFAULT 'medium' COMMENT '默认严重程度 (low/medium/high)',
  `status` tinyint DEFAULT '1' COMMENT '状态 1-启用 0-停用',
  `remark` varchar(255) DEFAULT NULL,
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `rule_code` (`rule_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warn_rule`
--

LOCK TABLES `warn_rule` WRITE;
/*!40000 ALTER TABLE `warn_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `warn_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warn_rule_param`
--

DROP TABLE IF EXISTS `warn_rule_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warn_rule_param` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rule_id` bigint NOT NULL COMMENT '关联规则ID',
  `base_id` bigint DEFAULT NULL COMMENT '适用基地ID (NULL=全平台通用)',
  `pond_id` bigint DEFAULT NULL COMMENT '适用塘口ID (NULL=全基地通用)',
  `param_key` varchar(50) NOT NULL COMMENT '参数键 (如: min_stock, withdrawal_check)',
  `param_value` varchar(255) NOT NULL COMMENT '参数值 (如: 100, true)',
  `unit` varchar(20) DEFAULT NULL COMMENT '单位 (如: kg, day)',
  `is_active` tinyint DEFAULT '1' COMMENT '是否启用该配置',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除: 0-正常, 1-已删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warn_rule_param`
--

LOCK TABLES `warn_rule_param` WRITE;
/*!40000 ALTER TABLE `warn_rule_param` DISABLE KEYS */;
/*!40000 ALTER TABLE `warn_rule_param` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

-- 显式恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-30 14:17:02
