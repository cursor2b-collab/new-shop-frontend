<template>
  <div class="box">
    <img id="banner" :src="bannerImage" alt="banner" />
    
    <!-- 导航标签栏 -->
    <div class="nav-tabs">
      <div class="nav-tab" @click="$router.push('/')">首页</div>
      <div class="nav-tab active">充值</div>
      <div class="nav-tab" @click="$router.push('/orders')">我的订单</div>
      <div class="nav-tab" @click="$router.push('/account')">账户</div>
      <div class="nav-tab" @click="handleApiClick">API接口</div>
    </div>
    
    <!-- 余额充值 -->
    <div class="main">
      <p class="main-title-green-full">
        <span class="el-tag el-tag--success el-tag--large el-tag--dark full-width-tag">
          <span class="el-tag__content">余额充值</span>
        </span>
      </p>
      
      <!-- 充值数量选择 -->
      <div class="el-form-item" style="margin-top: 15px;">
        <div class="el-form-item__label">请选择充值数量</div>
        <div class="el-form-item__content">
          <div class="el-input-number">
            <span class="el-input-number__decrease" @click="decreaseAmount">-</span>
            <div class="el-input">
              <div class="el-input__wrapper">
                <input 
                  class="el-input__inner" 
                  type="number" 
                  v-model.number="rechargeAmount"
                  min="1"
                  @input="updateAmount"
                >
              </div>
            </div>
            <span class="el-input-number__increase" @click="increaseAmount">+</span>
          </div>
        </div>
      </div>
      
      <!-- 信息提示框 -->
      <div v-if="showInfoMessage" class="el-message el-message--info" style="margin-top: 15px;">
        <div class="el-message__content">
          您将充值 {{ rechargeAmount }} USDT 到您的账户余额里
        </div>
        <div class="el-message__closeBtn" @click="closeInfoMessage">×</div>
      </div>
      
      <!-- 警告提示框 -->
      <div v-if="showWarningMessage" class="el-message el-message--warning" style="margin-top: 15px;">
        <div class="el-message__content">
          由于第三方充值风控限制,目前只能USDT充值,请针对相应钱包进行转账充值,充值成功自动到账。
        </div>
        <div class="el-message__closeBtn" @click="closeWarningMessage">×</div>
      </div>
      
      <!-- 立即充值按钮 -->
      <div style="margin-top: 20px;">
        <button type="button" class="el-button el-button--success el-button--large" style="width: 100%" @click="handleRecharge">
          <span class="el-button__text">立即充值</span>
        </button>
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

// 充值数量
const rechargeAmount = ref(1)

// 信息提示框显示状态
const showInfoMessage = ref(true)
const showWarningMessage = ref(true)

// 增加数量
const increaseAmount = () => {
  rechargeAmount.value++
}

// 减少数量
const decreaseAmount = () => {
  if (rechargeAmount.value > 1) {
    rechargeAmount.value--
  }
}

// 更新数量
const updateAmount = (event) => {
  const value = parseInt(event.target.value)
  if (value && value >= 1) {
    rechargeAmount.value = value
  } else {
    rechargeAmount.value = 1
  }
}

// 关闭信息提示框
const closeInfoMessage = () => {
  showInfoMessage.value = false
}

// 关闭警告提示框
const closeWarningMessage = () => {
  showWarningMessage.value = false
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

// 处理充值
const handleRecharge = () => {
  console.log('充值金额:', rechargeAmount.value)
  // TODO: 实现充值逻辑
  alert(`准备充值 ${rechargeAmount.value} USDT`)
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

.main-title-green-full {
  margin-left: -15px;
  margin-right: -15px;
  padding-left: 15px;
  padding-right: 15px;
  border-left: 2px solid #09bb07;
  margin-top: 10px;
  margin-bottom: 10px;
  word-break: break-all;
}

.full-width-tag {
  width: 100%;
  display: block;
}

.full-width-tag .el-tag__content {
  width: 100%;
  text-align: center;
}

/* 信息提示框样式 */
.el-message {
  min-height: 40px;
  box-sizing: border-box;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: #e4e7ed;
  position: relative;
  background-color: #f4f4f5;
  overflow: hidden;
  padding: 15px 19px;
  display: flex;
  align-items: center;
}

.el-message--info {
  background-color: #f0f9ff;
  border-color: #b3d8ff;
  color: #909399;
}

.el-message--warning {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

.el-message__content {
  padding: 0;
  font-size: 14px;
  line-height: 1;
  flex: 1;
}

.el-message__closeBtn {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: inherit;
  font-size: 16px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.el-message__closeBtn:hover {
  opacity: 1;
}

/* 成功按钮样式 */
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

/* 数字输入框样式 */
.el-input-number {
  position: relative;
  display: inline-flex;
  width: 150px;
  line-height: 30px;
}

.el-input-number .el-input {
  display: block;
  flex: 1;
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

