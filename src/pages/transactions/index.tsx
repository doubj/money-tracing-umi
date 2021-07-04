import React, { useState, useRef } from 'react';
import useMount from '@/utils/use-mount';
import EditModal from '@/components/EditModal/EditModal';
import RecordListTop from './RecordListTop';
import {
  getRecords,
  createRecord,
  modifyRecord,
  deleteRecords,
} from '@/services/transactions';
import RecordTable from './RecordTable';
import RecordListHeader from './RecordListHeader';
import { PaginationProps, message } from 'antd';
import { RecordType } from '@/services/transactions';
import { Dayjs } from 'dayjs';
import useCategory from '@/utils/use-category';
import SearchModal from '@/components/SearchModal/SearchModal';

const Transactions: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<RecordType | {}>({});
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: (page: number, pageSize: number | undefined) => {
      pagination.current = page;
      pagination.pageSize = pageSize;
      getExpenseList();
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { categories } = useCategory();
  const [records, setRecords] = useState<RecordType[]>([]);
  const query = useRef<{ [key: string]: unknown }>({});

  useMount(() => {
    getExpenseList();
  });

  const getExpenseList = async (page?: number) => {
    setIsLoading(true);
    const { current, pageSize } = pagination;
    const results = await getRecords({
      _page: page || current,
      _limit: pageSize,
      ...query.current,
    });
    if (results) {
      pagination.total = results.total;
      pagination.current = page || current;
      setPagination(pagination);
      setRecords(results.list);
      setIsLoading(false);
    }
  };

  const selectRow = (record: RecordType) => {
    const keys = [...selectedRowKeys];
    const { id } = record as { id: string };
    if (keys.indexOf(id) >= 0) {
      keys.splice(keys.indexOf(id), 1);
    } else {
      keys.push(id);
    }
    setSelectedRowKeys(keys);
  };

  const handleSearch = (search: any) => {
    query.current = { ...search };
    getExpenseList(1);
  };

  const openEditModalByCreate = () => {
    setEditRecord({});
    setEditVisible(true);
  };

  const addRecord = async (record: RecordType) => {
    setIsLoading(true);
    record.timestamp = +new Date();
    record.date = (record.date as Dayjs).format('YYYY-MM-DD');
    const result = await createRecord(record);
    if (result) {
      setRecords([result, ...records]);
      message.success('添加成功！');
    }
    setEditRecord({});
    setIsLoading(false);
  };
  const updateRecord = async (record: RecordType) => {
    setIsLoading(true);
    record.date = (record.date as Dayjs).format('YYYY-MM-DD');
    await modifyRecord(record);
    const idx = records.findIndex((r) => r.id === record.id);
    const recordsNew = [...records];
    recordsNew[idx] = record;
    setRecords(recordsNew);
    message.success('更新成功！');
    setIsLoading(false);
  };

  const deleteRecord = async () => {
    setIsLoading(true);
    let ids = '';
    selectedRowKeys.forEach((id) => (ids += id + ','));
    await deleteRecords(ids.substring(0, ids.length - 1));
    message.success('删除成功！');
    getExpenseList();
  };

  const recordTransfer = async (record: RecordType) => {
    setIsLoading(true);
    const template = {
      ...record,
      id: undefined,
      timestamp: new Date().getTime(),
    };
    // await createTemplate(template);
    message.success('生成模板成功！');
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <RecordListTop
        onCreate={openEditModalByCreate}
        onSearch={(value) => {
          query.current = { ...query.current, description_like: value };
          getExpenseList();
        }}
      />
      <div className="list-container">
        <RecordListHeader
          selectedRowKeys={selectedRowKeys}
          onSearch={() => {
            setSearchVisible(!searchVisible);
          }}
          onDelete={deleteRecord}
        />
        <RecordTable
          pagination={pagination}
          isLoading={isLoading}
          itemsWithCategory={records}
          selectedRowKeys={selectedRowKeys}
          selectChange={(keys) => {
            setSelectedRowKeys(keys);
          }}
          selectRow={selectRow}
          handleGenerate={recordTransfer}
          handleEdit={(record) => {
            setEditRecord({ ...record });
            setEditVisible(true);
          }}
        />
        <SearchModal
          searchVisible={searchVisible}
          categories={categories}
          onCancel={() => setSearchVisible(false)}
          onSearch={handleSearch}
        />
        <EditModal
          showRemark={false}
          formData={editRecord as RecordType}
          visible={editVisible}
          onCreate={(values: any) => {
            if (!values.id) {
              addRecord(values);
            } else {
              updateRecord(values);
            }
          }}
          onCancel={() => setEditVisible(false)}
        />
      </div>
    </React.Fragment>
  );
};

export default Transactions;
