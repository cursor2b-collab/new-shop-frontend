<template>
  <div class="box">
    <img id="banner" :src="bannerImage" alt="banner" />
    
    <!-- 导航标签栏 -->
    <div class="nav-tabs">
      <div class="nav-tab active">首页</div>
      <div class="nav-tab" @click="handleRechargeClick">充值</div>
      <div class="nav-tab" @click="$router.push('/orders')">我的订单</div>
      <div class="nav-tab" @click="$router.push('/account')">账户</div>
      <div class="nav-tab" @click="handleApiClick">API接口</div>
    </div>
    
    <!-- 商户信息 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">商户信息</span>
        </span>
      </p>
      <table class="n-table n-table--single-line" :style="tableStyle">
        <tbody>
          <tr>
            <td>
              <span class="el-tag el-tag--large el-tag--light merchant-tag">
                <span class="el-tag__content">商户名称</span>
              </span>
              米奇接码
            </td>
          </tr>
          <tr>
            <td>
              <span class="el-tag el-tag--large el-tag--light merchant-tag">
                <span class="el-tag__content">公告</span>
              </span>
              由于收款通道风控 本店只支持USDT付款
            </td>
          </tr>
          <tr>
            <td>
              <span class="el-tag el-tag--large el-tag--light merchant-tag">
                <span class="el-tag__content">telegram客服</span>
              </span>
              &nbsp;<a 
                id="tg-link" 
                :href="telegramCustomerLink" 
                target="_blank"
                rel="noopener"
                class="tg-button"
              >
                @nnnqqq
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <span class="el-tag el-tag--large el-tag--light merchant-tag">
                <span class="el-tag__content">商户介绍</span>
              </span>
              米奇接码为保护用户隐私提供海量国外手机号码,接码就要找米奇！
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 选择国家和业务 -->
    <div class="main">
      <!-- 选择国家 -->
      <div class="form-row">
        <span class="form-label el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">选择国家</span>
        </span>
        <div class="form-input-wrapper">
          <div class="el-select" style="width: 100%">
            <div class="select-trigger el-tooltip__trigger">
              <div class="el-input el-input--suffix">
                <div class="el-input__wrapper">
                  <input 
                    class="el-input__inner" 
                    type="text" 
                    autocomplete="off" 
                    placeholder="点击搜索国家" 
                    v-model="formData.countrySearch"
                    @input="searchCountry"
                    @focus="handleCountryFocus"
                    @click="handleCountryClick"
                  >
                  <span class="el-input__suffix">
                    <span class="el-input__suffix-inner">
                      <i class="el-icon-arrow-down"></i>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div v-if="showCountryDropdown && countries.length > 0 && filteredCountries.length > 0" class="country-dropdown">
              <div 
                v-for="country in filteredCountries" 
                :key="country.value"
                class="country-option"
                @click="selectCountry(country)"
              >
                {{ country.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 选择业务 -->
      <div class="form-row" style="margin-top: 15px;">
        <span class="form-label el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">选择业务</span>
        </span>
        <div class="form-input-wrapper">
          <div class="el-select" style="width: 100%">
            <div class="select-trigger el-tooltip__trigger">
              <div class="el-input el-input--suffix">
                <div class="el-input__wrapper">
                  <input 
                    class="el-input__inner" 
                    type="text" 
                    autocomplete="off" 
                    placeholder="选择国家后搜索项目" 
                    v-model="formData.serviceSearch"
                    @input="searchService"
                    @focus="handleServiceFocus"
                    @click="handleServiceClick"
                    :disabled="!formData.country"
                  >
                  <span class="el-input__suffix">
                    <span class="el-input__suffix-inner">
                      <i class="el-icon-arrow-down"></i>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div v-if="showServiceDropdown && services.length > 0 && filteredServices.length > 0" class="service-dropdown">
              <div 
                v-for="service in filteredServices" 
                :key="service.id"
                class="service-option"
                @click="selectService(service)"
              >
                {{ service.name }} - {{ service.price }} USDT
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 购买记录 -->
      <div style="margin-top: 20px;">
        <span class="form-label el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">购买记录</span>
        </span>
        <div class="purchase-records-table" style="margin-top: 10px;">
          <table class="purchase-table">
            <thead>
              <tr>
                <th>号码</th>
                <th>业务</th>
                <th>价格</th>
                <th>验证码</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="5" style="text-align: center; color: #909399; padding: 20px;">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 预计费用 -->
      <div class="estimated-cost" style="margin-top: 15px;">
        <span>预计费用：</span>
        <span class="cost-amount">{{ estimatedCost }} USDT</span>
      </div>

      <!-- 提示信息 -->
      <div class="info-message" style="margin-top: 10px;">
        任何项目都是首码，买一次可在7天内无限使用，到期可续费继续接，不用担心被他人使用
      </div>

      <!-- 立即购买按钮 -->
      <button type="button" class="el-button el-button--success el-button--large buy-button" @click="handleSubmit">
        <span class="el-button__text">立即购买</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { loadCashierDomains, navigateToCashier } from '../config/cashier.js'

const router = useRouter()

// Banner图片 - 使用指定的GIF图片
const bannerImage = ref('https://cy-747263170.imgix.net/GIF_20251120065910817.gif')

// 表格样式
const tableStyle = ref({
  '--n-bezier': 'cubic-bezier(.4,0,.2,1)',
  '--n-td-color': '#fff',
  '--n-td-color-modal': '#fff',
  '--n-td-color-popover': '#fff',
  '--n-td-text-color': 'rgb(51,54,57)',
  '--n-border-color': 'rgba(239,239,245,1)',
  '--n-border-color-modal': 'rgba(239,239,245,1)',
  '--n-border-color-popover': 'rgba(239,239,245,1)',
  '--n-border-radius': '3px',
  '--n-font-size': '14px',
  '--n-th-color': 'rgba(250,250,252,1)',
  '--n-th-color-modal': 'rgba(250,250,252,1)',
  '--n-th-color-popover': 'rgba(250,250,252,1)',
  '--n-th-font-weight': '500',
  '--n-th-text-color': 'rgb(31,34,37)',
  '--n-line-height': '1.6',
  '--n-td-padding': '12px',
  '--n-th-padding': '12px',
  '--n-td-color-striped': 'rgba(250,250,252,1)',
  '--n-td-color-striped-modal': 'rgba(250,250,252,1)',
  '--n-td-color-striped-popover': 'rgba(250,250,252,1)'
})

// 店铺配置
const shopConfig = ref({
  merchant_name: '',
  telegram_customer_service: '',
  telegram_customer_name: '',
  announcement: ''
})

// 代理信息
const dailiInfo = ref({
  username: ''
})

// 生成带有 Telegram 用户名的客服链接
const telegramCustomerLink = computed(() => {
  const baseUrl = 'https://t.me/nnnqqq'
  
  const tgUsername = sessionStorage.getItem('tg_username')
  if (tgUsername && baseUrl) {
    // 如果有 Telegram 用户名，添加预填的消息文本
    return `${baseUrl}?text=${encodeURIComponent('你好，我是 @' + tgUsername)}`
  }
  
  return baseUrl
})

// 国家列表（从Supabase加载）
const countries = ref([])

// 加载国家列表
const loadCountries = async () => {
  try {
    console.log('开始加载国家数据...')
    const { data: countriesData, error } = await supabase
      .from('jm273_countries')
      .select('*')
      .is('deletetime', null)
      .order('weigh', { ascending: false })
    
    console.log('国家数据查询结果:', { data: countriesData, error })
    
    if (!error && countriesData && countriesData.length > 0) {
      countries.value = countriesData.map(c => ({
        value: c.id,
        label: c.name
      }))
      console.log('✅ 从Supabase加载国家数据完成:', countries.value.length, '个国家')
    } else {
      console.error('❌ 从Supabase加载国家数据失败:', error)
      if (error) {
        console.error('错误详情:', JSON.stringify(error, null, 2))
      }
      // 使用默认国家列表作为后备
      countries.value = [
        { value: 'CN', label: 'CN/中国 +86' },
        { value: 'US', label: 'US/美国 +1' },
        { value: 'HK', label: 'HK/香港 +852' }
      ]
      console.log('使用默认国家列表:', countries.value.length, '个国家')
    }
  } catch (error) {
    console.error('❌ 加载国家数据异常:', error)
    countries.value = [
      { value: 'CN', label: 'CN/中国 +86' },
      { value: 'US', label: 'US/美国 +1' }
    ]
  }
}

// 服务列表（从数据库加载）
const services = ref([])

// 表单数据
const formData = ref({
  country: '',
  countrySearch: '',
  service: '',
  serviceSearch: '',
  serviceId: ''
})

// 预计费用
const estimatedCost = computed(() => {
  if (formData.value.serviceId) {
    const selectedService = services.value.find(s => s.id == formData.value.serviceId)
    return selectedService ? parseFloat(selectedService.price || 0).toFixed(2) : '0.00'
  }
  return '0.00'
})

// 下拉框显示状态
const showCountryDropdown = ref(false)
const showServiceDropdown = ref(false)

// 计算属性
const filteredCountries = computed(() => {
  // 如果没有输入或输入为空，显示前50个国家
  if (!formData.value.countrySearch || formData.value.countrySearch.trim() === '') {
    return countries.value.slice(0, 50)
  }
  const search = formData.value.countrySearch.toLowerCase()
  const filtered = countries.value.filter(c => 
    c.label.toLowerCase().includes(search) || 
    c.value.toLowerCase().includes(search)
  )
  // 搜索结果最多显示50个
  return filtered.slice(0, 50)
})

const filteredServices = computed(() => {
  if (!formData.value.country) {
    return []
  }
  // 所有国家显示相同的业务列表
  // 如果没有输入，显示前50个服务
  if (!formData.value.serviceSearch || formData.value.serviceSearch.trim() === '') {
    return services.value.slice(0, 50)
  }
  // 根据搜索关键词过滤
  const search = formData.value.serviceSearch.toLowerCase()
  const filtered = services.value.filter(s => 
    s.name.toLowerCase().includes(search)
  )
  // 搜索结果最多显示50个
  return filtered.slice(0, 50)
})

// 方法
const searchCountry = () => {
  showCountryDropdown.value = true
}

// 处理国家输入框获得焦点
const handleCountryFocus = () => {
  showCountryDropdown.value = true
  // 如果已经有选择的国家，清空搜索内容以便重新选择
  if (formData.value.country) {
    formData.value.countrySearch = ''
  }
}

// 处理国家输入框点击
const handleCountryClick = () => {
  // 如果已经有选择的国家，清空搜索内容以便重新选择
  if (formData.value.country) {
    formData.value.countrySearch = ''
    showCountryDropdown.value = true
  }
}

const selectCountry = (country) => {
  formData.value.country = country.value
  formData.value.countrySearch = country.label
  showCountryDropdown.value = false
  // 清空服务选择
  formData.value.service = ''
  formData.value.serviceSearch = ''
  formData.value.serviceId = ''
}

// 处理业务输入框获得焦点
const handleServiceFocus = () => {
  if (!formData.value.country) {
    alert('请先选择国家')
    return
  }
  showServiceDropdown.value = true
  // 如果已经有选择的业务，清空搜索内容以便重新选择
  if (formData.value.service) {
    formData.value.serviceSearch = ''
  }
}

// 处理业务输入框点击
const handleServiceClick = () => {
  if (!formData.value.country) {
    return
  }
  // 如果已经有选择的业务，清空搜索内容以便重新选择
  if (formData.value.service) {
    formData.value.serviceSearch = ''
    showServiceDropdown.value = true
  }
}

const searchService = () => {
  if (!formData.value.country) {
    alert('请先选择国家')
    return
  }
  showServiceDropdown.value = true
}

const selectService = (service) => {
  formData.value.service = service.name
  formData.value.serviceSearch = service.name
  formData.value.serviceId = service.id
  showServiceDropdown.value = false
}

// 处理充值点击
const handleRechargeClick = () => {
  const savedAccountInfo = sessionStorage.getItem('accountInfo')
  const isLoggedIn = sessionStorage.getItem('isLoggedIn')
  
  if (!savedAccountInfo || isLoggedIn !== 'true') {
    alert('请登录账号')
    router.push('/account')
  } else {
    router.push('/recharge')
  }
}

// 处理API接口点击
const handleApiClick = () => {
  const savedAccountInfo = sessionStorage.getItem('accountInfo')
  if (!savedAccountInfo) {
    alert('请先登录后再访问API接口')
    router.push('/account')
  } else {
    router.push('/api')
  }
}

const handleSubmit = async () => {
  // 检查登录状态
  const savedAccountInfo = sessionStorage.getItem('accountInfo')
  const isLoggedIn = sessionStorage.getItem('isLoggedIn')
  
  if (!savedAccountInfo || isLoggedIn !== 'true') {
    alert('请先登录后再购买')
    router.push('/account')
    return
  }
  
  // 验证
  if (!formData.value.country) {
    alert('请选择国家')
    return
  }
  if (!formData.value.serviceId) {
    alert('请选择业务')
    return
  }

  try {
    // 显示加载提示
    const loadingToast = document.createElement('div')
    loadingToast.textContent = '正在创建订单...'
    loadingToast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 15px 30px; border-radius: 8px; z-index: 9999; font-size: 16px;'
    document.body.appendChild(loadingToast)
    
    console.log('开始提交订单...')
    
    const selectedService = services.value.find(s => s.id == formData.value.serviceId)
    if (!selectedService) {
      alert('服务不存在')
      return
    }
    
    const formBody = new URLSearchParams({
      title: selectedService.name,
      price: selectedService.price || '0.00',
      amount: 1,
      pay_amount: selectedService.price || '0.00',
      email: '',
      img_path: 'https://jm273.cc/static/images/be7fa42546e73d642a19b19a8dcb6fa4.gif',
      country: formData.value.countrySearch,
      gender: 'random',
      goods_id: formData.value.serviceId
    })

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时
    
    const response = await fetch('/custom-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formBody.toString(),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    // 移除加载提示
    document.body.removeChild(loadingToast)
    
    console.log('响应状态:', response.status)
    console.log('响应OK:', response.ok)

    if (response.ok) {
      const data = await response.json()
      console.log('订单创建响应:', data)
      
      if (data.success && data.url) {
        // 从URL中提取订单号
        const orderSN = data.url.split('/').pop()
        console.log('订单号:', orderSN)
        
        // 保存订单数据到 sessionStorage
        const orderDataToSave = {
          orderSN: orderSN,
          title: selectedService.name,
          productName: selectedService.name,
          buy_amount: 1,
          quantity: 1,
          unitPrice: selectedService.price || '0.00',
          actual_price: selectedService.price || '0.00',
          actualPrice: selectedService.price || '0.00',
          email: '',
          country: formData.value.countrySearch,
          gender: 'random',
          // 保存 id 参数（从 URL 获取）
          id: new URLSearchParams(window.location.search).get('id') || ''
        }
        
        sessionStorage.setItem(`order_${orderSN}`, JSON.stringify(orderDataToSave))
        console.log('订单数据已保存到sessionStorage:', orderDataToSave)
        
        // 获取网站名称（如果有shopConfig）
        const websiteName = shopConfig?.value?.merchant_name || '好旺担保'
        sessionStorage.setItem(`website_name_${orderSN}`, websiteName)
        
        // 确保域名列表已加载（如果还没有加载）
        try {
          await loadCashierDomains()
        } catch (error) {
          // console.warn('⚠️ 加载域名列表失败，使用默认域名:', error)
        }
        
        // 跳转到统一收银台（使用轮询域名）
        const idParam = orderDataToSave?.id || ''
        const amount = orderDataToSave?.actual_price || orderDataToSave?.actualPrice || '0'
        navigateToCashier(orderSN, orderDataToSave, websiteName, idParam, amount)
      } else {
        console.error('订单创建失败，响应数据不正确:', data)
        alert('订单创建失败，请重试')
      }
    } else {
      const errorText = await response.text()
      console.error('提交失败，HTTP状态:', response.status)
      console.error('错误响应:', errorText)
      alert(`提交失败(${response.status})，请重试`)
    }
  } catch (error) {
    console.error('提交订单异常:', error)
    console.error('错误类型:', error.name)
    console.error('错误消息:', error.message)
    console.error('错误堆栈:', error.stack)
    
    // 检查是否是网络错误或超时
    if (error.name === 'AbortError') {
      alert('请求超时，请检查网络连接后重试')
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert('网络连接失败，请检查：\n1. 网络连接是否正常\n2. 服务器是否可访问\n3. 是否有防火墙阻止')
    } else {
      alert(`网络错误: ${error.message || '请检查连接后重试'}`)
    }
  }
}

// 加载服务数据
const loadServices = async () => {
  try {
    console.log('开始加载服务数据...')
    // 优先从Supabase加载服务数据
    const { data: servicesData, error } = await supabase
      .from('jm273_services')
      .select('*')
      .is('deletetime', null)
    
    console.log('服务数据查询结果:', { 
      dataCount: servicesData?.length || 0, 
      error: error ? JSON.stringify(error, null, 2) : null 
    })
    
    if (!error && servicesData && servicesData.length > 0) {
      // 转换数据格式以匹配现有代码
      services.value = servicesData.map(s => ({
        id: s.id,
        name: s.name,
        price: parseFloat(s.price).toFixed(5),
        country: s.country_id,
        countryName: s.country_name
      }))
      console.log('✅ 从Supabase加载服务数据完成:', services.value.length, '个服务')
    } else {
      console.error('❌ 从Supabase加载服务数据失败:', error)
      if (error) {
        console.error('错误详情:', JSON.stringify(error, null, 2))
      }
      // 如果Supabase失败，尝试从API加载
      try {
        const servicesResponse = await fetch('/api/services')
        if (servicesResponse.ok) {
          const apiData = await servicesResponse.json()
          services.value = apiData.data || []
          console.log('从API加载服务数据完成:', services.value.length, '个服务')
        } else {
          services.value = []
          console.log('API加载失败，服务列表为空')
        }
      } catch (apiError) {
        console.error('从API加载服务数据失败:', apiError)
        services.value = []
      }
    }
  } catch (error) {
    console.error('❌ 加载服务数据异常:', error)
    services.value = []
  }
}

// 从URL获取unique_id
function getUniqueIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  const idParam = urlParams.get('id')
  if (!idParam) {
    return null
  }
  const match = idParam.match(/^(trc|erc|bsc|okc|pol|grc)(\d{9})$/)
  return match ? match[2] : null
}

// 获取代理信息
async function queryDailiInfo(uniqueId) {
  try {
    const response = await fetch('/api/get_daili_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `unique_id=${encodeURIComponent(uniqueId)}`
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('代理信息:', data)
      
      if (data.code === 'yes' && data.data && data.data.username) {
        dailiInfo.value.username = data.data.username
        console.log('已设置代理客服:', dailiInfo.value.username)
      }
    }
  } catch (error) {
    console.error('获取代理信息失败:', error)
  }
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  if (!event.target.closest('.el-select')) {
    showCountryDropdown.value = false
    showServiceDropdown.value = false
  }
}

onMounted(async () => {
  // 先加载国家列表，再加载服务列表
  await loadCountries()
  await loadServices()
  
  // 预加载收银台域名列表
  try {
    await loadCashierDomains()
  } catch (error) {
    // console.warn('⚠️ 预加载域名列表失败:', error)
  }
  
  // 从 URL 获取 Telegram 用户名
  const urlParams = new URLSearchParams(window.location.search)
  const tgUsername = urlParams.get('tg')
  
  if (tgUsername) {
    // 保存到 sessionStorage
    sessionStorage.setItem('tg_username', tgUsername)
    console.log('从URL获取Telegram用户名:', tgUsername)
  }
  
  // 延迟获取代理信息
  setTimeout(() => {
    const uniqueId = getUniqueIdFromURL()
    if (uniqueId) {
      queryDailiInfo(uniqueId)
    }
  }, 1000)
  
  // 添加点击外部关闭下拉框的事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
/* 全局样式 - 不使用 scoped */
body {
  background-color: #f4f4f4;
  margin: 0;
  font-size: 14px;
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.6;
}

body input {
  font-family: inherit;
  font-size: inherit;
}

.box {
  word-break: break-all;
  word-wrap: break-word;
  max-width: 800px;
  display: block;
  margin: auto;
}

#banner {
  display: block;
  margin: 10px auto auto;
  width: 90%;
  border-radius: 10px;
  box-shadow: 0 0 4px gray;
}

.main {
  margin: 15px;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 4px gray;
}

.main-title-blue {
  margin-left: -15px;
  padding-left: 15px;
  border-left: 2px solid #2080f0;
  margin-top: 10px;
  word-break: break-all;
}

.main-title-green {
  margin-left: -15px;
  padding-left: 15px;
  border-left: 2px solid #09bb07;
  margin-top: 10px;
  margin-bottom: 10px;
  word-break: break-all;
}

.main-title-green .el-tag {
  display: inline-block;
}


/* Element Plus 标签样式 */
.el-tag {
  --el-tag-bg-color: var(--el-color-primary-light-9);
  --el-tag-border-color: var(--el-color-primary-light-8);
  --el-tag-text-color: var(--el-color-primary);
  --el-tag-hover-color: var(--el-color-primary);
  background-color: var(--el-tag-bg-color);
  border-color: var(--el-tag-border-color);
  color: var(--el-tag-text-color);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  font-size: 12px;
  line-height: 24px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
}

.el-tag__content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.el-tag--large {
  height: 32px;
  padding: 0 11px;
  font-size: 14px;
}

.el-tag--dark {
  --el-tag-bg-color: var(--el-color-primary);
  --el-tag-border-color: var(--el-color-primary);
  --el-tag-text-color: var(--el-color-white);
  --el-tag-hover-color: var(--el-color-white);
}

.el-tag--success {
  --el-tag-bg-color: var(--el-color-success-light-9);
  --el-tag-border-color: var(--el-color-success-light-8);
  --el-tag-text-color: var(--el-color-success);
}

.el-tag--success.el-tag--dark {
  --el-tag-bg-color: var(--el-color-success);
  --el-tag-border-color: var(--el-color-success);
  --el-tag-text-color: var(--el-color-white);
}

.el-tag--light {
  --el-tag-bg-color: rgba(64, 158, 255, 0.1);
  --el-tag-border-color: rgba(64, 158, 255, 0.2);
  --el-tag-text-color: #409eff;
}

.merchant-tag.el-tag--light {
  --el-tag-bg-color: #f0f9eb;
  --el-tag-border-color: #e1f3d8;
  --el-tag-text-color: #67c23a;
}

.merchant-tag {
  display: inline-block;
  min-width: 80px;
  margin-right: 10px;
  vertical-align: middle;
}

/* Telegram 客服按钮样式 - 荧光绿色 */
.tg-button {
  /* 主题颜色变量 - 荧光绿色 */
  --main-color: #00ff41;
  --main-bg-color: rgba(0, 255, 65, 0.36);
  --pattern-color: rgba(0, 255, 65, 0.073);
  
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  display: inline-block;
  background: radial-gradient(
      circle,
      var(--main-bg-color) 0%,
      rgba(0, 0, 0, 0) 95%
    ),
    linear-gradient(var(--pattern-color) 1px, transparent 1px),
    linear-gradient(to right, var(--pattern-color) 1px, transparent 1px);
  background-size:
    cover,
    15px 15px,
    15px 15px;
  background-position: center center, center center, center center;
  border-image: radial-gradient(
      circle,
      var(--main-color) 0%,
      rgba(0, 0, 0, 0) 100%
    )
    1;
  border-width: 1px 0 1px 0;
  border-style: solid;
  color: var(--main-color);
  padding: 0.2rem 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: background-size 0.2s ease-in-out;
  vertical-align: middle;
}

.tg-button:hover {
  background-size:
    cover,
    10px 10px,
    10px 10px;
}

.tg-button:active {
  filter: brightness(0.85);
}

/* 表格样式 */
.n-table {
  font-size: var(--n-font-size);
  font-variant-numeric: tabular-nums;
  line-height: var(--n-line-height);
  width: 100%;
  border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  background-color: var(--n-td-color);
  border-color: var(--n-merged-border-color);
  transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier), color .3s var(--n-bezier);
  --n-merged-border-color: var(--n-border-color);
}

.n-table td {
  transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier), color .3s var(--n-bezier);
  padding: var(--n-td-padding);
  color: var(--n-td-text-color);
  background-color: var(--n-td-color);
  border: 0px solid var(--n-merged-border-color);
  border-bottom: 1px solid var(--n-merged-border-color);
}

.n-table.n-table--single-line td {
  border-right: 0px solid var(--n-merged-border-color);
}

.n-table:not(.n-table--bottom-bordered) tr:last-child td {
  border-bottom: 0px solid var(--n-merged-border-color);
}

/* Element Plus 表单样式 */
.el-form {
  --el-form-label-font-size: 14px;
}

.el-form--label-right .el-form-item__label {
  justify-content: flex-end;
  text-align: right;
}

.el-form-item {
  display: flex;
  margin-bottom: 18px;
}

.el-form-item__label {
  display: inline-flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex: 0 0 auto;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}

.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before {
  content: "*";
  color: var(--el-color-danger);
  margin-right: 4px;
}

.el-form-item__content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
  line-height: 32px;
  position: relative;
  font-size: 14px;
}

