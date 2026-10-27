Page({
  data: {
    articles: [],
    isAdmin: false
  },

  onLoad() {
    this.checkAdmin();
  },

  onShow() {
    // 从编辑页返回后刷新列表
    if (this.data.isAdmin) {
      this.loadArticleList();
    }
  },

  onPullDownRefresh() {
    if (!this.data.isAdmin) {
      wx.stopPullDownRefresh();
      return;
    }
    this.loadArticleList().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 校验管理员身份，非管理员跳转回首页
  checkAdmin() {
    return wx.cloud.callFunction({
      name: 'checkAdmin'
    }).then(res => {
      const isAdmin = res.result.isAdmin;
      this.setData({ isAdmin });
      if (isAdmin) {
        this.loadArticleList();
      } else {
        wx.showModal({
          title: '无权限',
          content: '你不是管理员，无法进入管理后台',
          showCancel: false,
          success: () => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        });
      }
    }).catch(err => {
      console.error('管理员校验失败', err);
      wx.showToast({
        title: '校验失败',
        icon: 'none'
      });
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

  // 跳转到发布/编辑页
  goEdit(e) {
    const id = e.currentTarget.dataset.id || '';
    wx.navigateTo({
      url: `/pages/admin-edit/admin-edit?id=${id}`
    });
  },

  // 删除文章
  deleteArticle(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除该文章吗？删除后不可恢复',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteArticle',
            data: { id }
          }).then(() => {
            wx.showToast({
              title: '删除成功'
            });
            this.loadArticleList();
          }).catch(err => {
            wx.showToast({
              title: err.message || '删除失败',
              icon: 'none'
            });
            console.error('删除文章失败', err);
          });
        }
      }
    });
  }
});
