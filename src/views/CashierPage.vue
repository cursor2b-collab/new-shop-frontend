<template>
  <div class="container">
    <div class="box">
      <div class="title">
        <div class="logo">
          <svg t="1723040851427" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4315" width="20" height="20">
            <path d="M246.4 912a2.1 2.1 0 1 0 134.4 0 2.1 2.1 0 1 0-134.4 0Z" p-id="4316" fill="#000000"></path>
            <path d="M716.8 912a2.1 2.1 0 1 0 134.4 0 2.1 2.1 0 1 0-134.4 0Z" p-id="4317" fill="#000000"></path>
            <path d="M905.6 764.8l-537.6 0c-28.8 0-57.6-25.6-64-54.4l-96-566.4c-9.6-54.4-60.8-96-115.2-96l-22.4 0c-12.8 0-25.6 12.8-25.6 25.6 0 12.8 12.8 25.6 25.6 25.6l22.4 0c28.8 0 57.6 25.6 64 54.4l96 566.4c9.6 54.4 60.8 96 115.2 96l537.6 0c12.8 0 25.6-12.8 25.6-25.6C931.2 777.6 921.6 764.8 905.6 764.8z" p-id="4318" fill="#000000"></path>
            <path d="M880 179.2l-572.8 0c-12.8 0-25.6 12.8-25.6 25.6 0 12.8 12.8 25.6 25.6 25.6l572.8 0c25.6 0 38.4 16 32 41.6l-70.4 281.6c-6.4 32-41.6 57.6-73.6 60.8l-396.8 28.8c-12.8 0-25.6 12.8-22.4 28.8 0 12.8 12.8 25.6 28.8 22.4l396.8-28.8c54.4-3.2 105.6-48 118.4-99.2l70.4-281.6C976 230.4 937.6 179.2 880 179.2z" p-id="4319" fill="#000000"></path>
          </svg>
        </div>
        <h1 style="font-weight: bold;">收银台</h1>
      </div>

      <div class="head animate__animated animate__bounceIn">
        <div class="head_container">
          <i class="n-base-icon">
            <svg viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill-rule="nonzero">
                  <path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M32.6338835,17.6161165 C32.1782718,17.1605048 31.4584514,17.1301307 30.9676119,17.5249942 L30.8661165,17.6161165 L20.75,27.732233 L17.1338835,24.1161165 C16.6457281,23.6279612 15.8542719,23.6279612 15.3661165,24.1161165 C14.9105048,24.5717282 14.8801307,25.2915486 15.2749942,25.7823881 L15.3661165,25.8838835 L19.8661165,30.3838835 C20.3217282,30.8394952 21.0415486,30.8698693 21.5323881,30.4750058 L21.6338835,30.3838835 L32.6338835,19.3838835 C33.1220388,18.8957281 33.1220388,18.1042719 32.6338835,17.6161165 Z" fill="#18a058"></path>
                </g>
              </g>
            </svg>
          </i>
          <div class="head_info">
            <div class="l1"><span>订单信息</span></div>
            <div class="l2">
              <span class="l2_1">订单号：<span id="number">{{ orderData.orderSN }}</span></span>
              <span class="l2_2">付款金额：<span id="rate">{{ orderData.actual_price }}</span> USDT</span>
            </div>
            <div class="l3">由于第三方充值风控限制，目前只能USDT充值，请使用相应钱包进行转账充值，充值成功自动发货。</div>
          </div>
        </div>
      </div>

      <div class="body animate__animated animate__bounceIn">
        <div class="control">
          <div :class="['b', 'b1', { active: activeTab === 'quick' }]" @click="switchTab('quick')">快捷支付</div>
          <div :class="['b', 'b2', { active: activeTab === 'manual' }]" @click="switchTab('manual')">手动支付</div>
        </div>
        <div class="tip">USDT - 请选择付款使用的钱包（下滑获取更多）</div>
        <div class="walletout">
          <!-- 快捷支付 -->
          <div class="walletBox" id="handy">
            <div class="wallet handy" @click="selectWallet('imtoken')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/imToken.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">imToken - TRC20 / ERC20 / BEP20</div>
                  <div class="warn red">【推荐】快捷支付</div>
                </div>
              </div>
            </div>
            <div class="wallet handy" @click="selectWallet('tokenpocket')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/tokenPocket.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">TokenPocket - TRC20 / ERC20 / BEP20</div>
                  <div class="warn red">【推荐】快捷支付</div>
                </div>
              </div>
            </div>
            <div class="wallet handy" @click="selectWallet('tronlink')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/tronLink.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">TronLink - TRC20</div>
                  <div class="warn red">【推荐】快捷支付</div>
                </div>
              </div>
            </div>
            <div class="wallet handy" @click="selectWallet('bitget')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/bitget.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">Bitget Wallet / BitKeep - TRC20 / ERC20</div>
                  <div class="warn">快捷支付</div>
                </div>
              </div>
            </div>
            <div class="wallet handy" @click="selectWallet('trust')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/QQ20251115-132704.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">Trust Wallet - ERC20</div>
                  <div class="warn">快捷支付</div>
                </div>
              </div>
            </div>
            <div class="wallet handy" @click="selectWallet('metamask')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/metaMask.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">MetaMask - ERC20 / BEP20</div>
                  <div class="warn">快捷支付</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 手动支付 -->
          <div class="walletBox" id="hand">
            <div class="wallet hand" @click="showManualPayment('imtoken')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/imToken.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">imToken - TRC20 / ERC20 / BEP20</div>
                  <div class="warn red">点击无反应？尝试使用手动支付</div>
                </div>
              </div>
            </div>
            <div class="wallet hand" @click="showManualPayment('tokenpocket')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/tokenPocket.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">TokenPocket - TRC20 / ERC20 / BEP20</div>
                  <div class="warn red">点击无反应？尝试使用手动支付</div>
                </div>
              </div>
            </div>
            <div class="wallet hand" @click="showManualPayment('tronlink')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/tronLink.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">TronLink - TRC20</div>
                  <div class="warn">手动支付</div>
                </div>
              </div>
            </div>
            <div class="wallet hand" @click="showManualPayment('bitget')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/bitget.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">Bitget Wallet / BitKeep - ERC20</div>
                  <div class="warn">手动支付</div>
                </div>
              </div>
            </div>
            <div class="wallet hand" @click="showManualPayment('trust')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/QQ20251115-132704.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">Trust Wallet - ERC20</div>
                  <div class="warn">手动支付</div>
                </div>
              </div>
            </div>
            <div class="wallet hand" @click="showManualPayment('metamask')">
              <div class="icon">
                <img src="https://cy-747263170.imgix.net/metaMask.png" alt="">
              </div>
              <div class="walletInfo">
                <div class="info">
                  <div class="name">MetaMask - ERC20 / BEP20</div>
                  <div class="warn">手动支付</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 手动支付弹窗 -->
    <div v-if="showModal" class="zz" @click="closeModal"></div>
    <div v-if="showModal" class="module animate__animated" :class="{ 'animate__fadeInDown': showModal }">
      <div class="warninfo">
        <div class="l">操作流程</div>
        <div class="head">
          <div class="head_container">
            <i class="n-base-icon">
              <svg style="width: 24px; height: 24px" t="1723089284546" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4277">
                <path d="M512 32C246.912 32 32 246.912 32 512c0 265.088 214.912 480 480 480 265.088 0 480-214.912 480-480 0-265.088-214.912-480-480-480z m0 896C282.24 928 96 741.76 96 512S282.24 96 512 96s416 186.24 416 416-186.24 416-416 416z" p-id="4278" fill="#1296db"></path>
                <path d="M512 384a32 32 0 0 0-32 32v352a32 32 0 0 0 64 0V416a32 32 0 0 0-32-32zM464 272a48 48 0 1 0 96 0 48 48 0 1 0-96 0z" p-id="4279" fill="#1296db"></path>
              </svg>
            </i>
            <div class="head_info">
              <div class="l1"><span>点击查看大图</span></div>
              <div class="l3"><span>请复制以下链接到手机钱包打开，电脑无法下单支付。</span></div>
            </div>
          </div>
        </div>
      </div>
      <div id="teachimg">
        <img :src="teachImages[0]" alt="教程1" @click="viewFullImage($event)" style="width: 45%; margin: 5px; cursor: pointer;">
        <img :src="teachImages[1]" alt="教程2" @click="viewFullImage($event)" style="width: 45%; margin: 5px; cursor: pointer;">
      </div>
      <div class="link" id="link">{{ paymentLink }}</div>
      <div class="btn">
        <button id="close" @click="copyAndClose">复制并关闭</button>
      </div>
    </div>
  </div>

  <!-- 全屏图片查看 -->
  <div v-if="fullImageSrc" class="reader" @click="closeFullImage">
    <img :src="fullImageSrc" id="imgreader" alt="">
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const orderData = ref({
  orderSN: '',
  title: '',
  buy_amount: '',
  actual_price: '',
  id: ''
})

