import { CategoryType } from '@/services/categories';
import { IconFont } from '@/utils/utility';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface CategoryListProps {
  selectedTypes: string[];
  value?: CategoryType;
  categoryList: CategoryType[];
  onChange?: (value: CategoryType) => void;
}

const CategoryList: React.FC<CategoryListProps> = (props) => {
  const { selectedTypes, value, categoryList, onChange } = props;

  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    setCategories(
      categoryList.filter(
        (item) => selectedTypes.indexOf(item.type as string) !== -1,
      ),
    );
  }, [categoryList, selectedTypes]);

  return (
    <>
      <div className={styles.container}>
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              className={`${styles.item} ${
                value?.id === category.id ? `${styles.itemSelected}` : ''
              }`}
              onClick={() => {
                onChange?.(category);
              }}
            >
              <IconFont
                style={{ fontSize: '36px' }}
                type={category.icon as string}
              />
              <span>{category.name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CategoryList;
