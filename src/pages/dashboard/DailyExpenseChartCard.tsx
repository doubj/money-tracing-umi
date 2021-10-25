import { RecordType } from '@/services/transactions';
import styles from './index.less';
import echarts from './echartsService';
import PageLoading from '@/components/PageLoading';
import { currencyFormat } from '@/utils/utility';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';

interface DailyExpenseChartCardProps {
  records: RecordType[];
  loading: boolean;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  onClick: (params: any) => void;
}

const DailyExpenseChartCard: React.FC<DailyExpenseChartCardProps> = ({
  records,
  loading,
  dateRange,
  onClick,
}) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any[]) {
        const format = currencyFormat('decimal');
        let res = '';
        params.forEach((item) => {
          res += `${item.marker} ${item.axisValue} <br>
          日消费：${format.format(item.value)}`;
        });
        return res;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [''],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}',
      },
    },
    series: [
      {
        data: [0],
        type: 'line',
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)',
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)',
            },
          ]),
        },
      },
    ],
  };
  let myChart: any = null;

  const renderChart = () => {
    if (!document.getElementById('dailyLineChart')) {
      // records.length > 0 div有可能还未render
      return;
    }
    const chart = echarts.getInstanceByDom(
      document.getElementById('dailyLineChart') as HTMLElement,
    );
    if (chart) {
      myChart = chart;
    } else {
      myChart = echarts.init(
        document.getElementById('dailyLineChart') as HTMLElement,
      );
    }
    myChart.setOption(option);
    if (
      myChart &&
      (!myChart._$handlers || myChart._$handlers.click.length === 0)
    ) {
      // 防止绑定多个click事件
      myChart.on('click', onClick);
    }
  };

  const initLineChartData = () => {
    const xData: string[] = [];
    const yData: number[] = [];
    records.forEach((data) => {
      const {
        category: { type },
        date,
        price,
      } = data;
      if (type === 'expense') {
        const xString = (date as string).substr(0, 10);
        const idx = xData.findIndex((item) => item === xString);
        if (xData.includes(xString)) {
          yData[idx] += price;
        } else {
          xData.push(xString);
          yData.push(price);
        }
      }
    });
    option.xAxis.data = xData.reverse();
    option.series[0].data = yData.reverse();
  };

  useEffect(() => {
    if (records.length > 0) {
      initLineChartData();
      renderChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  const dateFormatter = 'YYYY/MM/DD';

  return (
    <>
      <div className={styles.dailyExpenseContainer}>
        <div>{'日消费'}</div>
        <div style={{ marginTop: '5px', color: '#9d9d9d', fontSize: '13px' }}>
          {`${dateRange[0].format(dateFormatter)} - ${dateRange[1].format(
            dateFormatter,
          )}`}
        </div>
        {loading ? (
          <PageLoading />
        ) : (
          <div
            style={{ width: '90%', height: '100%', marginLeft: '5%' }}
            id="dailyLineChart"
          ></div>
        )}
      </div>
    </>
  );
};

export default DailyExpenseChartCard;
