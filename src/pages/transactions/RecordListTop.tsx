import React from 'react';
import { Input, Row, Col, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

interface RecordListTopProps {
  onSearch: (key: string) => void;
  onCreate: () => void;
}

const RecordListTop: React.FC<RecordListTopProps> = ({
  onSearch,
  onCreate,
}) => {
  return (
    <Row style={{ marginBottom: '20px' }}>
      <Col span="20">
        <Search
          onSearch={onSearch}
          enterButton
          placeholder="请输入描述"
          allowClear
        />
      </Col>
      <Col span="4">
        <Button
          style={{ width: 'calc(100% - 5px)', marginLeft: 5 }}
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={onCreate}
        >
          添加消费记录
        </Button>
      </Col>
    </Row>
  );
};

export default RecordListTop;
