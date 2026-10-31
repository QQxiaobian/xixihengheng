const cloud = require('wx-server-sdk');

// 初始化云开发环境，请将 env 替换为你的云开发环境 ID
cloud.init({
  env: 'your-env-id'
});

const db = cloud.database();

// 管理员 openid 列表，请替换为实际管理员 openid
const adminOpenIds = ['oXXXXXXXXXXXXXXXXXXXXXXXXX'];

// 发布或更新文章（仅管理员可操作）
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  if (!adminOpenIds.includes(OPENID)) {
    return {
      code: -1,
      message: '无权限操作'
    };
  }

  const { id, title, summary, coverImage, content, isAdUnlock } = event;

  if (!title || !content) {
    return {
      code: -1,
      message: '标题和正文不能为空'
    };
  }

  try {
    const now = db.serverDate();

    if (id) {
      // 更新文章
      await db.collection('articles').doc(id).update({
        data: {
          title,
          summary,
          coverImage,
          content,
          isAdUnlock,
          updateTime: now
        }
      });
      return {
        code: 0,
        message: '更新成功'
      };
    } else {
      // 新增文章
      const result = await db.collection('articles').add({
        data: {
          title,
          summary,
          coverImage,
          content,
          isAdUnlock,
          createTime: now,
          updateTime: now
        }
      });
      return {
        code: 0,
        message: '发布成功',
        id: result._id
      };
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message
    };
  }
};
