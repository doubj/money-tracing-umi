import { PaginationProps, Popconfirm, Space, Table, Tooltip } from 'antd';
import React from 'react';
import {
  EditTwoTone,
  InteractionTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';
import { TemplateType } from '@/services/template';
import { currencyFormat, IconFont } from '@/utils/utility';
import dayjs from 'dayjs';

const { Column } = Table;

interface TemplateTableProps {
  isLoading: boolean;
  pagination: PaginationProps;
  templateList: TemplateType[];
  onGenerate: (template: TemplateType) => void;
  onEdit: (template: TemplateType) => void;
  onDelete: (template: TemplateType) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = (props) => {
  const { isLoading, pagination, templateList, onGenerate, onEdit, onDelete } =
    props;
  return (
    <>
      <Table
        style={{ marginTop: 20 }}
        loading={isLoading}
        pagination={pagination}
        dataSource={templateList}
      >
        <Column
          align="center"
          title="类别"
          dataIndex="category"
          key="category"
          render={(category) => {
            return (
              <>
                {category ? (
                  <Space size="small">
                    <IconFont
                      style={{ fontSize: '24px' }}
                      type={category.icon as string}
                    />
                    <span>{category.name}</span>
                  </Space>
                ) : (
                  <span>分类不存在</span>
                )}
              </>
            );
          }}
        />
        <Column
          align="center"
          title="创建时间"
          dataIndex="timestamp"
          key="timestamp"
          render={(timestamp: number) => dayjs(timestamp).format('YYYY-MM-DD')}
        />
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
          render={(price: number, template: TemplateType) => {
            const category = template.category;
            return (
              <span className={category?.type}>
                {currencyFormat().format(price)}
              </span>
            );
          }}
        />
        <Column align="center" title="备注" dataIndex="remark" key="remark" />
        <Column
          width={'15%'}
          align="center"
          title="操作"
          dataIndex=""
          key="action"
          render={(template: TemplateType) => (
            <div className="action-wrap">
              <Tooltip title="生成一条记录">
                <InteractionTwoTone onClick={() => onGenerate(template)} />
              </Tooltip>
              <Tooltip title="编辑">
                <EditTwoTone onClick={() => onEdit(template)} />
              </Tooltip>
              <Tooltip title="删除">
                <Popconfirm
                  title="确认要删除吗?"
                  onConfirm={() => onDelete(template)}
                  okText="确认"
                  cancelText="取消"
                >
                  <DeleteTwoTone />
                </Popconfirm>
              </Tooltip>
            </div>
          )}
        />
      </Table>
    </>
  );
};

export default TemplateTable;
