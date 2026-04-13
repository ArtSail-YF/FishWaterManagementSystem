import { Badge, Calendar, Card, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import React from 'react';



const { Title } = Typography;


//====类型
type CalendarTask = {
  type: 'feed' | 'water' | 'harvest' | 'medicine';
  content: string;
};

interface PlanCalendarProps {
  onSelect: (date: Dayjs) => void;
  getTasksForDate: (date: Dayjs) => CalendarTask[];
}
//============



const PlanCalendar: React.FC<PlanCalendarProps> = ({ onSelect, getTasksForDate }) => {
  const dateCellRender = (value: Dayjs) => {
    const listData = getTasksForDate(value);
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status={
                item.type === 'feed'
                  ? 'processing'
                  : item.type === 'medicine'
                  ? 'error'
                  : item.type === 'water'
                  ? 'warning'
                  : 'success'
              }
              text={item.content}
              style={{ fontSize: '10px' }}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card styles={{ body: { padding: '12px' } }} style={{ height: '100%' }}>
      <Calendar
        fullscreen={true}
        onSelect={onSelect}
        cellRender={dateCellRender}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          return (
            <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0 }}>
                {value.format('YYYY年 MM月')}
              </Title>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge status="processing" text="投喂" />
                <Badge status="error" text="用药" />
                <Badge status="warning" text="换水" />
                <Badge status="success" text="捕捞" />
              </div>
            </div>
          );
        }}
      />
    </Card>
  );
};

export default PlanCalendar;