const shopConfig = ref({
  merchant_name: '',
  telegram_customer_service: '',
  telegram_customer_name: '',
  announcement: ''
})

const activeTab = ref('quick')
const showModal = ref(false)
const paymentLink = ref('')
const fullImageSrc = ref('')
const currentWallet = ref('imtoken') // 当前选择的钱包类型

// 钱包教程图片映射
const walletTeachImages = {
  imtoken: ['/middleway/static/images/teach/imtoken.png', '/middleway/static/images/teach/imtoken1.png'],
  tokenpocket: ['/middleway/static/images/teach/TP.png', '/middleway/static/images/teach/tp2.png'],
  tronlink: ['/middleway/static/images/teach/tronlink.png', '/middleway/static/images/teach/tronlink1.png'],
  metamask: ['/middleway/static/images/teach/metamask.png', '/middleway/static/images/teach/metamask2.png'],
  trust: ['/middleway/static/images/teach/trust.png', '/middleway/static/images/teach/trust1.png'],
  bitget: ['/middleway/static/images/teach/bitget.png', '/middleway/static/images/teach/bitget2.png'],
  bitpie: ['/middleway/static/images/teach/imtoken.png', '/middleway/static/images/teach/imtoken1.png'], // 使用imtoken图片
  coinbase: ['/middleway/static/images/teach/imtoken.png', '/middleway/static/images/teach/imtoken1.png'] // 使用imtoken图片
}

