import { CategoryType } from '@/services/categories';
import { RecordType } from '@/services/transactions';
import { currencyFormat, IconFont } from '@/utils/utility';
import { Modal, PaginationProps, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const { Column } = Table;

interface RecordListModalProps {
  visible: boolean;
  title: string;
  datas: RecordType[];
  onCancel: () => void;
}

const RecordListModal: React.FC<RecordListModalProps> = (props) => {
  const { visible, title, datas, onCancel } = props;
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    getRecords();
  }, [datas]);

  const [records, setRecords] = useState<RecordType[]>([]);

  const getRecords = () => {
    let { current = 1, pageSize = 5 } = pagination;
    setRecords(datas.slice((current - 1) * pageSize, current * pageSize));
    // onChange必须要定义在这里才能获取到datas?
    setPagination({
      ...pagination,
      total: datas.length,
      onChange: (page: number, pageSize: number | undefined) => {
        pagination.current = page;
        pagination.pageSize = pageSize;
        getRecords();
      },
    });
  };

  return (
    <>
      <Modal
        width={'75%'}
        style={{ top: 80 }}
        footer={null}
        visible={visible}
        title={title}
        maskClosable={true}
        onCancel={() => {
          setPagination({ pageSize: 5, current: 1 });
          onCancel();
        }}
      >
        <Table rowKey="id" pagination={pagination} dataSource={records}>
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
