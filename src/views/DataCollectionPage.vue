<template>
  <div class="box">
    <img id="banner" :src="bannerImage" alt="banner" />
    
    <!-- 导航标签栏 -->
    <div class="nav-tabs">
      <div class="nav-tab" @click="$router.push('/')">首页</div>
      <div class="nav-tab" @click="$router.push('/recharge')">充值</div>
      <div class="nav-tab" @click="$router.push('/orders')">我的订单</div>
      <div class="nav-tab" @click="$router.push('/account')">账户</div>
      <div class="nav-tab" @click="handleApiClick">API接口</div>
    </div>
    
    <!-- 国家数据管理 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">国家数据管理</span>
        </span>
      </p>
      
      <!-- 添加国家 -->
      <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center;">
        <input 
          type="text" 
          v-model="newCountry.value" 
          placeholder="国家代码 (如: US)"
          class="el-input__inner"
          style="flex: 1; max-width: 150px;"
        >
        <input 
          type="text" 
          v-model="newCountry.label" 
          placeholder="国家名称 (如: US/美国 +1)"
          class="el-input__inner"
          style="flex: 2;"
        >
        <button 
          type="button" 
          class="el-button el-button--success el-button--small"
          @click="addCountry"
        >
          添加国家
        </button>
        <button 
          type="button" 
          class="el-button el-button--primary el-button--small"
          @click="saveCountriesToDB"
        >
          保存到数据库
        </button>
      </div>
      
      <!-- 国家列表 -->
      <div style="margin-top: 15px;">
        <table class="n-table n-table--single-line" :style="tableStyle">
          <thead>
            <tr>
              <th>国家代码</th>
              <th>国家名称</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(country, index) in countries" :key="index">
              <td>{{ country.value }}</td>
              <td>{{ country.label }}</td>
              <td>
                <button 
                  type="button" 
                  class="el-button el-button--danger el-button--small"
                  style="padding: 4px 12px; font-size: 12px;"
                  @click="removeCountry(index)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 业务数据管理 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">业务数据管理</span>
        </span>
      </p>
      
      <!-- 添加业务 -->
      <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <input 
          type="text" 
          v-model="newService.name" 
          placeholder="业务名称"
          class="el-input__inner"
          style="flex: 1; min-width: 150px;"
        >
        <select 
          v-model="newService.country" 
          class="el-input__inner"
          style="flex: 1; min-width: 120px;"
        >
          <option value="">选择国家</option>
          <option v-for="country in countries" :key="country.value" :value="country.value">
            {{ country.value }}
          </option>
        </select>
        <input 
          type="number" 
          v-model.number="newService.price" 
          placeholder="价格"
          class="el-input__inner"
          style="flex: 1; min-width: 100px;"
          step="0.01"
        >
        <button 
          type="button" 
          class="el-button el-button--success el-button--small"
          @click="addService"
        >
          添加业务
        </button>
        <button 
          type="button" 
          class="el-button el-button--primary el-button--small"
          @click="loadServicesFromDB"
        >
          从数据库加载
        </button>
        <button 
          type="button" 
          class="el-button el-button--warning el-button--small"
          @click="saveServicesToDB"
        >
          保存到数据库
        </button>
      </div>
      
      <!-- 业务列表 -->
      <div style="margin-top: 15px;">
        <table class="n-table n-table--single-line" :style="tableStyle">
          <thead>
            <tr>
              <th>ID</th>
              <th>业务名称</th>
              <th>国家</th>
              <th>价格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id || service.tempId">
              <td>{{ service.id || service.tempId }}</td>
              <td>{{ service.name }}</td>
              <td>{{ service.country }}</td>
              <td>{{ service.price || '0.00' }}</td>
              <td>
                <button 
                  type="button" 
                  class="el-button el-button--danger el-button--small"
                  style="padding: 4px 12px; font-size: 12px;"
                  @click="removeService(service)"
                >
                  删除
                </button>
              </td>
            </tr>
            <tr v-if="services.length === 0">
              <td colspan="5" class="empty-state">
                <p>暂无业务数据</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 数据导出 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">数据导出</span>
        </span>
      </p>
      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button 
          type="button" 
          class="el-button el-button--primary"
          @click="exportCountries"
        >
          导出国家数据 (JSON)
        </button>
        <button 
          type="button" 
          class="el-button el-button--primary"
          @click="exportServices"
        >
          导出业务数据 (JSON)
        </button>
        <button 
          type="button" 
          class="el-button el-button--success"
          @click="importData"
        >
          导入数据 (JSON)
        </button>
        <input 
          type="file" 
          ref="fileInput"
          accept=".json"
          style="display: none;"
          @change="handleFileImport"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

