import { getCategories } from '@/services/categories';

export async function getInitialState() {
  const result = await getCategories();
  return { categories: result };
}
