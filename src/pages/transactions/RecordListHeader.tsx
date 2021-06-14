import React, { useState } from 'react';
import { Row, Col, Button, Popconfirm } from 'antd';
import { DeleteFilled, SearchOutlined } from '@ant-design/icons';
import styles from './index.less';

interface RecordListHeaderProps {
  onSearch: () => void;
  onDelete: () => void;
  selectedRowKeys: React.Key[];
}

const RecordListHeader: React.FC<RecordListHeaderProps> = ({
  onSearch,
  onDelete,
  selectedRowKeys,
}) => {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const selectOneOrMore = selectedRowKeys.length >= 1;
  return (
    <Row style={{ float: 'right', marginBottom: '10px' }}>
      <Col className={styles.flexEnd} span={24}>
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          搜索
        </Button>
        <Popconfirm
          visible={deleteConfirmVisible}
          title="确认要删除吗?"
          onConfirm={() => {
            onDelete();
            setDeleteConfirmVisible(false);
          }}
          onCancel={() => setDeleteConfirmVisible(false)}
          cancelText="取消"
          okText="确认"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteFilled />}
            disabled={!selectOneOrMore}
            onClick={() => setDeleteConfirmVisible(true)}
          >
            删除
          </Button>
        </Popconfirm>
      </Col>
    </Row>
  );
};

export default RecordListHeader;
