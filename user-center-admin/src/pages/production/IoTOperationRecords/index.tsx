import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { AlertOutlined, ToolOutlined, SendOutlined } from '@ant-design/icons';
import AlertRecordsTab from './components/AlertRecordsTab';
import MaintenanceTab from './components/MaintenanceTab';
import CommandLogsTab from './components/CommandLogsTab';

const IoTOperationRecords = () => {
  return (
    <PageContainer>
      <Tabs
        defaultActiveKey="alert"
        items={[
          {
            key: 'alert',
            label: (
              <span>
                <AlertOutlined style={{ marginRight: 6 }} />
                告警记录
              </span>
            ),
            children: <AlertRecordsTab />,
          },
          {
            key: 'maintenance',
            label: (
              <span>
                <ToolOutlined style={{ marginRight: 6 }} />
                维护记录
              </span>
            ),
            children: <MaintenanceTab />,
          },
          {
            key: 'command',
            label: (
              <span>
                <SendOutlined style={{ marginRight: 6 }} />
                指令历史
              </span>
            ),
            children: <CommandLogsTab />,
          },
        ]}
      />
    </PageContainer>
  );
};

export default IoTOperationRecords;