// Banner图片 - 使用指定的GIF图片
const bannerImage = ref('https://cy-747263170.imgix.net/GIF_20251120065910817.gif')

// 国家列表
const countries = ref([
  { value: 'US', label: 'US/美国 +1' },
  { value: 'CN', label: 'CN/中国 +86' },
  { value: 'HK', label: 'HK/香港 +852' },
  { value: 'TW', label: 'TW/台湾 +886' },
  { value: 'JP', label: 'JP/日本 +81' },
  { value: 'KR', label: 'KR/韩国 +82' },
  { value: 'UK', label: 'UK/英国 +44' },
  { value: 'DE', label: 'DE/德国 +49' },
  { value: 'FR', label: 'FR/法国 +33' },
  { value: 'CA', label: 'CA/加拿大 +1' },
  { value: 'AU', label: 'AU/澳大利亚 +61' },
  { value: 'SG', label: 'SG/新加坡 +65' },
  { value: 'MY', label: 'MY/马来西亚 +60' },
  { value: 'TH', label: 'TH/泰国 +66' },
  { value: 'VN', label: 'VN/越南 +84' },
  { value: 'ID', label: 'ID/印度尼西亚 +62' },
  { value: 'PH', label: 'PH/菲律宾 +63' },
  { value: 'IN', label: 'IN/印度 +91' },
  { value: 'BR', label: 'BR/巴西 +55' },
  { value: 'MX', label: 'MX/墨西哥 +52' },
  { value: 'AR', label: 'AR/阿根廷 +54' },
  { value: 'RU', label: 'RU/俄罗斯 +7' },
  { value: 'TR', label: 'TR/土耳其 +90' },
  { value: 'SA', label: 'SA/沙特阿拉伯 +966' },
  { value: 'AE', label: 'AE/阿联酋 +971' },
  { value: 'EG', label: 'EG/埃及 +20' },
  { value: 'ZA', label: 'ZA/南非 +27' },
  { value: 'NZ', label: 'NZ/新西兰 +64' },
  { value: 'ES', label: 'ES/西班牙 +34' },
  { value: 'IT', label: 'IT/意大利 +39' },
  { value: 'NL', label: 'NL/荷兰 +31' },
  { value: 'BE', label: 'BE/比利时 +32' },
  { value: 'SE', label: 'SE/瑞典 +46' },
  { value: 'NO', label: 'NO/挪威 +47' },
  { value: 'DK', label: 'DK/丹麦 +45' },
  { value: 'FI', label: 'FI/芬兰 +358' },
  { value: 'PL', label: 'PL/波兰 +48' },
  { value: 'UA', label: 'UA/乌克兰 +380' },
  { value: 'CZ', label: 'CZ/捷克 +420' },
  { value: 'AT', label: 'AT/奥地利 +43' },
  { value: 'CH', label: 'CH/瑞士 +41' },
  { value: 'PT', label: 'PT/葡萄牙 +351' },
  { value: 'GR', label: 'GR/希腊 +30' },
  { value: 'IL', label: 'IL/以色列 +972' },
  { value: 'NP', label: 'NP/尼泊尔 +977' },
  { value: 'BD', label: 'BD/孟加拉国 +880' },
  { value: 'PK', label: 'PK/巴基斯坦 +92' },
  { value: 'LK', label: 'LK/斯里兰卡 +94' },
  { value: 'MM', label: 'MM/缅甸 +95' },
  { value: 'KH', label: 'KH/柬埔寨 +855' },
  { value: 'LA', label: 'LA/老挝 +856' }
])

// 服务列表
const services = ref([])

// 新国家表单
const newCountry = ref({
  value: '',
  label: ''
})

