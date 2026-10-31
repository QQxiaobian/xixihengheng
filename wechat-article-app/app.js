App({
  onLaunch() {
    // 初始化云开发环境，请将 env 替换为你的云开发环境 ID
    wx.cloud.init({
      env: 'your-env-id',
      traceUser: true
    });
  },

  globalData: {
    // 当前用户是否为管理员
    isAdmin: false
  }
});
