const cloud = require('wx-server-sdk');

// 初始化云开发环境，请将 env 替换为你的云开发环境 ID
cloud.init({
  env: 'your-env-id'
});

const db = cloud.database();

// 检查和记录用户对文章的解锁状态
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { articleId, action = 'unlock' } = event;

  if (!articleId || !OPENID) {
    return {
      code: -1,
      message: '参数错误'
    };
  }

  try {
    // 查询是否已解锁
    const unlockRecord = await db.collection('unlocks')
      .where({
        openid: OPENID,
        articleId
      })
      .get();

    const alreadyUnlocked = unlockRecord.data.length > 0;

    // 仅查询模式，不写入记录
    if (action === 'check') {
      return {
        code: 0,
        unlocked: alreadyUnlocked
      };
    }

    if (alreadyUnlocked) {
      return {
        code: 0,
        unlocked: true
      };
    }

    // 未解锁则新增解锁记录
    await db.collection('unlocks').add({
      data: {
        openid: OPENID,
        articleId,
        unlockTime: db.serverDate()
      }
    });

    return {
      code: 0,
      unlocked: true
    };
  } catch (err) {
    return {
      code: -1,
      message: err.message
    };
  }
};
