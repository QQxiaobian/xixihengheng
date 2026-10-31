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

// 根据文章 ID 获取文章详情
exports.main = async (event, context) => {
  const { id } = event;
  if (!id) {
    return {
      code: -1,
      message: '缺少文章 ID'
    };
  }

  try {
    const { data } = await db.collection('articles').doc(id).get();
    return {
      code: 0,
      data: {
        ...data,
        createTime: formatTime(data.createTime),
        updateTime: formatTime(data.updateTime)
      }
    };
  } catch (err) {
    return {
      code: -1,
      message: err.message
    };
  }
};
