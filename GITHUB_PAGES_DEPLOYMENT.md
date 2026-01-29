# 部署到 GitHub Pages

## 方法一：手动上传文件

1. 访问 [GitHub](https://github.com) 并登录
2. 创建一个新的仓库，例如命名为 `titan-diff-reports`
3. 点击 "Add file" → "Upload files"
4. 将以下文件拖拽到上传区域：
   - `index.html`
   - `itemsparse_3.80.0.65301_to_3.80.0.65586.zhCN.json`
   - `README.md`
   - `.nojekyll`
5. 点击 "Commit changes"
6. 在仓库页面点击 "Settings" 选项卡
7. 向下滚动到 "Pages" 部分
8. 在 "Source" 下拉菜单中选择 "Deploy from a branch"
9. 选择 "main" 分支和 "/" 文件夹
10. 点击 "Save"
11. 等待几分钟，然后访问 `https://<your-username>.github.io/titan-diff-reports/`

## 方法二：使用 Git 命令行

### 1. 初始化仓库
```bash
# 在项目目录中
cd /Users/vincent/titan-diff-reports

# 关联远程仓库（替换 <your-username> 为你的 GitHub 用户名）
git remote add origin https://github.com/<your-username>/titan-diff-reports.git
```

### 2. 推送到 GitHub
```bash
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages
1. 前往 GitHub 仓库页面
2. 点击 "Settings" → "Pages"
3. Source: 选择 "Deploy from a branch"
4. Branch: 选择 "main" → "/"
5. 点击 "Save"

## 验证部署

部署完成后，GitHub 会显示类似信息：
```
Your site is published at https://<your-username>.github.io/titan-diff-reports/
```

访问该 URL 即可使用在线工具。

## 更新数据

如需更新数据文件：
1. 将新的 JSON 数据文件上传到仓库
2. 提交更改后 GitHub Pages 会自动更新

## 注意事项

- `.nojekyll` 文件很重要，它告诉 GitHub Pages 不要使用 Jekyll 处理这些静态文件
- 确保所有文件都在仓库根目录中
- 首次部署可能需要几分钟时间
- 如果遇到问题，请检查文件是否正确上传