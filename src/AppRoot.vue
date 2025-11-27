<template>
  <router-view></router-view>
  
  <!-- 首次打开通知弹窗 -->
  <div v-if="showNotification" class="notification-modal" @click.self="closeNotification">
    <div class="notification-dialog">
      <div class="notification-header">
        <h3 class="notification-title">通知</h3>
        <button class="notification-close-btn" @click="closeNotification">&times;</button>
      </div>
      <div class="notification-body">
        <p>由于第三方充值风控限制,目前只能USDT充值,请针对相应钱包进行转账充值,充值成功自动到账。</p>
      </div>
      <div class="notification-footer">
        <button class="notification-close-button" @click="closeNotification">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showNotification = ref(false)

// 检查是否已经显示过通知
function checkNotification() {
  const hasShown = localStorage.getItem('notification_shown')
  if (!hasShown) {
    showNotification.value = true
  }
}

// 关闭通知
function closeNotification() {
  showNotification.value = false
  // 记录已经显示过，24小时内不再显示
  localStorage.setItem('notification_shown', 'true')
  // 可选：设置过期时间（24小时后）
  const expireTime = Date.now() + 24 * 60 * 60 * 1000
  localStorage.setItem('notification_expire', expireTime.toString())
}

// 组件挂载时检查
onMounted(() => {
  // 检查是否过期（24小时后重新显示）
  const expireTime = localStorage.getItem('notification_expire')
  if (expireTime && Date.now() > parseInt(expireTime)) {
    localStorage.removeItem('notification_shown')
    localStorage.removeItem('notification_expire')
  }
  
  checkNotification()
})
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 通知弹窗样式 */
.notification-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.notification-dialog {
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 85%;
  max-width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
  margin: 20px;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.notification-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  line-height: 1;
}

.notification-close-btn:hover {
  color: #333;
}

.notification-body {
  padding: 16px;
  color: #666;
  font-size: 13px;
  line-height: 1.5;
}

.notification-body p {
  margin: 0;
}

.notification-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
}

.notification-close-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 60px;
}

.notification-close-button:hover {
  background-color: #357abd;
}

.notification-close-button:active {
  background-color: #2a5f8f;
}
</style>


