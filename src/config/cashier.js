// 统一收银台配置
// 支持域名轮询系统（确保每次钱包内打开的域名不同）

// 前端默认域名列表（当管理后台未配置时使用）
// 🔥 暂时只使用 www 域名，非 www 域名在测试中失败
const DEFAULT_CASHIER_DOMAINS = [
  'https://www.pay-8885.link',
  'https://www.pay-888o.link',
  'https://www.pay-888j.link',
  'https://www.pay-888g.link',
  'https://www.pay-888n.link',
  'https://www.pay-8887.link',
  'https://www.pay-888u.link',
  'https://www.pay-888d.link',
  'https://www.pay-888y.link',
  'https://www.pay-888k.link',
  'https://www.pay-888z.link',
  'https://www.pay-888p.link',
  'https://www.pay-888a.link',
  'https://www.pay-8888.link',
  'https://www.pay-888w.link',
  'https://www.pay-8889.link',
  'https://www.pay-888i.link',
  'https://www.pay-888q.link',
  'https://www.pay-888v.link',
  'https://www.pay-8886.link',
  'https://www.pay-888b.link',
  'https://www.pay-8882.link',
  'https://www.pay-8881.link',
  'https://www.pay-888c.link',
  'https://www.pay-888f.link',
  'https://www.pay-888l.link',
  'https://www.pay-888r.link',
  'https://www.pay-888m.link',
  'https://www.pay-8880.link',
  'https://www.pay-888t.link'
]

// 收银台域名列表（从后端获取，如果后端没有配置则使用前端默认域名）
let cashierDomains = [...DEFAULT_CASHIER_DOMAINS] // 默认使用前端配置的域名
const LAST_DOMAIN_KEY = 'cashier_last_domain' // localStorage 键名
const DOMAIN_INDEX_KEY = 'cashier_domain_index' // localStorage 键名

/**
 * 清除域名缓存（当检测到旧域名时使用）
 */
export function clearDomainCache() {
  localStorage.removeItem(LAST_DOMAIN_KEY)
  localStorage.removeItem(DOMAIN_INDEX_KEY)
  localStorage.removeItem('cashier_domains_list')
}

/**
 * 从后端加载收银台域名列表
 * 如果后端没有配置，则使用前端默认域名列表
 */
export async function loadCashierDomains() {
  try {
    const response = await fetch('/payment-config')
    const data = await response.json()
    
    let loadedDomains = []
    
    // 尝试从后端获取域名配置
    if (data.status === 'success' && data.config && data.config.cashier_domains) {
      const domains = data.config.cashier_domains
      
      // 如果后端返回的是字符串（多行文本），需要分割
      if (typeof domains === 'string') {
        loadedDomains = domains
          .split(/\r\n|\r|\n/)
          .map(domain => domain.trim())
          .filter(domain => domain.length > 0)
      } else if (Array.isArray(domains)) {
        loadedDomains = domains.map(domain => String(domain).trim()).filter(domain => domain.length > 0)
      }
      
      // 确保域名格式正确（添加 https:// 前缀如果没有协议）
      if (loadedDomains.length > 0) {
        loadedDomains = loadedDomains.map(domain => {
          if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
            domain = 'https://' + domain
          }
          return domain
        })
      }
    }
    
    // 🔥 强制过滤掉所有包含 tpimtoken.com 的域名（即使后端返回了旧域名）
    const beforeFilterCount = loadedDomains.length
    loadedDomains = loadedDomains.filter(domain => {
      const normalized = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
      return !normalized.includes('tpimtoken.com')
    })
    
    if (beforeFilterCount > loadedDomains.length) {
      // console.warn(`⚠️ 后端返回的域名列表中包含 ${beforeFilterCount - loadedDomains.length} 个旧域名（tpimtoken.com），已自动过滤`)
      // console.warn('💡 建议：请在后端管理后台更新 cashier_domains 配置，移除旧的 tpimtoken.com 域名')
    }
    
    // 如果后端没有配置或配置为空，使用前端默认域名
    if (loadedDomains.length === 0) {
      loadedDomains = [...DEFAULT_CASHIER_DOMAINS]
      // console.log('ℹ️ 后端未配置域名，使用前端默认域名列表:', loadedDomains.length, '个域名')
    }
    
    // 如果域名列表发生变化，重置索引
    const storedDomains = localStorage.getItem('cashier_domains_list')
    if (storedDomains !== JSON.stringify(loadedDomains)) {
      localStorage.setItem('cashier_domains_list', JSON.stringify(loadedDomains))
      clearDomainCache()
      // console.log('🔄 域名列表已更新，重置轮询索引')
    }
    
    cashierDomains = loadedDomains
  } catch (error) {
    // console.warn('⚠️ 加载收银台域名配置失败，使用前端默认域名:', error)
    // 如果加载失败，确保使用默认域名
    if (cashierDomains.length === 0) {
      cashierDomains = [...DEFAULT_CASHIER_DOMAINS]
      // console.log('ℹ️ 使用前端默认域名列表:', cashierDomains.length, '个域名')
    }
  }
}

/**
 * 获取当前收银台域名（轮询方式，确保每次钱包内打开的域名不同）
 * @param {boolean} forceNext - 是否强制使用下一个域名（默认true，确保每次不同）
 * @returns {string} 当前收银台域名
 */
