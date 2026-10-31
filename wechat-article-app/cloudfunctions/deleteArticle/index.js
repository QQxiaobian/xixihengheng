const cloud = require('wx-server-sdk');

// 初始化云开发环境，请将 env 替换为你的云开发环境 ID
cloud.init({
  env: 'your-env-id'
});

const db = cloud.database();

// 管理员 openid 列表，请替换为实际管理员 openid
const adminOpenIds = ['oXXXXXXXXXXXXXXXXXXXXXXXXX'];

// 删除文章（仅管理员可操作）
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  if (!adminOpenIds.includes(OPENID)) {
    return {
      code: -1,
      message: '无权限操作'
    };
  }

  const { id } = event;
  if (!id) {
    return {
      code: -1,
      message: '缺少文章 ID'
    };
  }

  try {
    await db.collection('articles').doc(id).remove();
    return {
      code: 0,
      message: '删除成功'
    };
  } catch (err) {
    return {
      code: -1,
      message: err.message
    };
  }
};
