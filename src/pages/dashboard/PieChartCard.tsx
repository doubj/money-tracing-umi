import React, { useEffect } from 'react';
import echarts from './echartsService';
import { currencyFormat, percentFormat } from '@/utils/utility';
import { RecordType } from '@/services/transactions';
import { CategoryType } from '@/services/categories';
import dayjs from 'dayjs';
import styles from './index.less';
import PageLoading from '@/components/PageLoading';

function getTotal(datas: { name: string; value: number }[]) {
  let sum = 0;
  datas.forEach(({ name, value }) => (sum += value));
  return sum;
}

function genLegendFormatter(
  data: { name: string; value: number }[],
  total: number,
  key: string,
) {
  if (data.length === 0) {
    return;
  }
  const { name, value } = data.find((data) => data.name === key) as {
    name: string;
    value: number;
  };
  return `${name}  ${currencyFormat().format(value)}  ${percentFormat.format(
    value / total,
  )}`;
}

interface PieChartCardProps {
  records: RecordType[];
  categories: CategoryType[];
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  onClick: (params: any) => void;
  loading: boolean;
}

const PieChartCard: React.FC<PieChartCardProps> = (props) => {
  const { records, categories, dateRange, onClick, loading } = props;
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        const format = currencyFormat('decimal');
        const { seriesName, marker, data, percent } = params;
        return `${seriesName} <br>${marker} ${data.name}：${format.format(
          data.value,
        )} (${percent}%)`;
      },
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      formatter: function (name: string) {
        return name;
      },
      textStyle: {
        fontSize: 16,
      },
      right: 100,
      top: 100,
    },
    series: [
      {
        name: '分类',
        type: 'pie',
        // radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: [{ name: '', value: 0 }],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  const dateFormatter = 'YYYY/MM/DD';
  let myChart: any = null;

  const initPieChartData = () => {
    const categoryArr: string[] = [];
    const priceArr: number[] = [];
    records.forEach((data) => {
      if (data.category?.type === 'income') {
        return;
      }
      const {
        category: { name },
        price,
      } = data;
      const idx = categoryArr.findIndex((item) => item === name);
      if (idx > -1) {
        // 如果该分类已存在
        priceArr[idx] = priceArr[idx] + (price || 0);
      } else {
        categoryArr.push(name || '');
        priceArr.push(price || 0);
      }
    });
    const data = categoryArr.map((name, idx) => {
      return {
        name,
        value: priceArr[idx],
      };
    });
    const total = getTotal(data);
    option.legend.formatter = (name: string) => {
      return genLegendFormatter(data, total, name) || '';
    };
    option.series[0].data = data;
  };

  const renderChart = () => {
    if (!document.getElementById('pieChart')) {
      return;
    }
    const chart = echarts.getInstanceByDom(
      document.getElementById('pieChart') as HTMLElement,
    );
    if (chart) {
      myChart = chart;
    } else {
      myChart = echarts.init(
        document.getElementById('pieChart') as HTMLElement,
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

  useEffect(() => {
    if (records.length > 0 && categories.length > 0) {
      initPieChartData();
      renderChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, categories]);

  return (
    <>
      <div className={styles.pieChartContainer}>
        <div>所有支出</div>
        <div style={{ marginTop: '5px', color: '#9d9d9d', fontSize: '13px' }}>
          {`${dateRange[0].format(dateFormatter)} - ${dateRange[1].format(
            dateFormatter,
          )}`}
        </div>
        {loading ? (
          <PageLoading />
        ) : (
          <div
            style={{ width: '80%', height: '90%', marginLeft: '10%' }}
            id="pieChart"
          ></div>
        )}
      </div>
    </>
  );
};

export default PieChartCard;
