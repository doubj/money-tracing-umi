import EmptyDataInfo from '@/components/EmptyDataInfo/EmptyDataInfo';
import { RecordType } from '@/services/transactions';
import { currencyFormat } from '@/utils/utility';
import React, { useEffect } from 'react';
import echarts from './echartsService';
import styles from './index.less';

interface LineChartCardProps {
  records: RecordType[];
  title: string;
}
const LineChartCard: React.FC<LineChartCardProps> = (props) => {
  const { records, title } = props;
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any[]) {
        const format = currencyFormat('decimal');
        let res = '';
        params.forEach((item) => {
          res += `${item.marker} ${item.axisValue}  ${format.format(
            item.value,
          )}`;
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
        areaStyle: {},
      },
    ],
  };
  let myChart: any = null;

  const renderChart = () => {
    if (!document.getElementById('lineChart')) {
      // records.length > 0 div有可能还未render
      return;
    }
    const chart = echarts.getInstanceByDom(
      document.getElementById('lineChart') as HTMLElement,
    );
    if (chart) {
      myChart = chart;
    } else {
      myChart = echarts.init(
        document.getElementById('lineChart') as HTMLElement,
      );
    }
    myChart.setOption(option);
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
      const xString = (date as string).substr(0, 7);
      const calcPrice = type === 'expense' ? -(price || 0) : +(price || 0);
      const idx = xData.findIndex((item) => item === xString);
      if (idx > -1) {
        // 当前已有该月份，更新当前月份的可用资金
        yData[idx] += calcPrice;
      } else {
        xData.push(xString);
        yData.push(calcPrice);
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

  return (
    <>
      <div className={styles.lineChartContainer}>
        <div>{title}</div>
        {records.length > 0 ? (
          <div
            style={{ width: '90%', height: '100%', marginLeft: '5%' }}
            id="lineChart"
          ></div>
        ) : (
          <EmptyDataInfo title={'交易列表为空，快去记录一条交易吧！'} />
        )}
      </div>
    </>
  );
};

export default LineChartCard;
