import { extend, ResponseError } from 'umi-request';
import { message } from 'antd';
import { history } from 'umi';

export const BASE_URL = 'http://42.192.49.233:3010';

/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */
const errorHandler = (error: ResponseError): void => {
  // 20x会有返回结果，其余全在这个异常处理中处理
  const { response, data } = error;
  if (response && response.status) {
    const errorText = data.message || response.statusText;
    message.error(errorText);
    if (response.status === 401) {
      history.push('/login');
    }
  } else if (!response) {
    message.error('网络错误：请刷新或重试');
  }
};

/**
 * @en-US Configure the default parameters for request
 * @zh-CN 配置request请求时的默认参数
 */
const request = extend({
  prefix: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
  timeout: 3000,
  errorHandler, // default error handling
  // credentials: 'include', // Does the default request bring cookies
});

// request拦截器, 给请求头加上token
request.interceptors.request.use((url, options) => {
  return {
    url: `${url}`,
    options: {
      ...options,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    },
  };
});

export default request;
