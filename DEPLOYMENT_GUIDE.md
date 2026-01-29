# 部署指南：将 Titan Timeline Diff Reports 发布到 GitHub Pages

## 步骤 1: 创建 GitHub 仓库

1. 登录你的 GitHub 账户
2. 点击 "New repository" 按钮
3. 输入仓库名称，例如 `titan-diff-reports`
4. 选择 "Public"（如果希望公开访问）
5. 不要勾选 "Initialize this repository with a README"，因为我们已经有了
6. 点击 "Create repository"

## 步骤 2: 将本地代码推送至 GitHub

在你的终端中执行以下命令（替换 `<your-username>` 为你的 GitHub 用户名）：

```bash
cd /Users/vincent/titan-diff-reports
git init
git add .
git config user.email "your-email@example.com"
git config user.name "Your Name"
git commit -m "Initial commit: Titan Timeline Diff Reports"
git remote add origin https://github.com/<your-username>/titan-diff-reports.git
git branch -M main
git push -u origin main
```

## 步骤 3: 启用 GitHub Pages

1. 进入你刚刚创建的仓库页面
2. 点击仓库顶部的 "Settings" 标签
3. 向下滚动到 "Pages" 部分（在 "Code and automation" 下）
4. 在 "Source" 部分，从下拉菜单中选择 "Deploy from a branch"
5. 选择分支 "main" 和文件夹 "/ (root)"
6. 点击 "Save" 按钮
7. GitHub 会自动构建并部署你的站点

## 步骤 4: 访问你的网站

部署完成后，GitHub 会显示类似这样的信息：
`Your site is published at https://<your-username>.github.io/titan-diff-reports/`

几分钟后，你就可以通过上面的 URL 访问你的网站了。

## 添加更多数据文件

要添加更多版本的对比数据，只需：

1. 将新的 JSON 数据文件（如 `itemsparse_xxx_to_yyy.zhhCN.json`）上传到仓库
2. 提交更改，GitHub Pages 会自动更新

## 替代方法：使用 GitHub Desktop 或 CLI

如果你更喜欢使用图形界面：

1. 使用 GitHub Desktop 克隆仓库
2. 将本地的文件拖拽到 GitHub Desktop 中
3. 提交并推送更改

## 注意事项

- GitHub Pages 需要一些时间来部署更改（通常 1-10 分钟）
- `.nojekyll` 文件已包含在 HTML 文件中，确保 GitHub Pages 不会处理我们的静态文件
- 确保你的数据文件使用 UTF-8 编码
- 如果你想要自定义域名，可以在 Settings -> Pages 中设置

## 故障排除

如果页面没有正确显示：
1. 检查 GitHub Pages 设置是否正确
2. 确认文件已正确上传
3. 检查是否有拼写错误
4. 刷新浏览器缓存

恭喜！你现在有了一个可以公开访问的泰坦时光服物品数据对比工具。