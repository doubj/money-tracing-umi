// intl兼容性不太好
// 返回货币转换工具，默认为带¥千分隔保留2味的数据, style = decimal不带前缀
export const currencyFormat = (style = 'currency') => {
  return Intl.NumberFormat('zh-Hans-CN', {
    style,
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
export const percentFormat = Intl.NumberFormat('zh-Hans-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
