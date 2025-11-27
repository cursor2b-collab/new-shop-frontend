import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CashierPage from '../views/CashierPage.vue'
import RechargePage from '../views/RechargePage.vue'
import OrdersPage from '../views/OrdersPage.vue'
import AccountPage from '../views/AccountPage.vue'
import ApiPage from '../views/ApiPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/recharge',
    name: 'Recharge',
    component: RechargePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountPage
  },
  {
    path: '/api',
    name: 'Api',
    component: ApiPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/cashier/:orderSN',
    name: 'Cashier',
    component: CashierPage
  },
  {
    path: '/payment/:orderSN',
    name: 'Payment',
    component: () => import('../views/PaymentConfirm.vue')
  },
  {
    path: '/sc/:orderSN/:amount/pay',
    name: 'PaymentWithAmount',
    component: () => import('../views/PaymentConfirm.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const savedAccountInfo = sessionStorage.getItem('accountInfo')
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')
    
    if (!savedAccountInfo || isLoggedIn !== 'true') {
      // 根据不同页面显示不同提示
      if (to.path === '/recharge') {
        alert('请登录账号')
      } else if (to.path === '/orders') {
        alert('请登录账号')
      } else {
        alert('请先登录后再访问此页面')
      }
      next('/account')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router


