import request from '@/utils/request';

export async function getTotal() {
  return request('/api/v1/record/total', {
    method: 'GET',
  });
}
