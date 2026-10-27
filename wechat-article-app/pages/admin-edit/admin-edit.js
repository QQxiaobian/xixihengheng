Page({
  data: {
    articleId: '',
    form: {
      title: '',
      summary: '',
      coverImage: '',
      content: '',
      isAdUnlock: false
    }
  },

  onLoad(options) {
    const id = options.id || '';
    this.setData({ articleId: id });

    if (id) {
      // 编辑模式：加载文章详情
      wx.setNavigationBarTitle({
        title: '编辑文章'
      });
      this.loadArticleDetail(id);
    } else {
      wx.setNavigationBarTitle({
        title: '发布文章'
      });
    }
  },

  // 加载文章详情
  loadArticleDetail(id) {
    wx.cloud.callFunction({
      name: 'getArticleDetail',
      data: { id }
    }).then(res => {
      const article = res.result.data || {};
      this.setData({
        form: {
          title: article.title || '',
          summary: article.summary || '',
          coverImage: article.coverImage || '',
          content: article.content || '',
          isAdUnlock: !!article.isAdUnlock
        }
      });
    }).catch(err => {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      console.error('加载文章详情失败', err);
    });
  },

  // 普通输入框
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  // 多行文本框
  onTextareaInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  // 广告解锁开关
  onSwitchChange(e) {
    this.setData({
      'form.isAdUnlock': e.detail.value
    });
  },

  // 保存文章
  save() {
    const { form, articleId } = this.data;

    if (!form.title || !form.content) {
      wx.showToast({
        title: '请填写标题和正文',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中'
    });

    wx.cloud.callFunction({
      name: 'saveArticle',
      data: {
        id: articleId,
        ...form
      }
    }).then(() => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: err.message || '保存失败',
        icon: 'none'
      });
      console.error('保存文章失败', err);
    });
  }
});
