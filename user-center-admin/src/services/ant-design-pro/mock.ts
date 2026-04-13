/**
 * 全局 Mock 数据中心
 * 当 API 请求失败时，组件层将引用此处的降级数据
 */

// ================== 塘口管理 (Pond) ==================

export const MOCK_PONDS: Pond.PondItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: `P${(i + 1).toString().padStart(3, '0')}`,
  name: `${i + 1}号池塘`,
  baseId: i < 5 ? 'B001' : i < 10 ? 'B002' : i < 15 ? 'B003' : 'B004',
  type: i % 2 === 0 ? '南美白对虾' : '大黄鱼',
  area: 600,
  depth: 1.5,
  status: i === 4 ? 'locked' : i % 5 === 0 ? 'empty' : i % 7 === 0 ? 'ready' : 'breeding',
  species: i % 2 === 0 ? '南美白对虾' : '大黄鱼',
  days: 45 + i * 2,
  temp: 24.5 + Math.random() * 2,
  do: 5.2 + Math.random() * 1.5,
  doTrend: [4.2, 4.5, 5.1, 5.8, 5.4, 5.2, 4.9, 5.3],
  estWeight: 1200 + i * 50,
  videoStatus: 'online',
  videoUrl: 'rtsp://admin:12345@192.168.1.100:554/ch1/main',
  sensorCount: 3,
  iotNodes: ['NODE-001', 'NODE-002'],
  pond_type: i % 3 === 0 ? '传统' : i % 3 === 1 ? '循环水' : '智慧养殖',
  ecological_index: 80 + Math.random() * 20,
  carbon_footprint: 5 + Math.random() * 10,
}));

export const MOCK_POND_STATS: Pond.PondSummaryStatsProps = {
  totalPonds: 18,
  breedingCount: 12,
  emptyCount: 3,
  lockedCount: 1,
  totalArea: 10800,
  avgDepth: 1.5,
  totalBiomass: 21600,
  species: ['南美白对虾', '大黄鱼'],
};

export const MOCK_POND_DETAIL_FALLBACK = (id: string) => {
  const pond = MOCK_PONDS.find(p => p.id === id) || MOCK_PONDS[0];
  return {
    ...pond,
    Water: { waterTemp: 25, waterDO: 5.5, waterPH: 7.8 },
    PondPhysical: { area: 600, depth: 1.5, days: 45 },
    timeline: [
      { time: '2026-03-27 18:30', title: '自动投喂', content: '系统自动投喂 45.2kg (1.5mm 高蛋白)', status: 'finish' },
      { time: '2026-03-26 10:30', title: '人工用药', content: '技术员-李工 录入用药记录：聚维酮碘 120g (预防)', status: 'finish' },
      { time: '2026-03-20 09:00', title: '水质采样', content: '水质采样送检：指标符合二级养殖水标准', status: 'finish' },
      { time: '2026-02-10 08:00', title: '正式放苗', content: '正式放苗：南美白对虾 50万尾', status: 'finish' },
    ],
    stats: {
      todayTasks: 10,
      completedTasks: 7,
      activePlans: 3,
      overdueTasks: 0,
    }
  };
};

// ================== 生产日志 (Logs) ==================

export const MOCK_FEEDING_LOGS: Pond.ProductionLogItem[] = [
  { id: '1', time: '2026-03-27 18:30:00', pondId: 'P001', type: 'feeding', content: '投喂 45.2kg (1.5mm 高蛋白)', operator: '系统自动', status: 'normal', details: { feedType: '1.5mm 高蛋白', amount: 45.2, method: 'auto' } },
  { id: '2', time: '2026-03-27 18:15:00', pondId: 'P003', type: 'feeding', content: '投喂 38.5kg (1.5mm 高蛋白)', operator: '王大牛', status: 'high', details: { feedType: '1.5mm 高蛋白', amount: 38.5, method: 'manual' } },
];

