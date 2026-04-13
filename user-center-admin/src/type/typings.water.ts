declare namespace Water {

        // =============== 水质相关 ===============
        export interface WaterMetrics {
            level?: number;      // 水位/水深
            temperature?: number;
            pH?: number;
            dissolvedOxygen?: number;
            salinity?: number;
        }


        export interface BaseWaterSummary {
            oxygen: number;   // 通常取「所有在养单元中的最低溶氧」
            temperature: number; // 平均水温
            pH: number;       // 平均 pH
            // 可选：异常单元数量
            warningUnits?: number;
        }

        export type PondWaterLog = {
        timestamp: string;
        dissolvedOxygen: number;
        waterTemperature?: number;
        pH?: number;
        };

        export type WaterStats = {
        total: number;
        normal: number;
        warning: number;
        error: number;
        };

        export type WaterAlarmLog = {
        id: string;
        time: string;
        metric?: string;
        value?: number;
        threshold?: number;
        status?: 'normal' | 'warning' | 'error';
        handle?: '未处理' | '已处理';
        };



        interface SeawaterMetrics extends WaterMetrics {
            salinity: number;        // 盐度（‰，通常 25~35）
            turbidity: number;       // 浊度（NTU）
            chlorophyll: number;     // 叶绿素 a（μg/L，反映藻类密度）
            currentSpeed?: number;   // 水流速度（m/s，影响网箱溶氧交换）
            tideLevel?: number;      // 潮位（m）
         }

}