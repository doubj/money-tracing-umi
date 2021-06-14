import React, { useState, useEffect } from 'react';
// import { getDescriptionList } from "api/record";
import {
  Form,
  Radio,
  Row,
  Col,
  Modal,
  Input,
  InputNumber,
  AutoComplete,
} from 'antd';
import { DatePicker } from '@/components/AntdReset';
import { TemplateType } from '@/services/template';
import { RecordType } from '@/services/transactions';
import useCategory from '@/utils/use-category';
import CategoryList from '../CategoryList/CategoryList';
import dayjs from 'dayjs';

const { Option } = AutoComplete;

interface EditModalProps {
  formData: RecordType | TemplateType;
  visible: boolean;
  onCreate: (values: RecordType | TemplateType) => void;
  onCancel: () => void;
  showRemark: boolean;
}

// Record与Template共用该组件用来编辑与新增，
const EditModal: React.FC<EditModalProps> = ({
  formData,
  visible,
  onCreate,
  onCancel,
  showRemark,
}) => {
  const { options, categories } = useCategory();
  const [selectedType, setSelectedType] = useState(options[0].value);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    { description: string; id: string }[]
  >([]);
  const [form] = Form.useForm();
  const isEdit = formData.id;
  const title = isEdit ? '编辑' : '新增';
  const okText = isEdit ? '更新' : '添加';

  useEffect(() => {
    if (!isEdit) {
      formData.type = selectedType;
      formData.date = dayjs();
      formData.time = dayjs();
      const categoryList = categories.filter((c) => c.type === selectedType);
      formData.category = categoryList.length > 0 ? categoryList[0] : {};
    } else {
      formData.date = dayjs(formData.timestamp);
      formData.time = dayjs(formData.timestamp);
      formData.type = categories.find(
        (c) => c.id === formData.category?.id,
      )?.type;
    }
    if (form) {
      form.resetFields();
      form.setFieldsValue({ ...formData });
    }
  }, [formData, categories, form, isEdit, selectedType]);

  const autoCalculatePrice = () => {
    const value = form.getFieldValue('description');
    if (value.split(',') && value.split(',')[0]) {
      const express = value.split(',')[0];
      if (express.indexOf('+') !== -1) {
        // 如果包含+号
        let sum = 0;
        express.split('+').forEach((_price: string) => {
          if (+_price > 0) {
            sum += +_price;
          }
        });
        form.setFieldsValue({ ...form.getFieldsValue(), price: sum });
      }
    }
  };

  const getAutoCompleteOptions = async (value: string) => {
    const params = {
      _limit: 20,
      description_like: value,
      cid: form.getFieldValue('cid'),
    };
    // const result = await getDescriptionList(params);
    setAutoCompleteOptions([]);
    autoCalculatePrice();
  };

  return (
    <>
      <Modal
        width={800}
        title={title}
        visible={visible}
        okText={okText}
        cancelText="取消"
        onOk={() => {
          form.validateFields().then((values) => {
            onCreate(values);
          });
        }}
        onCancel={onCancel}
      >
        <Form
          form={form}
          scrollToFirstError={true}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          name="editForm"
          initialValues={formData}
        >
          <Row>
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item label="ID" name="id">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '请选择是收入还是支出!' }]}
              >
                <Radio.Group
                  options={options}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="日期"
                name="date"
                rules={[
                  { type: 'object', required: true, message: '请选择日期!' },
                ]}
              >
                <DatePicker
                  disabled={showRemark}
                  allowClear={false}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                label="分类"
                name="category"
                rules={[{ required: true, message: '请选择分类!' }]}
              >
                <CategoryList
                  categoryList={categories}
                  selectedTypes={[selectedType]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                label="金额"
                name="price"
                rules={[{ required: true, message: '请输入金额!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0.01} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                tooltip="例：1+1(自动计算金额2),具体描述"
                label="描述"
                name="description"
                rules={[{ required: true, message: '请输入具体描述!' }]}
              >
                <AutoComplete onChange={getAutoCompleteOptions}>
                  {autoCompleteOptions.map((option) => {
                    return (
                      <Option key={option.id} value={option.description}>
                        {option.description}
                      </Option>
                    );
                  })}
                </AutoComplete>
              </Form.Item>
            </Col>
            {showRemark && (
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  label="备注"
                  name="remark"
                >
                  <Input />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default EditModal;
