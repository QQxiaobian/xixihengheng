const cloud = require('wx-server-sdk');

// 初始化云开发环境，请将 env 替换为你的云开发环境 ID
cloud.init({
  env: 'your-env-id'
});

const db = cloud.database();

// 格式化日期为 yyyy-MM-dd HH:mm
function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = n => (n < 10 ? '0' + n : n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// 获取文章列表，按创建时间倒序排列
exports.main = async (event, context) => {
  try {
    const { data } = await db.collection('articles')
      .orderBy('createTime', 'desc')
      .get();

    const list = data.map(item => ({
      ...item,
      createTime: formatTime(item.createTime),
      updateTime: formatTime(item.updateTime)
    }));

    return {
      code: 0,
      data: list
    };
  } catch (err) {
    return {
      code: -1,
      message: err.message
    };
  }
};
