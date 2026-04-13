// @ts-ignore
/* eslint-disable */


// import { Result } from "antd";


declare namespace Base{

   type BaseInfo = {
      id: string;
      name: string;
      location: [number, number]; // 基地中心点坐标
      status: 'normal' | 'warning' | 'todo'; // ← 由塘口聚合得出
      
      // 可选：汇总水质（非原始数据，而是统计值）
      waterQuality: Water.BaseWaterSummary;

      // 可选：附加统计
      stats?: {
        totalPonds: number;
        warningPonds: number;
        todoTasks: number;
      };
    };


    type MapApi = {
      apiKey: string;
    };

}



