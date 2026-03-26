import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message as antMessage, notification } from 'antd';
import { history } from '@umijs/max';

interface ResponseStructure {
  code: number;
  success: boolean;
  data: any;
  message?: string;
  description?: string;
}

export const errorConfig: RequestConfig = {
  // 1. 【重要】删除 errorThrower，只保留 errorHandler
  errorConfig: {
    // errorThrower: (res) => { ... }  <-- 删掉这段！它会和 responseInterceptors 冲突
    
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;

      console.log('🛡️ [全局错误捕获] 收到错误:');
      
      // 情况 A: 业务错误 (由 responseInterceptors 抛出)
      if (error.name === 'BizError') {
        const { message, description } = error.info || {};
        const content = description || message || '请求失败';
        
        antMessage.error(content);
        
        // 如果需要特殊处理（如 401 跳转登录），在这里加
        // if (error.info?.code === 401) { history.push('/login'); }
        
        return; // ✅ 处理完毕，直接返回，不要再 throw
      }

      // 情况 B: 网络错误或 HTTP 状态码错误 (404, 500)
      if (error.response) {
        antMessage.error(`服务器响应错误: ${error.response.status}`);
      } else if (error.request) {
        antMessage.error('网络异常，请检查网络连接');
      } else {
        antMessage.error('请求发送失败');
      }

    },
  },

  requestInterceptors: [
    (config: RequestOptions) => {
      const url = config?.url?.concat('?token=123');
      return { ...config, url };
    },
  ],

  // 2. 【核心】所有业务逻辑判断都在这里做
  responseInterceptors: [
    (response) => {
        const resData = (response as any).data;

      // 防御性编程：防止 resData 为空
      if (!resData) {
         // 如果连数据都没有，视为异常
         const error: any = new Error('响应数据为空');
         error.name = 'BizError';
         error.info = { message: '响应数据为空' };
         throw error;
      }

      // 核心判断：只要 code 不是 200，就视为业务失败
      if (resData.code !== 200) {

        const error: any = new Error(resData.message || resData.description || '请求失败');
        error.name = 'BizError'; // 标记为业务错误
        error.info = {
          code: resData.code,
          message: resData.message,
          description: resData.description,
          data: resData.data,
        };
        
        // 👇 关键：在这里抛出，会直接跳过 .then()，进入 errorHandler
        throw error;
      }

      // 成功则原样返回
      return response;

    },
  ],
};