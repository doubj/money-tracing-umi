import { message, PaginationProps } from 'antd';
import React, { useRef, useState } from 'react';
import TemplateTable from './TemplateTable';
import TemplateTableHeader from './TemplateTableHeader';
import {
  createTemplate,
  deleteTemplate,
  getTemplates,
  modifyTemplate,
  TemplateType,
} from '@/services/template';
import useCategory from '@/utils/use-category';
import useMount from '@/utils/use-mount';
import EditModal from '@/components/EditModal/EditModal';
import { createRecord } from '@/services/transactions';
import dayjs from 'dayjs';

const Templates: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: (page: number, pageSize: number | undefined) => {
      pagination.current = page;
      pagination.pageSize = pageSize;
      getTemplateList();
    },
  });
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [editVisible, setEditVisible] = useState(false);
  const [editTemplate, setEditTemplate] = useState<TemplateType>({});

  const query = useRef<{ [key: string]: unknown }>({});

  useMount(() => {
    getTemplateList();
  });

  const getTemplateList = async () => {
    setIsLoading(true);
    const { current, pageSize } = pagination;
    const results = await getTemplates({
      _page: current,
      _limit: pageSize,
      ...query.current,
    });
    pagination.total = results.total;
    setPagination(pagination);
    setTemplates(results.list);
    setIsLoading(false);
  };

  const handleGenerate = async (template: TemplateType) => {
    setIsLoading(true);
    const timestamp = new Date().getTime();
    const date = dayjs().format('YYYY-MM-DD');
    const record = { ...template, id: undefined, timestamp, date };
    await createRecord(record);
    message.success('成功生成一条交易记录！');
    setIsLoading(false);
  };

  const addTemplate = async (template: TemplateType) => {
    setIsLoading(true);
    template.timestamp = +new Date();
    const result = await createTemplate(template);
    setTemplates([result, ...templates]);
    setEditTemplate({});
    message.success('添加成功！');
    setIsLoading(false);
  };
  const updateTemplate = async (template: TemplateType) => {
    setIsLoading(true);
    await modifyTemplate(template);
    const idx = templates.findIndex((r) => r.id === template.id);
    const templatesNew = [...templates];
    templatesNew[idx] = template;
    setTemplates(templatesNew);
    message.success('更新成功！');
    setIsLoading(false);
  };

  const handleDeleteTemplate = async (template: TemplateType) => {
    setIsLoading(true);
    await deleteTemplate(template.id as string);
    message.success('删除成功！');
    getTemplateList();
  };

  return (
    <>
      <div className="list-container">
        <TemplateTableHeader
          onQuery={(searchQuery: { [key: string]: unknown }) => {
            console.log(searchQuery);
            query.current = { ...searchQuery };
            getTemplateList();
          }}
          onCreate={() => {
            setEditVisible(true);
          }}
        />
        <EditModal
          showRemark={true}
          formData={editTemplate}
          visible={editVisible}
          onCreate={(values: any) => {
            if (!values.id) {
              addTemplate(values);
            } else {
              updateTemplate(values);
            }
          }}
          onCancel={() => setEditVisible(false)}
        />
        <TemplateTable
          isLoading={isLoading}
          pagination={pagination}
          templateList={templates}
          onGenerate={handleGenerate}
          onDelete={(template: TemplateType) => handleDeleteTemplate(template)}
          onEdit={(template: TemplateType) => {
            setEditTemplate({ ...template });
            setEditVisible(true);
          }}
        />
      </div>
    </>
  );
};

export default Templates;
