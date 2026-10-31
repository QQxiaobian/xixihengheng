const app = getApp();

Page({
  data: {
    articles: [],
    isAdmin: false
  },

  onLoad() {
    this.loadArticleList();
    this.checkAdmin();
  },

  // 下拉刷新
  onPullDownRefresh() {
    Promise.all([this.loadArticleList(), this.checkAdmin()]).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载文章列表
  loadArticleList() {
    return wx.cloud.callFunction({
      name: 'getArticles'
    }).then(res => {
      this.setData({
        articles: res.result.data || []
      });
    }).catch(err => {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      console.error('加载文章列表失败', err);
    });
  },

  // 检查当前用户是否为管理员
  checkAdmin() {
    return wx.cloud.callFunction({
      name: 'checkAdmin'
    }).then(res => {
      const isAdmin = res.result.isAdmin;
      this.setData({ isAdmin });
      app.globalData.isAdmin = isAdmin;
    }).catch(err => {
      console.error('管理员校验失败', err);
    });
  },

  // 跳转到文章详情
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 跳转到管理后台
  goAdmin() {
    wx.navigateTo({
      url: '/pages/admin/admin'
    });
  }
});
