import * as echarts from 'echarts/core';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import {
  BarChart,
  HeatmapChart,
  ScatterChart,
  LineChart,
  PieChart,
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  TitleComponent,
  CalendarComponent,
  VisualMapComponent,
  HeatmapChart,
  ScatterChart,
  LineChart,
  PieChart,
]);

export default echarts;
