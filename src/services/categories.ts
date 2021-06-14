import request from '@/utils/request';

export type CategoryType = {
  id?: string;
  name?: string;
  icon?: string;
  type?: string;
};

export const getCategories = () => {
  return request.get<CategoryType[]>('/api/v1/category');
};