export const MOCK_MEDICINE_LOGS: Pond.ProductionLogItem[] = [
  { id: '1', time: '2026-03-27 10:30:00', pondId: 'P005', type: 'medicine', content: '使用 120g 聚维酮碘 (预防)', operator: '技术员-李工', status: 'locked', details: { medicineName: '聚维酮碘', dose: 120, reason: '预防', withdrawalDays: 7, withdrawalRemaining: 7, status: 'locked' } },
  { id: '2', time: '2026-03-27 09:15:00', pondId: 'P012', type: 'medicine', content: '使用 50g 恩诺沙星 (肠炎)', operator: '技术员-李工', status: 'locked', details: { medicineName: '恩诺沙星', dose: 50, reason: '肠炎', withdrawalDays: 15, withdrawalRemaining: 15, status: 'locked' } },
];

// ================== 气象 (Weather) ==================

export const MOCK_WEATHER_HISTORY = [
  { id: '1', time: '2026-03-27 08:00:00', base: 'hz', weather: '晴', avgTemp: 26.4, maxWind: 3, totalRain: 0, avgPressure: 1012, status: 'normal' },
  { id: '2', time: '2026-03-27 07:00:00', base: 'zs', weather: '多云', avgTemp: 22.1, maxWind: 5, totalRain: 0.5, avgPressure: 1010, status: 'normal' },
];

export const MOCK_WEATHER_SUMMARY = [
  { label: '杭州基地', value: '26.4°C', trend: 'up' },
  { label: '舟山基地', value: '22.1°C', trend: 'down' },
  { label: '风力', value: '4.2m/s', trend: 'stable' },
];

export const MOCK_AQUACULTURE_ADVICE = {
  indices: [
    { label: '出海指数', value: 4, desc: '风浪适宜，适合出海。' },
    { label: '换水指数', value: 2, desc: '降雨概率大，不宜换水。' },
  ],
  forecast: [
    { day: '明天', weather: '8级大风', isWarning: true, advice: '⚠️ 建议加固渔排。', color: '#cf1322' },
  ]
};

// ================== 预警 (Warning) ==================

export const MOCK_ALERTS = [
  { key: '1', level: 'P0', time: '2026-03-27 10:45:12', source: '萧山基地 / 1号塘', description: '溶氧量 (DO) 骤降: 2.1 mg/L ↓', duration: '15m', status: 'pending' },
  { key: '2', level: 'P1', time: '2026-03-27 09:30:00', source: '余杭基地 / 3号塘', description: 'pH 值异常: 8.5 ↑', duration: '10m', status: 'pending' },
  { key: '3', level: 'P2', time: '2026-03-26 16:20:00', source: '富阳基地 / 5号塘', description: '水温偏高: 30.5°C ↑', duration: '20m', status: 'pending' },
  { key: '4', level: 'P0', time: '2026-03-27 08:15:00', source: '桐庐基地 / 2号塘', description: '氨氮含量超标: 0.8 mg/L ↑', duration: '25m', status: 'pending' },
  { key: '5', level: 'P1', time: '2026-03-27 07:45:00', source: '临安基地 / 4号塘', description: '亚硝酸盐偏高: 0.15 mg/L ↑', duration: '12m', status: 'pending' },
];

export const MOCK_ALERT_SUMMARY = {
  unprocessed: 12,
  newInHour: 4,
  processedToday: 45,
  avgResponseTime: '4m 30s',
};

export const MOCK_RISK_DISTRIBUTION = {
  heatmap: {
    x: ['萧山', '余杭', '富阳', '桐庐', '临安'],
    y: ['塘口 A', '塘口 B'],
    data: [[0, 0, 1], [0, 1, 2]]
  },
  composition: [
    { value: 45, name: '水质异常', color: '#cf1322' },
  ]
};

export const MOCK_WARNING_HISTORY = [
  { id: '1', level: 'P0', time: '2026-03-27 10:45:12', source: '萧山基地 / 1号塘', description: '溶氧量 (DO) 骤降: 2.1 mg/L ↓', duration: '15m', status: 'processed' },
  { id: '2', level: 'P1', time: '2026-03-27 09:30:00', source: '余杭基地 / 3号塘', description: 'pH 值异常: 8.5 ↑', duration: '10m', status: 'processed' },
  { id: '3', level: 'P2', time: '2026-03-26 16:20:00', source: '富阳基地 / 5号塘', description: '水温偏高: 30.5°C ↑', duration: '20m', status: 'processed' },
];

