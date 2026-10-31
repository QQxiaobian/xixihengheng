# 图文文章小程序

一个基于微信云开发的图文文章展示小程序。支持管理员发布、编辑、删除文章，并可为单篇文章设置“观看激励视频广告后解锁全文”模式。

## 功能特性

- 文章列表展示（封面、标题、摘要、广告解锁标识）
- 文章详情阅读
- 激励视频广告解锁全文
- 已解锁文章再次进入自动展示全文
- 管理员后台：发布、编辑、删除文章
- 单篇文章独立开关广告解锁模式

## 项目结构

```
wechat-article-app/
├── app.js                      # 小程序入口，初始化云开发
├── app.json                    # 全局页面与窗口配置
├── app.wxss                    # 全局样式
├── project.config.json         # 项目配置
├── sitemap.json                # 搜索索引配置
├── pages/
│   ├── index/                  # 文章列表页
│   ├── detail/                 # 文章详情页（含广告解锁）
│   ├── admin/                  # 管理员文章管理页
│   └── admin-edit/             # 发布/编辑文章页
├── utils/
│   └── util.js                 # 工具函数
└── cloudfunctions/             # 云函数
    ├── checkAdmin/             # 校验管理员身份
    ├── getArticles/            # 获取文章列表
    ├── getArticleDetail/       # 获取文章详情
    ├── saveArticle/            # 发布/更新文章
    ├── deleteArticle/          # 删除文章
    └── unlockArticle/          # 检查/记录解锁状态
```

## 数据库集合

在云开发控制台数据库中创建以下集合：

- `articles`：存储文章数据
  - `title`：标题
  - `summary`：摘要（广告解锁模式下展示）
  - `coverImage`：封面图 URL
  - `content`：正文内容（支持富文本 HTML）
  - `isAdUnlock`：是否开启广告解锁
  - `createTime`：创建时间
  - `updateTime`：更新时间

- `unlocks`：存储用户解锁记录
  - `openid`：用户 openid
  - `articleId`：文章 ID
  - `unlockTime`：解锁时间

## 使用前配置

### 1. 云开发环境 ID

将以下文件中的 `your-env-id` 替换为你的云开发环境 ID：

- `app.js`
- `cloudfunctions/checkAdmin/index.js`
- `cloudfunctions/getArticles/index.js`
- `cloudfunctions/getArticleDetail/index.js`
- `cloudfunctions/saveArticle/index.js`
- `cloudfunctions/deleteArticle/index.js`
- `cloudfunctions/unlockArticle/index.js`

### 2. 小程序 AppID

将 `project.config.json` 中的 `your-app-id` 替换为你的小程序 AppID。

### 3. 管理员 openid

将以下文件中的 `oXXXXXXXXXXXXXXXXXXXXXXXXX` 替换为实际管理员的 openid：

- `cloudfunctions/checkAdmin/index.js`
- `cloudfunctions/saveArticle/index.js`
- `cloudfunctions/deleteArticle/index.js`

获取 openid 的方法：先部署 `checkAdmin` 云函数并随便调用一次，控制台会返回当前用户的 openid。

### 4. 激励视频广告位 ID

将 `pages/detail/detail.js` 中的 `your-ad-unit-id` 替换为你在微信小程序后台申请的激励视频广告位 ID。

## 部署步骤

1. 在微信开发者工具中选择“导入项目”，选择 `wechat-article-app` 目录。
2. 填写小程序 AppID，选择“不使用云服务”或“使用云服务”（只要已开通云开发即可）。
3. 在微信开发者工具中点击工具栏“云开发”按钮，开通并进入云开发控制台。
4. 在云开发控制台“数据库”中创建 `articles` 和 `unlocks` 两个集合。
5. 右键 `cloudfunctions` 下的每个云函数目录，选择“创建并部署：云端安装依赖”。
6. 完成上述配置替换后，点击微信开发者工具的“预览”按钮，即可扫码体验。

## 使用说明

### 普通用户

1. 进入小程序首页，浏览文章列表。
2. 点击文章进入详情页。
3. 若文章未开启广告解锁，可直接阅读全文。
4. 若文章开启广告解锁，会看到摘要和“观看广告解锁全文”按钮，完整观看激励视频后即可阅读全文。
5. 已解锁的文章再次进入时会自动展示全文，无需重复观看广告。

### 管理员

1. 管理员在首页会看到“进入管理后台”按钮。
2. 进入管理后台后可查看所有文章。
3. 点击“发布新文章”填写标题、摘要、封面图、正文，并设置是否开启广告解锁。
4. 可对已有文章进行编辑或删除。

## 注意事项

- 云函数首次部署可能需要等待几秒钟生效。
- 数据库默认权限可能只允许读，发布/编辑/删除需要确保云函数有写权限。
- 激励视频广告需要在微信小程序后台“流量主”中申请并通过审核后才能正式生效，开发阶段可使用测试广告位或跳过广告逻辑。
- 封面图目前使用图片 URL，如需本地上传，可扩展 `admin-edit` 页面，使用 `wx.chooseMedia` 和 `wx.cloud.uploadFile` 上传至云存储。
