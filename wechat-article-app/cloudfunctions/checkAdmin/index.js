const cloud = require('wx-server-sdk');

// 初始化云开发环境，请将 env 替换为你的云开发环境 ID
cloud.init({
  env: 'your-env-id'
});

// 管理员 openid 列表，请替换为实际管理员 openid
const adminOpenIds = ['oXXXXXXXXXXXXXXXXXXXXXXXXX'];

// 校验当前用户是否为管理员
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  return {
    openid: OPENID,
    isAdmin: adminOpenIds.includes(OPENID)
  };
};
