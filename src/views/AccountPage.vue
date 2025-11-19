<template>
  <div class="box">
    <img id="banner" :src="bannerImage" alt="banner" />
    
    <!-- 导航标签栏 -->
    <div class="nav-tabs">
      <div class="nav-tab" @click="$router.push('/')">首页</div>
      <div class="nav-tab" @click="$router.push('/recharge')">充值</div>
      <div class="nav-tab" @click="$router.push('/orders')">我的订单</div>
      <div class="nav-tab active">账户</div>
      <div class="nav-tab" @click="handleApiClick">API接口</div>
    </div>
    
    <!-- 登录前：登录表单 -->
    <div v-if="!isLoggedIn" class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">欢迎登录</span>
        </span>
      </p>
      
      <div class="el-form-item is-required asterisk-left el-form-item--feedback" style="margin-top: 15px;">
        <div class="el-form-item__label">用户名</div>
        <div class="el-form-item__content">
          <div class="el-input">
            <div class="el-input__wrapper">
              <input 
                class="el-input__inner" 
                type="text" 
                autocomplete="off" 
                placeholder="请输入用户名" 
                v-model="loginForm.username"
              >
            </div>
          </div>
        </div>
      </div>
      
      <div class="el-form-item is-required asterisk-left el-form-item--feedback" style="margin-top: 15px;">
        <div class="el-form-item__label">密码</div>
        <div class="el-form-item__content">
          <div class="el-input">
            <div class="el-input__wrapper">
              <input 
                class="el-input__inner" 
                type="password" 
                autocomplete="off" 
                placeholder="请输入密码" 
                v-model="loginForm.password"
              >
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 20px; display: flex; gap: 10px;">
        <button type="button" class="el-button el-button--success el-button--large" style="flex: 1" @click="handleLogin">
          <span class="el-button__text">登录</span>
        </button>
        <button type="button" class="el-button el-button--primary el-button--large" style="flex: 1" @click="handleRegister">
          <span class="el-button__text">注册</span>
        </button>
      </div>
    </div>
    
    <!-- 登录后：账户详情 -->
    <template v-else>
      <div class="main">
        <p class="main-title-green">
          <span class="el-tag el-tag--success el-tag--large el-tag--dark">
            <span class="el-tag__content">账户详情</span>
          </span>
        </p>
        <table class="n-table n-table--single-line" :style="tableStyle">
          <tbody>
            <tr>
              <td>
                <span class="el-tag el-tag--large el-tag--light merchant-tag">
                  <span class="el-tag__content">账号</span>
                </span>
                {{ accountInfo.username || '-' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="el-tag el-tag--large el-tag--light merchant-tag">
                  <span class="el-tag__content">余额</span>
                </span>
                {{ accountInfo.balance || '-' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="el-tag el-tag--large el-tag--light merchant-tag">
                  <span class="el-tag__content">邮箱</span>
                </span>
                <div style="display: inline-flex; align-items: center; gap: 10px; flex: 1;">
                  <input 
                    v-if="editingEmail"
                    type="email" 
                    v-model="emailInput"
                    placeholder="请输入邮箱"
                    class="el-input__inner"
                    style="flex: 1; max-width: 300px;"
                    @keyup.enter="saveEmail"
                    @keyup.esc="cancelEditEmail"
                  >
                  <span v-else>{{ accountInfo.email || '-' }}</span>
                  <button 
                    v-if="!editingEmail"
                    type="button" 
                    class="el-button el-button--small"
                    style="padding: 4px 12px; font-size: 12px;"
                    @click="startEditEmail"
                  >
                    {{ accountInfo.email && accountInfo.email !== '-' ? '修改' : '绑定' }}
                  </button>
                  <div v-else style="display: flex; gap: 5px;">
                    <button 
                      type="button" 
                      class="el-button el-button--success el-button--small"
                      style="padding: 4px 12px; font-size: 12px;"
                      @click="saveEmail"
                    >
                      保存
                    </button>
                    <button 
                      type="button" 
                      class="el-button el-button--small"
                      style="padding: 4px 12px; font-size: 12px;"
                      @click="cancelEditEmail"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span class="el-tag el-tag--large el-tag--light merchant-tag">
                  <span class="el-tag__content">最近登录时间</span>
                </span>
                {{ accountInfo.lastLoginTime || '-' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="el-tag el-tag--large el-tag--light merchant-tag">
                  <span class="el-tag__content">最近登录ip</span>
                </span>
                {{ accountInfo.lastLoginIp || '-' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="el-tag el-tag--large el-tag--light merchant-tag">
                  <span class="el-tag__content">API秘钥</span>
                </span>
                {{ accountInfo.apiKey || '-' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="el-tag el-tag--large el-tag--light merchant-tag">
                  <span class="el-tag__content">注册时间</span>
                </span>
                {{ accountInfo.registerTime || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 充值订单 -->
      <div class="main">
        <p class="main-title-green">
          <span class="el-tag el-tag--success el-tag--large el-tag--dark">
            <span class="el-tag__content">充值订单</span>
          </span>
        </p>
        <div class="orders-table">
          <table class="n-table n-table--single-line" :style="tableStyle">
            <thead>
              <tr>
                <th>ID</th>
                <th>订单号</th>
                <th>充值金额</th>
                <th>充值时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4" class="empty-state">
                  <p>暂无订单</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 退出账户按钮 -->
      <div class="main">
        <button type="button" class="el-button el-button--success el-button--large" style="width: 100%" @click="handleLogout">
          <span class="el-button__text">退出账户</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

// Banner图片
const bannerImage = ref('https://jm273.cc/static/images/be7fa42546e73d642a19b19a8dcb6fa4.gif')

// 登录状态
const isLoggedIn = ref(false)

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

// 账户信息
const accountInfo = ref({
  username: '',
  balance: '',
  email: '',
  lastLoginTime: '',
  lastLoginIp: '',
  apiKey: '',
  registerTime: ''
})

// 邮箱编辑状态
const editingEmail = ref(false)
const emailInput = ref('')

// 获取用户IP地址
const getUserIP = async () => {
  try {
    // 尝试从多个API获取IP
    const apis = [
      'https://api.ipify.org?format=json',
      'https://api64.ipify.org?format=json'
    ]
    
    for (const api of apis) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)
        
        const response = await fetch(api, { 
          signal: controller.signal 
        })
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          return data.ip || data.query || null
        }
      } catch (e) {
        // 超时或其他错误，继续尝试下一个API
        continue
      }
    }
    return null
  } catch (error) {
    console.error('获取IP失败:', error)
    return null
  }
}

// 开始编辑邮箱
const startEditEmail = () => {
  editingEmail.value = true
  emailInput.value = accountInfo.value.email && accountInfo.value.email !== '-' ? accountInfo.value.email : ''
}

// 取消编辑邮箱
const cancelEditEmail = () => {
  editingEmail.value = false
  emailInput.value = ''
}

// 保存邮箱
const saveEmail = async () => {
  if (!emailInput.value || !emailInput.value.includes('@')) {
    alert('请输入有效的邮箱地址')
    return
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('请先登录')
      return
    }
    
    // 更新user_profiles表的邮箱
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ email: emailInput.value })
      .eq('id', user.id)
    
    if (updateError) {
      alert(`保存邮箱失败: ${updateError.message}`)
      return
    }
    
    // 更新本地状态
    accountInfo.value.email = emailInput.value
    sessionStorage.setItem('accountInfo', JSON.stringify(accountInfo.value))
    
    editingEmail.value = false
    alert('邮箱保存成功')
  } catch (error) {
    console.error('保存邮箱失败:', error)
    alert(`保存邮箱失败: ${error.message}`)
  }
}

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

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString || dateString === 'null' || dateString === 'undefined') return '-'
  try {
    // 处理PostgreSQL的timestamp格式
    let date
    if (typeof dateString === 'string') {
      // 移除时区信息中的空格，确保正确解析
      date = new Date(dateString.replace(' ', 'T'))
    } else {
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) {
      console.warn('无效的日期:', dateString)
      return '-'
    }
    
    const formatted = date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZone: 'Asia/Shanghai'
    }).replace(/\//g, '-')
    
    return formatted
  } catch (error) {
    console.error('格式化日期失败:', error, dateString)
    return '-'
  }
}

// 加载用户信息
const loadUserInfo = async (userId, retryCount = 0) => {
  try {
    // 从auth.users获取登录信息
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('获取用户认证信息失败:', userError)
      // 如果认证失败，返回基本信息
      const apiKey = btoa(userId.replace(/-/g, '')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) || userId.replace(/-/g, '').substring(0, 32)
      return {
        username: userId.substring(0, 8),
        balance: '0.00',
        email: '-',
        lastLoginTime: '-',
        lastLoginIp: '-',
        apiKey: apiKey,
        registerTime: '-'
      }
    }
    
    // 从user_profiles表获取用户信息
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    // 如果profile不存在且是第一次尝试，等待后重试
    if (profileError && retryCount < 3) {
      console.log(`user_profiles未找到，等待后重试 (${retryCount + 1}/3)...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return loadUserInfo(userId, retryCount + 1)
    }
    
    // 生成API密钥（基于用户ID的简单哈希）
    const apiKey = btoa(userId.replace(/-/g, '')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) || userId.replace(/-/g, '').substring(0, 32)
    
    // 获取用户IP地址
    const userIP = await getUserIP()
    
    // 如果profile存在，使用profile数据
    if (profile && !profileError) {
      // 确定登录时间：优先使用profile的last_login_time，其次使用auth的last_sign_in_at
      let loginTime = profile.last_login_time || user.last_sign_in_at
      
      // 确定登录IP：优先使用profile的last_login_ip，其次使用当前获取的IP
      let loginIp = profile.last_login_ip
      if (!loginIp && userIP) {
        loginIp = userIP
        // 如果数据库中没有IP，更新数据库
        await supabase
          .from('user_profiles')
          .update({ last_login_ip: userIP })
          .eq('id', userId)
      }
      
      // 确定注册时间：优先使用profile的created_at，其次使用auth的created_at
      let registerTime = profile.created_at || user.created_at
      
      // 调试信息
      console.log('用户信息加载:', {
        profile_created_at: profile.created_at,
        user_created_at: user.created_at,
        registerTime: registerTime,
        profile_last_login_time: profile.last_login_time,
        user_last_sign_in_at: user.last_sign_in_at,
        loginTime: loginTime,
        profile_last_login_ip: profile.last_login_ip,
        userIP: userIP
      })
      
      return {
        username: profile.username || user.user_metadata?.username || user.email?.split('@')[0] || '-',
        balance: profile.balance ? parseFloat(profile.balance).toFixed(2) : '0.00',
        email: profile.email || user.email || '-',
        lastLoginTime: loginTime ? formatDateTime(loginTime) : '-',
        lastLoginIp: loginIp || '-',
        apiKey: apiKey,
        registerTime: registerTime ? formatDateTime(registerTime) : '-'
      }
    }
    
    // 如果profile不存在，使用auth.users的数据创建基本信息
    console.warn('user_profiles不存在，使用auth.users数据')
    const userIPFallback = await getUserIP()
    
    return {
      username: user.user_metadata?.username || user.email?.split('@')[0] || userId.substring(0, 8),
      balance: '0.00',
      email: user.email || '-',
      lastLoginTime: formatDateTime(user.last_sign_in_at),
      lastLoginIp: userIPFallback || '-',
      apiKey: apiKey,
      registerTime: formatDateTime(user.created_at)
    }
  } catch (error) {
    console.error('加载用户信息异常:', error)
    // 即使出错也返回基本信息
    const apiKey = btoa(userId.replace(/-/g, '')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) || userId.replace(/-/g, '').substring(0, 32)
    return {
      username: userId.substring(0, 8),
      balance: '0.00',
      email: '-',
      lastLoginTime: '-',
      lastLoginIp: '-',
      apiKey: apiKey,
      registerTime: '-'
    }
  }
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请输入用户名和密码')
    return
  }
  
  try {
    // 使用Supabase登录（支持邮箱或用户名登录）
    // 首先尝试作为邮箱登录
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginForm.value.username.includes('@') 
        ? loginForm.value.username 
        : `${loginForm.value.username}@temp.com`, // 如果不是邮箱，尝试添加临时域名
      password: loginForm.value.password
    })
    
    // 如果失败，尝试查询user_profiles表找到对应的邮箱
    if (authError && !loginForm.value.username.includes('@')) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('username', loginForm.value.username)
        .single()
      
      if (profile && profile.email) {
        const { data: retryAuthData, error: retryAuthError } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password: loginForm.value.password
        })
        
        if (!retryAuthError) {
          authData = retryAuthData
          authError = null
        }
      }
    }
    
    if (authError) {
      alert(`登录失败: ${authError.message}`)
      return
    }
    
    if (authData.user) {
      // 获取用户IP
      const userIP = await getUserIP()
      const loginTime = new Date().toISOString()
      
      // 更新登录信息到数据库
      if (userIP) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            last_login_ip: userIP,
            last_login_time: loginTime
          })
          .eq('id', authData.user.id)
        
        if (updateError) {
          console.error('更新登录信息失败:', updateError)
        }
      }
      
      // 加载用户信息
      const userInfo = await loadUserInfo(authData.user.id)
      
      if (userInfo) {
        // 如果IP获取成功，更新显示
        if (userIP) {
          userInfo.lastLoginIp = userIP
        }
        // 如果登录时间存在，更新显示
        if (authData.user.last_sign_in_at) {
          userInfo.lastLoginTime = formatDateTime(authData.user.last_sign_in_at)
        } else if (loginTime) {
          userInfo.lastLoginTime = formatDateTime(loginTime)
        }
        
        isLoggedIn.value = true
        accountInfo.value = userInfo
        
        // 保存登录状态
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('accountInfo', JSON.stringify(accountInfo.value))
        sessionStorage.setItem('userId', authData.user.id)
      } else {
        alert('获取用户信息失败')
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert(`登录失败: ${error.message}`)
  }
}

// 处理注册
const handleRegister = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请输入用户名和密码')
    return
  }
  
  // 验证密码长度
  if (loginForm.value.password.length < 6) {
    alert('密码长度至少6位')
    return
  }
  
  try {
    // 生成邮箱（如果用户名不是邮箱格式）
    const email = loginForm.value.username.includes('@') 
      ? loginForm.value.username 
      : `${loginForm.value.username}@temp.com`
    
    // 使用Supabase注册
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: loginForm.value.password,
      options: {
        data: {
          username: loginForm.value.username
        }
      }
    })
    
    // 检查错误类型
    if (authError) {
      // 如果是用户已存在的错误，尝试直接登录
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        // 用户已存在，尝试登录
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email,
          password: loginForm.value.password
        })
        
        if (loginError) {
          alert(`用户已存在，但登录失败: ${loginError.message}`)
          return
        }
        
        // 登录成功，加载用户信息
        if (loginData.user) {
          await loadAndSetUserInfo(loginData.user.id)
          return
        }
      } else {
        alert(`注册失败: ${authError.message}`)
        return
      }
    }
    
    // 注册成功
    if (authData.user) {
      // 获取用户IP
      const userIP = await getUserIP()
      const registerTime = new Date().toISOString()
      
      // 等待触发器创建user_profiles记录
      let retries = 0
      const maxRetries = 5
      
      const checkProfile = async () => {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()
        
        if (profile && !profileError) {
          // user_profiles已创建，更新用户名和注册时间
          const updateData = { username: loginForm.value.username }
          
          // 如果created_at为空，设置注册时间
          if (!profile.created_at) {
            updateData.created_at = registerTime
          }
          
          // 如果IP获取成功，也更新IP
          if (userIP) {
            updateData.last_login_ip = userIP
            updateData.last_login_time = registerTime
          }
          
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update(updateData)
            .eq('id', authData.user.id)
          
          if (updateError) {
            console.error('更新用户信息失败:', updateError)
          }
          
          // 自动登录并加载用户信息
          await loadAndSetUserInfo(authData.user.id)
        } else if (retries < maxRetries) {
          // 重试
          retries++
          setTimeout(checkProfile, 500)
        } else {
          // 超时，但仍然尝试登录
          console.warn('user_profiles创建超时，尝试直接登录')
          await loadAndSetUserInfo(authData.user.id)
        }
      }
      
      // 开始检查
      setTimeout(checkProfile, 500)
    }
  } catch (error) {
    console.error('注册失败:', error)
    alert(`注册失败: ${error.message || '未知错误'}`)
  }
}

// 加载并设置用户信息（用于注册后自动登录）
const loadAndSetUserInfo = async (userId) => {
  try {
    // 等待一下，确保触发器已经执行
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userInfo = await loadUserInfo(userId)
    
    if (userInfo) {
      isLoggedIn.value = true
      accountInfo.value = userInfo
      
      // 保存登录状态
      sessionStorage.setItem('isLoggedIn', 'true')
      sessionStorage.setItem('accountInfo', JSON.stringify(accountInfo.value))
      sessionStorage.setItem('userId', userId)
      
      // 清空登录表单
      loginForm.value = { username: '', password: '' }
      
      // 提示成功
      alert('注册成功！已自动登录')
    } else {
      // 即使loadUserInfo返回null，也应该有基本信息
      // 这种情况不应该发生，但为了安全起见
      alert('注册成功，但获取用户信息失败，请刷新页面')
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    // 即使出错，也尝试设置基本登录状态
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const apiKey = btoa(userId.replace(/-/g, '')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) || userId.replace(/-/g, '').substring(0, 32)
        isLoggedIn.value = true
        accountInfo.value = {
          username: user.user_metadata?.username || user.email?.split('@')[0] || '-',
          balance: '0.00',
          email: user.email || '-',
          lastLoginTime: '-',
          lastLoginIp: '-',
          apiKey: apiKey,
          registerTime: '-'
        }
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('accountInfo', JSON.stringify(accountInfo.value))
        sessionStorage.setItem('userId', userId)
        alert('注册成功！已自动登录（部分信息可能不完整）')
      } else {
        alert('注册成功，但获取用户信息失败，请刷新页面')
      }
    } catch (fallbackError) {
      console.error('备用方案也失败:', fallbackError)
      alert('注册成功，但获取用户信息失败，请刷新页面')
    }
  }
}

// 处理退出
const handleLogout = async () => {
  if (confirm('确定要退出账户吗？')) {
    try {
      // 使用Supabase登出
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('登出失败:', error)
      }
      
      isLoggedIn.value = false
      loginForm.value = { username: '', password: '' }
      accountInfo.value = {
        username: '',
        balance: '',
        email: '',
        lastLoginTime: '',
        lastLoginIp: '',
        apiKey: '',
        registerTime: ''
      }
      sessionStorage.removeItem('isLoggedIn')
      sessionStorage.removeItem('accountInfo')
      sessionStorage.removeItem('userId')
    } catch (error) {
      console.error('登出异常:', error)
      // 即使出错也清除本地状态
      isLoggedIn.value = false
      sessionStorage.clear()
    }
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

// 检查登录状态
onMounted(async () => {
  try {
    // 检查Supabase session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (session && session.user) {
      // 有有效的session，更新登录信息
      const userIP = await getUserIP()
      const loginTime = new Date().toISOString()
      
      // 更新登录IP和时间到数据库
      if (userIP) {
        await supabase
          .from('user_profiles')
          .update({ 
            last_login_ip: userIP,
            last_login_time: loginTime
          })
          .eq('id', session.user.id)
      }
      
      // 加载用户信息
      const userInfo = await loadUserInfo(session.user.id)
      
      if (userInfo) {
        // 确保显示最新的登录信息
        if (userIP) {
          userInfo.lastLoginIp = userIP
        }
        if (session.user.last_sign_in_at) {
          userInfo.lastLoginTime = formatDateTime(session.user.last_sign_in_at)
        } else if (loginTime) {
          userInfo.lastLoginTime = formatDateTime(loginTime)
        }
        
        isLoggedIn.value = true
        accountInfo.value = userInfo
        
        // 更新sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('accountInfo', JSON.stringify(accountInfo.value))
        sessionStorage.setItem('userId', session.user.id)
      }
    } else {
      // 没有有效session，检查本地存储（向后兼容）
      const savedLoginState = sessionStorage.getItem('isLoggedIn')
      const savedAccountInfo = sessionStorage.getItem('accountInfo')
      
      if (savedLoginState === 'true' && savedAccountInfo) {
        // 本地有数据但Supabase session已过期，清除本地数据
        sessionStorage.removeItem('isLoggedIn')
        sessionStorage.removeItem('accountInfo')
        sessionStorage.removeItem('userId')
      }
    }
    
    // 监听认证状态变化
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // 更新登录信息
        const userIP = await getUserIP()
        const loginTime = new Date().toISOString()
        
        if (userIP) {
          await supabase
            .from('user_profiles')
            .update({ 
              last_login_ip: userIP,
              last_login_time: loginTime
            })
            .eq('id', session.user.id)
        }
        
        const userInfo = await loadUserInfo(session.user.id)
        if (userInfo) {
          if (userIP) {
            userInfo.lastLoginIp = userIP
          }
          if (session.user.last_sign_in_at) {
            userInfo.lastLoginTime = formatDateTime(session.user.last_sign_in_at)
          } else if (loginTime) {
            userInfo.lastLoginTime = formatDateTime(loginTime)
          }
          
          isLoggedIn.value = true
          accountInfo.value = userInfo
          sessionStorage.setItem('isLoggedIn', 'true')
          sessionStorage.setItem('accountInfo', JSON.stringify(accountInfo.value))
          sessionStorage.setItem('userId', session.user.id)
        }
      } else if (event === 'SIGNED_OUT') {
        isLoggedIn.value = false
        accountInfo.value = {
          username: '',
          balance: '',
          email: '',
          lastLoginTime: '',
          lastLoginIp: '',
          apiKey: '',
          registerTime: ''
        }
        sessionStorage.removeItem('isLoggedIn')
        sessionStorage.removeItem('accountInfo')
        sessionStorage.removeItem('userId')
      }
    })
  } catch (error) {
    console.error('检查登录状态失败:', error)
  }
})
</script>

<style>
/* 全局样式 - 与 HomePage 保持一致 */
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

.n-table th {
  transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier), color .3s var(--n-bezier);
  padding: var(--n-th-padding);
  color: var(--n-th-text-color);
  background-color: var(--n-th-color);
  border: 0px solid var(--n-merged-border-color);
  border-bottom: 1px solid var(--n-merged-border-color);
  font-weight: var(--n-th-font-weight);
  text-align: left;
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

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 20px !important;
}

.empty-state p {
  color: #909399;
  margin: 0;
  font-size: 14px;
}

.orders-table {
  margin-top: 15px;
}

/* Element Plus 表单样式 */
.el-form-item {
  display: flex;
  margin-bottom: 18px;
  align-items: center;
}

.el-form-item__label {
  display: inline-flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex: 0 0 auto;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  min-width: 120px;
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

.el-button--success {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-success);
  --el-button-border-color: var(--el-color-success);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-success-light-3);
  --el-button-hover-border-color: var(--el-color-success-light-3);
  --el-button-active-bg-color: var(--el-color-success-dark-2);
  --el-button-active-border-color: var(--el-color-success-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-success-light-5);
  --el-button-disabled-border-color: var(--el-color-success-light-5);
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