// 获取当前钱包的教程图片
const teachImages = computed(() => {
  return walletTeachImages[currentWallet.value] || walletTeachImages.imtoken
})

// 切换标签页
function switchTab(tab) {
  activeTab.value = tab
  const walletout = document.querySelector('.walletout')
  if (walletout) {
    if (tab === 'quick') {
      walletout.style.transform = 'translateX(0)'
    } else {
      walletout.style.transform = 'translateX(-50%)'
    }
  }
}

// 快捷支付 - 选择钱包
function selectWallet(walletType) {
  const orderSN = orderData.value.orderSN
  
  sessionStorage.setItem(`order_${orderSN}`, JSON.stringify(orderData.value))
  console.log('已保存订单数据到 sessionStorage:', orderData.value)
  
  sessionStorage.setItem(`wallet_type_${orderSN}`, walletType)
  
  const websiteName = shopConfig.value.merchant_name || '好旺担保'
  sessionStorage.setItem(`website_name_${orderSN}`, websiteName)
  
  const idParam = orderData.value.id || ''
  const amount = orderData.value.actual_price || orderData.value.actualPrice || orderData.value.price || '0'
  
  const queryParams = new URLSearchParams()
  if (idParam) queryParams.append('id', idParam)
  queryParams.append('amount', amount)
  const queryString = '?' + queryParams.toString()
  
  const baseUrl = `${window.location.origin}/payment/${orderSN}${queryString}`
  console.log('钱包跳转URL (带金额):', baseUrl)
  
  const walletUrls = {
    imtoken: `imtokenv2://navigate/DappView?url=${encodeURIComponent(baseUrl)}`,
    tokenpocket: `tpdapp://open?params={"url":"${encodeURIComponent(baseUrl)}","chain":"TRON","source":"xxx"}`,
    tronlink: `tronlinkoutside://pull.activity?param={"url":"${encodeURIComponent(baseUrl)}"}`,
    metamask: `https://metamask.app.link/dapp/${window.location.host}/payment/${orderSN}${queryString}`,
    trust: `trust://open_url?coin_id=60&url=${encodeURIComponent(baseUrl)}`,
    bitget: `bitkeep://bkconnect?action=dapp&url=${encodeURIComponent(baseUrl)}`,
    bitpie: `bitpie://dapp?url=${encodeURIComponent(baseUrl)}`,
    coinbase: `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(baseUrl)}`
  }

  const url = walletUrls[walletType]
  if (url) {
    console.log('跳转到钱包:', walletType, 'URL:', url)
    window.location.href = url
  }
}

