import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Switch,
  Form,
  Modal,
  message,
  Tag,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useIntl } from 'umi';

// 预警类型选项
const warningTypes = [
  '水质预警',
  '投喂预警',
  '用药预警',
  '收获预警',
  '设备预警',
  '天气预警',
];

// 预警级别选项
const warningLevels = [
  { value: 'info', label: '信息', color: 'blue' },
  { value: 'warning', label: '警告', color: 'orange' },
  { value: 'error', label: '错误', color: 'red' },
  { value: 'success', label: '成功', color: 'green' },
];

// 模拟预警设置数据
const mockWarningSettings = [
  {
    id: '1',
    name: '水质pH值预警',
    type: '水质预警',
    level: 'warning',
    condition: 'pH值 < 6.5 或 pH值 > 8.5',
    enabled: true,
    notifyChannels: ['短信', '邮件', '系统通知'],
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    name: '溶氧预警',
    type: '水质预警',
    level: 'error',
    condition: '溶氧 < 3mg/L',
    enabled: true,
    notifyChannels: ['短信', '系统通知'],
    createdAt: '2024-01-16 14:20:00',
    updatedAt: '2024-01-16 14:20:00',
  },
  {
    id: '3',
    name: '投喂量预警',
    type: '投喂预警',
    level: 'warning',
    condition: '日投喂量 > 100kg',
    enabled: false,
    notifyChannels: ['系统通知'],
    createdAt: '2024-01-17 09:15:00',
    updatedAt: '2024-01-17 09:15:00',
  },
];

interface WarningSetting {
  id: string;
  name: string;
  type: string;
  level: string;
  condition: string;
  enabled: boolean;
  notifyChannels: string[];
  createdAt: string;
  updatedAt: string;
}

