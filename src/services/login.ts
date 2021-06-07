import request from '@/utils/request';

export type LoginParamsType = {
  userName: string;
  password: string;
};

export async function login(params: LoginParamsType) {
  return request('/api/v1/user/login', {
    method: 'POST',
    data: params,
  });
}