// 手动支付 - 显示弹窗
function showManualPayment(walletType) {
  currentWallet.value = walletType // 记录当前选择的钱包
  
  const orderSN = orderData.value.orderSN
  const idParam = orderData.value.id || ''
  const amount = orderData.value.actual_price || orderData.value.actualPrice || orderData.value.price || '0'
  
  const queryParams = new URLSearchParams()
  if (idParam) queryParams.append('id', idParam)
  queryParams.append('amount', amount)
  const queryString = '?' + queryParams.toString()
  
  paymentLink.value = `${window.location.origin}/payment/${orderSN}${queryString}`
  showModal.value = true
  
  setTimeout(() => {
    const module = document.querySelector('.module')
    if (module) {
      module.style.top = '50%'
      module.style.transform = 'translate(-50%, -50%)'
    }
  }, 10)
}

// 关闭弹窗
function closeModal() {
  const module = document.querySelector('.module')
  if (module) {
    module.style.top = '-1000px'
  }
  setTimeout(() => {
    showModal.value = false
  }, 300)
}

// 复制链接并关闭
async function copyAndClose() {
  try {
    await navigator.clipboard.writeText(paymentLink.value)
    alert('链接已复制到剪贴板')
    closeModal()
  } catch (err) {
    const input = document.createElement('input')
    input.value = paymentLink.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    alert('链接已复制到剪贴板')
    closeModal()
  }
}

// 查看全屏图片
function viewFullImage(event) {
  fullImageSrc.value = event.target.src
}

// 关闭全屏图片
function closeFullImage() {
  fullImageSrc.value = ''
}

// 加载订单数据
async function loadOrderData(orderSN) {
  console.log('CashierPage: 开始加载订单数据, orderSN:', orderSN)
  
  const cachedData = sessionStorage.getItem(`order_${orderSN}`)
  console.log('CashierPage: sessionStorage数据:', cachedData)
  
  if (cachedData) {
    orderData.value = JSON.parse(cachedData)
    console.log('CashierPage: 已从缓存加载订单数据:', orderData.value)
    return
  }
  
  try {
    const response = await fetch(`/api/orders/${orderSN}`)
    if (response.ok) {
      const data = await response.json()
      orderData.value = data
      console.log('CashierPage: 已从API加载订单数据:', orderData.value)
    }
  } catch (error) {
    console.error('CashierPage: 加载订单数据失败:', error)
  }
}