/* Element Plus 输入框样式 */
.el-input {
  --el-input-text-color: var(--el-text-color-regular);
  --el-input-border: var(--el-border);
  --el-input-hover-border: var(--el-border-color-hover);
  --el-input-focus-border: var(--el-color-primary);
  --el-input-border-color: var(--el-border-color);
  --el-input-border-radius: var(--el-border-radius-base);
  --el-input-bg-color: var(--el-fill-color-blank);
  --el-input-icon-color: var(--el-text-color-placeholder);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-input-hover-border-color: var(--el-border-color-hover);
  --el-input-clear-hover-color: var(--el-text-color-secondary);
  --el-input-focus-border-color: var(--el-color-primary);
  --el-input-width: 100%;
  position: relative;
  font-size: 14px;
  display: inline-flex;
  width: var(--el-input-width);
  line-height: 32px;
  box-sizing: border-box;
  vertical-align: middle;
}

.el-input__wrapper {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 11px;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  cursor: text;
  transition: var(--el-transition-box-shadow);
  transform: translateZ(0);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

.el-input__inner {
  --el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);
  width: 100%;
  flex-grow: 1;
  -webkit-appearance: none;
  color: var(--el-input-text-color, var(--el-text-color-regular));
  font-size: inherit;
  height: var(--el-input-inner-height);
  line-height: var(--el-input-inner-height);
  padding: 0;
  outline: 0;
  border: none;
  background: 0 0;
  box-sizing: border-box;
}

