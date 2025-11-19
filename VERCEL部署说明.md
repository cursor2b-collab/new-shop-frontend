# New-Shop-Frontend Vercel 部署说明

## 📦 项目准备

### 1. 确认文件已就绪
- ✅ `vercel.json` - Vercel 配置文件
- ✅ `package.json` - 包含构建脚本
- ✅ `vite.config.js` - Vite 配置
- ✅ 所有支付相关资源文件已复制

### 2. 环境变量配置
在 Vercel 项目设置中添加以下环境变量：

```
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

## 🚀 部署步骤

### 方法一：通过 Vercel CLI（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
cd F:\xiazai\new-shop-frontend
vercel
```

4. **生产部署**
```bash
vercel --prod
```

### 方法二：通过 Vercel 网站

1. **访问** [https://vercel.com](https://vercel.com)

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 或者直接上传项目文件夹

3. **配置项目**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **添加环境变量**
   - 在项目设置中添加 `VITE_SUPABASE_URL`
   - 添加 `VITE_SUPABASE_ANON_KEY`

5. **部署**
   - 点击 "Deploy" 按钮

## 📋 Vercel 配置说明

### vercel.json 配置
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/payment/(.*)",
      "dest": "/index.html"
    },
    {
      "src": "/cashier/(.*)",
      "dest": "/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 路由配置说明
- `/payment/*` - 钱包支付页面路由
- `/cashier/*` - 收银台页面路由
- 所有其他路由都会重定向到 `index.html`（SPA模式）

## 🔧 构建配置

### package.json 脚本
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Vite 配置
确保 `vite.config.js` 包含正确的配置：
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

## 📁 项目结构

```
new-shop-frontend/
├── public/
│   ├── pay/              # 支付页面和JS库
│   ├── middleway/        # 手动支付教程
│   ├── static/           # 静态资源
│   └── tu213/            # 其他资源
├── src/
│   ├── components/
│   │   └── PaymentPage.vue
│   ├── views/
│   │   ├── CashierPage.vue
│   │   └── PaymentConfirm.vue
│   ├── router/
│   │   └── index.js
│   └── main.js
├── vercel.json           # Vercel 配置
├── package.json
└── vite.config.js
```

## ✅ 部署后验证

### 1. 检查页面访问
- 主页: `https://your-project.vercel.app/`
- 收银台: `https://your-project.vercel.app/cashier/ORDER123`
- 支付页面: `https://your-project.vercel.app/payment/ORDER123`

### 2. 检查资源加载
- 打开浏览器开发者工具
- 检查 Network 标签
- 确认所有 JS、CSS、图片资源正常加载

### 3. 测试支付流程
- 创建测试订单
- 进入收银台
- 选择钱包支付
- 验证钱包唤起或手动支付流程

## 🔄 自动部署

### Git 集成
1. 将项目推送到 GitHub/GitLab/Bitbucket
2. 在 Vercel 中连接 Git 仓库
3. 每次推送代码时自动触发部署

### 分支部署
- `main` 分支 → 生产环境
- `dev` 分支 → 预览环境

## 🐛 常见问题

### 1. 构建失败
- 检查 Node.js 版本（推荐 18.x 或更高）
- 确认所有依赖已正确安装
- 查看 Vercel 构建日志

### 2. 路由 404
- 确认 `vercel.json` 配置正确
- 检查 Vue Router 配置为 `createWebHistory`

### 3. 环境变量未生效
- 确认变量名以 `VITE_` 开头
- 重新部署项目
- 检查 Vercel 项目设置中的环境变量

### 4. 支付页面无法访问
- 确认 `public/pay` 和 `public/middleway` 目录已复制
- 检查路由配置
- 验证 Web3.js 和 ABI 文件已加载

## 📞 支持

如有问题，请检查：
- Vercel 官方文档: https://vercel.com/docs
- Vite 官方文档: https://vitejs.dev/
- Vue Router 文档: https://router.vuejs.org/

## 🎉 部署完成

部署成功后，您将获得：
- ✅ 生产环境 URL
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署预览
- ✅ 完整的支付系统

**祝部署顺利！** 🚀