// 加载店铺配置
async function loadShopConfig() {
  try {
    const response = await fetch('/api/shop-config')
    if (response.ok) {
      const configData = await response.json()
      if (configData) {
        shopConfig.value = configData
      }
    }
  } catch (error) {
    console.error('加载店铺配置失败:', error)
  }
}

// 页面加载时获取订单数据
onMounted(async () => {
  const orderSN = route.params.orderSN
  if (orderSN) {
    await Promise.all([
      loadShopConfig(),
      loadOrderData(orderSN)
    ])
  }
})
</script>

<style scoped>
:root {
  --text-color: rgb(31, 34, 37);
  --warn-color: #ff6347;
}

body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  min-width: 320px;
}

.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
  box-sizing: border-box;
}

.n-base-icon {
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
}

.n-base-icon svg {
  color: #18a058;
}

.l1 {
  font-size: 16px;
  line-height: 19px;
  color: rgb(31, 34, 37);
  font-weight: bold;
}

.l2 {
  margin-top: 10px;
  display: flex;
  font-size: 14px;
  color: rgb(31, 34, 37);
  flex-wrap: wrap;
  gap: 10px;
}

.l2_1 {
  margin-right: 20px;
  color: rgb(31, 34, 37);
  white-space: nowrap;
}

.l2_2 {
  color: rgb(31, 34, 37);
  white-space: nowrap;
}

#rate {
  color: #ff6347;
  font-weight: bold;
}

.l3 {
  color: #ff6347;
  margin-top: 10px;
  font-size: 14px;
}

.body {
  border-radius: 10px;
  width: 100%;
  margin: 15px 0;
  box-shadow: 0 0 10px gray;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
}

.tip {
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 14px;
  color: rgb(31, 34, 37);
}