/* 数字输入框 */
.el-input-number {
  position: relative;
  display: inline-flex;
  width: 150px;
  line-height: 30px;
}

.el-input-number .el-input {
  display: block;
}

.el-input-number .el-input__inner {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  padding-left: 42px;
  padding-right: 42px;
  text-align: center;
}

.el-input-number__decrease,
.el-input-number__increase {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  position: absolute;
  z-index: 1;
  top: 1px;
  bottom: 1px;
  width: 32px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  cursor: pointer;
  font-size: 13px;
  user-select: none;
}

.el-input-number__decrease:hover,
.el-input-number__increase:hover {
  color: var(--el-color-primary);
}

.el-input-number__increase {
  right: 1px;
  border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;
  border-left: var(--el-border);
}

.el-input-number__decrease {
  left: 1px;
  border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
  border-right: var(--el-border);
}

.el-icon {
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: inherit;
  font-size: inherit;
}

.el-icon svg {
  height: 1em;
  width: 1em;
}

/* 单选按钮 */
.el-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  font-size: 0;
}

.el-radio {
  --el-radio-font-size: 14px;
  --el-radio-text-color: var(--el-text-color-regular);
  --el-radio-font-weight: 500;
  --el-radio-input-height: 14px;
  --el-radio-input-width: 14px;
  --el-radio-input-border-radius: var(--el-border-radius-circle);
  --el-radio-input-bg-color: var(--el-fill-color-blank);
  --el-radio-input-border: var(--el-border);
  --el-radio-input-border-color: var(--el-border-color);
  color: var(--el-radio-text-color);
  font-weight: var(--el-radio-font-weight);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  outline: 0;
  font-size: var(--el-font-size-base);
  user-select: none;
  margin-right: 30px;
  height: 32px;
}