// 新业务表单
const newService = ref({
  name: '',
  country: '',
  price: 0
})

// 文件输入引用
const fileInput = ref(null)

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

// 添加国家
const addCountry = () => {
  if (!newCountry.value.value || !newCountry.value.label) {
    alert('请填写完整的国家信息')
    return
  }
  
  // 检查是否已存在
  if (countries.value.find(c => c.value === newCountry.value.value)) {
    alert('该国家代码已存在')
    return
  }
  
  countries.value.push({
    value: newCountry.value.value,
    label: newCountry.value.label
  })
  
  newCountry.value = { value: '', label: '' }
  alert('国家添加成功')
}

// 删除国家
const removeCountry = (index) => {
  if (confirm('确定要删除这个国家吗？')) {
    countries.value.splice(index, 1)
    alert('国家删除成功')
  }
}

// 添加业务
const addService = () => {
  if (!newService.value.name || !newService.value.country) {
    alert('请填写完整的业务信息')
    return
  }
  
  const tempId = 'temp_' + Date.now()
  services.value.push({
    tempId: tempId,
    id: null,
    name: newService.value.name,
    country: newService.value.country,
    price: newService.value.price || 0
  })
  
  newService.value = { name: '', country: '', price: 0 }
  alert('业务添加成功')
}

// 删除业务
const removeService = (service) => {
  if (confirm('确定要删除这个业务吗？')) {
    const index = services.value.findIndex(s => 
      (s.id && s.id === service.id) || (s.tempId && s.tempId === service.tempId)
    )
    if (index > -1) {
      services.value.splice(index, 1)
      alert('业务删除成功')
    }
  }
}

// 保存国家数据到数据库
const saveCountriesToDB = async () => {
  try {
    // 检查是否有countries表，如果没有则创建
    // 这里我们使用一个简单的配置表来存储国家数据
    const countriesJson = JSON.stringify(countries.value)
    
    // 保存到localStorage作为备份
    localStorage.setItem('countries_data', countriesJson)
    
    alert(`国家数据已保存（共${countries.value.length}条）`)
  } catch (error) {
    console.error('保存国家数据失败:', error)
    alert(`保存失败: ${error.message}`)
  }
}

// 从数据库加载业务数据
const loadServicesFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('加载业务数据失败:', error)
      alert(`加载失败: ${error.message}`)
      return
    }
    
    if (data && data.length > 0) {
      services.value = data.map(s => ({
        id: s.id,
        name: s.name,
        country: s.category_id || '', // 使用category_id作为国家代码
        price: parseFloat(s.rate || 0).toFixed(2),
        category_id: s.category_id,
        rate: s.rate,
        min_quantity: s.min_quantity,
        max_quantity: s.max_quantity,
        description: s.description,
        status: s.status
      }))
      alert(`成功加载 ${services.value.length} 条业务数据`)
    } else {
      alert('数据库中没有业务数据')
    }
  } catch (error) {
    console.error('加载业务数据异常:', error)
    alert(`加载失败: ${error.message}`)
  }
}

