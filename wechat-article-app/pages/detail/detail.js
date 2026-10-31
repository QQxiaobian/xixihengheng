const app = getApp();

Page({
  data: {
    articleId: '',
    article: {},
    isAdmin: false,
    unlocked: false,
    showFull: false
  },

  rewardedVideoAd: null,

  onLoad(options) {
    const id = options.id || '';
    this.setData({ articleId: id });
    this.initRewardedVideoAd();
    this.checkAdmin().then(() => {
      this.loadArticleDetail(id);
    });
  },

  onUnload() {
    if (this.rewardedVideoAd) {
      this.rewardedVideoAd.offClose();
      this.rewardedVideoAd.offError();
    }
  },

  // 初始化激励视频广告（只创建一次）
  initRewardedVideoAd() {
    if (!wx.createRewardedVideoAd) {
      return;
    }
    this.rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: 'your-ad-unit-id' // 替换为你的激励视频广告位 ID
    });

    this.rewardedVideoAd.onError(err => {
      wx.showToast({
        title: '广告加载失败',
        icon: 'none'
      });
      console.error('广告加载失败', err);
    });

    this.rewardedVideoAd.onClose(res => {
      if (res && res.isEnded) {
        this.doUnlock();
      } else {
        wx.showToast({
          title: '需要完整观看才能解锁',
          icon: 'none'
        });
      }
    });
  },

  // 检查管理员身份
  checkAdmin() {
    return wx.cloud.callFunction({
      name: 'checkAdmin'
    }).then(res => {
      const isAdmin = res.result.isAdmin;
      this.setData({ isAdmin });
      app.globalData.isAdmin = isAdmin;
      this.updateShowFull();
    }).catch(err => {
      console.error('管理员校验失败', err);
    });
  },

  // 获取文章详情
  loadArticleDetail(id) {
    return wx.cloud.callFunction({
      name: 'getArticleDetail',
      data: { id }
    }).then(res => {
      const article = res.result.data || {};
      this.setData({ article });
      if (article.isAdUnlock && !this.data.isAdmin) {
        this.checkUnlockStatus();
      } else {
        this.updateShowFull();
      }
    }).catch(err => {
      wx.showToast({
        title: '加载详情失败',
        icon: 'none'
      });
      console.error('加载文章详情失败', err);
    });
  },

  // 查询当前用户是否已解锁该文章
  checkUnlockStatus() {
    return wx.cloud.callFunction({
      name: 'unlockArticle',
      data: { articleId: this.data.articleId, action: 'check' }
    }).then(res => {
      this.setData({ unlocked: res.result.unlocked });
      this.updateShowFull();
    }).catch(err => {
      console.error('查询解锁状态失败', err);
      this.updateShowFull();
    });
  },

  // 根据广告解锁状态与管理员身份判断是否显示全文
  updateShowFull() {
    const { article, unlocked, isAdmin } = this.data;
    const showFull = !article.isAdUnlock || unlocked || isAdmin;
    this.setData({ showFull });
  },

  // 观看激励视频广告解锁全文
  watchAd() {
    if (!this.rewardedVideoAd) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本不支持激励视频广告',
        showCancel: false
      });
      return;
    }

    this.rewardedVideoAd.show().catch(() => {
      this.rewardedVideoAd.load().then(() => this.rewardedVideoAd.show());
    });
  },

  // 调用云函数记录解锁状态
  doUnlock() {
    wx.cloud.callFunction({
      name: 'unlockArticle',
      data: { articleId: this.data.articleId, action: 'unlock' }
    }).then(res => {
      if (res.result.unlocked) {
        wx.showToast({
          title: '解锁成功',
          icon: 'success'
        });
        this.setData({ unlocked: true });
        this.updateShowFull();
      }
    }).catch(err => {
      wx.showToast({
        title: '解锁失败',
        icon: 'none'
      });
      console.error('解锁失败', err);
    });
  }
});
