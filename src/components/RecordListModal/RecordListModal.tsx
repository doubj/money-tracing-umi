import { CategoryType } from '@/services/categories';
import { RecordType } from '@/services/transactions';
import { currencyFormat, IconFont } from '@/utils/utility';
import { Modal, Space, Table } from 'antd';
import React from 'react';

const { Column } = Table;

interface RecordListModalProps {
  visible: boolean;
  title: string;
  datas: RecordType[];
  onCancel: () => void;
}

const RecordListModal: React.FC<RecordListModalProps> = (props) => {
  const { visible, title, datas, onCancel } = props;
  return (
    <>
      <Modal
        width={'75%'}
        style={{ top: 80 }}
        footer={null}
        visible={visible}
        title={title}
        maskClosable={true}
        onCancel={onCancel}
      >
        <Table rowKey="id" pagination={{ pageSize: 5 }} dataSource={datas}>
          <Column
            align="center"
            title="类别"
            dataIndex="category"
            key="category"
            render={(category) => (
              <>
                {
                  <Space size="small">
                    <IconFont
                      style={{ fontSize: '24px' }}
                      type={category.icon}
                    />
                    <span>{category.name}</span>
                  </Space>
                }
              </>
            )}
          />
          <Column align="center" title="日期" dataIndex="date" key="date" />
          <Column
            align="center"
            title="描述"
            dataIndex="description"
            key="description"
          />
          <Column
            align="center"
            title="金额"
            dataIndex="price"
            key="price"
            render={(price: number, record: RecordType) => (
              <span className={(record.category as CategoryType).type}>
                {currencyFormat().format(price)}
              </span>
            )}
          />
        </Table>
      </Modal>
    </>
  );
};

export default RecordListModal;