const WarningSettings: React.FC = () => {
  const intl = useIntl();
  const [settings, setSettings] = useState<WarningSetting[]>(mockWarningSettings);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSetting, setEditingSetting] = useState<WarningSetting | null>(null);
  const [loading, setLoading] = useState(false);

  // 处理新增预警设置
  const handleAdd = () => {
    setEditingSetting(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑预警设置
  const handleEdit = (record: WarningSetting) => {
    setEditingSetting(record);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      level: record.level,
      condition: record.condition,
      enabled: record.enabled,
      notifyChannels: record.notifyChannels,
    });
    setModalVisible(true);
  };

  // 处理删除预警设置
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个预警设置吗？',
      onOk: () => {
        setSettings(settings.filter(setting => setting.id !== id));
        message.success('删除成功');
      },
    });
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      setTimeout(() => {
        // 构建预警条件字符串
        let condition = '';
        if (values.type === '水质预警') {
          if (values.waterQualityParam === 'pH值') {
            condition = `${values.waterQualityParam} < ${values.minValue} 或 ${values.waterQualityParam} > ${values.maxValue}`;
          } else {
            condition = `${values.waterQualityParam} < ${values.minValue}`;
          }
        } else if (values.type === '投喂预警') {
          condition = `日投喂量 > ${values.feedingAmount}kg`;
        } else if (values.type === '用药预警') {
          condition = `用药量 > ${values.medicineAmount}g`;
        } else if (values.type === '收获预警') {
          condition = `预计收获日期 < ${values.harvestDate}`;
        } else if (values.type === '设备预警') {
          condition = `${values.deviceType} ${values.deviceStatus}`;
        } else if (values.type === '天气预警') {
          condition = `${values.weatherType} ${values.weatherLevel}`;
        }

        if (editingSetting) {
          // 编辑现有设置
          setSettings(
            settings.map(setting =>
              setting.id === editingSetting.id
                ? {
                    ...setting,
                    name: values.name,
                    type: values.type,
                    level: values.level,
                    condition: condition,
                    enabled: values.enabled,
                    notifyChannels: values.notifyChannels,
                    updatedAt: new Date().toLocaleString(),
                  }
                : setting
            )
          );
          message.success('更新成功');
        } else {
          // 新增设置
          const newSetting: WarningSetting = {
            id: String(Date.now()),
            name: values.name,
            type: values.type,
            level: values.level,
            condition: condition,
            enabled: values.enabled,
            notifyChannels: values.notifyChannels,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
          };
          setSettings([...settings, newSetting]);
          message.success('添加成功');
        }
        setModalVisible(false);
        form.resetFields();
        setLoading(false);
      }, 500);
    });
  };

  // 处理启用/禁用预警设置
  const handleToggle = (id: string, enabled: boolean) => {
    setSettings(
      settings.map(setting =>
        setting.id === id
          ? {
              ...setting,
              enabled: !enabled,
              updatedAt: new Date().toLocaleString(),
            }
          : setting
      )
    );
    message.success(enabled ? '已禁用' : '已启用');
  };

  // 表格列定义
  const columns: TableColumnsType<WarningSetting> = [
    {
      title: intl.formatMessage({ id: 'warningSettings.name', defaultMessage: '预警名称' }),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'warningSettings.type', defaultMessage: '预警类型' }),
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'warningSettings.level', defaultMessage: '预警级别' }),
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level) => {
        const levelInfo = warningLevels.find(item => item.value === level);
        return levelInfo ? (
          <Tag color={levelInfo.color}>{levelInfo.label}</Tag>
        ) : null;
      },
    },
    {
      title: intl.formatMessage({ id: 'warningSettings.condition', defaultMessage: '预警条件' }),
      dataIndex: 'condition',
      key: 'condition',
      ellipsis: true,
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'warningSettings.notifyChannels', defaultMessage: '通知渠道' }),
      dataIndex: 'notifyChannels',
      key: 'notifyChannels',
      ellipsis: true,
      width: 150,
      render: (channels) => (
        <Space direction="vertical" size={4}>
          {channels.map((channel: string, index: number) => (
            <Tag key={index}>{channel}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'warningSettings.status', defaultMessage: '状态' }),
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggle(record.id, enabled)}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'warningSettings.action', defaultMessage: '操作' }),
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            {intl.formatMessage({ id: 'warningSettings.edit', defaultMessage: '编辑' })}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          >
            {intl.formatMessage({ id: 'warningSettings.delete', defaultMessage: '删除' })}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <span>{intl.formatMessage({ id: 'menu.production.warning-settings', defaultMessage: '预警设置' })}</span>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              {intl.formatMessage({ id: 'warningSettings.add', defaultMessage: '新增预警设置' })}
            </Button>
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setSettings(mockWarningSettings);
                  setLoading(false);
                  message.success(intl.formatMessage({ id: 'warningSettings.refreshSuccess', defaultMessage: '刷新成功' }));
                }, 500);
              }}
            >
              {intl.formatMessage({ id: 'warningSettings.refresh', defaultMessage: '刷新' })}
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={settings}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />

        {/* 预警设置编辑模态框 */}
        <Modal
          title={editingSetting ? intl.formatMessage({ id: 'warningSettings.edit', defaultMessage: '编辑预警设置' }) : intl.formatMessage({ id: 'warningSettings.add', defaultMessage: '新增预警设置' })}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmit}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label={intl.formatMessage({ id: 'warningSettings.name', defaultMessage: '预警名称' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.nameRequired', defaultMessage: '请输入预警名称' }) }]}
            >
              <Input placeholder={intl.formatMessage({ id: 'warningSettings.namePlaceholder', defaultMessage: '请输入预警名称' })} />
            </Form.Item>

            <Form.Item
              name="type"
              label={intl.formatMessage({ id: 'warningSettings.type', defaultMessage: '预警类型' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.typeRequired', defaultMessage: '请选择预警类型' }) }]}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'warningSettings.typePlaceholder', defaultMessage: '请选择预警类型' })}
                style={{ width: '100%' }}
                onChange={(value) => {
                  // 当预警类型改变时，重置相关字段
                  form.resetFields(['waterQualityParam', 'minValue', 'maxValue', 'feedingAmount', 'medicineAmount', 'harvestDate', 'deviceType', 'deviceStatus', 'weatherType', 'weatherLevel']);
                }}
              >
                {warningTypes.map(type => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="level"
              label={intl.formatMessage({ id: 'warningSettings.level', defaultMessage: '预警级别' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.levelRequired', defaultMessage: '请选择预警级别' }) }]}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'warningSettings.levelPlaceholder', defaultMessage: '请选择预警级别' })}
                style={{ width: '100%' }}
              >
                {warningLevels.map(level => (
                  <Select.Option key={level.value} value={level.value}>
                    {level.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* 水质预警参数 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === '水质预警') {
                  return (
                    <div>
                      <Form.Item
                        name="waterQualityParam"
                        label={intl.formatMessage({ id: 'warningSettings.waterQualityParam', defaultMessage: '水质参数' })}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.waterQualityParamRequired', defaultMessage: '请选择水质参数' }) }]}
                      >
                        <Select placeholder={intl.formatMessage({ id: 'warningSettings.waterQualityParamPlaceholder', defaultMessage: '请选择水质参数' })} style={{ width: '100%' }}>
                          <Select.Option value="pH值">pH值</Select.Option>
                          <Select.Option value="溶氧">溶氧</Select.Option>
                          <Select.Option value="氨氮">氨氮</Select.Option>
                          <Select.Option value="亚硝酸盐">亚硝酸盐</Select.Option>
                          <Select.Option value="温度">温度</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="minValue"
                        label={intl.formatMessage({ id: 'warningSettings.minValue', defaultMessage: '最小值' })}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.minValueRequired', defaultMessage: '请输入最小值' }) }]}
                      >
                        <Input type="number" placeholder={intl.formatMessage({ id: 'warningSettings.minValuePlaceholder', defaultMessage: '请输入最小值' })} />
                      </Form.Item>

                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.waterQualityParam !== currentValues.waterQualityParam}
                      >
                        {({ getFieldValue }) => {
                          const param = getFieldValue('waterQualityParam');
                          if (param === 'pH值') {
                            return (
                              <Form.Item
                                name="maxValue"
                                label={intl.formatMessage({ id: 'warningSettings.maxValue', defaultMessage: '最大值' })}
                                rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.maxValueRequired', defaultMessage: '请输入最大值' }) }]}
                              >
                                <Input type="number" placeholder={intl.formatMessage({ id: 'warningSettings.maxValuePlaceholder', defaultMessage: '请输入最大值' })} />
                              </Form.Item>
                            );
                          }
                          return null;
                        }}
                      </Form.Item>
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>

            {/* 投喂预警参数 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === '投喂预警') {
                  return (
                    <Form.Item
                      name="feedingAmount"
                      label={intl.formatMessage({ id: 'warningSettings.feedingAmount', defaultMessage: '日投喂量上限' })}
                      rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.feedingAmountRequired', defaultMessage: '请输入日投喂量上限' }) }]}
                    >
                      <Input type="number" placeholder={intl.formatMessage({ id: 'warningSettings.feedingAmountPlaceholder', defaultMessage: '请输入日投喂量上限（kg）' })} />
                    </Form.Item>
                  );
                }
                return null;
              }}
            </Form.Item>

            {/* 用药预警参数 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === '用药预警') {
                  return (
                    <Form.Item
                      name="medicineAmount"
                      label={intl.formatMessage({ id: 'warningSettings.medicineAmount', defaultMessage: '用药量上限' })}
                      rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.medicineAmountRequired', defaultMessage: '请输入用药量上限' }) }]}
                    >
                      <Input type="number" placeholder={intl.formatMessage({ id: 'warningSettings.medicineAmountPlaceholder', defaultMessage: '请输入用药量上限（g）' })} />
                    </Form.Item>
                  );
                }
                return null;
              }}
            </Form.Item>

            {/* 收获预警参数 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === '收获预警') {
                  return (
                    <Form.Item
                      name="harvestDate"
                      label={intl.formatMessage({ id: 'warningSettings.harvestDate', defaultMessage: '预计收获日期' })}
                      rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.harvestDateRequired', defaultMessage: '请选择预计收获日期' }) }]}
                    >
                      <Input type="date" placeholder={intl.formatMessage({ id: 'warningSettings.harvestDatePlaceholder', defaultMessage: '请选择预计收获日期' })} />
                    </Form.Item>
                  );
                }
                return null;
              }}
            </Form.Item>

            {/* 设备预警参数 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === '设备预警') {
                  return (
                    <div>
                      <Form.Item
                        name="deviceType"
                        label={intl.formatMessage({ id: 'warningSettings.deviceType', defaultMessage: '设备类型' })}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.deviceTypeRequired', defaultMessage: '请选择设备类型' }) }]}
                      >
                        <Select placeholder={intl.formatMessage({ id: 'warningSettings.deviceTypePlaceholder', defaultMessage: '请选择设备类型' })} style={{ width: '100%' }}>
                          <Select.Option value="增氧机">增氧机</Select.Option>
                          <Select.Option value="水泵">水泵</Select.Option>
                          <Select.Option value="投料机">投料机</Select.Option>
                          <Select.Option value="水质监测仪">水质监测仪</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="deviceStatus"
                        label={intl.formatMessage({ id: 'warningSettings.deviceStatus', defaultMessage: '设备状态' })}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.deviceStatusRequired', defaultMessage: '请选择设备状态' }) }]}
                      >
                        <Select placeholder={intl.formatMessage({ id: 'warningSettings.deviceStatusPlaceholder', defaultMessage: '请选择设备状态' })} style={{ width: '100%' }}>
                          <Select.Option value="故障">故障</Select.Option>
                          <Select.Option value="离线">离线</Select.Option>
                          <Select.Option value="异常">异常</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>

            {/* 天气预警参数 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === '天气预警') {
                  return (
                    <div>
                      <Form.Item
                        name="weatherType"
                        label={intl.formatMessage({ id: 'warningSettings.weatherType', defaultMessage: '天气类型' })}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.weatherTypeRequired', defaultMessage: '请选择天气类型' }) }]}
                      >
                        <Select placeholder={intl.formatMessage({ id: 'warningSettings.weatherTypePlaceholder', defaultMessage: '请选择天气类型' })} style={{ width: '100%' }}>
                          <Select.Option value="暴雨">暴雨</Select.Option>
                          <Select.Option value="台风">台风</Select.Option>
                          <Select.Option value="高温">高温</Select.Option>
                          <Select.Option value="寒潮">寒潮</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="weatherLevel"
                        label={intl.formatMessage({ id: 'warningSettings.weatherLevel', defaultMessage: '预警级别' })}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.weatherLevelRequired', defaultMessage: '请选择预警级别' }) }]}
                      >
                        <Select placeholder={intl.formatMessage({ id: 'warningSettings.weatherLevelPlaceholder', defaultMessage: '请选择预警级别' })} style={{ width: '100%' }}>
                          <Select.Option value="蓝色预警">蓝色预警</Select.Option>
                          <Select.Option value="黄色预警">黄色预警</Select.Option>
                          <Select.Option value="橙色预警">橙色预警</Select.Option>
                          <Select.Option value="红色预警">红色预警</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  );
                }
                return null;
              }}
            </Form.Item>

            <Form.Item
              name="notifyChannels"
              label={intl.formatMessage({ id: 'warningSettings.notifyChannels', defaultMessage: '通知渠道' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'warningSettings.notifyChannelsRequired', defaultMessage: '请选择通知渠道' }) }]}
            >
              <Select
                mode="multiple"
                placeholder={intl.formatMessage({ id: 'warningSettings.notifyChannelsPlaceholder', defaultMessage: '请选择通知渠道' })}
                style={{ width: '100%' }}
              >
                <Select.Option value="短信">短信</Select.Option>
                <Select.Option value="邮件">邮件</Select.Option>
                <Select.Option value="系统通知">系统通知</Select.Option>
                <Select.Option value="微信">微信</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="enabled"
              label={intl.formatMessage({ id: 'warningSettings.enabled', defaultMessage: '是否启用' })}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default WarningSettings;