.walletBox {
  max-height: 350px;
  overflow-y: auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.wallet {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
  border-bottom: 1px solid #f1f1f1;
}

.wallet:last-child {
  border-color: transparent;
}

.icon {
  width: 85px;
  height: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon img {
  width: 60px;
  height: 60px;
}

.walletInfo {
  height: 60px;
}

.info {
  display: block;
}

.name {
  color: rgb(31, 34, 37);
}

.warn {
  margin: 14px 0;
  color: rgb(31, 34, 37);
}

.warn.red {
  color: #ff6347;
}

@media screen and (max-width: 750px) {
  .box {
    padding: 0 5px;
  }

  .title {
    padding: 0 5px;
  }

  .title h1 {
    font-size: 18px;
  }

  .head {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
  }

  .head_container {
    flex-direction: row;
    align-items: flex-start;
  }

  .l1 {
    font-size: 14px;
  }

  .l2 {
    font-size: 12px;
    flex-direction: row;
    gap: 10px;
  }

  .l2_1,
  .l2_2 {
    margin-right: 0;
    width: auto;
  }

  .l3 {
    font-size: 12px;
    line-height: 1.5;
  }

  .body {
    width: 100%;
    margin: 15px 0;
    background-color: #fff;
    border-radius: 10px;
  }

  .tip {
    font-size: 12px;
    padding: 8px;
  }

  .control .b {
    font-size: 12px;
    padding: 5px;
    margin: 0 8px;
  }

  .icon {
    width: 60px;
    height: 60px;
  }

  .icon img {
    width: 35px;
    height: 35px;
  }

  .walletInfo {
    height: auto;
    padding: 5px 0;
  }

  .name {
    font-size: 12px;
    line-height: 1.4;
  }

  .warn {
    margin: 6px 0;
    font-size: 11px;
  }

  .wallet {
    padding: 8px 5px;
  }
}

/* 超小屏幕优化 */
@media screen and (max-width: 480px) {
  .box {
    padding: 0 3px;
  }

  .title h1 {
    font-size: 16px;
  }

  .head {
    padding: 8px;
  }

  .l1 {
    font-size: 13px;
  }

  .l2 {
    font-size: 11px;
  }

  .l3 {
    font-size: 11px;
  }

  .control .b {
    font-size: 11px;
    padding: 4px;
    margin: 0 5px;
    width: 70px;
  }

  .icon {
    width: 50px;
    height: 50px;
  }

  .icon img {
    width: 30px;
    height: 30px;
  }

  .name {
    font-size: 11px;
  }

  .warn {
    font-size: 10px;
  }
}

.control {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  background-color: #fff;
  padding: 10px;
}

.control .b {
  width: 80px;
  cursor: pointer;
  border: 1px solid #f1f1f1;
  padding: 6px;
  margin: 0 15px;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  transform: scale(1, 1);
  transform-origin: center center;
  transition: all 0.15s;
  color: rgb(31, 34, 37);
}

.control .b:first-child {
  margin-left: 0;
}

.control .b:hover {
  box-shadow: 0 0 4px #bbb9b9;
  transform: scale(1.05, 1.05);
}

.control .b.active {
  background-color: #18a058;
  color: #fff;
}

.zz {
  display: block;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9;
}

.module {
  width: 700px;
  height: 700px;
  background-color: #fff;
  position: fixed;
  top: -1000px;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  z-index: 10;
  transition: top 0.3s;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.warninfo {
  margin-bottom: 20px;
}

.warninfo .l {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: rgb(31, 34, 37);
}

.head {
  border-radius: 10px;
  margin-top: 10px;
  background-color: #f5f5f5;
  padding: 13px;
}

.head_container {
  display: flex;
  justify-content: center;
}

.head_info {
  flex: 1;
  margin-left: 15px;
}

#teachimg {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow-y: auto;
  margin: 10px 0;
}

.link {
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  word-break: break-all;
  margin: 10px 0;
  font-size: 14px;
  color: rgb(31, 34, 37);
}

.btn {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.btn button {
  padding: 12px 30px;
  background-color: #18a058;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn button:hover {
  background-color: #159947;
}

.btn button:active {
  background-color: #127a3a;
}

.walletout {
  display: flex;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  width: 200%;
  display: flex;
  transition: transform 0.5s ease;
}

.walletout .walletBox {
  width: 50%;
  flex-shrink: 0;
}

@media screen and (max-width: 750px) {
  .reader img {
    width: 95%;
    max-width: 300px;
  }

  .info,
  .warn {
    font-size: 12px;
  }

  .module {
    width: 95%;
    max-width: 400px;
    height: auto;
    max-height: 85vh;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    padding: 15px;
    box-sizing: border-box;
  }

  .module .title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .module .content {
    font-size: 13px;
  }
}

@media screen and (max-width: 480px) {
  .reader img {
    width: 95%;
    max-width: 250px;
  }

  .module {
    width: 95%;
    max-width: 350px;
    padding: 12px;
  }

  .module .title {
    font-size: 14px;
  }

  .module .content {
    font-size: 12px;
  }
}

.box {
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  margin-top: 0;
  box-sizing: border-box;
}

.title {
  margin-top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 16px;
  color: rgb(31, 34, 37);
  animation: slideInFromLeft 0.8s ease-out;
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.title h1 {
  font-size: 22px;
  color: rgb(31, 34, 37);
  font-weight: bold;
}

.title svg {
  margin-left: 10px;
  margin-right: 20px;
  width: 30px;
  height: 30px;
  font-weight: bold;
}

.title svg path {
  stroke-width: 1.5;
}

.head {
  width: 95%;
  border-radius: 10px;
  margin-top: 25px;
  box-shadow: 0 0 10px gray;
  background-color: #fff;
  padding: 13px;
}

.reader {
  display: flex;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.9);
  justify-content: center;
  align-items: center;
  z-index: 11;
  transform-origin: center center;
  cursor: pointer;
}

.reader img {
  height: 80%;
}
</style>
