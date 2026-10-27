// 简单工具函数

/**
 * 格式化日期为 yyyy-MM-dd HH:mm
 */
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hour = padZero(date.getHours());
  const minute = padZero(date.getMinutes());
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

const padZero = (num) => {
  return num < 10 ? '0' + num : num;
};

module.exports = {
  formatTime
};