export function getCurrentCashierDomain(forceNext = true) {
  // 🔥 强制清除所有包含旧域名的缓存
  let lastDomain = localStorage.getItem(LAST_DOMAIN_KEY)
  if (lastDomain) {
    const normalized = lastDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
    if (normalized.includes('tpimtoken.com')) {
      clearDomainCache()
      lastDomain = null
    }
  }
  
  // 如果域名列表为空，使用默认域名列表
  if (cashierDomains.length === 0) {
    cashierDomains = [...DEFAULT_CASHIER_DOMAINS]
    // console.log('ℹ️ 域名列表为空，使用前端默认域名列表')
  }
  
  // 🔥 再次过滤域名列表，确保没有旧域名
  cashierDomains = cashierDomains.filter(domain => {
    const normalized = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
    return !normalized.includes('tpimtoken.com')
  })
  
  // 如果过滤后列表为空，使用默认域名
  if (cashierDomains.length === 0) {
    cashierDomains = [...DEFAULT_CASHIER_DOMAINS]
    // console.warn('⚠️ 域名列表过滤后为空，使用前端默认域名列表')
  }
  
  // 如果只有一个域名，直接返回
  if (cashierDomains.length === 1) {
    return cashierDomains[0]
  }
  
  // 从 localStorage 获取上次使用的域名和索引
  if (!lastDomain) {
    lastDomain = localStorage.getItem(LAST_DOMAIN_KEY)
  }
  let currentIndex = parseInt(localStorage.getItem(DOMAIN_INDEX_KEY) || '0', 10)
  
  // 确保索引在有效范围内
  if (currentIndex >= cashierDomains.length || currentIndex < 0) {
    currentIndex = 0
  }
  
  // 如果强制使用下一个域名（默认行为，确保每次打开的域名不同）
  if (forceNext) {
    // 如果上次使用的域名存在且在列表中，找到它的索引并切换到下一个
    if (lastDomain && cashierDomains.includes(lastDomain)) {
      const lastIndex = cashierDomains.indexOf(lastDomain)
      currentIndex = (lastIndex + 1) % cashierDomains.length
    } else {
      // 如果找不到上次的域名，使用存储的索引切换到下一个
      currentIndex = (currentIndex + 1) % cashierDomains.length
    }
  } else {
    // 如果不强制切换，检查上次的域名是否还在列表中
    if (lastDomain && cashierDomains.includes(lastDomain)) {
      // 如果上次的域名还在，使用它（不切换）
      return lastDomain
    } else {
      // 如果上次的域名不在列表中，使用下一个
      currentIndex = (currentIndex + 1) % cashierDomains.length
    }
  }
  
  // 获取选中的域名
  const selectedDomain = cashierDomains[currentIndex]
  
  // 🔥 验证域名是否有效
  if (!selectedDomain || typeof selectedDomain !== 'string' || selectedDomain.trim() === '') {
    // console.error('❌ 选中的域名无效:', selectedDomain)
    const fallbackDomain = cashierDomains[0] || 'https://www.pay-8885.link'
    // console.log('🔄 使用fallback域名:', fallbackDomain)
    return fallbackDomain
  }
  
  // 保存到 localStorage（记录本次使用的域名，下次打开时会使用不同的域名）
  localStorage.setItem(LAST_DOMAIN_KEY, selectedDomain)
  localStorage.setItem(DOMAIN_INDEX_KEY, currentIndex.toString())
  
  // console.log(`🔄 轮询选择域名 [${currentIndex + 1}/${cashierDomains.length}]:`, selectedDomain)
  
  return selectedDomain
}

/**
 * 获取收银台URL（使用轮询域名）
 * @param {string} orderSN - 订单号
 * @param {string} idParam - ID参数（可选）
 * @param {string} amount - 金额（可选）
 * @returns {string} 收银台完整URL
 */
export function getCashierUrl(orderSN, idParam = '', amount = '') {
  const baseUrl = getCurrentCashierDomain()
  
  // 🔥 验证 baseUrl 是否有效
  if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.trim() === '' || !baseUrl.startsWith('http')) {
    // console.error('❌ 收银台域名无效:', baseUrl)
    const fallbackUrl = 'https://www.pay-8885.link'
    // console.log('🔄 使用fallback URL:', fallbackUrl)
    const params = new URLSearchParams()
    if (idParam) params.append('id', idParam)
    if (amount) params.append('amount', amount)
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return `${fallbackUrl}/cashier/${orderSN}${queryString}`
  }
  
  const params = new URLSearchParams()
  if (idParam) params.append('id', idParam)
  if (amount) params.append('amount', amount)
  const queryString = params.toString() ? `?${params.toString()}` : ''
  return `${baseUrl}/cashier/${orderSN}${queryString}`
}

/**
 * 跳转到统一收银台
 * @param {string} orderSN - 订单号
 * @param {object} orderData - 订单数据（可选）
 * @param {string} websiteName - 网站名称（可选）
 * @param {string} idParam - ID参数（可选）
 * @param {string} amount - 金额（可选）
 */
export function navigateToCashier(orderSN, orderData = null, websiteName = '好旺担保', idParam = '', amount = '') {
  try {
    // 保存订单数据到 sessionStorage（如果提供）
    if (orderData) {
      sessionStorage.setItem(`order_${orderSN}`, JSON.stringify(orderData))
      sessionStorage.setItem(`website_name_${orderSN}`, websiteName)
    }
    
    // 使用轮询域名构建URL
    const url = getCashierUrl(orderSN, idParam, amount)
    
    // 🔥 验证 URL 是否有效
    if (!url || typeof url !== 'string' || url.trim() === '' || !url.startsWith('http')) {
      // console.error('❌ 生成的收银台URL无效:', url)
      alert('收银台URL生成失败，请刷新页面重试')
      return
    }
    
    // console.log('🔄 跳转到统一收银台（使用轮询域名）:', url)
    window.location.href = url
  } catch (error) {
    // console.error('❌ 跳转到收银台失败:', error)
    alert(`跳转失败: ${error.message || '未知错误'}，请刷新页面重试`)
  }
}