.el-radio__input {
  white-space: nowrap;
  cursor: pointer;
  outline: 0;
  display: inline-flex;
  position: relative;
  vertical-align: middle;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  border: 1px solid #dcdfe6;
  background-color: #fff;
}

.el-radio__input::after {
  content: "";
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform .15s ease-in;
}

.el-radio__input.is-checked {
  border-color: #409eff;
  background-color: #409eff;
}

.el-radio__input.is-checked::after {
  transform: translate(-50%, -50%) scale(1);
}

.el-radio__input .el-radio__original {
  opacity: 0;
  outline: 0;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.el-radio__label {
  font-size: var(--el-radio-font-size);
  padding-left: 8px;
}

.el-radio.is-checked {
  color: #409eff;
}

.el-radio:hover .el-radio__input {
  border-color: #409eff;
}

/* 按钮样式 */
.el-button {
  --el-button-font-weight: 500;
  --el-button-border-color: var(--el-border-color);
  --el-button-bg-color: var(--el-fill-color-blank);
  --el-button-text-color: var(--el-text-color-regular);
  --el-button-disabled-text-color: var(--el-disabled-text-color);
  --el-button-disabled-bg-color: var(--el-fill-color-blank);
  --el-button-disabled-border-color: var(--el-border-color-light);
  --el-button-hover-text-color: var(--el-color-primary);
  --el-button-hover-bg-color: var(--el-color-primary-light-9);
  --el-button-hover-border-color: var(--el-color-primary-light-7);
  --el-button-active-text-color: var(--el-button-hover-text-color);
  --el-button-active-border-color: var(--el-color-primary);
  --el-button-active-bg-color: var(--el-button-hover-bg-color);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: var(--el-button-text-color);
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  transition: .1s;
  font-weight: var(--el-button-font-weight);
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: var(--el-button-bg-color);
  border: var(--el-border);
  border-color: var(--el-button-border-color);
  padding: 8px 15px;
  font-size: 14px;
  border-radius: var(--el-border-radius-base);
}

.el-button--large {
  --el-button-size: 40px;
  height: var(--el-button-size);
  padding: 12px 19px;
  font-size: 14px;
  border-radius: var(--el-border-radius-base);
}

/* 下拉框样式 */
.el-select {
  position: relative;
  width: 100%;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.select-dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: background-color 0.2s;
}

.select-dropdown-item:hover {
  background-color: #f5f7fa;
}

.select-dropdown-item.selected {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 导航标签栏样式 */
.nav-tabs {
  margin: 15px;
  background: #fff;
  padding: 0;
  border-radius: 10px;
  box-shadow: 0 0 4px gray;
  display: flex;
  overflow-x: auto;
}

.nav-tab {
  flex: 1;
  padding: 12px 20px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  white-space: nowrap;
  min-width: 80px;
}

.nav-tab:hover {
  color: #409eff;
}

.nav-tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 500;
}

/* 表单行样式 */
.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-label {
  flex-shrink: 0;
  white-space: nowrap;
}

.form-input-wrapper {
  flex: 1;
  min-width: 0;
}

/* 购买记录表格样式 */
.purchase-records-table {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.purchase-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.purchase-table thead {
  background-color: #f5f7fa;
}

.purchase-table th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 500;
  color: #606266;
  border-bottom: 1px solid #dcdfe6;
  font-size: 13px;
}

.purchase-table td {
  padding: 10px 12px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.purchase-table tbody tr:last-child td {
  border-bottom: none;
}

/* 预计费用样式 */
.estimated-cost {
  background-color: #f0f9eb;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
}

.cost-amount {
  color: #f56c6c;
  font-weight: 500;
}

/* 提示信息样式 */
.info-message {
  background-color: #fdf6ec;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

/* 立即购买按钮 */
.buy-button {
  width: 100%;
  margin-top: 15px;
  background-color: #67c23a;
  border-color: #67c23a;
  color: #fff;
}

.buy-button:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}

.buy-button:active {
  background-color: #529b2e;
  border-color: #529b2e;
}

/* 下拉框箭头图标 */
.el-input__suffix {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.el-input__suffix-inner {
  display: flex;
  align-items: center;
  color: #c0c4cc;
}

.el-icon-arrow-down::before {
  content: "▼";
  font-size: 12px;
}

/* 下拉框样式 */
.country-dropdown,
.service-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.country-option,
.service-option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: background-color 0.2s;
}

.country-option:hover,
.service-option:hover {
  background-color: #f5f7fa;
}

.country-option:active,
.service-option:active {
  background-color: #ecf5ff;
  color: #409eff;
}

.el-select {
  position: relative;
}

.el-button--primary {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
  --el-button-active-bg-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-primary-light-5);
  --el-button-disabled-border-color: var(--el-color-primary-light-5);
}

.el-button:hover {
  color: var(--el-button-hover-text-color);
  border-color: var(--el-button-hover-border-color);
  background-color: var(--el-button-hover-bg-color);
  outline: 0;
}

.el-button:active {
  color: var(--el-button-active-text-color);
  border-color: var(--el-button-active-border-color);
  background-color: var(--el-button-active-bg-color);
  outline: 0;
}

/* CSS 变量定义 */
:root {
  --el-color-white: #ffffff;
  --el-color-black: #000000;
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
  --el-color-success: #67c23a;
  --el-color-success-light-3: #95d475;
  --el-color-success-light-5: #b3e19d;
  --el-color-success-light-7: #d1edc4;
  --el-color-success-light-8: #e1f3d8;
  --el-color-success-light-9: #f0f9eb;
  --el-color-success-dark-2: #529b2e;
  --el-color-danger: #f56c6c;
  --el-border: 1px solid var(--el-border-color);
  --el-border-color: #dcdfe6;
  --el-border-color-hover: #c0c4cc;
  --el-border-color-light: #e4e7ed;
  --el-border-radius-base: 4px;
  --el-border-radius-circle: 100%;
  --el-fill-color-blank: #ffffff;
  --el-fill-color-light: #f5f7fa;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #a8abb2;
  --el-disabled-text-color: #c0c4cc;
  --el-transition-box-shadow: box-shadow .2s cubic-bezier(.645,.045,.355,1);
}
</style>
