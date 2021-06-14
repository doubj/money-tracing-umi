import React from 'react';
import { Table, Space, Tooltip } from 'antd';
import { RecordType } from '@/services/transactions';
import { currencyFormat, IconFont } from '@/utils/utility';
import { EditTwoTone, InteractionTwoTone } from '@ant-design/icons';
import { CategoryType } from '@/services/categories';

const { Column } = Table;

interface RecordTableProps {
  pagination: Object;
  isLoading: boolean;
  itemsWithCategory: RecordType[];
  selectedRowKeys: React.Key[];
  selectChange: (keys: React.Key[], selectRows: RecordType[]) => void;
  selectRow: (record: RecordType) => void;
  handleGenerate: (record: RecordType) => void;
  handleEdit: (record: RecordType) => void;
}

const RecordTable: React.FC<RecordTableProps> = ({
  pagination,
  isLoading,
  itemsWithCategory,
  selectedRowKeys,
  selectChange,
  selectRow,
  handleGenerate,
  handleEdit,
}) => {
  return (
    <Table
      className="pointer"
      pagination={pagination}
      loading={isLoading}
      style={{ marginTop: 10 }}
      rowSelection={{
        selectedRowKeys,
        onChange: selectChange,
      }}
      rowKey="id"
      dataSource={itemsWithCategory}
      onRow={(record) => ({
        onClick: () => {
          selectRow(record);
        },
      })}
      summary={(pageData) => {
        let sum = 0;
        pageData.forEach(({ price, category }) => {
          if ((category as CategoryType).type === 'income') {
            sum += price || 0;
          } else {
            sum -= price || 0;
          }
        });
        return (
          itemsWithCategory.length > 0 && (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} align="right" colSpan={4}>
                  总收入/支出
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  <span className={sum > 0 ? 'income' : 'expense'}>
                    {currencyFormat().format(Math.abs(sum))}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )
        );
      }}
    >
      <Column
        align="center"
        title="类别"
        dataIndex="category"
        key="category"
        render={(category) => (
          <>
            {
              <Space size="small">
                <IconFont style={{ fontSize: '24px' }} type={category.icon} />
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
      <Column
        width={'15%'}
        align="center"
        title="操作"
        dataIndex=""
        key="action"
        render={(record: RecordType) => (
          <div className="action-wrap">
            <Tooltip title="生成模板">
              <InteractionTwoTone
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerate(record);
                }}
              />
            </Tooltip>
            <Tooltip title="编辑">
              <EditTwoTone
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record);
                }}
              />
            </Tooltip>
          </div>
        )}
      />
    </Table>
  );
};

export default RecordTable;
