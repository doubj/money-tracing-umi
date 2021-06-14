import React, { useState } from 'react';
import { Space, Modal, DatePicker, Checkbox, InputNumber, Button } from 'antd';
import Draggable from 'react-draggable';
import moment from 'moment';

import { CategoryType } from '@/services/categories';
import CategoryList from '../CategoryList/CategoryList';

const checkBoxOptions = [
  { label: '支出', value: 'expense' },
  { label: '收入', value: 'income' },
];

const { RangePicker } = DatePicker;

interface SearchModalProps {
  searchVisible: boolean;
  categories: CategoryType[];
  onCancel: () => void;
  onSearch: (search: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  searchVisible,
  onSearch,
  onCancel,
  categories,
}) => {
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [disabled, setDisabled] = useState(true);
  const [search, setSearch] = useState<any>({});
  const [selectedType, setSelectedType] = useState<string[]>(
    checkBoxOptions.map((option) => option.value),
  );
  const draggleRef = React.createRef<any>();

  const onStart = (event: any, uiData: any) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };

  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };

  return (
    <Modal
      title={
        <div
          style={{ width: '100%', cursor: 'move' }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
        >
          搜索
        </div>
      }
      width={600}
      visible={searchVisible}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="reset"
          onClick={() => {
            setSelectedType(checkBoxOptions.map((option) => option.value));
            setSearch({});
            onSearch({});
          }}
        >
          重置
        </Button>,
        <Button key="search" type="primary" onClick={() => onSearch(search)}>
          搜索
        </Button>,
      ]}
      onCancel={onCancel}
      mask={false}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      <Space style={{ width: '100%' }} direction="vertical" size={20}>
        <RangePicker
          value={[
            search.date_$gte ? moment(search.date_$gte) : null,
            search.date_$lt ? moment(search.date_$lt) : null,
          ]}
          disabledDate={disabledDate}
          style={{ width: '100%' }}
          onChange={(values: any) =>
            setSearch({
              ...search,
              date_$gte: values[0].format('YYYY-MM-DD'),
              date_$lt: moment(values[1]).add(1, 'days').format('YYYY-MM-DD'),
            })
          }
        />
        <CategoryList
          value={categories.find((item) => item.id === search.category)}
          categoryList={categories}
          selectedTypes={selectedType}
          onChange={(value: CategoryType) =>
            setSearch({ ...search, category: value.id })
          }
        />
        <Checkbox.Group
          value={selectedType}
          options={checkBoxOptions}
          onChange={(values: any) => setSelectedType(values)}
        />
        <Space>
          <span>最小金额：</span>
          <InputNumber
            value={search.price_$gte || 0}
            min={0}
            max={search.price_$lte || Number.MAX_SAFE_INTEGER}
            defaultValue={0}
            onChange={(value: number) =>
              setSearch({
                ...search,
                price_$gte: value,
              })
            }
          />
          <span>最大金额：</span>
          <InputNumber
            value={search.price_$lte || 0}
            min={search.price_$gte || 0}
            defaultValue={0}
            onChange={(value: number) =>
              setSearch({
                ...search,
                price_$lte: value,
              })
            }
          />
        </Space>
      </Space>
    </Modal>
  );
};

export default SearchModal;
