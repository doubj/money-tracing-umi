import EmptyDataInfo from '@/components/EmptyDataInfo/EmptyDataInfo';
import { RecordType } from '@/services/transactions';
import { currencyFormat } from '@/utils/utility';
import React, { useEffect } from 'react';
import echarts from './echartsService';
import styles from './index.less';

interface BarChartCardProps {
  records: RecordType[];
  title: string;
}

const BarChartCard: React.FC<BarChartCardProps> = (props) => {
  const { records, title } = props;
  const option = {
    legend: {},
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        const format = currencyFormat('decimal');
        const { seriesName, marker, value } = params;
        // 返回的value是数组 [dateMonth, incomeTotal, expenseTotal]
        const idx = seriesName === '收入' ? 1 : 2;
        return `${seriesName} <br>${marker} ${value[0]}：${format.format(
          value[idx],
        )}`;
      },
    },
    dataset: {
      source: [['', 0]],
    },
    xAxis: { type: 'category' },
    yAxis: {
      axisLabel: {
        formatter: '¥{value}',
      },
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{ type: 'bar' }, { type: 'bar' }],
  };
  let myChart: any = null;

  const renderChart = () => {
    if (!document.getElementById('barChart')) {
      return;
    }
    const chart = echarts.getInstanceByDom(
      document.getElementById('barChart') as HTMLElement,
    );
    if (chart) {
      myChart = chart;
    } else {
      myChart = echarts.init(
        document.getElementById('barChart') as HTMLElement,
      );
    }
    myChart.setOption(option);
  };

  const initBarChartData = () => {
    const res: (string | number)[][] = [['product', '收入', '支出']];
    const dateArr: string[] = [];
    const incomeArr: number[] = [];
    const expenseArr: number[] = [];
    records.forEach((data) => {
      const {
        category: { type },
        price,
        date,
      } = data;
      const xString = (date as string).substr(0, 7);
      const idx = dateArr.findIndex((item) => item === xString);
      if (idx > -1) {
        // 如果该时间已存在，更新对应下表的收入与支出值
        incomeArr[idx] += type === 'income' ? price || 0 : 0;
        expenseArr[idx] += type === 'expense' ? price || 0 : 0;
      } else {
        dateArr.push(xString);
        incomeArr.push(type === 'income' ? price || 0 : 0);
        expenseArr.push(type === 'expense' ? price || 0 : 0);
      }
    });
    const restArr = dateArr.map((_, idx) => [
      dateArr[idx],
      incomeArr[idx],
      expenseArr[idx],
    ]);
    option.dataset.source = res.concat(restArr.reverse());
  };

  useEffect(() => {
    if (records.length > 0) {
      initBarChartData();
      renderChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  return (
    <>
      <div className={styles.barChartContainer}>
        <div>{title}</div>
        {records.length > 0 ? (
          <div
            style={{ width: '90%', height: '100%', marginLeft: '5%' }}
            id="barChart"
          ></div>
        ) : (
          <EmptyDataInfo title={'交易列表为空，快去记录一条交易吧！'} />
        )}
      </div>
    </>
  );
};

export default BarChartCard;
