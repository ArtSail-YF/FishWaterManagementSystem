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



--

-- Table structure for table `base_info`

--



DROP TABLE IF EXISTS `base_info`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `base_info` (

  `id` bigint NOT NULL AUTO_INCREMENT,

  `base_code` varchar(50) NOT NULL COMMENT '',

  `base_name` varchar(100) NOT NULL COMMENT '',

  `breeder_id` bigint NOT NULL COMMENT '',

  `dept_id` bigint NOT NULL COMMENT '',

  `address` varchar(255) DEFAULT NULL COMMENT '',

  `longitude` decimal(10,7) DEFAULT NULL COMMENT '',

  `latitude` decimal(10,7) DEFAULT NULL COMMENT '',

  `total_area` decimal(12,2) DEFAULT NULL COMMENT '',

  `water_area` decimal(12,2) DEFAULT NULL COMMENT '',

  `water_source` varchar(100) DEFAULT NULL COMMENT '',

  `water_quality_grade` varchar(20) DEFAULT NULL COMMENT '',

  `soil_type` varchar(100) DEFAULT NULL COMMENT '',

  `ph_value` decimal(3,1) DEFAULT NULL COMMENT '',

  `power_supply` varchar(100) DEFAULT NULL COMMENT '',

  `transformer_capacity` int DEFAULT NULL COMMENT '',

  `road_condition` varchar(200) DEFAULT NULL COMMENT '',

  `drainage_system` varchar(100) DEFAULT NULL COMMENT '',

  `is_pollution_free` tinyint DEFAULT '0' COMMENT '',

  `taiwan_cooperation` tinyint DEFAULT '0' COMMENT '',

  `green_certification` varchar(50) DEFAULT NULL COMMENT '',

  `certification_img` varchar(255) DEFAULT NULL COMMENT '',

  `deep_sea_certified` tinyint DEFAULT '0' COMMENT '',

  `sea_area_license` varchar(255) DEFAULT NULL COMMENT '',

  `environmental_assessment` varchar(255) DEFAULT NULL COMMENT '',

  `remark` varchar(500) DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

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

INSERT INTO `base_info` VALUES (1,'BASE_XM2026','厦门海洋牧场示范基地',1001,101,'厦门海洋牧场示范基地',118.2654321,24.5678901,500.00,420.50,'塘口','塘口','基地A?',7.8,'塘口基地A',500,'基地A塘口塘口','基地A基地A基地A塘口',1,0,'基地A基地A A ??','/upload/cert/xm_green_2025.jpg',0,'基地A? 101002026001 ??','?塘口 [2025] 056 ??','厦门海洋牧场示范基地基地A基地A基地A?',1,'2026-05-03 08:00:00','2026-05-04 00:10:00',0,NULL),(2,'BASE_ND2026','福建省厦门市海沧区??',1001,102,'厦门海洋牧场示范基地塘口',119.7543210,26.5812345,1200.00,1150.00,'基地A?','塘口','基地A基地A',8.1,'基地A基地A塘口+基地A基地A',800,'基地A??','基地A基地A?',1,1,'基地A基地A?','/upload/cert/nd_organic_2025.jpg',1,'基地A? 102002026008 ??','基地A?? [2025] 112 ??','厦门海洋牧场示范基地? 5G 基地A??',1,'2026-05-03 09:00:00','2026-05-04 00:10:00',0,NULL);

/*!40000 ALTER TABLE `base_info` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `biz_ai_diagnosis`

--



DROP TABLE IF EXISTS `biz_ai_diagnosis`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `biz_ai_diagnosis` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `user_id` bigint NOT NULL COMMENT '',

  `diag_type` varchar(50) DEFAULT 'DAILY' COMMENT '',

  `input_time` datetime NOT NULL COMMENT '',

  `input_data` text COMMENT '',

  `analysis_text` text COMMENT '',

  `action_items` text COMMENT '',

  `report_file_url` varchar(255) DEFAULT NULL COMMENT '',

  `status` varchar(20) DEFAULT 'SUCCESS' COMMENT 'SUCCESS, FAILED, PROCESSING',

  `create_time` datetime DEFAULT NULL COMMENT '',

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

  `breeder_code` varchar(50) NOT NULL COMMENT '',

  `breeder_name` varchar(100) NOT NULL COMMENT '',

  `legal_person` varchar(50) DEFAULT NULL COMMENT '',

  `phone` varchar(20) NOT NULL COMMENT '',

  `email` varchar(100) DEFAULT NULL COMMENT '',

  `id_card` varchar(20) DEFAULT NULL COMMENT '',

  `business_license` varchar(255) DEFAULT NULL COMMENT '',

  `license_no` varchar(100) DEFAULT NULL COMMENT '',

  `reg_capital` decimal(15,2) DEFAULT NULL COMMENT '',

  `establish_date` date DEFAULT NULL COMMENT '',

  `province` varchar(50) DEFAULT NULL COMMENT '',

  `city` varchar(50) DEFAULT NULL COMMENT '',

  `county` varchar(50) DEFAULT NULL COMMENT '',

  `address` varchar(255) DEFAULT NULL COMMENT '',

  `longitude` decimal(10,7) DEFAULT NULL COMMENT '',

  `latitude` decimal(10,7) DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `position` varchar(50) DEFAULT NULL COMMENT '',

  `hire_date` date DEFAULT NULL COMMENT '',

  `base_id` bigint DEFAULT NULL COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

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

INSERT INTO `biz_breeder` VALUES (1001,'BREEDER_001','??','??','13800138000','chen@example.com','35010119800101001X',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'基地A?','2025-03-01',1,NULL,NULL,0,NULL),(1002,'BREEDER_002','基地A??','基地A?','13950208888','aming@aqua.cn','350205198503151234',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'基地A?','2025-06-15',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1003,'BREEDER_003','基地A?','基地A?','13606923456','huilin@shui.com','350205197808152345',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'基地A?','2025-09-01',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1004,'BREEDER_004','基地A?','基地A?','13859309999','gdh@ningde.cn','352201198212013456',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'基地A?','2024-12-01',2,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1005,'BREEDER_005','基地A?','基地A','15059308888','wjg@deepsea.cn','352201197509214567',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'基地A?','2026-01-10',2,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1006,'BREEDER_006','基地A?','基地A?','13505952222','cqq@minquan.cn','350521198803216789',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'基地A?','2025-04-20',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL),(1007,'BREEDER_007','?塘口','基地A','13706031234','youcai@fish.cn','350203199012016789',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'基地A?','2026-02-15',1,'2026-05-29 21:02:57','2026-05-29 21:02:57',0,NULL);

/*!40000 ALTER TABLE `biz_breeder` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `biz_breeder_pond`

--



DROP TABLE IF EXISTS `biz_breeder_pond`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `biz_breeder_pond` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `breeder_id` bigint NOT NULL COMMENT '',

  `pond_id` bigint NOT NULL COMMENT '',

  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '',

  PRIMARY KEY (`id`),

  UNIQUE KEY `uk_breeder_pond` (`breeder_id`,`pond_id`),

  KEY `pond_id` (`pond_id`),

  CONSTRAINT `fk_breeder_pond_breeder` FOREIGN KEY (`breeder_id`) REFERENCES `biz_breeder` (`id`),

  CONSTRAINT `fk_breeder_pond_pond` FOREIGN KEY (`pond_id`) REFERENCES `pond_info` (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='基地A?-基地A基地A?';

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `target_type` varchar(20) NOT NULL COMMENT '',

  `target_id` bigint NOT NULL COMMENT '',

  `calc_date` date NOT NULL COMMENT '',

  `current_stock` decimal(12,2) DEFAULT NULL COMMENT '',

  `est_yield` decimal(12,2) DEFAULT NULL COMMENT '',

  `avg_weight` decimal(8,2) DEFAULT NULL COMMENT '',

  `cost_feed` decimal(12,2) DEFAULT '0.00' COMMENT '',

  `cost_drug` decimal(12,2) DEFAULT '0.00' COMMENT '',

  `cost_electricity` decimal(12,2) DEFAULT '0.00' COMMENT '',

  `cost_fry` decimal(12,2) DEFAULT '0.00' COMMENT '',

  `cost_labor` decimal(12,2) DEFAULT '0.00' COMMENT '',

  `cost_depreciation` decimal(12,2) DEFAULT '0.00' COMMENT '',

  `total_cost` decimal(14,2) DEFAULT NULL COMMENT '',

  `market_price` decimal(8,2) DEFAULT NULL COMMENT '',

  `est_revenue` decimal(14,2) DEFAULT NULL COMMENT '',

  `profit` decimal(14,2) DEFAULT NULL COMMENT '',

  `unit_cost` decimal(8,2) DEFAULT NULL COMMENT '',

  `fcr` decimal(5,2) DEFAULT NULL COMMENT '',

  `status` varchar(20) DEFAULT 'valid' COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `suggest_no` varchar(50) NOT NULL COMMENT '',

  `source_type` varchar(20) DEFAULT NULL COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `total_amount` decimal(12,2) DEFAULT NULL COMMENT '',

  `status` varchar(20) DEFAULT 'DRAFT' COMMENT '',

  `create_time` datetime DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `suggest_id` bigint NOT NULL COMMENT '',

  `mat_id` bigint NOT NULL COMMENT '',

  `suggest_qty` decimal(12,2) NOT NULL COMMENT '',

  `current_stock` decimal(12,2) NOT NULL COMMENT '',

  `min_stock` decimal(12,2) NOT NULL COMMENT '',

  `remark` varchar(255) DEFAULT NULL COMMENT '',

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

  `cage_code` varchar(50) NOT NULL COMMENT '',

  `cage_name` varchar(100) NOT NULL COMMENT '',

  `base_id` bigint DEFAULT NULL COMMENT '',

  `breeder_id` bigint NOT NULL COMMENT '',

  `longitude` decimal(10,7) NOT NULL COMMENT '',

  `latitude` decimal(10,7) NOT NULL COMMENT '',

  `sea_area_name` varchar(100) DEFAULT NULL COMMENT '',

  `water_depth` decimal(6,1) DEFAULT NULL COMMENT '',

  `cage_type` varchar(50) DEFAULT NULL COMMENT '',

  `shape` varchar(20) DEFAULT NULL COMMENT '',

  `perimeter` decimal(8,2) DEFAULT NULL COMMENT '',

  `volume` decimal(10,2) DEFAULT NULL COMMENT '',

  `net_bag_depth` decimal(6,2) DEFAULT NULL COMMENT '',

  `material` varchar(100) DEFAULT NULL COMMENT '',

  `wind_resistance` int DEFAULT NULL COMMENT '',

  `current_resistance` int DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

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

INSERT INTO `cage_info` VALUES (1,'CAGE-XM-202605','基地A基地A基地A?',1,1001,118.1234560,24.4567890,'基地A基地A',30.5,'基地A?','塘口',NULL,15000.00,15.00,'HDPE',NULL,NULL,1,'2026-05-03 08:00:00',NULL,0,NULL);

/*!40000 ALTER TABLE `cage_info` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `cert_detail`

--



DROP TABLE IF EXISTS `cert_detail`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `cert_detail` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `cert_id` bigint NOT NULL COMMENT '',

  `target_type` varchar(20) NOT NULL COMMENT '',

  `target_id` bigint NOT NULL COMMENT '',

  `quantity` decimal(12,2) NOT NULL COMMENT '',

  `is_withdrawal_passed` tinyint DEFAULT '0' COMMENT '',

  `is_test_passed` tinyint DEFAULT '0' COMMENT '',

  `test_report_url` varchar(255) DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `cert_no` varchar(50) NOT NULL COMMENT '',

  `strategy_id` bigint NOT NULL COMMENT '',

  `issue_date` date NOT NULL COMMENT '',

  `status` varchar(20) DEFAULT 'valid' COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `strategy_name` varchar(100) NOT NULL COMMENT '',

  `spec_type` varchar(50) NOT NULL COMMENT '',

  `required_tests` text COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  PRIMARY KEY (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `cert_strategy`

--



LOCK TABLES `cert_strategy` WRITE;

/*!40000 ALTER TABLE `cert_strategy` DISABLE KEYS */;

INSERT INTO `cert_strategy` VALUES 

(1,'A福建省厦门市海沧区?','基地A','[]',1),

(2,'B基地A基地A基地A','基地A','["????","基地A??","基地A基地A"]',1);

/*!40000 ALTER TABLE `cert_strategy` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `env_tide`

--



DROP TABLE IF EXISTS `env_tide`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `env_tide` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `tide_date` date NOT NULL COMMENT '',

  `tide_time` time NOT NULL COMMENT '',

  `tide_type` varchar(20) NOT NULL COMMENT '',

  `tide_height` double NOT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `update_time` datetime NOT NULL COMMENT '',

  `air_temperature` double DEFAULT NULL COMMENT '',

  `humidity` double DEFAULT NULL COMMENT '',

  `wind_speed` double DEFAULT NULL COMMENT '',

  `wind_direction` varchar(20) DEFAULT NULL COMMENT '',

  `rainfall` double DEFAULT NULL COMMENT '',

  `weather_condition` varchar(50) DEFAULT NULL COMMENT '',

  `data_source` varchar(20) DEFAULT 'IOT' COMMENT '',

  `last_operator_id` bigint DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `stat_date` date NOT NULL COMMENT '',

  `max_temp` double DEFAULT NULL COMMENT '',

  `min_temp` double DEFAULT NULL COMMENT '',

  `total_rainfall` double DEFAULT NULL COMMENT '',

  `max_wind_speed` double DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `pond_id` bigint NOT NULL COMMENT '',

  `update_time` datetime NOT NULL COMMENT '',

  `dissolved_oxygen` double DEFAULT NULL COMMENT '',

  `ph_value` double DEFAULT NULL COMMENT '',

  `water_temperature` double DEFAULT NULL COMMENT '',

  `ammonia_nitrogen` double DEFAULT NULL COMMENT '',

  `nitrite` double DEFAULT NULL COMMENT '',

  `turbidity` double DEFAULT NULL COMMENT '',

  `salinity` double DEFAULT NULL COMMENT '',

  `data_source` varchar(20) DEFAULT 'IOT' COMMENT '',

  `last_operator_id` bigint DEFAULT NULL COMMENT '',

  `do_status` varchar(20) DEFAULT NULL COMMENT '',

  `ph_status` varchar(20) DEFAULT NULL COMMENT '',

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

INSERT INTO env_wq (pond_id, update_time, dissolved_oxygen, ph_value, water_temperature, mmonia_nitrogen, 
itrite, data_source, do_status, ph_status) VALUES


(1, '2026-06-03 08:00:00', 6.42, 7.8, 24.5, 0.05, 0.01, 'IOT', 'normal', 'normal'),


(2, '2026-06-03 08:00:00', 5.89, 8.2, 26.1, 0.12, 0.03, 'IOT', 'warning', 'normal'),


(3, '2026-06-03 07:30:00', 3.51, 7.5, 25.8, 0.08, NULL, 'IOT', 'error', 'normal'),


(4, '2026-06-02 16:00:00', 6.12, 7.2, 23.0, NULL, NULL, 'MANUAL', 'normal', 'normal'),


(5, '2026-06-03 08:00:00', 7.15, 7.6, 22.5, 0.03, 0.01, 'IOT', 'normal', 'normal'),


(6, '2026-06-03 07:00:00', 6.85, 7.9, 25.0, 0.06, NULL, 'IOT', 'normal', 'normal'),


(7, '2026-06-02 18:00:00', 5.22, 8.5, 24.8, 0.10, 0.02, 'IOT', 'warning', 'warning'),


(8, '2026-06-03 06:00:00', 6.50, 7.4, 23.5, 0.04, NULL, 'IOT', 'normal', 'normal');




/*!40000 ALTER TABLE `env_wq` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `env_wq_hist`

--



DROP TABLE IF EXISTS `env_wq_hist`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `env_wq_hist` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `pond_id` bigint NOT NULL COMMENT '',

  `stat_date` datetime NOT NULL COMMENT '',

  `avg_do` double DEFAULT NULL COMMENT '',

  `min_do` double DEFAULT NULL COMMENT '',

  `max_do` double DEFAULT NULL COMMENT '',

  `avg_temp` double DEFAULT NULL COMMENT '',

  `avg_ph` double DEFAULT NULL COMMENT '',

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

  `target_type` varchar(20) DEFAULT NULL COMMENT '',

  `target_id` bigint DEFAULT NULL,

  `cost_type` varchar(20) DEFAULT NULL COMMENT '',

  `amount` decimal(12,2) DEFAULT NULL COMMENT '',

  `related_log_id` bigint DEFAULT NULL COMMENT '',

  `occur_time` datetime DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `alert_no` varchar(50) NOT NULL COMMENT '',

  `device_id` bigint NOT NULL COMMENT '',

  `alert_type` varchar(50) NOT NULL COMMENT '',

  `title` varchar(150) NOT NULL COMMENT '',

  `content` text COMMENT '',

  `severity` varchar(10) DEFAULT 'MEDIUM' COMMENT '',

  `status` varchar(20) DEFAULT 'UNHANDLED' COMMENT '',

  `trigger_time` datetime NOT NULL COMMENT '',

  `handle_time` datetime DEFAULT NULL COMMENT '',

  `handler_id` bigint DEFAULT NULL COMMENT '',

  `handle_note` varchar(500) DEFAULT NULL COMMENT '',

  PRIMARY KEY (`id`),

  UNIQUE KEY `alert_no` (`alert_no`),

  KEY `device_id` (`device_id`),

  KEY `idx_status` (`status`),

  KEY `idx_trigger_time` (`trigger_time`),

  CONSTRAINT `iot_alert_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='IoT 基地A';

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `iot_alert`

--



LOCK TABLES `iot_alert` WRITE;

/*!40000 ALTER TABLE `iot_alert` DISABLE KEYS */;

INSERT INTO iot_alert VALUES(1,'ALT-001',4,'DATA_OVERFLOW','基地A基地A基地A','DO-XM-001基地A?2.85mg/L基地A塘口3.0','HIGH','UNHANDLED','2026-06-01 03:30:00',NULL,NULL,NULL);



/*!40000 ALTER TABLE `iot_alert` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `iot_alert_rule`

--



DROP TABLE IF EXISTS `iot_alert_rule`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `iot_alert_rule` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `rule_name` varchar(100) NOT NULL COMMENT '',

  `device_type_id` bigint NOT NULL COMMENT '',

  `metric_key` varchar(50) NOT NULL COMMENT '',

  `condition_expr` text NOT NULL COMMENT '',

  `severity` varchar(10) DEFAULT 'MEDIUM' COMMENT '',

  `is_enabled` tinyint DEFAULT '1' COMMENT '',

  `remark` varchar(255) DEFAULT NULL COMMENT '',

  PRIMARY KEY (`id`),

  KEY `device_type_id` (`device_type_id`),

  KEY `idx_is_enabled` (`is_enabled`),

  CONSTRAINT `iot_alert_rule_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `iot_device_type` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='IoT 基地A??';

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `iot_alert_rule`

--



LOCK TABLES `iot_alert_rule` WRITE;

/*!40000 ALTER TABLE `iot_alert_rule` DISABLE KEYS */;

INSERT INTO `iot_alert_rule` VALUES

(1,'基地A基地A基地A',2,'dissolved_oxygen','value < 3.0','HIGH',1,'基地A基地A基地A塘口3.0mg/L基地A基地A??'),

(2,'基地A基地A基地A',2,'dissolved_oxygen','value > 8.5','MEDIUM',1,'厦门海洋牧场示范基地塘口'),

(3,'pH基地A塘口',3,'ph','value < 6.5','HIGH',1,'pH基地A6.5基地A基地A??'),

(4,'pH基地A塘口',3,'ph','value > 8.8','MEDIUM',1,'pH基地A8.8基地A??'),

(5,'??基地A??',4,'temperature','value > 32.0','HIGH',1,'??塘口32基地A基地A??'),

(6,'??基地A??',4,'temperature','value < 5.0','MEDIUM',1,'??塘口5基地A??'),

(7,'基地A基地A基地A',5,'current','value > 15.0','HIGH',1,'基地A基地A基地A??15A基地A基地A??'),

(8,'基地A??',1,'feed_amount','value > 50.0','LOW',1,'基地A基地A基地A50kg基地A基地A');

/*!40000 ALTER TABLE `iot_alert_rule` ENABLE KEYS */;

UNLOCK TABLES;

-- Table structure for table `iot_device`

--



DROP TABLE IF EXISTS `iot_device`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `iot_device` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `device_sn` varchar(100) NOT NULL COMMENT '',

  `device_name` varchar(100) NOT NULL COMMENT '',

  `type_id` bigint NOT NULL COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `pond_id` bigint DEFAULT NULL COMMENT '',

  `ip_address` varchar(50) DEFAULT NULL COMMENT '',

  `port` int DEFAULT NULL COMMENT '',

  `auth_info` text COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `last_heartbeat` datetime DEFAULT NULL COMMENT '',

  `install_time` datetime DEFAULT NULL COMMENT '',

  `remark` varchar(255) DEFAULT NULL COMMENT '',

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

INSERT INTO `iot_device` VALUES (1,'FD-XM-001','1基地A基地A?',1,1,1,'192.168.1.10',1883,NULL,1,'2026-05-30 01:00:00','2026-01-15 08:00:00','1基地A基地A基地A?'),(2,'FD-XM-002','2基地A基地A?',1,1,2,'192.168.1.11',1883,NULL,1,NULL,'2026-01-15 08:00:00','2基地A基地A基地A?'),(3,'FD-XM-003','3基地A基地A?',1,1,3,'192.168.1.12',1883,NULL,0,NULL,'2026-01-15 08:00:00','3基地A基地A基地A'),(4,'DO-XM-001','1基地A基地A基地A?',2,1,1,'192.168.1.20',502,NULL,1,'2026-05-30 01:00:00','2026-01-10 09:00:00','基地A基地A基地A?'),(5,'PH-XM-001','1??pH基地A??',3,1,2,'192.168.1.21',502,NULL,1,'2026-05-30 01:00:00','2026-01-10 09:00:00','基地A??pH塘口'),(6,'TMP-XM-001','1塘口基地A??',4,1,3,'192.168.1.22',502,NULL,0,NULL,'2026-01-10 09:00:00','基地A??塘口'),(7,'AR-XM-001','1基地A基地A',5,1,3,'192.168.1.30',1883,NULL,1,'2026-05-30 01:00:00','2026-02-01 10:00:00','基地A基地A?'),(8,'PUMP-XM-001','1基地A塘口',6,1,4,'192.168.1.40',1883,NULL,1,'2026-05-30 01:00:00','2026-02-01 10:00:00','4基地A基地A??'),(9,'FD-ND-001','基地A1基地A??',1,2,5,'192.168.2.10',1883,NULL,1,'2026-05-30 01:00:00','2026-03-01 08:00:00','基地A基地A塘口'),(10,'DO-ND-001','基地A1基地A基地A基地A',2,2,5,'192.168.2.20',502,NULL,1,'2026-05-30 01:00:00','2026-03-01 09:00:00','基地A基地A基地A?');

/*!40000 ALTER TABLE `iot_device` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `iot_device_config`

--



DROP TABLE IF EXISTS `iot_device_config`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `iot_device_config` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `device_id` bigint NOT NULL COMMENT '',

  `param_key` varchar(100) NOT NULL COMMENT '',

  `param_value` varchar(255) NOT NULL COMMENT '',

  `is_active` tinyint DEFAULT '1' COMMENT '',

  `update_time` datetime DEFAULT NULL COMMENT '',

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

INSERT INTO `iot_device_config` VALUES(1,4,'REPORT_INTERVAL','30',1,'2026-05-30 01:00:00');

/*!40000 ALTER TABLE `iot_device_config` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `iot_device_maintenance`

--



DROP TABLE IF EXISTS `iot_device_maintenance`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `iot_device_maintenance` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `device_id` bigint NOT NULL COMMENT '',

  `maint_type` varchar(50) NOT NULL COMMENT '',

  `operator_id` bigint NOT NULL COMMENT '',

  `before_value` text COMMENT '',

  `after_value` text COMMENT '',

  `remark` varchar(255) DEFAULT NULL COMMENT '',

  `maint_time` datetime NOT NULL COMMENT '',

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

INSERT INTO `iot_device_maintenance` VALUES (1,1,'INSPECT',1,'{"基地A":"基地A"}','{"基地A":"基地A"}','基地A塘口','2025-12-15 09:00:00'),

(2,1,'UPGRADE',1,'{"塘口":"v2.1"}','{"塘口":"v2.2"}','基地A塘口','2026-04-10 10:30:00'),

(3,2,'REPAIR',1,'{"基地A":"基地A"}','{"塘口":"基地A"}','基地A塘口','2026-01-20 14:00:00'),

(4,4,'CALIBRATE',1,'{"塘口":"-0.15","??":"??"}','{"塘口":"0.02"}','基地A?','2026-01-10 09:00:00'),

(5,7,'REPAIR',1,'{"基地A":"8.5A"}','{"基地A":"6.2A"}','基地A塘口','2026-03-15 13:00:00'),

(6,10,'CALIBRATE',4,'{"塘口":"-0.08"}','{"??":"0.01"}','基地A','2026-05-15 14:00:00'),

(7,3,'INSPECT',1,'{"基地A":"基地A","基地A?":3200}','{"基地A":"基地A"}','基地A基地A基地A','2025-11-20 08:00:00'),

(8,5,'CALIBRATE',1,'{"pH4":"-0.08","pH7":"0.06"}','{"pH4":"0.00","pH7":"0.01"}','基地A基地A?','2026-02-18 11:00:00'),

(9,5,'REPAIR',1,'{"基地A??":"520M??","塘口":">120s"}','{"基地A":"80M??","塘口":"<30s"}','基地ApH??','2026-05-06 09:30:00'),

(10,6,'INSPECT',1,'{"塘口":"+0.3??"}','{"塘口":"+0.1??"}','?基地A基地A','2025-12-08 09:30:00'),

(11,8,'INSPECT',1,'{"塘口":"8.2m","基地A":"45m3/h"}','{"塘口":"8.2m","基地A":"45m3/h"}','基地A基地A','2026-02-01 08:00:00'),

(12,9,'INSPECT',4,'{"??":"???"}','{"??":"基地A塘口"}','塘口基地A基地A塘口','2026-04-01 10:00:00'),

(13,7,'UPGRADE',1,'{"基地A":"2680h","??":"78??"}','{"基地A":"2680h","??":"65??"}','基地A基地A??','2026-05-20 15:00:00');

/*!40000 ALTER TABLE `iot_device_maintenance` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `iot_device_type`

--



DROP TABLE IF EXISTS `iot_device_type`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `iot_device_type` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `type_code` varchar(50) NOT NULL COMMENT '',

  `type_name` varchar(100) NOT NULL COMMENT '',

  `manufacturer` varchar(100) DEFAULT NULL COMMENT '',

  `protocol_type` varchar(50) DEFAULT 'MQTT' COMMENT '',

  `description` varchar(255) DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  PRIMARY KEY (`id`),

  UNIQUE KEY `type_code` (`type_code`)

) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `iot_device_type`

--



LOCK TABLES `iot_device_type` WRITE;

/*!40000 ALTER TABLE `iot_device_type` DISABLE KEYS */;

INSERT INTO `iot_device_type` VALUES (1,'FEEDER','基地A塘口','基地A基地A','MQTT','基地A基地A基地A基地A',1),(2,'DO_METER','基地A基地A塘口','基地A塘口','Modbus','基地A基地A基地A基地A',1),(3,'PH_METER','pH基地A??','基地A塘口','Modbus','基地A基地ApH?',1),(4,'TEMP_METER','?基地A??','基地A塘口','Modbus','基地A基地A',1),(5,'AERATOR','基地A??','基地A?','MQTT','基地A基地A基地A塘口',1),(6,'PUMP','塘口','基地A??','MQTT','基地A??基地A基地A??',1);

/*!40000 ALTER TABLE `iot_device_type` ENABLE KEYS */;

UNLOCK TABLES;





--

-- Table structure for table `iot_metric_def`

--



DROP TABLE IF EXISTS `iot_metric_def`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `iot_metric_def` (

  `metric_key` varchar(50) NOT NULL COMMENT '',

  `display_name` varchar(50) NOT NULL COMMENT '',

  `unit` varchar(20) DEFAULT NULL COMMENT '',

  `device_type_id` bigint NOT NULL COMMENT '',

  `is_active` tinyint DEFAULT '1' COMMENT '',

  PRIMARY KEY (`metric_key`),

  KEY `device_type_id` (`device_type_id`),

  CONSTRAINT `iot_metric_def_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `iot_device_type` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='基地A??';

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `iot_metric_def`

--



LOCK TABLES `iot_metric_def` WRITE;

/*!40000 ALTER TABLE `iot_metric_def` DISABLE KEYS */;

INSERT INTO `iot_metric_def` VALUES

('dissolved_oxygen','基地A?','mg/L',2,1),

('ph','pH?','',3,1),

('temperature','??','??',4,1),

('feed_amount','基地A','kg',1,1),

('current','基地A','A',5,1),

('flow_rate','基地A','m3/h',6,1);

/*!40000 ALTER TABLE `iot_metric_def` ENABLE KEYS */;

UNLOCK TABLES;



-- IoT 基地A基地A基地A

CREATE TABLE IF NOT EXISTS `iot_device_protocol_map` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `device_type_id` bigint NOT NULL COMMENT '',

  `device_sn` varchar(100) DEFAULT NULL COMMENT '',

  `source_field` varchar(100) NOT NULL COMMENT '',

  `metric_key` varchar(50) NOT NULL COMMENT '',

  PRIMARY KEY (`id`),

  KEY `device_type_id` (`device_type_id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='IoT 基地A基地A塘口';



--

-- Dumping data for table `iot_device_protocol_map`

--



LOCK TABLES `iot_device_protocol_map` WRITE;

/*!40000 ALTER TABLE `iot_device_protocol_map` DISABLE KEYS */;

INSERT INTO `iot_device_protocol_map` VALUES(1,2,NULL,'DO','dissolved_oxygen');

/*!40000 ALTER TABLE `iot_device_protocol_map` ENABLE KEYS */;

UNLOCK TABLES;



--



CREATE TABLE IF NOT EXISTS `iot_device_type_command` (

  `id` bigint NOT NULL AUTO_INCREMENT,

  `device_type_id` bigint NOT NULL,

  `command_key` varchar(50) NOT NULL,

  `command_name` varchar(100) NOT NULL,

  `confirm_text` varchar(200) DEFAULT NULL,

  `is_stop` tinyint DEFAULT 0,

  `sort_order` int DEFAULT 0,

  `is_active` tinyint DEFAULT 1,

  PRIMARY KEY (`id`),

  KEY `device_type_id` (`device_type_id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='IoT 基地A塘口';



CREATE TABLE IF NOT EXISTS `iot_command_log` (

  `id` bigint NOT NULL AUTO_INCREMENT,

  `device_id` bigint NOT NULL,

  `command_key` varchar(50) NOT NULL,

  `status` varchar(20) DEFAULT 'SENT',

  `trigger_time` datetime NOT NULL,

  `response_time` datetime DEFAULT NULL,

  `response_data` text,

  `error_msg` varchar(500) DEFAULT NULL,

  PRIMARY KEY (`id`),

  KEY `device_id` (`device_id`),

  KEY `trigger_time` (`trigger_time`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='IoT 基地A塘口';



--

-- Dumping data for table iot_device_type_command

--



LOCK TABLES iot_device_type_command WRITE;

/*!40000 ALTER TABLE iot_device_type_command DISABLE KEYS */;

INSERT INTO iot_device_type_command (device_type_id, command_key, command_name, confirm_text, is_stop, sort_order, is_active) VALUES

(1,'feed_once','基地A??','基地A基地A基地A?',0,1,1),

(1,'stop_feeding','基地A','基地A基地A?',1,2,1),

(5,'start','基地A基地A','基地A基地A基地A??',0,1,1),

(5,'stop','基地A塘口','基地A基地A基地A?',1,2,1),

(6,'start','基地A塘口','基地A基地A?',0,1,1),

(6,'stop','基地A??','基地A塘口?',1,2,1);

/*!40000 ALTER TABLE iot_device_type_command ENABLE KEYS */;

UNLOCK TABLES;



--

-- Dumping data for table iot_command_log

--



LOCK TABLES iot_command_log WRITE;

/*!40000 ALTER TABLE iot_command_log DISABLE KEYS */;

INSERT INTO `iot_command_log` VALUES (1,1,'feed_once','SUCCESS','2026-06-01 06:00:00','2026-06-01 06:00:02','{"result":"SUCCESS","amount":"30.5kg"}',NULL),

(2,1,'feed_once','SUCCESS','2026-06-01 12:00:00','2026-06-01 12:00:01','{"result":"SUCCESS","amount":"28.3kg"}',NULL),

(3,1,'feed_once','SUCCESS','2026-06-02 06:00:00','2026-06-02 06:00:02','{"result":"SUCCESS","amount":"31.2kg"}',NULL),

(4,7,'start','SUCCESS','2026-06-01 08:00:00','2026-06-01 08:00:03','{"result":"SUCCESS","status":"running"}',NULL),

(5,7,'stop','SUCCESS','2026-06-01 18:00:00','2026-06-01 18:00:02','{"result":"SUCCESS","status":"stopped"}',NULL),

(6,7,'start','SUCCESS','2026-06-02 08:00:00','2026-06-02 08:00:03','{"result":"SUCCESS","status":"running"}',NULL),

(7,7,'stop','FAILED','2026-06-02 18:00:00','2026-06-02 18:00:05','{"result":"ERROR","code":"E004"}','基地A基地A基地A'),

(8,8,'start','SUCCESS','2026-06-01 09:00:00','2026-06-01 09:00:02','{"result":"SUCCESS","flow":"45m3/h"}',NULL),

(9,8,'stop','SUCCESS','2026-06-01 17:00:00','2026-06-01 17:00:01','{"result":"SUCCESS"}',NULL),

(10,8,'start','SUCCESS','2026-06-02 09:00:00','2026-06-02 09:00:02','{"result":"SUCCESS","flow":"44m3/h"}',NULL),

(11,9,'feed_once','SUCCESS','2026-06-01 07:00:00','2026-06-01 07:00:02','{"result":"SUCCESS","amount":"25.0kg"}',NULL),

(12,9,'feed_once','FAILED','2026-06-02 07:00:00',NULL,NULL,'基地A??'),

(13,9,'feed_once','SENT','2026-06-03 07:00:00',NULL,NULL,NULL);

/*!40000 ALTER TABLE iot_command_log ENABLE KEYS */;

UNLOCK TABLES;



-- Table structure for table `iot_ts_data`

--



DROP TABLE IF EXISTS `iot_ts_data`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `iot_ts_data` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `device_id` bigint NOT NULL COMMENT '',

  `metric_key` varchar(50) NOT NULL COMMENT '',

  `metric_value` double NOT NULL COMMENT '',

  `record_time` datetime NOT NULL COMMENT '',

  `quality_flag` tinyint DEFAULT '1' COMMENT '',

  `source_type` varchar(20) DEFAULT 'IOT' COMMENT '',

  `operator_id` bigint DEFAULT NULL COMMENT '',

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

INSERT INTO `iot_ts_data` VALUES(1,4,'dissolved_oxygen',6.42,'2026-06-01 03:30:00',1,'IOT',NULL);



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

  `cat_code` varchar(50) NOT NULL COMMENT '',

  `cat_name` varchar(100) NOT NULL COMMENT '',

  `parent_id` bigint DEFAULT '0' COMMENT '',

  `sort_order` int DEFAULT '0' COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `create_time` datetime DEFAULT NULL COMMENT '',

  `update_time` datetime DEFAULT NULL COMMENT '',

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

  PRIMARY KEY (`id`),

  UNIQUE KEY `cat_code` (`cat_code`)

) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `mat_category`

--



LOCK TABLES `mat_category` WRITE;

/*!40000 ALTER TABLE `mat_category` DISABLE KEYS */;

INSERT INTO `mat_category` VALUES (1,'feed','基地A',0,1,1,NULL,NULL,0,NULL),(2,'drug','塘口',0,2,1,NULL,NULL,0,NULL),(3,'disinfectant','基地A??',0,3,1,NULL,NULL,0,NULL),(4,'tool','基地A??',0,4,1,NULL,NULL,0,NULL);

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

  `mat_code` varchar(50) NOT NULL COMMENT '',

  `mat_name` varchar(100) NOT NULL COMMENT '',

  `cat_id` bigint NOT NULL COMMENT '',

  `spec` varchar(100) DEFAULT NULL COMMENT '',

  `unit` varchar(20) DEFAULT 'kg' COMMENT '',

  `supplier_id` bigint DEFAULT NULL COMMENT '',

  `min_stock` decimal(10,2) DEFAULT NULL COMMENT '',

  `max_stock` decimal(10,2) DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

  `withdrawal_days` int DEFAULT '0' COMMENT '',

  `unit_price` decimal(10,2) DEFAULT '0.00' COMMENT '',

  `approval_code` varchar(100) DEFAULT NULL COMMENT '',

  `manufacturer` varchar(100) DEFAULT NULL COMMENT '',

  `create_time` datetime DEFAULT NULL COMMENT '',

  `update_time` datetime DEFAULT NULL COMMENT '',

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

INSERT INTO `mat_info` VALUES (13,'FEED-001','基地A基地A基地A?? 101',1,'基地A塘口 4mm','kg',1,500.00,5000.00,1,0,NULL,0,5.20,'基地A(2023)01-001','基地A基地A基地A',NULL,NULL),(14,'FEED-002','基地A基地A基地A 8808',1,'基地A塘口 6mm','kg',2,200.00,2000.00,1,0,NULL,0,8.50,'基地A(2024)05-088','基地A基地A',NULL,NULL),(15,'DRUG-001','基地A塘口',2,'100g:5g','?',3,5.00,50.00,1,0,NULL,20,45.00,'基地A?190032345','基地A基地A基地A塘口',NULL,NULL),(16,'DRUG-002','基地A基地A',2,'100g:10g','?',3,5.00,50.00,1,0,NULL,30,65.00,'基地A?140012233','??基地A塘口',NULL,NULL),(17,'DIS-001','基地A基地A?',3,'10% 500ml','?',3,10.00,100.00,1,0,NULL,0,25.00,'基地A?190012345','基地A基地A基地A塘口',NULL,NULL);

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

  `contact_person` varchar(50) DEFAULT NULL COMMENT '',

  `phone` varchar(20) DEFAULT NULL,

  `address` varchar(255) DEFAULT NULL,

  `license_img` varchar(255) DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1',

  `create_time` datetime DEFAULT NULL COMMENT '',

  `update_time` datetime DEFAULT NULL COMMENT '',

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

  PRIMARY KEY (`id`),

  UNIQUE KEY `supplier_code` (`supplier_code`)

) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `mat_supplier`

--



LOCK TABLES `mat_supplier` WRITE;

/*!40000 ALTER TABLE `mat_supplier` DISABLE KEYS */;

INSERT INTO `mat_supplier` VALUES (1,'SUP001','福建省厦门市海沧区?','基地A?','13800138001','基地A基地A塘口',NULL,1,NULL,NULL,0,NULL),(2,'SUP002','福建省厦门市海沧区','基地A','13900139002','基地A基地A塘口',NULL,1,NULL,NULL,0,NULL),(3,'SUP003','基地A基地A基地A塘口','基地A??','13700137003','基地A基地A??',NULL,1,NULL,NULL,0,NULL);

/*!40000 ALTER TABLE `mat_supplier` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Table structure for table `med_record`

--



DROP TABLE IF EXISTS `med_record`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `med_record` (

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `pond_id` bigint NOT NULL COMMENT '',

  `drug_mat_id` bigint NOT NULL COMMENT '',

  `usage_qty` decimal(10,2) NOT NULL COMMENT '',

  `admin_date` date NOT NULL COMMENT '',

  `withdrawal_days` int NOT NULL COMMENT '',

  `ban_harvest_until` date NOT NULL COMMENT '',

  `log_id` bigint DEFAULT NULL COMMENT '',

  `create_time` datetime DEFAULT NULL COMMENT '',

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

  `base_id` bigint DEFAULT NULL COMMENT '',

  `pond_id` bigint DEFAULT NULL COMMENT '',

  `stat_date` date DEFAULT NULL COMMENT '',

  `total_feed` decimal(10,2) DEFAULT '0.00' COMMENT '',

  `total_mortality` decimal(10,2) DEFAULT '0.00' COMMENT '',

  `total_harvest` decimal(10,2) DEFAULT '0.00' COMMENT '',

  `current_stock_estimate` decimal(10,2) DEFAULT NULL COMMENT '',

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

  `pond_code` varchar(50) NOT NULL COMMENT '',

  `pond_name` varchar(100) NOT NULL COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `area` decimal(10,2) DEFAULT NULL COMMENT '',

  `depth_avg` decimal(5,2) DEFAULT NULL COMMENT '',

  `depth_max` decimal(5,2) DEFAULT NULL COMMENT '',

  `shape_type` varchar(20) DEFAULT NULL COMMENT '',

  `bottom_type` varchar(50) DEFAULT NULL COMMENT '',

  `bottom_silt_depth` decimal(4,1) DEFAULT NULL COMMENT '',

  `inlet_count` int DEFAULT '0' COMMENT '',

  `inlet_diameter` int DEFAULT NULL COMMENT '',

  `outlet_count` int DEFAULT '0' COMMENT '',

  `outlet_type` varchar(50) DEFAULT NULL COMMENT '',

  `aeration_type` varchar(100) DEFAULT NULL COMMENT '',

  `aeration_count` int DEFAULT '0' COMMENT '',

  `aeration_power` decimal(6,2) DEFAULT NULL COMMENT '',

  `has_circulating` tinyint DEFAULT '0' COMMENT '',

  `has_monitoring` tinyint DEFAULT '0' COMMENT '',

  `current_species` varchar(100) DEFAULT NULL COMMENT '',

  `stocking_date` date DEFAULT NULL COMMENT '',

  `estimated_output` decimal(10,2) DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '2' COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

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

INSERT INTO `pond_info` VALUES (1,'POND_XM_001','1基地A基地A塘口',1,5.00,1.50,2.00,'基地A','基地A??',NULL,2,NULL,2,NULL,'基地A塘口',10,15.50,1,1,'基地A塘口','2026-04-01',5000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(2,'POND_XM_002','2基地A基地A塘口',1,20.00,2.50,3.00,'塘口','塘口',NULL,1,NULL,1,NULL,'基地A',4,12.00,1,1,'基地A?','2026-03-15',15000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(3,'POND_XM_003','3基地A基地A基地A',1,100.00,1.80,2.20,'基地A??','塘口',NULL,3,NULL,3,NULL,'基地A',6,18.00,0,1,'基地A基地A','2026-04-20',50000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(4,'POND_XM_004','4基地A塘口',1,295.50,0.50,1.00,'基地A??','塘口',NULL,0,NULL,0,NULL,'基地A??',0,0.00,0,0,'塘口','2025-11-01',100000.00,1,'2026-05-03 08:10:00','2026-05-03 08:10:00',0,NULL),(5,'POND_ND_001','1基地A基地A基地A??',2,80.00,8.00,12.00,'塘口','HDPE塘口',NULL,0,NULL,0,NULL,'基地A基地A??',20,25.00,1,1,'基地A?','2026-02-15',200000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL),(6,'POND_ND_002','2基地A基地A基地A',2,600.00,7.50,10.00,'基地A?','基地A基地A',NULL,0,NULL,0,NULL,'基地A(基地A)',8,15.00,0,1,'基地A??','2026-03-01',120000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL),(7,'POND_ND_003','3基地Az基地A塘口',2,500.00,9.00,13.00,'塘口','基地A??',NULL,0,NULL,0,NULL,'基地A?',4,10.00,1,1,'塘口z','2026-01-10',80000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL),(8,'POND_ND_004','基地A基地A基地A??A',2,50.00,2.00,2.50,'基地A','基地A??',NULL,2,NULL,2,NULL,'基地A?',4,5.50,1,1,'基地A塘口','2026-04-25',5000.00,1,'2026-05-03 09:10:00','2026-05-03 09:10:00',0,NULL);

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

  `task_id` bigint DEFAULT NULL COMMENT '',

  `plan_id` bigint DEFAULT NULL COMMENT '',

  `base_id` bigint DEFAULT NULL COMMENT '',

  `target_type` varchar(20) DEFAULT NULL,

  `target_id` bigint DEFAULT NULL,

  `batch_no` varchar(50) DEFAULT NULL COMMENT '',

  `log_type` varchar(30) DEFAULT NULL COMMENT '',

  `action_time` datetime DEFAULT NULL COMMENT '',

  `quantity` decimal(10,2) DEFAULT NULL COMMENT '',

  `photo_urls` text COMMENT '',

  `env_data` json DEFAULT NULL COMMENT '',

  `gps_lat` decimal(8,6) DEFAULT NULL COMMENT '',

  `gps_lng` decimal(9,6) DEFAULT NULL COMMENT '',

  `location_city` varchar(50) DEFAULT NULL COMMENT '',

  `source` varchar(20) DEFAULT 'app' COMMENT '',

  `created_by` bigint DEFAULT NULL COMMENT '',

  `actual_worker_id` bigint DEFAULT NULL COMMENT '',

  `is_backfilled` tinyint(1) DEFAULT '0' COMMENT '',

  `status_flag` varchar(20) DEFAULT 'normal' COMMENT '',

  `backfill_reason` varchar(255) DEFAULT NULL COMMENT '',

  `remark` varchar(255) DEFAULT NULL COMMENT '',

  `verify_status` varchar(20) DEFAULT 'auto' COMMENT '',

  `create_time` datetime DEFAULT (now()) COMMENT '',

  `update_time` datetime DEFAULT (now()) COMMENT '',

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

  `feed_variety` varchar(100) DEFAULT NULL COMMENT '',

  `feed_amount` decimal(10,2) DEFAULT NULL COMMENT '',

  `drug_name` varchar(100) DEFAULT NULL COMMENT '',

  `dosage` varchar(100) DEFAULT NULL COMMENT '',

  `withdrawal_days` int DEFAULT NULL COMMENT '',

  `weather_req` varchar(100) DEFAULT NULL COMMENT '',

  `est_yield` decimal(10,2) DEFAULT NULL COMMENT '',

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

INSERT INTO `prod_plan` VALUES (1,1,NULL,'pond',1,'feeding','5?基地A基地A基地A??','厦门海洋牧场示范基地厦门海洋牧场示范基地基地A','基地A基地A塘口',50.00,NULL,NULL,NULL,'基地A基地A?',NULL,'2026-06-01 06:00:00','2026-06-30 20:00:00','daily','active',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(2,1,NULL,'pond',2,'feeding','基地A基地A基地A??','厦门海洋牧场示范基地?2基地A基地A?基地A基地A基地A塘口','基地A基地A塘口',80.00,NULL,NULL,NULL,NULL,NULL,'2026-06-01 07:00:00','2026-06-30 18:00:00','daily','active',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(3,1,NULL,'pond',3,'medication','基地A基地A基地A基地A','基地A3厦门海洋牧场示范基地基地A基地A基地A基地A',NULL,NULL,'基地A??','500ml/基地A?',7,'基地A基地A塘口',NULL,'2026-06-03 08:00:00','2026-06-05 18:00:00',NULL,'published',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(4,1,NULL,'pond',4,'harvest','基地A基地A塘口','厦门海洋牧场示范基地福建省厦门市海沧区??',NULL,NULL,NULL,NULL,NULL,NULL,2000.00,'2026-06-10 04:00:00','2026-06-10 12:00:00',NULL,'draft',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(5,1,NULL,'cage',1,'maintenance','基地A基地A基地A塘口','厦门海洋牧场示范基地厦门海洋牧场示范基地基地A??',NULL,NULL,NULL,NULL,NULL,'基地A塘口3??',NULL,'2026-06-08 09:00:00','2026-06-08 17:00:00',NULL,'draft',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(6,2,NULL,'pond',6,'seeding','基地A基地A基地A基地A?','厦门海洋牧场示范基地基地A基地A??基地A基地A基地A?',NULL,NULL,NULL,NULL,NULL,'基地A基地A22??C基地A',NULL,'2026-06-05 07:00:00','2026-06-05 12:00:00',NULL,'published',1004,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(7,2,NULL,'pond',5,'feeding','基地A基地A基地A??','??基地A??基地A基地A基地A2基地A基地A基地A基地A','基地A基地A?',120.00,NULL,NULL,NULL,NULL,NULL,'2026-06-01 06:00:00','2026-06-30 18:00:00','daily','active',1004,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(8,2,NULL,'pond',7,'harvest','塘口z基地A基地A基地A','厦门海洋牧场示范基地基地A基地A基地A基地A',NULL,NULL,NULL,NULL,NULL,'基地A塘口4??',5000.00,'2026-06-15 04:00:00','2026-06-15 14:00:00',NULL,'draft',1004,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(9,2,NULL,'pond',8,'water_change','基地A基地A塘口','塘口1/3厦门海洋牧场示范基地基地A基地A基地A??',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-28 09:00:00','2026-05-28 15:00:00',NULL,'completed',1004,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(10,1,NULL,'vsl',1,'maintenance','基地A基地A基地A基地A?','厦门海洋牧场示范基地厦门海洋牧场示范基地基地A?',NULL,NULL,NULL,NULL,NULL,'基地A?',NULL,'2026-06-12 09:00:00','2026-06-12 17:00:00',NULL,'draft',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(11,1,NULL,'pond',2,'medication','基地A基地A基地A?','福建省厦门市海沧区??5厦门海洋牧场示范基地基地A?',NULL,NULL,'基地A??','200g/基地A??',15,NULL,NULL,'2026-06-07 08:00:00','2026-06-11 18:00:00',NULL,'published',1001,202,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL),(12,1,NULL,'pond',3,'harvest','基地A基地A基地A基地A','基地A基地A+厦门海洋牧场示范基地基地A基地A基地A塘口12基地A',NULL,NULL,NULL,NULL,NULL,NULL,3000.00,'2026-06-20 04:00:00','2026-06-20 10:00:00',NULL,'draft',1001,201,'2026-05-30 04:13:10','2026-05-30 04:13:10',0,NULL);

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

  `base_id` bigint DEFAULT NULL COMMENT '',

  `parent_plan_id` bigint DEFAULT NULL COMMENT '',

  `target_type` varchar(20) DEFAULT NULL COMMENT '',

  `target_id` bigint DEFAULT NULL COMMENT '',

  `plan_type` varchar(30) DEFAULT NULL COMMENT '',

  `title` varchar(255) DEFAULT NULL COMMENT '',

  `content_desc` text COMMENT '',

  `start_time` datetime DEFAULT NULL COMMENT '',

  `end_time` datetime DEFAULT NULL COMMENT '',

  `cycle_rule` varchar(50) DEFAULT NULL COMMENT '',

  `status` varchar(20) DEFAULT 'draft' COMMENT '',

  `owner_id` bigint DEFAULT NULL COMMENT '',

  `assignee_group_id` bigint DEFAULT NULL COMMENT '',

  `create_time` datetime DEFAULT (now()) COMMENT '',

  `update_time` datetime DEFAULT (now()) COMMENT '',

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT ''

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `prod_plan_backup`

--



LOCK TABLES `prod_plan_backup` WRITE;

/*!40000 ALTER TABLE `prod_plan_backup` DISABLE KEYS */;

INSERT INTO `prod_plan_backup` VALUES (1,1,NULL,'pond',1,'feeding','5?基地A基地A','厦门海洋牧场示范基地基地A塘口','2026-05-05 06:00:00','2026-05-31 20:00:00','Every Day','active',1001,201,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(2,1,NULL,'cage',5,'medication','基地A基地A基地A??','??厦门海洋牧场示范基地基地A基地A','2026-05-06 08:00:00','2026-05-06 12:00:00',NULL,'published',1001,202,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(3,2,NULL,'vsl',1,'maintenance','基地A基地A??基地A','厦门海洋牧场示范基地','2026-05-10 09:00:00','2026-05-10 17:00:00',NULL,'draft',1002,203,'2026-05-04 18:39:23','2026-05-04 18:39:23',1,NULL),(4,1,1,'pond',2,'feeding','102基地A基地A?','福建省厦门市海沧区10%基地A','2026-05-07 07:00:00','2026-05-07 18:00:00',NULL,'completed',1001,201,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(5,2,NULL,'pond',5,'harvest','基地A基地A基地A','厦门海洋牧场示范基地','2026-05-15 04:00:00','2026-05-15 10:00:00',NULL,'cancelled',1002,201,'2026-05-04 18:39:23','2026-05-04 18:39:23',0,NULL),(6,1,NULL,'pond',3,'harvest','103基地A基地A基地A塘口','福建省厦门市海沧区?1kg基地A基地A基地A?','2026-05-20 04:00:00','2026-05-20 12:00:00',NULL,'published',1001,201,'2026-05-04 22:21:54','2026-05-04 22:21:54',0,NULL),(7,1,NULL,'pond',4,'medication','104基地A基地A基地A基地A','基地A3基地A基地A基地A塘口基地A?','2026-05-21 08:00:00','2026-05-23 18:00:00',NULL,'cancelled',1001,202,'2026-05-04 22:24:47','2026-05-04 22:24:47',0,NULL);

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

  `plan_id` bigint DEFAULT NULL COMMENT '',

  `base_id` bigint DEFAULT NULL COMMENT '',

  `task_title` varchar(255) DEFAULT NULL COMMENT '',

  `target_type` varchar(20) DEFAULT NULL COMMENT '',

  `target_id` bigint DEFAULT NULL COMMENT '',

  `action_time` datetime DEFAULT NULL COMMENT '',

  `deadline_time` datetime DEFAULT NULL COMMENT '',

  `status` varchar(20) DEFAULT 'pending' COMMENT '',

  `assignee_id` bigint DEFAULT NULL COMMENT '',

  `cancel_reason` varchar(255) DEFAULT NULL COMMENT '',

  `device_id` bigint DEFAULT NULL COMMENT '',

  `device_action` varchar(50) DEFAULT NULL COMMENT '',

  `create_time` datetime DEFAULT (now()) COMMENT '',

  `update_time` datetime DEFAULT (now()) COMMENT '',

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

  `priority` varchar(10) DEFAULT 'medium' COMMENT '',

  `feed_variety` varchar(100) DEFAULT NULL COMMENT '',

  `feed_amount` decimal(10,2) DEFAULT NULL COMMENT '',

  `drug_name` varchar(100) DEFAULT NULL COMMENT '',

  `dosage` varchar(100) DEFAULT NULL COMMENT '',

  `withdrawal_days` int DEFAULT NULL COMMENT '',

  `weather_req` varchar(100) DEFAULT NULL COMMENT '',

  `source_type` varchar(20) DEFAULT NULL COMMENT '',

  `source_id` bigint DEFAULT NULL COMMENT '',

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

INSERT INTO `prod_task` VALUES (1,1,1,'2026-06-01 基地A?','pond',1,'2026-06-01 06:00:00','2026-06-01 08:00:00','done',1002,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','基地A基地A塘口',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(2,1,1,'2026-06-01 基地A??','pond',1,'2026-06-01 17:00:00','2026-06-01 19:00:00','done',1003,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','基地A基地A塘口',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(3,1,1,'2026-06-02 基地A?','pond',1,'2026-06-02 06:00:00','2026-06-02 08:00:00','assigned',1002,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','基地A基地A塘口',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(4,1,1,'2026-06-02 基地A??','pond',1,'2026-06-02 17:00:00','2026-06-02 19:00:00','pending',1003,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','基地A基地A塘口',25.00,NULL,NULL,NULL,NULL,NULL,NULL),(5,2,1,'2026-06-01 基地A?','pond',2,'2026-06-01 07:00:00','2026-06-01 09:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high','基地A基地A塘口',40.00,NULL,NULL,NULL,NULL,NULL,NULL),(6,2,1,'2026-06-01 基地A?','pond',2,'2026-06-01 12:00:00','2026-06-01 14:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high','基地A基地A塘口',40.00,NULL,NULL,NULL,NULL,NULL,NULL),(7,2,1,'2026-06-02 基地A?','pond',2,'2026-06-02 07:00:00','2026-06-02 09:00:00','assigned',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high','基地A基地A塘口',40.00,NULL,NULL,NULL,NULL,NULL,NULL),(8,3,1,'塘口-基地A??','pond',3,'2026-06-03 08:00:00','2026-06-03 09:00:00','pending',1006,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','500ml/基地A?',NULL,NULL,NULL,NULL),(9,3,1,'??1基地A基地A?','pond',3,'2026-06-03 09:00:00','2026-06-03 11:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','500ml/基地A?',NULL,NULL,NULL,NULL),(10,3,1,'??2基地A基地A?','pond',3,'2026-06-04 09:00:00','2026-06-04 11:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','500ml/基地A?',NULL,NULL,NULL,NULL),(11,3,1,'??3基地A基地A?','pond',3,'2026-06-05 09:00:00','2026-06-05 11:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','500ml/基地A?',NULL,NULL,NULL,NULL),(12,6,2,'基地A塘口-基地A基地A?','pond',6,'2026-06-05 07:00:00','2026-06-05 08:00:00','pending',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,6,2,'基地A基地A塘口','pond',6,'2026-06-05 08:00:00','2026-06-05 11:00:00','pending',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'high',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,7,2,'2026-06-01 基地A?','pond',5,'2026-06-01 06:00:00','2026-06-01 08:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','基地A基地A?',60.00,NULL,NULL,NULL,NULL,NULL,NULL),(15,7,2,'2026-06-01 基地A??','pond',5,'2026-06-01 16:00:00','2026-06-01 18:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','基地A基地A?',60.00,NULL,NULL,NULL,NULL,NULL,NULL),(16,7,2,'2026-06-02 基地A?','pond',5,'2026-06-02 06:00:00','2026-06-02 08:00:00','assigned',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium','基地A基地A?',60.00,NULL,NULL,NULL,NULL,NULL,NULL),(17,9,2,'基地A基地A塘口','pond',8,'2026-05-28 09:00:00','2026-05-28 11:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,9,2,'基地A??','pond',8,'2026-05-28 11:00:00','2026-05-28 12:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,9,2,'基地A基地A基地A','pond',8,'2026-05-28 14:00:00','2026-05-28 15:00:00','done',1005,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'medium',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,11,1,'塘口-基地A基地A?','pond',2,'2026-06-07 08:00:00','2026-06-07 09:00:00','pending',1006,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','200g/基地A??',15,NULL,NULL,NULL),(21,11,1,'??1基地A塘口','pond',2,'2026-06-07 09:00:00','2026-06-07 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','200g/基地A??',15,NULL,NULL,NULL),(22,11,1,'??2基地A塘口','pond',2,'2026-06-08 09:00:00','2026-06-08 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','200g/基地A??',15,NULL,NULL,NULL),(23,11,1,'??3基地A塘口','pond',2,'2026-06-09 09:00:00','2026-06-09 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','200g/基地A??',15,NULL,NULL,NULL),(24,11,1,'??4基地A塘口','pond',2,'2026-06-10 09:00:00','2026-06-10 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','200g/基地A??',15,NULL,NULL,NULL),(25,11,1,'??5基地A塘口','pond',2,'2026-06-11 09:00:00','2026-06-11 10:00:00','pending',1007,NULL,NULL,NULL,'2026-05-30 04:13:30','2026-05-30 04:13:30',0,NULL,'urgent',NULL,NULL,'基地A??','200g/基地A??',15,NULL,NULL,NULL);

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

  `base_id` bigint NOT NULL COMMENT '',

  `mat_id` bigint NOT NULL COMMENT '',

  `batch_no` varchar(50) DEFAULT NULL COMMENT '',

  `current_qty` decimal(12,4) DEFAULT '0.0000' COMMENT '',

  `lock_qty` decimal(12,4) DEFAULT '0.0000' COMMENT '',

  `last_update_time` datetime DEFAULT (now()),

  PRIMARY KEY (`id`),

  UNIQUE KEY `uk_mat` (`base_id`,`mat_id`,`batch_no`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='基地A基地A??';

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

  `record_no` varchar(50) NOT NULL COMMENT '',

  `base_id` bigint NOT NULL COMMENT '',

  `mat_id` bigint NOT NULL COMMENT '',

  `batch_no` varchar(50) DEFAULT NULL COMMENT '',

  `type` varchar(20) NOT NULL COMMENT '',

  `change_qty` decimal(12,4) NOT NULL COMMENT '',

  `operator_id` bigint DEFAULT NULL COMMENT '',

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

INSERT INTO `stk_record` VALUES (1,'STK-IN-20260501-001',1,13,'BATCH-20260501','IN',1000.0000,1001,'基地A?? - 基地A基地A基地A??','2026-05-01 09:00:00'),(2,'STK-IN-20260501-002',1,14,'BATCH-20260501','IN',500.0000,1001,'基地A?? - 基地A基地A基地A','2026-05-01 09:30:00'),(3,'STK-IN-20260502-003',1,15,'BATCH-20260502','IN',50.0000,1001,'基地A?? - 基地A塘口','2026-05-02 10:00:00'),(4,'STK-IN-20260502-004',1,17,'BATCH-20260502','IN',100.0000,1001,'基地A?? - 基地A基地A?','2026-05-02 10:30:00'),(5,'STK-OUT-20260520-005',1,13,'BATCH-20260501','OUT',-50.5000,5001,'基地A?? - 1基地A基地A?','2026-05-20 07:15:00'),(6,'STK-OUT-20260520-006',1,14,'BATCH-20260501','OUT',-120.0000,1001,'基地A?? - 2基地A塘口','2026-05-20 08:00:00'),(7,'STK-OUT-20260521-007',1,13,'BATCH-20260501','OUT',-48.0000,5001,'基地A?? - 1基地A基地A??','2026-05-21 17:30:00'),(8,'STK-OUT-20260521-008',1,15,'BATCH-20260502','OUT',-500.0000,5002,'基地A塘口 - 基地A基地A??','2026-05-21 09:30:00'),(9,'STK-OUT-20260522-009',1,15,'BATCH-20260502','OUT',-500.0000,5002,'基地A塘口 - 基地A塘口2??','2026-05-22 09:30:00'),(10,'STK-OUT-20260510-010',1,17,'BATCH-20260502','OUT',-2000.0000,1001,'基地A塘口 - 基地A基地A??','2026-05-10 14:00:00'),(11,'STK-ADJ-20260515-011',1,13,'BATCH-20260501','ADJUST',-10.0000,1001,'基地A?? - 基地A塘口10kg','2026-05-15 16:00:00'),(12,'STK-ADJ-20260515-012',1,14,'BATCH-20260501','ADJUST',5.0000,1001,'基地A?? - 基地A塘口5kg','2026-05-15 16:30:00');

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

  `usage_no` varchar(50) NOT NULL COMMENT '',

  `base_id` bigint NOT NULL,

  `pond_id` bigint NOT NULL COMMENT '',

  `task_id` bigint DEFAULT NULL COMMENT '',

  `mat_id` bigint NOT NULL,

  `use_qty` decimal(10,2) NOT NULL COMMENT '',

  `unit_price` decimal(10,2) DEFAULT NULL COMMENT '',

  `total_price` decimal(12,2) DEFAULT NULL COMMENT '',

  `operator_id` bigint DEFAULT NULL COMMENT '',

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

  `config_key` varchar(100) NOT NULL COMMENT '',

  `config_value` varchar(500) NOT NULL COMMENT '',

  `config_desc` varchar(200) DEFAULT NULL COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `parent_id` bigint DEFAULT '0' COMMENT '',

  `dept_name` varchar(100) NOT NULL COMMENT '',

  `dept_code` varchar(50) DEFAULT NULL COMMENT '',

  `sort_order` int DEFAULT '0' COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `sys_dept`

--



LOCK TABLES `sys_dept` WRITE;

/*!40000 ALTER TABLE `sys_dept` DISABLE KEYS */;

INSERT INTO `sys_dept` VALUES (101,0,'基地A基地A基地A基地A','DEPT_XM',0,1,NULL,NULL,0,NULL),(102,0,'基地A基地A基地A??','DEPT_ND',0,1,NULL,NULL,0,NULL);

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

  `dict_type` varchar(50) NOT NULL COMMENT '',

  `dict_label` varchar(100) NOT NULL COMMENT '',

  `dict_value` varchar(100) NOT NULL COMMENT '',

  `sort_order` int DEFAULT '0',

  `status` tinyint DEFAULT '1',

  `create_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

  `update_time` datetime DEFAULT NULL COMMENT '',

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `sys_dict_data`

--



LOCK TABLES `sys_dict_data` WRITE;

/*!40000 ALTER TABLE `sys_dict_data` DISABLE KEYS */;

INSERT INTO `sys_dict_data` VALUES (1,'sys_user_sex','??','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(2,'sys_user_sex','?','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(3,'sys_user_sex','??','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(4,'sys_show_hide','塘口','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(5,'sys_show_hide','基地A','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(6,'sys_normal_disable','基地A','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(7,'sys_normal_disable','塘口','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(8,'sys_job_status','基地A','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(9,'sys_job_status','塘口','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(10,'sys_job_group','??','DEFAULT',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(11,'sys_job_group','塘口','QUANLIAN',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(12,'sys_yes_no','??','Y',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(13,'sys_yes_no','??','N',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(14,'sys_notice_type','??','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(15,'sys_notice_type','基地A','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(16,'sys_oper_type','基地A','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(17,'sys_oper_type','基地A','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(18,'sys_oper_type','塘口','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(19,'sys_oper_type','塘口','3',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(20,'sys_common_status','塘口','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(21,'sys_common_status','塘口','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(22,'pond_status','基地A?','1',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(23,'pond_status','基地A','2',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(24,'pond_status','基地A','0',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(25,'cage_type','基地A?','gravity',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(26,'cage_type','基地A??','tension_leg',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(27,'cage_type','基地A?','submersible',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(28,'warn_severity','??','low',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(29,'warn_severity','??','medium',1,1,'2026-05-03 01:46:00',0,NULL,NULL),(30,'warn_severity','??','high',1,1,'2026-05-03 01:46:00',0,NULL,NULL);

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

  `dict_type` varchar(50) NOT NULL COMMENT '',

  `dict_name` varchar(100) NOT NULL COMMENT '',

  `dict_desc` varchar(200) DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1',

  `create_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

  `update_time` datetime DEFAULT NULL COMMENT '',

  PRIMARY KEY (`id`),

  UNIQUE KEY `dict_type` (`dict_type`)

) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;



--

-- Dumping data for table `sys_dict_type`

--



LOCK TABLES `sys_dict_type` WRITE;

/*!40000 ALTER TABLE `sys_dict_type` DISABLE KEYS */;

INSERT INTO `sys_dict_type` VALUES (1,'sys_user_sex','?基地A',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(2,'sys_show_hide','基地A?',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(3,'sys_normal_disable','基地A??',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(4,'sys_job_status','基地A??',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(5,'sys_job_group','基地A塘口',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(6,'sys_yes_no','基地A?',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(7,'sys_notice_type','基地A??',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(8,'sys_oper_type','基地A基地A',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(9,'sys_common_status','基地A',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(10,'pond_status','基地A?',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(11,'cage_type','基地A基地A',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00'),(12,'warn_severity','基地A??',NULL,1,'2026-05-03 01:46:00',0,NULL,'2026-05-03 01:46:00');

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

  `username` varchar(50) DEFAULT NULL COMMENT '',

  `operation` varchar(200) DEFAULT NULL COMMENT '',

  `method` varchar(200) DEFAULT NULL COMMENT '',

  `params` text COMMENT '',

  `ip` varchar(50) DEFAULT NULL COMMENT '',

  `time` bigint DEFAULT '0' COMMENT '',

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

  `username` varchar(50) DEFAULT NULL COMMENT '',

  `ip` varchar(50) DEFAULT NULL COMMENT '',

  `login_time` datetime DEFAULT (now()) COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `msg` varchar(255) DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `menu_name` varchar(50) NOT NULL COMMENT '',

  `parent_id` bigint DEFAULT '0' COMMENT '',

  `menu_type` tinyint NOT NULL COMMENT '',

  `menu_path` varchar(200) DEFAULT NULL COMMENT '',

  `component` varchar(255) DEFAULT NULL COMMENT '',

  `perms` varchar(100) DEFAULT NULL COMMENT '',

  `icon` varchar(100) DEFAULT NULL COMMENT '',

  `sort_order` int DEFAULT '0' COMMENT '',

  `visible` tinyint DEFAULT '1' COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `title` varchar(255) NOT NULL COMMENT '',

  `content` text NOT NULL COMMENT '',

  `publisher_id` bigint NOT NULL COMMENT '',

  `publish_time` datetime NOT NULL COMMENT '',

  `expire_time` datetime DEFAULT NULL COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `biz_id` bigint DEFAULT NULL COMMENT '',

  `biz_type` varchar(50) DEFAULT NULL COMMENT '',

  `template_id` bigint NOT NULL COMMENT '',

  `user_id` bigint NOT NULL COMMENT '',

  `title` varchar(255) NOT NULL COMMENT '',

  `content` text NOT NULL COMMENT '',

  `channel` varchar(20) NOT NULL COMMENT '',

  `receiver_addr` varchar(100) DEFAULT NULL COMMENT '',

  `status` varchar(20) DEFAULT 'PENDING' COMMENT '',

  `read_status` tinyint DEFAULT '0' COMMENT '',

  `send_time` datetime DEFAULT NULL COMMENT '',

  `read_time` datetime DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `template_code` varchar(50) NOT NULL COMMENT '',

  `template_name` varchar(100) NOT NULL COMMENT '',

  `title` varchar(255) NOT NULL COMMENT '',

  `content` text NOT NULL COMMENT '',

  `channel` varchar(20) NOT NULL COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

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

  `read_status` tinyint DEFAULT '0' COMMENT '',

  `read_time` datetime DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `role_name` varchar(50) NOT NULL COMMENT '',

  `role_code` varchar(50) NOT NULL COMMENT '',

  `role_desc` varchar(200) DEFAULT NULL COMMENT '',

  `data_scope` tinyint DEFAULT '1' COMMENT '',

  `sort_order` int DEFAULT '0' COMMENT '',

  `status` tinyint DEFAULT '1' COMMENT '',

  `create_time` datetime DEFAULT NULL,

  `update_time` datetime DEFAULT NULL,

  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '',

  `delete_time` datetime DEFAULT NULL COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',

  `user_id` bigint NOT NULL COMMENT '',

  `category` varchar(50) NOT NULL COMMENT '',

  `channel` varchar(20) NOT NULL COMMENT '',

  `is_enabled` tinyint DEFAULT '1' COMMENT '',

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

  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',


-- ----------------------------
-- 基地A?
-- ----------------------------
DROP TABLE IF EXISTS `sys_news`;
CREATE TABLE `sys_news` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '',
  `title` varchar(200) NOT NULL COMMENT '',
  `summary` varchar(500) DEFAULT NULL COMMENT '',
  `content` longtext COMMENT '',
  `cover_image` varchar(500) DEFAULT NULL COMMENT '',
  `source` varchar(100) DEFAULT NULL COMMENT '',
  `category` varchar(50) DEFAULT NULL COMMENT '',
  `publish_time` datetime DEFAULT NULL COMMENT '',
  `is_published` tinyint DEFAULT '0' COMMENT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '',
  `create_by` varchar(50) DEFAULT NULL COMMENT '',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基地A';

INSERT INTO `sys_news` VALUES (1,'基地A塘口2026基地A基地A?','基地A基地A基地A?...','<p>基地A...</p>','','基地A?','policy','2026-05-01 10:00:00',1,'2026-05-01 10:00:00','admin'),(2,'基地A基地A塘口23%','基地A基地A塘口...','<p>基地A...</p>','','基地A基地A塘口','market','2026-04-28 09:00:00',1,'2026-04-28 09:00:00','admin'),(3,'基地A基地A基地A','基地A基地A?...','<p>基地A...</p>','','基地A基地A?','tech','2026-04-25 14:00:00',1,'2026-04-25 14:00:00','admin'),(4,'2026基地A基地A塘口','基地A基地A?...','<p>基地A...</p>','','基地A基地A?','industry','2026-04-20 08:00:00',1,'2026-04-20 08:00:00','admin');