export const MOCK_WARNING_STATS = {
  total: 120,
  processed: 108,
  pending: 12,
  byLevel: {
    P0: 5,
    P1: 15,
    P2: 100
  },
  byType: {
    water: 80,
    weather: 20,
    equipment: 20
  }
};

// ================== 投入记录 (Input) ==================

export const MOCK_INPUT_RECORDS = [
  { id: '1', type: 'in', date: '2026-03-27', name: '南美白对虾饲料', category: 'feed', specification: '1.5mm 高蛋白', quantity: 500, unit: 'kg', price: 12.5, totalPrice: 6250, supplier: '杭州饲料公司', status: 'approved', operator: '王大牛' },
  { id: '2', type: 'in', date: '2026-03-26', name: '聚维酮碘', category: 'medicine', specification: '10% 溶液', quantity: 50, unit: '瓶', price: 35, totalPrice: 1750, supplier: '浙江兽药公司', status: 'approved', operator: '李工' },
  { id: '3', type: 'out', date: '2026-03-27', name: '南美白对虾饲料', category: 'feed', specification: '1.5mm 高蛋白', quantity: 100, unit: 'kg', price: 12.5, totalPrice: 1250, pondName: '1号池塘', status: 'pending', operator: '王大牛' },
  { id: '4', type: 'out', date: '2026-03-26', name: '聚维酮碘', category: 'medicine', specification: '10% 溶液', quantity: 10, unit: '瓶', price: 35, totalPrice: 350, pondName: '5号池塘', status: 'approved', operator: '李工' },
];


// ================== 基地 (Base) ==================

export const MOCK_BASES: any[] = [
  { id: 'B001', name: '萧山核心基地', location: [120.48, 30.15], status: 'normal', waterQuality: { oxygen: 6.2, temp: 24.5, ph: 7.8 }, base_type: '近海', deep_sea_certified: 0, taiwan_cooperation: 0, green_certification: 'A' },
  { id: 'B002', name: '余杭育苗基地', location: [120.02, 30.35], status: 'warning', waterQuality: { oxygen: 4.8, temp: 26.1, ph: 8.2 }, base_type: '陆基工厂化', deep_sea_certified: 0, taiwan_cooperation: 1, green_certification: 'B' },
  { id: 'B003', name: '深远海养殖基地', location: [121.5, 29.8], status: 'normal', waterQuality: { oxygen: 7.5, temp: 23.2, ph: 7.6 }, base_type: '深远海', deep_sea_certified: 1, taiwan_cooperation: 1, green_certification: 'A+' },
];

// ================== 深远海装备 (Deep Sea Equipment) ==================

export const MOCK_DEEP_SEA_EQUIPMENT = [
  { id: 'E001', equipment_type: '网箱', name: '深远海智能网箱', base_id: 'B003', tonnage: 500.00, max_depth: 20.00, gps_position: '121.5, 29.8', status: '运行', subsidy_amount: 1000000.00, subsidy_status: '已获批' },
  { id: 'E002', equipment_type: '工船', name: '养殖工船', base_id: 'B003', tonnage: 2000.00, max_depth: 30.00, gps_position: '121.6, 29.7', status: '维修', subsidy_amount: 5000000.00, subsidy_status: '申请中' },
];

export const MOCK_DEEP_SEA_OPERATION_LOGS = [
  { id: 'OL001', equipment_id: 'E001', operation_type: '投喂', start_time: '2026-03-27 08:00:00', end_time: '2026-03-27 09:30:00', catch_quantity: 0, fuel_consumption: 50.00 },
  { id: 'OL002', equipment_id: 'E001', operation_type: '捕捞', start_time: '2026-03-26 10:00:00', end_time: '2026-03-26 16:00:00', catch_quantity: 5000.00, fuel_consumption: 200.00 },
];

// ================== 两岸产业链协同 (Cross Strait Cooperation) ==================