// 保存业务数据到数据库
const saveServicesToDB = async () => {
  try {
    if (services.value.length === 0) {
      alert('没有业务数据需要保存')
      return
    }
    
    // 准备要插入的数据（只保存没有ID的新数据）
    const servicesToInsert = services.value
      .filter(s => !s.id || s.tempId) // 只插入新数据
      .map(s => ({
        id: s.tempId ? `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : s.id,
        category_id: s.country || 'US', // 使用country作为category_id
        name: s.name,
        rate: parseFloat(s.price || 0),
        min_quantity: 1,
        max_quantity: 1000000,
        type: 0,
        status: 'active'
      }))
    
    if (servicesToInsert.length > 0) {
      const { error } = await supabase
        .from('services')
        .insert(servicesToInsert)
      
      if (error) {
        console.error('保存业务数据失败:', error)
        alert(`保存失败: ${error.message}`)
        return
      }
      
      alert(`成功保存 ${servicesToInsert.length} 条业务数据`)
      
      // 重新加载数据以获取ID
      await loadServicesFromDB()
    } else {
      alert('没有新的业务数据需要保存')
    }
  } catch (error) {
    console.error('保存业务数据异常:', error)
    alert(`保存失败: ${error.message}`)
  }
}

// 导出国家数据
const exportCountries = () => {
  const dataStr = JSON.stringify(countries.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `countries_${new Date().getTime()}.json`
  link.click()
  URL.revokeObjectURL(url)
  alert('国家数据导出成功')
}

// 导出业务数据
const exportServices = () => {
  const dataStr = JSON.stringify(services.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `services_${new Date().getTime()}.json`
  link.click()
  URL.revokeObjectURL(url)
  alert('业务数据导出成功')
}

// 导入数据
const importData = () => {
  fileInput.value?.click()
}

// 处理文件导入
const handleFileImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (Array.isArray(data)) {
      // 判断是国家数据还是业务数据
      if (data.length > 0 && data[0].value && data[0].label) {
        // 是国家数据
        countries.value = data
        alert(`成功导入 ${data.length} 条国家数据`)
      } else if (data.length > 0 && data[0].name) {
        // 是业务数据
        services.value = data
        alert(`成功导入 ${data.length} 条业务数据`)
      } else {
        alert('无法识别数据格式')
      }
    } else {
      alert('数据格式错误，需要JSON数组')
    }
  } catch (error) {
    console.error('导入数据失败:', error)
    alert(`导入失败: ${error.message}`)
  }
  
  // 清空文件输入
  event.target.value = ''
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

// 页面加载时从数据库加载业务数据
onMounted(async () => {
  // 从localStorage加载国家数据（如果有）
  const savedCountries = localStorage.getItem('countries_data')
  if (savedCountries) {
    try {
      const parsed = JSON.parse(savedCountries)
      if (Array.isArray(parsed)) {
        countries.value = parsed
      }
    } catch (e) {
      console.error('加载国家数据失败:', e)
    }
  }
  
  // 尝试从数据库加载业务数据
  await loadServicesFromDB()
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

/* Element Plus 输入框样式 */
.el-input__inner {
  --el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);
  width: 100%;
  flex-grow: 1;
  -webkit-appearance: none;
  color: var(--el-input-text-color, var(--el-text-color-regular));
  font-size: inherit;
  height: var(--el-input-inner-height);
  line-height: var(--el-input-inner-height);
  padding: 0 11px;
  outline: 0;
  border: 1px solid var(--el-border-color);
  background: var(--el-fill-color-blank);
  box-sizing: border-box;
  border-radius: var(--el-border-radius-base);
}

.el-input__inner:focus {
  border-color: var(--el-color-primary);
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

.el-button--small {
  height: 24px;
  padding: 5px 11px;
  font-size: 12px;
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

.el-button--warning {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-warning);
  --el-button-border-color: var(--el-color-warning);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-warning-light-3);
  --el-button-hover-border-color: var(--el-color-warning-light-3);
  --el-button-active-bg-color: var(--el-color-warning-dark-2);
  --el-button-active-border-color: var(--el-color-warning-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-warning-light-5);
  --el-button-disabled-border-color: var(--el-color-warning-light-5);
}

.el-button--danger {
  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-danger);
  --el-button-border-color: var(--el-color-danger);
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-danger-light-3);
  --el-button-hover-border-color: var(--el-color-danger-light-3);
  --el-button-active-bg-color: var(--el-color-danger-dark-2);
  --el-button-active-border-color: var(--el-color-danger-dark-2);
  --el-button-disabled-text-color: var(--el-color-white);
  --el-button-disabled-bg-color: var(--el-color-danger-light-5);
  --el-button-disabled-border-color: var(--el-color-danger-light-5);
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
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: #eebe77;
  --el-color-warning-light-5: #f3d19e;
  --el-color-warning-light-7: #f8e3c5;
  --el-color-warning-light-8: #faecd8;
  --el-color-warning-light-9: #fdf6ec;
  --el-color-warning-dark-2: #b88230;
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: #f89898;
  --el-color-danger-light-5: #fab6b6;
  --el-color-danger-light-7: #fcd3d3;
  --el-color-danger-light-8: #fde2e2;
  --el-color-danger-light-9: #fef0f0;
  --el-color-danger-dark-2: #c45656;
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

