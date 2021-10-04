import { Button, Modal, Space, Table } from 'antd';
import { getTemplates, TemplateType } from '@/services/template';
import useMount from '@/utils/use-mount';
import { useState } from 'react';
import { currencyFormat, IconFont } from '@/utils/utility';

interface TemplateChooseModalProps {
  visible: boolean;
  onChoose: (template: TemplateType) => void;
  onCancel: () => void;
}

const { Column } = Table;

const TemplateChooseModal: React.FC<TemplateChooseModalProps> = ({
  visible,
  onChoose,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const [templateList, setTemplateList] = useState<TemplateType[]>([]);

  useMount(async () => {
    setLoading(true);
    const results = await getTemplates({
      _page: 1,
      _limit: 1000,
    });
    setLoading(false);
    setTemplateList(results.list);
  });

  return (
    <Modal
      width={1024}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="选择模板"
    >
      <Table
        style={{ marginTop: 20 }}
        loading={loading}
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
            <Button type="primary" onClick={() => onChoose(template)}>
              选择
            </Button>
          )}
        />
      </Table>
    </Modal>
  );
};

export default TemplateChooseModal;
