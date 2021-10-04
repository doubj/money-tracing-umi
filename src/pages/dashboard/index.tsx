import React, { useState } from 'react';
import { DatePicker } from '@/components/AntdReset/index';
import PieChartCard from './PieChartCard';
import LineChartCard from './LineChartCard';
import BarChartCard from './BarChartCard';
import NumberCards from './NumberCards';
import CalendarChartCard from './CalendarChartCard';
import { getRecords, RecordType } from '@/services/transactions';
import dayjs from 'dayjs';
import useMount from '@/utils/use-mount';
import RecordListModal from '@/components/RecordListModal/RecordListModal';
import useCategory from '@/utils/use-category';
import styles from './index.less';
import useAsync from '@/utils/use-async';
import DailyExpenseChartCard from './DailyExpenseChartCard';

const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const { categories } = useCategory();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(3, 'months'),
    dayjs(),
  ]);
  const [listVisible, setListVisible] = useState(false);
  const [listRecords, setListRecords] = useState<RecordType[]>([]);
  const [listTitle, setListTitle] = useState('');
  const { run, isLoading } = useAsync<{ list: RecordType[] }>();

  const initData = async (date = dateRange) => {
    const dateFormatter = 'YYYY-MM-DD';
    const dateMin = date[0].format(dateFormatter);
    const dateMax = dayjs(date[1].valueOf())
      .add(1, 'days')
      .format(dateFormatter);
    const result = await run(
      getRecords({ date_$gte: dateMin, date_$lt: dateMax }),
    );
    if (result) {
      setRecords(result.list);
    }
  };

  useMount(() => {
    initData();
  });

  const showRecordsByCategoryName = (params: any) => {
    const { name } = params;
    setListTitle(name);
    setListRecords(records.filter((record) => record.category?.name === name));
    setListVisible(true);
  };

  const showRecordsByDate = (params: any) => {
    const { componentSubType, data } = params;
    if (componentSubType === 'heatmap') {
      setListTitle(`${data[0]}，消费：${data[1]}元`);
      // TODO: 魔法值
      setListRecords(
        records.filter(
          (record) =>
            record.date === data[0] && record.category.type === 'expense',
        ),
      );
    }
    if (componentSubType === 'pie') {
      const { name, date } = data;
      setListTitle(`${name}(${date})`);
      setListRecords(
        records.filter(
          (record) => record.date === date && record.category.name === name,
        ),
      );
    }
    if (componentSubType === 'line') {
      const { name: date } = params;
      setListTitle(`${date}日总支出`);
      setListRecords(
        records.filter(
          (record) =>
            record.date === date && record.category.type === 'expense',
        ),
      );
    }
    setListVisible(true);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current > dayjs().endOf('day');
  };

  return (
    <>
      <RangePicker
        disabledDate={disabledDate}
        className={styles.datePicker}
        allowClear={false}
        defaultValue={dateRange}
        ranges={{
          今天: [dayjs(), dayjs()],
          最近一周: [dayjs().subtract(7, 'days'), dayjs()],
          最近一个月: [dayjs().subtract(1, 'months'), dayjs()],
          最近三个月: [dayjs().subtract(3, 'months'), dayjs()],
          最近半年: [dayjs().subtract(6, 'months'), dayjs()],
          最近一年: [dayjs().subtract(1, 'years'), dayjs()],
        }}
        onChange={(values) => {
          setDateRange(values as [dayjs.Dayjs, dayjs.Dayjs]);
          initData(values as [dayjs.Dayjs, dayjs.Dayjs]);
        }}
      />
      <NumberCards records={records} />
      <DailyExpenseChartCard
        loading={isLoading}
        records={records}
        dateRange={dateRange}
        onClick={showRecordsByDate}
      />
      <PieChartCard
        loading={isLoading}
        onClick={showRecordsByCategoryName}
        dateRange={dateRange}
        records={records}
        categories={categories}
      />
      {dateRange[1].diff(dateRange[0], 'day') > 28 && (
        <CalendarChartCard
          loading={isLoading}
          onClick={showRecordsByDate}
          dateRange={dateRange}
          records={records}
          categories={categories}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <LineChartCard loading={isLoading} title={'月结余'} records={records} />
        <BarChartCard loading={isLoading} title={'收支比'} records={records} />
      </div>
      <RecordListModal
        visible={listVisible}
        datas={listRecords}
        title={listTitle}
        onCancel={() => setListVisible(false)}
      />
    </>
  );
};

export default Dashboard;
