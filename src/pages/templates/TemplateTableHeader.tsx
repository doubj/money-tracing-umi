import { Button, Input, Space } from 'antd';
import React, { useState } from 'react';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';

interface TemplateTableHeaderProps {
  onQuery: (query: { [key: string]: unknown }) => void;
  onCreate: () => void;
}

const TemplateTableHeader: React.FC<TemplateTableHeaderProps> = (props) => {
  const { onQuery, onCreate } = props;

  const [query, setQuery] = useState<{ [key: string]: unknown }>({});
  return (
    <>
      <Space>
        <Input
          placeholder="备注"
          allowClear={true}
          onChange={(e) => setQuery({ remark_like: e.target.value })}
          onPressEnter={() => onQuery(query)}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => onQuery(query)}
        >
          搜索
        </Button>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => onCreate()}
        >
          新增
        </Button>
      </Space>
    </>
  );
};

export default TemplateTableHeader;
