<template>
  <div class="box">
    <img id="banner" :src="bannerImage" alt="banner" />
    
    <!-- 导航标签栏 -->
    <div class="nav-tabs">
      <div class="nav-tab" @click="$router.push('/')">首页</div>
      <div class="nav-tab" @click="$router.push('/recharge')">充值</div>
      <div class="nav-tab active">我的订单</div>
      <div class="nav-tab" @click="$router.push('/account')">账户</div>
      <div class="nav-tab" @click="handleApiClick">API接口</div>
    </div>
    
    <!-- 进行中的订单 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">进行中的订单</span>
        </span>
      </p>
      <div class="orders-table">
        <table class="n-table n-table--single-line" :style="tableStyle">
          <thead>
            <tr>
              <th>ID</th>
              <th>订单号</th>
              <th>项目代码</th>
              <th>金额</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="empty-state">
                <p>暂无订单</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 完成的订单 -->
    <div class="main">
      <p class="main-title-green">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark">
          <span class="el-tag__content">完成的订单</span>
        </span>
      </p>
      <div class="orders-table">
        <table class="n-table n-table--single-line" :style="tableStyle">
          <thead>
            <tr>
              <th>ID</th>
              <th>订单号</th>
              <th>项目代码</th>
              <th>金额</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="empty-state">
                <p>暂无订单</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Banner图片
const bannerImage = ref('https://jm273.cc/static/images/be7fa42546e73d642a19b19a8dcb6fa4.gif')

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

.orders-table {
  margin-top: 15px;
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