export const MOCK_TAIWAN_ENTERPRISES = [
  { id: 'TE001', company_name: '台湾渔业发展有限公司', taiwan_business_license: 'TW12345678', taiwan_contact: '台北市中正区忠孝东路100号', cross_strait_cooperation: '是', preferential_policy: '享受税收优惠、土地优惠等政策', insurance_discount: 15.00 },
  { id: 'TE002', company_name: '台湾种苗培育中心', taiwan_business_license: 'TW87654321', taiwan_contact: '高雄市三民区建国路50号', cross_strait_cooperation: '是', preferential_policy: '享受种苗引进补贴政策', insurance_discount: 10.00 },
];

export const MOCK_TAIWAN_SEED_IMPORT = [
  { id: 'SI001', species_name: '石斑鱼', origin_taiwan: '高雄', quarantine_certificate: 'QC123456', adaptation_assessment: '适应性良好，适合本地养殖', import_cost: 500000.00, expected_yield: 100000.00 },
  { id: 'SI002', species_name: '鲍鱼', origin_taiwan: '屏东', quarantine_certificate: 'QC654321', adaptation_assessment: '需要适应期，建议逐步投放', import_cost: 800000.00, expected_yield: 50000.00 },
];

export const MOCK_CROSS_STRAIT_TECH_EXCHANGE = [
  { id: 'TX001', expert_name: '陈教授', expertise: '深远海养殖技术', consultation_type: '视频', consultation_content: '深远海网箱养殖技术指导', taiwan_standard: '符合台湾养殖标准TS-2025' },
  { id: 'TX002', expert_name: '林博士', expertise: '水质管理', consultation_type: '现场', consultation_content: '水质监测与管理技术培训', taiwan_standard: '符合台湾水质标准TW-WQ-2024' },
];

// ================== 物资与供应商 (Material & Supplier) ==================

export const MOCK_MATERIALS = [
  { id: 'M001', name: '台湾进口饲料', category: '饲料', specification: '高蛋白', quantity: 1000, unit: 'kg', price: 20.00, totalPrice: 20000.00, supplier: '台湾渔业发展有限公司', status: 'approved', operator: '王大牛', origin_region: '台湾', taiwan_brand: '台湾渔友', cross_strait_standard: '互认' },
  { id: 'M002', name: '大陆饲料', category: '饲料', specification: '普通', quantity: 2000, unit: 'kg', price: 15.00, totalPrice: 30000.00, supplier: '杭州饲料公司', status: 'approved', operator: '李工', origin_region: '大陆', taiwan_brand: '', cross_strait_standard: '大陆标准' },
];

export const MOCK_SUPPLIERS = [
  { id: 'S001', name: '台湾渔业发展有限公司', contact: '张先生', phone: '00886-12345678', address: '台北市中正区忠孝东路100号', supplier_origin: '台湾', taiwan_qualification: '台湾渔业协会会员', cross_strait_cooperation: 1, insurance_discount: 15.00 },
  { id: 'S002', name: '杭州饲料公司', contact: '王经理', phone: '0571-12345678', address: '杭州市萧山区开发区', supplier_origin: '大陆', taiwan_qualification: '', cross_strait_cooperation: 0, insurance_discount: 0.00 },
];

// ================== 产品合格证与市场行情 (Certificate & Market) ==================

export const MOCK_CERTIFICATES = [
  { id: 'C001', product_name: '石斑鱼', batch_number: '20260301', production_date: '2026-03-01', expiration_date: '2026-09-01', issuer: '浙江省渔业检验中心', issue_date: '2026-03-02', green_certification: '有机认证', cross_strait_recognition: 1, export_taiwan: 1, premium_price: 100.00 },
  { id: 'C002', product_name: '南美白对虾', batch_number: '20260302', production_date: '2026-03-02', expiration_date: '2026-09-02', issuer: '浙江省渔业检验中心', issue_date: '2026-03-03', green_certification: '绿色认证', cross_strait_recognition: 0, export_taiwan: 0, premium_price: 50.00 },
];

export const MOCK_MARKET_QUOTES = [
  { id: 'MQ001', product_name: '石斑鱼', market_price: 80.00, date: '2026-03-27', region: '杭州', taiwan_market_price: 120.00, export_demand: '高', cross_strait_trend: '上涨' },
  { id: 'MQ002', product_name: '南美白对虾', market_price: 40.00, date: '2026-03-27', region: '杭州', taiwan_market_price: 60.00, export_demand: '中', cross_strait_trend: '稳定' },
];
