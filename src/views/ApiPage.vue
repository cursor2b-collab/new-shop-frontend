<template>
  <div class="box">
    <img id="banner" :src="bannerImage" alt="banner" />
    
    <!-- 导航标签栏 -->
    <div class="nav-tabs">
      <div class="nav-tab" @click="$router.push('/')">首页</div>
      <div class="nav-tab" @click="$router.push('/recharge')">充值</div>
      <div class="nav-tab" @click="$router.push('/orders')">我的订单</div>
      <div class="nav-tab" @click="$router.push('/account')">账户</div>
      <div class="nav-tab active">API接口</div>
    </div>
    
    <!-- API密钥和请求链接 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">API密钥</span>
        </span>
      </p>
      <div style="margin-top: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px; word-break: break-all;">
        {{ apiKey || '-' }}
      </div>
      
      <p class="main-title-green" style="margin-top: 20px;">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">请求链接</span>
        </span>
      </p>
      <div style="margin-top: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px; word-break: break-all;">
        {{ baseUrl }}
      </div>
    </div>
    
    <!-- 请求号码 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">请求号码</span>
        </span>
      </p>
      <div style="margin-top: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px; word-break: break-all; margin-bottom: 15px;">
        {{ baseUrl }}/api/getnumber?country=TH&pid=2&secret_key={{ apiKey }}
      </div>
      
      <div class="api-section">
        <div class="api-section-title">Request 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>必填</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>country</td>
              <td>str</td>
              <td>Yes</td>
              <td>国家ID</td>
            </tr>
            <tr>
              <td>pid</td>
              <td>str</td>
              <td>Yes</td>
              <td>项目ID</td>
            </tr>
            <tr>
              <td>secret_key</td>
              <td>str</td>
              <td>Yes</td>
              <td>API密钥</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="api-section" style="margin-top: 15px;">
        <div class="api-section-title">Response 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>phone</td>
              <td>str</td>
              <td>电话号码</td>
            </tr>
            <tr>
              <td>pid</td>
              <td>str</td>
              <td>项目ID</td>
            </tr>
            <tr>
              <td>taskid</td>
              <td>int</td>
              <td>订单号</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 请求验证码 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">请求验证码</span>
        </span>
      </p>
      <div style="margin-top: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px; word-break: break-all; margin-bottom: 15px;">
        {{ baseUrl }}/api/getcode?taskid=25656&secret_key={{ apiKey }}
      </div>
      
      <div class="api-section">
        <div class="api-section-title">Request 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>必填</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>taskid</td>
              <td>int</td>
              <td>Yes</td>
              <td>订单号</td>
            </tr>
            <tr>
              <td>secret_key</td>
              <td>str</td>
              <td>Yes</td>
              <td>API密钥</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="api-section" style="margin-top: 15px;">
        <div class="api-section-title">Response 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>code</td>
              <td>str</td>
              <td>验证码</td>
            </tr>
            <tr>
              <td>phone</td>
              <td>str</td>
              <td>电话号码</td>
            </tr>
            <tr>
              <td>taskid</td>
              <td>int</td>
              <td>订单号</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 释放号码 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">释放号码</span>
        </span>
      </p>
      <div style="margin-top: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px; word-break: break-all; margin-bottom: 15px;">
        {{ baseUrl }}/api/releasenumber?phone=19258645142&secret_key={{ apiKey }}
      </div>
      
      <div class="api-section">
        <div class="api-section-title">Request 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>必填</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>phone</td>
              <td>int</td>
              <td>Yes</td>
              <td>号码前不需要'+'</td>
            </tr>
            <tr>
              <td>secret_key</td>
              <td>str</td>
              <td>Yes</td>
              <td>API密钥</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="api-section" style="margin-top: 15px;">
        <div class="api-section-title">Response 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>message</td>
              <td>str</td>
              <td>收到"订单成功取消"</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 查询正在进行的订单 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">查询正在进行的订单</span>
        </span>
      </p>
      <div style="margin-top: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px; word-break: break-all; margin-bottom: 15px;">
        {{ baseUrl }}/api/pendingorders?secret_key={{ apiKey }}
      </div>
      
      <div class="api-section">
        <div class="api-section-title">Request 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>必填</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>secret_key</td>
              <td>str</td>
              <td>Yes</td>
              <td>API密钥</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="api-section" style="margin-top: 15px;">
        <div class="api-section-title">Response 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>message</td>
              <td>str</td>
              <td>进行中的订单</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 查询消费记录 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">查询消费记录</span>
        </span>
      </p>
      <div style="margin-top: 15px; padding: 10px; background: #f5f7fa; border-radius: 4px; word-break: break-all; margin-bottom: 15px;">
        {{ baseUrl }}/api/successfulorders?secret_key={{ apiKey }}
      </div>
      
      <div class="api-section">
        <div class="api-section-title">Request 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>必填</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>secret_key</td>
              <td>str</td>
              <td>Yes</td>
              <td>API密钥</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="api-section" style="margin-top: 15px;">
        <div class="api-section-title">Response 参数</div>
        <table class="api-table">
          <thead>
            <tr>
              <th>参数</th>
              <th>类型</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>message</td>
              <td>str</td>
              <td>消费记录</td>
            </tr>
          </tbody>
        </table>
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

// API配置
const baseUrl = ref('https://jm273.cc')
const apiKey = ref('')

// 检查登录状态
onMounted(async () => {
  try {
    // 检查Supabase session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (!session || !session.user) {
      // 未登录，跳转到账户页面
      alert('请先登录后再访问API接口')
      router.push('/account')
      return
    }
    
    // 已登录，从sessionStorage获取API密钥（在AccountPage中已设置）
    const savedAccountInfo = sessionStorage.getItem('accountInfo')
    if (savedAccountInfo) {
      const accountInfo = JSON.parse(savedAccountInfo)
      apiKey.value = accountInfo.apiKey || ''
    } else {
      // 如果没有，尝试从user_profiles获取并生成
      const userId = session.user.id
      apiKey.value = btoa(userId.replace(/-/g, '')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32) || userId.replace(/-/g, '').substring(0, 32)
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
    alert('请先登录后再访问API接口')
    router.push('/account')
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

/* API文档表格样式 */
.api-section {
  margin-top: 15px;
}

.api-section-title {
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px 4px 0 0;
  border: 1px solid #e1f3d8;
  border-bottom: none;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e1f3d8;
  border-radius: 0 0 4px 4px;
  overflow: hidden;
}

.api-table thead {
  background-color: #f0f9eb;
}

.api-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  border-bottom: 1px solid #e1f3d8;
}

.api-table td {
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px solid #f0f0f0;
}

.api-table tbody tr:last-child td {
  border-bottom: none;
}

.api-table tbody tr:hover {
  background-color: #fafafa;
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

