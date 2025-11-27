<template>
  <div class="payment-container">
    <div class="payment-box">
      <div class="payment-header">
        <h1>确认支付</h1>
      </div>

      <div class="order-info">
        <h3>订单信息</h3>
        <div class="info-row">
          <span class="label">订单号：</span>
          <span class="value">{{ orderInfo.orderSn }}</span>
        </div>
        <div class="info-row">
          <span class="label">商品名称：</span>
          <span class="value">{{ orderInfo.goodsName }}</span>
        </div>
        <div class="info-row">
          <span class="label">购买数量：</span>
          <span class="value">{{ orderInfo.quantity }}</span>
        </div>
        <div class="info-row price-row">
          <span class="label">支付金额：</span>
          <span class="value price">{{ orderInfo.amount }} USDT</span>
        </div>
      </div>

      <div class="notice">
        <i class="fas fa-info-circle"></i>
        点击下方按钮将在钱包中发起支付授权，请确认转账金额和收款地址后完成支付。
      </div>

      <button class="confirm-btn" @click="confirmPayment" :disabled="loading">
        <i class="fas fa-wallet"></i>
        {{ loading ? '处理中...' : '确认付款' }}
      </button>

      <!-- 支付UI容器 -->
      <div id="payment-ui-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(false)
const orderInfo = ref({
  orderSn: '',
  goodsName: '',
  quantity: 0,
  amount: 0
})

onMounted(() => {
  // 从URL参数获取订单信息
  orderInfo.value = {
    orderSn: route.query.orderSn || '',
    goodsName: route.query.goodsName || '',
    quantity: route.query.quantity || 0,
    amount: route.query.amount || 0
  }
  
  console.log('订单信息:', orderInfo.value)
  
  // 加载支付相关的脚本
  loadPaymentScripts()
})

function loadPaymentScripts() {
  // 加载 Web3
  const web3Script = document.createElement('script')
  web3Script.src = 'https://cdn.jsdelivr.net/npm/web3@1.5.2/dist/web3.min.js'
  document.head.appendChild(web3Script)
  
  // 这里可以加载你们的 pay.js 和其他支付相关脚本
  // 如果需要的话
}

function confirmPayment() {
  loading.value = true
  
  // 这里调用支付相关的函数
  // 假设有一个全局的 initPaymentUI 函数
  if (typeof window.initPaymentUI === 'function') {
    try {
      window.initPaymentUI('payment-ui-container')
    } catch (error) {
      console.error('支付初始化失败:', error)
      alert('支付初始化失败，请重试')
      loading.value = false
    }
  } else {
    // 如果没有 initPaymentUI 函数，直接调用后端API创建支付
    createPayment()
  }
}

async function createPayment() {
  try {
    // 调用后端支付接口
    const response = await fetch('https://vps.boltcode.vip/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_sn: orderInfo.value.orderSn,
        amount: orderInfo.value.amount
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      // 支付创建成功，等待区块链确认
      alert('支付已提交，请等待区块链确认')
      // 可以跳转到订单查询页面
    } else {
      alert('支付失败: ' + data.message)
    }
  } catch (error) {
    console.error('支付请求失败:', error)
    alert('支付请求失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.payment-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 50px;
}

.payment-box {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.payment-header {
  text-align: center;
  margin-bottom: 30px;
}

.payment-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.order-info {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.order-info h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 15px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #666;
  font-size: 14px;
}

.info-row .value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.info-row.price-row .value.price {
  color: #f44336;
  font-size: 18px;
  font-weight: 600;
}

.notice {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 13px;
  color: #e65100;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.notice i {
  margin-top: 2px;
}

.confirm-btn {
  width: 100%;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.confirm-btn:active:not(:disabled) {
  transform: translateY(0);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

#payment-ui-container {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .payment-container {
    padding: 15px;
    padding-top: 30px;
  }
  
  .payment-box {
    padding: 20px;
  }
}
</style>

