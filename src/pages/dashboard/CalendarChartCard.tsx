import React, { useEffect } from 'react';
import EmptyDataInfo from '@/components/EmptyDataInfo/EmptyDataInfo';
import echarts from './echartsService';
import { currencyFormat } from '@/utils/utility';
import { RecordType } from '@/services/transactions';
import { CategoryType } from '@/services/categories';
import dayjs from 'dayjs';
import styles from './index.less';

interface CalendarChartCardProps {
  records: RecordType[];
  categories: CategoryType[];
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  onClick: (params: any) => void;
}

const cellSize = [80, 80];
const pieRadius = 30;
const dateFormatter = 'YYYY/MM/DD';

const CalendarChartCard: React.FC<CalendarChartCardProps> = (props) => {
  const { records, categories, onClick, dateRange } = props;
  const dateRangeStr = [
    dateRange[0].format(dateFormatter),
    dateRange[1].format(dateFormatter),
  ];
  const pieCalendar = dateRange[1].diff(dateRange[0], 'day') < 100;
  const pieCalenderOption = {
    tooltip: {},
    legend: {
      data: [''],
      top: 20,
    },
    calendar: {
      top: 80,
      left: 'center',
      cellSize: cellSize,
      yearLabel: {
        show: false,
        fontSize: 30,
      },
      dayLabel: {
        margin: 20,
        firstDay: 1,
        nameMap: 'cn',
      },
      monthLabel: {
        nameMap: 'cn',
      },
      range: dateRangeStr,
    },
    series: [
      {
        id: 'label',
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
          show: true,
          formatter: function (params: any) {
            return params.value[0].substring(5);
          },
          offset: [-cellSize[0] / 2 + 20, -cellSize[1] / 2 + 10],
          fontSize: 12,
        },
        data: [['', 0]],
      },
    ],
  };
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        const format = currencyFormat('decimal');
        const { data, marker } = params;
        return `${marker} ${data[0]}：${format.format(data[1])}`;
      },
    },
    visualMap: {
      min: 0,
      max: 200,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 20,
    },
    calendar: {
      top: 80,
      left: 'center',
      cellSize: [20, 20],
      range: dateRangeStr,
      itemStyle: {
        borderWidth: 0.5,
      },
      dayLabel: {
        margin: 10,
        nameMap: 'cn',
      },
      monthLabel: {
        nameMap: 'cn',
      },
      yearLabel: { show: false },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: [['', 0]],
    },
  };

  let myChart: any = null;

  const renderChart = () => {
    if (!document.getElementById('calendarChart')) {
      return;
    }
    const chart = echarts.getInstanceByDom(
      document.getElementById('calendarChart') as HTMLElement,
    );
    if (chart) {
      myChart = chart;
    } else {
      myChart = echarts.init(
        document.getElementById('calendarChart') as HTMLElement,
      );
    }
    myChart.clear();
    myChart.setOption(pieCalendar ? pieCalenderOption : option);
    if (
      myChart &&
      (!myChart._$handlers || myChart._$handlers.click.length === 0)
    ) {
      // 防止绑定多个click事件
      myChart.on('click', onClick);
    }
  };

  const initCalendarChartData = () => {
    const dataMap: { [date: string]: number } = {};
    const categoryNameArr: string[] = [];
    records.forEach((record) => {
      const {
        date,
        price,
        category: { type, name },
      } = record;
      if (type !== 'expense') {
        return;
      }
      if (!categoryNameArr.includes(name as string)) {
        categoryNameArr.push(name as string);
      }
      dataMap[date as string] =
        (dataMap[date as string] ? dataMap[date as string] : 0) + (price || 0);
    });
    const data = Object.keys(dataMap).map((key) => [key, dataMap[key]]);
    if (pieCalendar) {
      pieCalenderOption.series[0].data = data;
      pieCalenderOption.legend.data = categoryNameArr;
      setTimeout(function () {
        myChart.setOption({
          series: getPieSeries(data as [[string, number]], myChart),
        });
      }, 10);
    } else {
      let max = data[0][1] as number;
      data.forEach((item) => {
        max = Math.max(max, item[1] as number);
      });
      option.series.data = data;
      option.visualMap.max = Math.ceil(max / 1000) * 1000;
    }
  };

  const getPieSeries = (calendarData: [[string, number]], myChart: any) => {
    return calendarData.map((item, index) => {
      const dailyDataMap = records
        .filter(
          (record) =>
            record.date === item[0] && record.category.type === 'expense',
        )
        .reduce((map: { [key: string]: number }, item: RecordType) => {
          map[item.category.id] =
            (map[item.category.id] ? map[item.category.id] : 0) +
            (item.price || 0);
          return map;
        }, {});
      const dailyData = Object.keys(dailyDataMap).map((cid) => {
        const category = categories.find((c) => c.id === cid);
        return {
          name: category?.name,
          expenseType: category?.type,
          date: item[0],
          total: item[1],
          value: dailyDataMap[cid],
        };
      });
      const center = myChart.convertToPixel('calendar', item);
      return {
        id: index + 'pie',
        type: 'pie',
        center: center,
        label: {
          normal: {
            formatter: '{c}',
            position: 'inside',
          },
        },
        radius: pieRadius,
        data: dailyData,
      };
    });
  };

  useEffect(() => {
    if (records.length > 0 && categories.length > 0) {
      initCalendarChartData();
      renderChart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, categories]);

  return (
    <>
      <div
        className={styles.calendarChartContainer}
        style={{ height: pieCalendar ? 800 : 400 }}
      >
        <div>支出明细</div>
        <div style={{ marginTop: '5px', color: '#9d9d9d', fontSize: '13px' }}>
          {`${dateRangeStr[0]} - ${dateRangeStr[1]}`}
        </div>
        {records.length > 0 ? (
          <div
            style={{ width: '100%', height: '90%' }}
            id="calendarChart"
          ></div>
        ) : (
          <EmptyDataInfo title={'还没有任何一项支出哦！快去添加一项支出吧！'} />
        )}
      </div>
    </>
  );
};

export default CalendarChartCard;
