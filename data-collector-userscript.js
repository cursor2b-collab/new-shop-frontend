// ==UserScript==
// @name          JM273 数据采集器
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   采集 jm273.cc 网站的国家和业务数据
// @author        You
// @match         https://jm273.cc/*
// @match         http://jm273.cc/*
// @grant         GM_download
// @grant         GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'data-collector-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border: 2px solid #409eff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #409eff;">数据采集器</h3>
                <button id="close-panel" style="background: #f56c6c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">×</button>
            </div>
            <div id="status" style="margin-bottom: 15px; padding: 10px; background: #f0f9eb; border-radius: 4px; font-size: 12px;">
                就绪
            </div>
            <button id="start-collect" style="width: 100%; padding: 10px; background: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-bottom: 10px;">
                开始采集
            </button>
            <button id="export-data" style="width: 100%; padding: 10px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-bottom: 10px;" disabled>
                导出数据
            </button>
            <div id="progress" style="margin-top: 10px; font-size: 12px; color: #606266;"></div>
        `;
        
        document.body.appendChild(panel);
        
        // 关闭按钮
        document.getElementById('close-panel').onclick = () => {
            panel.style.display = 'none';
        };
        
        return panel;
    }
    
    // 更新状态
    function updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('status');
        const colors = {
            info: '#f0f9eb',
            success: '#e1f3d8',
            warning: '#faecd8',
            error: '#fde2e2'
        };
        statusEl.textContent = message;
        statusEl.style.background = colors[type] || colors.info;
    }
    
    // 更新进度
    function updateProgress(current, total, message) {
        const progressEl = document.getElementById('progress');
        progressEl.textContent = `进度: ${current}/${total} - ${message}`;
    }
    
    // 等待元素
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`元素 ${selector} 未找到`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };
            checkElement();
        });
    }
    
    // 等待时间
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 采集国家列表
    async function collectCountries() {
        const countries = [];
        
        try {
            // 尝试从Vue组件获取
            const app = document.querySelector('#app');
            if (app && app.__vue_app__) {
                const instance = app.__vue_app__._instance;
                if (instance && instance.setupState && instance.setupState.countries) {
                    return instance.setupState.countries;
                }
            }
            
            // 尝试从输入框触发下拉
            const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
            if (countryInput) {
                countryInput.click();
                await sleep(500);
                countryInput.value = '';
                countryInput.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(800);
                
                const options = document.querySelectorAll('.country-option, .country-dropdown .option');
                options.forEach(opt => {
                    const text = opt.textContent.trim();
                    const value = opt.getAttribute('data-value') || text.split('/')[0]?.trim();
                    if (value && !countries.find(c => c.value === value)) {
                        countries.push({ value, label: text });
                    }
                });
            }
        } catch (error) {
            console.error('采集国家失败:', error);
        }
        
        return countries.length > 0 ? countries : [
            { value: 'US', label: 'US/美国 +1' },
            { value: 'CN', label: 'CN/中国 +86' },
            { value: 'HK', label: 'HK/香港 +852' },
            { value: 'TW', label: 'TW/台湾 +886' },
            { value: 'JP', label: 'JP/日本 +81' },
            { value: 'KR', label: 'KR/韩国 +82' },
            { value: 'UK', label: 'UK/英国 +44' },
            { value: 'DE', label: 'DE/德国 +49' },
            { value: 'FR', label: 'FR/法国 +33' },
            { value: 'CA', label: 'CA/加拿大 +1' }
        ];
    }
    
    // 采集业务数据
    async function collectServicesForCountry(country, countries) {
        const services = [];
        
        try {
            // 选择国家
            const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
            if (countryInput) {
                countryInput.value = '';
                countryInput.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(300);
                
                countryInput.value = country.label;
                countryInput.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(500);
                
                const countryOption = Array.from(document.querySelectorAll('.country-option, .country-dropdown .option'))
                    .find(opt => opt.textContent.includes(country.value) || opt.textContent.includes(country.label));
                
                if (countryOption) {
                    countryOption.click();
                    await sleep(1000);
                }
            }
            
            // 获取业务列表
            const serviceInput = document.querySelector('input[placeholder*="业务"], input[placeholder*="选择业务"]');
            if (serviceInput) {
                serviceInput.click();
                await sleep(500);
                serviceInput.value = '';
                serviceInput.dispatchEvent(new Event('input', { bubbles: true }));
                await sleep(800);
                
                const serviceOptions = document.querySelectorAll('.service-option, .service-dropdown .option');
                serviceOptions.forEach(opt => {
                    const text = opt.textContent.trim();
                    const name = text.split(' - ')[0]?.trim() || text.split('¥')[0]?.trim() || text;
                    const priceMatch = text.match(/[\d.]+/);
                    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
                    
                    if (name) {
                        services.push({
                            id: `service_${country.value}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            name: name,
                            country: country.value,
                            countryLabel: country.label,
                            price: price
                        });
                    }
                });
            }
            
            // 尝试从API获取
            if (services.length === 0) {
                try {
                    const response = await fetch(`/api/services?country=${country.value}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.data && Array.isArray(data.data)) {
                            data.data.forEach(service => {
                                services.push({
                                    id: service.id,
                                    name: service.name,
                                    country: country.value,
                                    countryLabel: country.label,
                                    price: parseFloat(service.price || service.rate || 0)
                                });
                            });
                        }
                    }
                } catch (e) {
                    console.warn('API请求失败:', e);
                }
            }
        } catch (error) {
            console.error(`采集 ${country.label} 失败:`, error);
        }
        
        return services;
    }
    
    // 主采集函数
    async function startCollection() {
        const startBtn = document.getElementById('start-collect');
        const exportBtn = document.getElementById('export-data');
        const collectedData = {
            countries: [],
            services: [],
            collectedAt: new Date().toISOString()
        };
        
        startBtn.disabled = true;
        updateStatus('正在采集国家列表...', 'info');
        
        try {
            // 采集国家
            collectedData.countries = await collectCountries();
            updateStatus(`找到 ${collectedData.countries.length} 个国家`, 'success');
            
            // 采集每个国家的业务
            for (let i = 0; i < collectedData.countries.length; i++) {
                const country = collectedData.countries[i];
                updateProgress(i + 1, collectedData.countries.length, `正在采集 ${country.label}...`);
                
                const services = await collectServicesForCountry(country, collectedData.countries);
                collectedData.services.push(...services);
                
                await sleep(1000);
            }
            
            // 保存数据到全局变量
            window.collectedData = collectedData;
            
            updateStatus(`采集完成！共 ${collectedData.services.length} 个业务`, 'success');
            exportBtn.disabled = false;
            
            // 自动导出
            exportData(collectedData);
            
        } catch (error) {
            updateStatus('采集失败: ' + error.message, 'error');
            console.error('采集错误:', error);
        } finally {
            startBtn.disabled = false;
        }
    }
    
    // 导出数据
    function exportData(data) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jm273_data_${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        updateStatus('数据已导出！', 'success');
    }
    
    // 初始化
    function init() {
        // 等待页面加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createControlPanel, 1000);
            });
        } else {
            setTimeout(createControlPanel, 1000);
        }
        
        // 绑定事件
        setTimeout(() => {
            const startBtn = document.getElementById('start-collect');
            const exportBtn = document.getElementById('export-data');
            
            if (startBtn) {
                startBtn.onclick = startCollection;
            }
            
            if (exportBtn) {
                exportBtn.onclick = () => {
                    if (window.collectedData) {
                        exportData(window.collectedData);
                    } else {
                        alert('请先采集数据');
                    }
                };
            }
        }, 1500);
    }
    
    init();
})();

