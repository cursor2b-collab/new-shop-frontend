# New-Shop-Frontend

一个基于 Vue 3 + Vite 的现代化电商前端项目，集成完整的 USDT 支付系统。

## ✨ 功能特性

- 🛒 完整的电商购物流程
- 💰 USDT 加密货币支付
- 🔐 Supabase 用户认证
- 📱 响应式设计
- 🚀 快速构建和部署

## 🏗️ 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **路由**: Vue Router
- **UI 组件**: Element Plus
- **后端服务**: Supabase
- **区块链**: Web3.js
- **支付**: USDT (TRC20/ERC20/BEP20)

## 📦 项目结构

```
new-shop-frontend/
├── public/
│   ├── pay/              # 支付页面和Web3库
│   ├── middleway/        # 手动支付教程
│   ├── static/           # 静态资源
│   └── tu213/            # 其他资源
├── src/
│   ├── components/       # Vue组件
│   │   └── PaymentPage.vue
│   ├── views/            # 页面视图
│   │   ├── CashierPage.vue      # 收银台
│   │   ├── PaymentConfirm.vue   # 支付确认
│   │   ├── HomePage.vue         # 首页
│   │   ├── AccountPage.vue      # 账户
│   │   └── OrdersPage.vue       # 订单
│   ├── router/           # 路由配置
│   ├── lib/              # 工具库
│   │   └── supabase.js
│   └── main.js           # 入口文件
├── vercel.json           # Vercel配置
├── vite.config.js        # Vite配置
└── package.json
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产版本

```bash
npm run preview
```

## 🌐 部署到 Vercel

### 快速部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

或使用快速部署脚本：

```bash
deploy.bat
```

### 详细部署说明

查看 [VERCEL部署说明.md](./VERCEL部署说明.md)

## 💳 支付系统

### 支持的钱包

- imToken (TRC20/ERC20/BEP20)
- TokenPocket (TRC20/ERC20/BEP20)
- TronLink (TRC20)
- MetaMask (ERC20)
- Trust Wallet (多链)
- Bitget Wallet (多链)
- BitPie (多链)
- Coinbase Wallet (ERC20)

### 支付流程

1. **选择商品** → 创建订单
2. **进入收银台** → 显示订单信息
3. **选择支付方式**:
   - **快捷支付**: 直接唤起钱包APP
   - **手动支付**: 复制链接到钱包
4. **完成支付** → Web3交互确认
5. **订单完成** → 自动发货

## 🔧 开发

### 项目命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览
npm run preview

# 部署
vercel
vercel --prod
```

### 添加新页面

1. 在 `src/views/` 创建新的 Vue 文件
2. 在 `src/router/index.js` 添加路由
3. 在导航菜单中添加链接

### 修改支付配置

编辑 `src/views/CashierPage.vue` 和 `src/views/PaymentConfirm.vue`

## 📱 支持的网络

- **TRC20** (TRON)
- **ERC20** (Ethereum)
- **BEP20** (BSC)

## 🔐 安全性

- ✅ 客户端不存储私钥
- ✅ 使用用户自己的钱包签名
- ✅ 智能合约交互透明
- ✅ 交易状态实时跟踪

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请查看：
- [Vercel 部署说明](./VERCEL部署说明.md)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Supabase 文档](https://supabase.com/docs)

---

**Made with ❤️ using Vue 3 + Vite**

