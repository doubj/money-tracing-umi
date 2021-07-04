import request from '@/utils/request';
import { Dayjs } from 'dayjs';
import { CategoryType } from './categories';

export type QueryParams = {
  _page?: number;
  _limit?: number;
  description_like?: string;
  remark_like?: string;
  cid?: string;
};

export type TemplateType = {
  id?: string;
  type: string;
  date: string | Dayjs | Date;
  time: Date | Dayjs;
  timestamp: number;
  category: CategoryType;
  price: number;
  description: string;
  remark: string;
};

export async function getTemplates(params: QueryParams) {
  return request.get<{ list: TemplateType[]; total: number }>(
    '/api/v1/template',
    { params },
  );
}

export async function createTemplate(data: TemplateType) {
  return request.post('/api/v1/template', { data });
}

export async function modifyTemplate(data: TemplateType) {
  return request.put(`/api/v1/template/${data.id}`, { data });
}

export async function deleteTemplate(id: string) {
  return request.delete(`/api/v1/template/${id}`);
}
