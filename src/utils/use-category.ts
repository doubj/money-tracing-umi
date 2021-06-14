import { useModel } from 'umi';

const useCategory = () => {
  const { initialState } = useModel('@@initialState');
  const categories = initialState?.categories;
  const options = [
    {
      label: '支出',
      value: 'expense',
    },
    {
      label: '收入',
      value: 'income',
    },
  ];
  return {
    categories: categories || [],
    options,
  };
};

export default useCategory;
