import { Dayjs } from 'dayjs';
import { CategoryType } from './categories';
import request from '@/utils/request';

export type RecordType = {
  id?: string;
  date: string | Dayjs | Date;
  time: Date | Dayjs;
  type: string;
  timestamp: number;
  price: number;
  description: string;
  category: CategoryType;
};

interface QueryParams {
  _page?: number;
  _limit?: number;
  description_like?: string;
  date_$gte?: string;
  date_$lt?: string;
  cid?: string;
  price_$gte?: number;
  price_$lte?: number;
}

export async function getRecords(params: QueryParams) {
  return request.get('/api/v1/record', { params });
}

export async function createRecord(data: RecordType) {
  return request.post('/api/v1/record', { data });
}

export async function modifyRecord(data: RecordType) {
  return request.put(`/api/v1/record/${data.id}`, { data });
}

export async function deleteRecords(ids: string) {
  return request.delete(`/api/v1/record/${ids}`);
}

export async function getTotal() {
  return request.get('/api/v1/record/total');
}
