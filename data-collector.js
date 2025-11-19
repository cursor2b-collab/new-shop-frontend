/**
 * 交互式数据采集脚本 - 采集 jm273.cc 的国家和业务数据
 * 
 * 使用方法：
 * 1. 打开浏览器，访问 https://jm273.cc/#/
 * 2. 打开浏览器开发者工具（F12）
 * 3. 切换到 Console（控制台）标签
 * 4. 复制粘贴此脚本并运行
 * 5. 手动点击选择国家，脚本会自动采集该国家的业务数据
 * 6. 采集完成后，手动选择下一个国家，继续采集
 * 7. 所有国家采集完成后，输入 finish() 结束并导出数据
 */

(function() {
  console.log('🚀 交互式数据采集脚本已启动！');
  console.log('📋 使用说明：');
  console.log('   1. 手动点击选择国家');
  console.log('   2. 脚本会自动采集该国家的业务数据');
  console.log('   3. 采集完成后，手动选择下一个国家');
  console.log('   4. 所有国家采集完成后，输入 finish() 导出数据');
  console.log('   5. 输入 showData() 查看已采集的数据');
  console.log('   6. 输入 reset() 重置采集数据');
  console.log('');
  
  // 存储采集的数据
  const collectedData = {
    countries: [],
    services: [],
    collectedAt: new Date().toISOString(),
    currentCountry: null
  };
  
  // 采集状态
  let isCollecting = false;
  let collectionObserver = null;
  
  // 等待页面加载完成
  const waitForElement = (selector, timeout = 10000) => {
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
  };
  
  // 等待指定时间
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // 监听国家选择变化
  const watchCountryChange = () => {
    // 清除旧的观察者
    if (collectionObserver) {
      collectionObserver.disconnect();
    }
    
    // 查找国家输入框
    const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
    if (!countryInput) {
      console.warn('⚠️ 未找到国家输入框，请刷新页面后重试');
      return;
    }
    
    let lastCountryValue = countryInput.value || '';
    
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
      const currentValue = countryInput.value || '';
      if (currentValue !== lastCountryValue && currentValue.trim() !== '') {
        lastCountryValue = currentValue;
        console.log(`\n🔍 检测到国家选择变化: ${currentValue}`);
        setTimeout(() => collectCurrentCountryServices(), 1000);
      }
    });
    
    observer.observe(countryInput, {
      attributes: true,
      attributeFilter: ['value'],
      childList: false,
      subtree: false
    });
    
    // 同时监听input事件
    countryInput.addEventListener('input', () => {
      setTimeout(() => {
        const currentValue = countryInput.value || '';
        if (currentValue !== lastCountryValue && currentValue.trim() !== '') {
          lastCountryValue = currentValue;
          console.log(`\n🔍 检测到国家选择变化: ${currentValue}`);
          setTimeout(() => collectCurrentCountryServices(), 1000);
        }
      }, 500);
    });
    
    collectionObserver = observer;
    console.log('✅ 已启动国家选择监听，请手动选择国家开始采集...');
  };
  
  // 从Vue组件获取国家列表
  const getCountriesFromVue = () => {
    try {
      const app = document.querySelector('#app');
      if (!app || !app.__vue_app__) {
        return null;
      }
      
      const vueApp = app.__vue_app__;
      const instance = vueApp._instance;
      
      if (!instance) {
        return null;
      }
      
      // 尝试多种方式获取countries数据
      let countries = null;
      
      // 方法1: 从setupState获取
      if (instance.setupState && instance.setupState.countries) {
        countries = instance.setupState.countries;
      }
      
      // 方法2: 从data获取
      if (!countries && instance.data && instance.data.countries) {
        countries = instance.data.countries;
      }
      
      // 方法3: 遍历子组件查找
      if (!countries) {
        const findCountriesInComponent = (comp) => {
          if (comp.setupState && comp.setupState.countries) {
            return comp.setupState.countries;
          }
          if (comp.data && comp.data.countries) {
            return comp.data.countries;
          }
          return null;
        };
        
        const walkComponent = (comp) => {
          if (!comp) return null;
          const countries = findCountriesInComponent(comp);
          if (countries) return countries;
          
          if (comp.subTree && comp.subTree.children) {
            for (const child of comp.subTree.children) {
              if (child.component) {
                const result = walkComponent(child.component);
                if (result) return result;
              }
            }
          }
          return null;
        };
        
        countries = walkComponent(instance);
      }
      
      return countries;
    } catch (error) {
      console.error('从Vue获取国家列表失败:', error);
      return null;
    }
  };
  
  // 采集国家列表
  const collectCountries = async () => {
    console.log('📋 开始采集国家列表...');
    
    try {
      // 方法1: 直接从Vue组件数据中获取（最快最准确）
      const vueCountries = getCountriesFromVue();
      if (vueCountries && Array.isArray(vueCountries) && vueCountries.length > 0) {
        collectedData.countries = vueCountries.map(c => ({
          value: c.value || c.code || '',
          label: c.label || c.name || ''
        })).filter(c => c.value && c.label);
        
        console.log(`✅ 从Vue组件采集到 ${collectedData.countries.length} 个国家`);
        return;
      }
      
      // 方法2: 从页面元素中提取
      const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"], input.el-input__inner');
      
      if (countryInput) {
        // 点击输入框以触发下拉列表
        countryInput.click();
        countryInput.focus();
        await sleep(500);
        
        // 输入空字符串以显示所有国家
        countryInput.value = '';
        countryInput.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(800);
        
        // 查找下拉列表中的国家选项
        const countryOptions = document.querySelectorAll('.country-option, .country-dropdown .option, [role="option"], .el-select-dropdown__item');
        
        if (countryOptions.length > 0) {
          countryOptions.forEach(option => {
            const text = option.textContent.trim();
            if (!text) return;
            
            const value = option.getAttribute('data-value') || 
                         option.getAttribute('value') || 
                         text.split('/')[0]?.trim() || 
                         text.split(' ')[0]?.trim() ||
                         text;
            
            if (value && !collectedData.countries.find(c => c.value === value)) {
              collectedData.countries.push({
                value: value,
                label: text
              });
            }
          });
        }
      }
      
      // 方法3: 从页面中提取国家数据
      if (collectedData.countries.length === 0) {
        const countryElements = document.querySelectorAll('[data-country], .country-item, .country-option, [data-value]');
        countryElements.forEach(el => {
          const value = el.getAttribute('data-value') || el.getAttribute('data-country') || el.textContent.trim().split('/')[0]?.trim();
          const label = el.textContent.trim();
          if (value && label && !collectedData.countries.find(c => c.value === value)) {
            collectedData.countries.push({ value, label });
          }
        });
      }
      
      console.log(`✅ 采集到 ${collectedData.countries.length} 个国家`);
    } catch (error) {
      console.error('❌ 采集国家列表失败:', error);
    }
  };
  
  // 从Vue组件获取服务数据
  const getServicesFromVue = () => {
    try {
      const app = document.querySelector('#app');
      if (!app || !app.__vue_app__) {
        return null;
      }
      
      // 获取Vue实例
      const vueApp = app.__vue_app__;
      const instance = vueApp._instance;
      
      if (!instance) {
        return null;
      }
      
      // 尝试多种方式获取services数据
      let services = null;
      
      // 方法1: 从setupState获取
      if (instance.setupState && instance.setupState.services) {
        services = instance.setupState.services;
      }
      
      // 方法2: 从data获取
      if (!services && instance.data && instance.data.services) {
        services = instance.data.services;
      }
      
      // 方法3: 从$data获取
      if (!services && instance.$data && instance.$data.services) {
        services = instance.$data.services;
      }
      
      // 方法4: 遍历所有子组件查找
      if (!services) {
        const findServicesInComponent = (comp) => {
          if (comp.setupState && comp.setupState.services) {
            return comp.setupState.services;
          }
          if (comp.data && comp.data.services) {
            return comp.data.services;
          }
          if (comp.$data && comp.$data.services) {
            return comp.$data.services;
          }
          return null;
        };
        
        const walkComponent = (comp) => {
          if (!comp) return null;
          const services = findServicesInComponent(comp);
          if (services) return services;
          
          if (comp.subTree && comp.subTree.children) {
            for (const child of comp.subTree.children) {
              if (child.component) {
                const result = walkComponent(child.component);
                if (result) return result;
              }
            }
          }
          return null;
        };
        
        services = walkComponent(instance);
      }
      
      return services;
    } catch (error) {
      console.error('从Vue获取服务数据失败:', error);
      return null;
    }
  };
  
  // 采集指定国家的业务数据
  const collectServicesForCountry = async (country) => {
    console.log(`📦 正在采集 ${country.label} 的业务数据...`);
    
    try {
      // 方法1: 直接从Vue组件数据中获取（最快）
      const vueServices = getServicesFromVue();
      if (vueServices && Array.isArray(vueServices) && vueServices.length > 0) {
        const countryServices = vueServices.filter(s => {
          // 检查服务是否属于当前国家
          const serviceCountry = s.country || s.country_code || s.category_id || '';
          return serviceCountry === country.value || 
                 serviceCountry.toLowerCase() === country.value.toLowerCase();
        });
        
        if (countryServices.length > 0) {
          countryServices.forEach(service => {
            if (!collectedData.services.find(s => s.id === service.id && s.country === country.value)) {
              collectedData.services.push({
                id: service.id || `service_${country.value}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: service.name || service.title || '',
                country: country.value,
                countryLabel: country.label,
                price: parseFloat(service.price || service.rate || service.amount || 0),
                priceText: (service.price || service.rate || service.amount || 0).toString()
              });
            }
          });
          
          const count = collectedData.services.filter(s => s.country === country.value).length;
          console.log(`✅ ${country.label}: 从Vue组件采集到 ${count} 个业务`);
          return;
        }
      }
      
      // 方法2: 模拟用户操作选择国家
      const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
      if (countryInput) {
        // 使用更安全的方式触发事件
        const triggerInput = (value) => {
          // 直接设置值
          countryInput.value = value;
          
          // 创建自定义事件，不包含isTrusted
          const inputEvent = new Event('input', { 
            bubbles: true, 
            cancelable: true 
          });
          
          // 手动设置值属性
          Object.defineProperty(inputEvent, 'target', {
            value: countryInput,
            enumerable: true
          });
          
          countryInput.dispatchEvent(inputEvent);
          
          // 触发Vue的v-model更新
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 
            'value'
          )?.set;
          
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(countryInput, value);
            const event = new Event('input', { bubbles: true });
            countryInput.dispatchEvent(event);
          }
        };
        
        // 清空输入
        triggerInput('');
        await sleep(300);
        
        // 输入国家代码或名称
        const searchText = country.value || country.label.split('/')[0];
        triggerInput(searchText);
        countryInput.focus();
        await sleep(1000);
        
        // 查找并点击国家选项
        const countryOptions = document.querySelectorAll('.country-option, .country-dropdown .option, [role="option"]');
        let clicked = false;
        
        for (const option of countryOptions) {
          const text = option.textContent.trim();
          if (text.includes(country.value) || text.includes(country.label) || text.includes(searchText)) {
            // 使用鼠标事件而不是click
            const mouseEvent = new MouseEvent('mousedown', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            option.dispatchEvent(mouseEvent);
            await sleep(100);
            option.click();
            clicked = true;
            await sleep(2000); // 等待业务列表加载
            break;
          }
        }
        
        if (!clicked && countryOptions.length > 0) {
          countryOptions[0].click();
          await sleep(2000);
        }
      }
      
      // 方法3: 从业务下拉列表中采集
      const serviceInput = document.querySelector('input[placeholder*="业务"], input[placeholder*="选择业务"]');
      if (serviceInput) {
        // 点击业务输入框
        serviceInput.click();
        serviceInput.focus();
        await sleep(500);
        
        // 清空并触发搜索
        serviceInput.value = '';
        serviceInput.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(1000);
        
        // 查找业务选项
        const serviceOptions = document.querySelectorAll('.service-option, .service-dropdown .option, [role="option"]');
        
        if (serviceOptions.length > 0) {
          serviceOptions.forEach(option => {
            const text = option.textContent.trim();
            if (!text) return;
            
            // 提取业务名称和价格
            const nameMatch = text.match(/^([^-]+)/);
            const name = nameMatch ? nameMatch[1].trim() : text;
            const priceMatch = text.match(/[\d.]+/g);
            const price = priceMatch ? parseFloat(priceMatch[priceMatch.length - 1]) : 0;
            
            if (name && !collectedData.services.find(s => s.name === name && s.country === country.value)) {
              collectedData.services.push({
                id: `service_${country.value}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: name,
                country: country.value,
                countryLabel: country.label,
                price: price,
                priceText: price.toString()
              });
            }
          });
        }
        
        // 再次从Vue组件获取（可能已更新）
        const updatedServices = getServicesFromVue();
        if (updatedServices && Array.isArray(updatedServices)) {
          const countryServices = updatedServices.filter(s => {
            const serviceCountry = s.country || s.country_code || s.category_id || '';
            return serviceCountry === country.value;
          });
          
          countryServices.forEach(service => {
            if (!collectedData.services.find(s => s.id === service.id && s.country === country.value)) {
              collectedData.services.push({
                id: service.id || `service_${country.value}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: service.name || service.title || '',
                country: country.value,
                countryLabel: country.label,
                price: parseFloat(service.price || service.rate || service.amount || 0),
                priceText: (service.price || service.rate || service.amount || 0).toString()
              });
            }
          });
        }
      }
      
      // 方法4: 尝试从API获取（使用正确的API路径）
      const currentServices = collectedData.services.filter(s => s.country === country.value);
      if (currentServices.length === 0) {
        console.log(`🔍 尝试从API获取 ${country.label} 的业务数据...`);
        try {
          // 尝试不同的API路径
          const apiPaths = [
            '/api/services',
            'https://jm273.cc/api/services',
            '/api/services?country=' + country.value,
            'https://jm273.cc/api/services?country=' + country.value
          ];
          
          for (const apiPath of apiPaths) {
            try {
              const response = await fetch(apiPath);
              if (response.ok) {
                const data = await response.json();
                const servicesList = data.data || data.services || data;
                
                if (Array.isArray(servicesList)) {
                  const countryServices = servicesList.filter(s => {
                    const serviceCountry = s.country || s.country_code || s.category_id || '';
                    return serviceCountry === country.value;
                  });
                  
                  countryServices.forEach(service => {
                    if (!collectedData.services.find(s => s.id === service.id)) {
                      collectedData.services.push({
                        id: service.id,
                        name: service.name || service.title || '',
                        country: country.value,
                        countryLabel: country.label,
                        price: parseFloat(service.price || service.rate || service.amount || 0),
                        priceText: (service.price || service.rate || service.amount || 0).toString()
                      });
                    }
                  });
                  
                  if (countryServices.length > 0) {
                    console.log(`✅ 从API获取到 ${countryServices.length} 个业务`);
                    break;
                  }
                }
              }
            } catch (e) {
              continue;
            }
          }
        } catch (apiError) {
          console.warn(`⚠️ API请求失败:`, apiError);
        }
      }
      
      const finalCount = collectedData.services.filter(s => s.country === country.value).length;
      console.log(`✅ ${country.label}: 共采集到 ${finalCount} 个业务`);
      
    } catch (error) {
      console.error(`❌ 采集 ${country.label} 的业务数据失败:`, error);
    }
  };
  
  // 下载JSON数据
  const downloadJSON = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // 采集当前选择国家的业务数据
  const collectCurrentCountryServices = async () => {
    if (isCollecting) {
      console.log('⏳ 正在采集中，请稍候...');
      return;
    }
    
    isCollecting = true;
    
    try {
      // 获取当前选择的国家
      const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
      if (!countryInput || !countryInput.value) {
        console.log('⚠️ 未检测到国家选择');
        isCollecting = false;
        return;
      }
      
      const countryLabel = countryInput.value.trim();
      if (!countryLabel) {
        isCollecting = false;
        return;
      }
      
      // 提取国家代码
      const countryValue = countryLabel.split('/')[0]?.trim() || 
                          countryLabel.split(' ')[0]?.trim() || 
                          countryLabel;
      
      // 检查是否已采集过这个国家
      const existingCountry = collectedData.countries.find(c => 
        c.value === countryValue || c.label === countryLabel
      );
      
      if (!existingCountry) {
        collectedData.countries.push({
          value: countryValue,
          label: countryLabel
        });
      }
      
      collectedData.currentCountry = {
        value: countryValue,
        label: countryLabel
      };
      
      console.log(`\n📦 开始采集 ${countryLabel} 的业务数据...`);
      
      // 等待业务列表加载
      await sleep(1500);
      
      // 方法1: 从Vue组件获取
      const vueServices = getServicesFromVue();
      let collectedCount = 0;
      
      if (vueServices && Array.isArray(vueServices) && vueServices.length > 0) {
        const countryServices = vueServices.filter(s => {
          const serviceCountry = s.country || s.country_code || s.category_id || '';
          return serviceCountry === countryValue || 
                 serviceCountry.toLowerCase() === countryValue.toLowerCase();
        });
        
        countryServices.forEach(service => {
          if (!collectedData.services.find(s => s.id === service.id && s.country === countryValue)) {
            collectedData.services.push({
              id: service.id || `service_${countryValue}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: service.name || service.title || '',
              country: countryValue,
              countryLabel: countryLabel,
              price: parseFloat(service.price || service.rate || service.amount || 0),
              priceText: (service.price || service.rate || service.amount || 0).toString()
            });
            collectedCount++;
          }
        });
      }
      
      // 方法2: 从业务下拉列表获取
      if (collectedCount === 0) {
        const serviceInput = document.querySelector('input[placeholder*="业务"], input[placeholder*="选择业务"]');
        if (serviceInput) {
          serviceInput.click();
          serviceInput.focus();
          await sleep(800);
          
          serviceInput.value = '';
          serviceInput.dispatchEvent(new Event('input', { bubbles: true }));
          await sleep(1000);
          
          const serviceOptions = document.querySelectorAll('.service-option, .service-dropdown .option, [role="option"]');
          
          if (serviceOptions.length > 0) {
            serviceOptions.forEach(option => {
              const text = option.textContent.trim();
              if (!text) return;
              
              const nameMatch = text.match(/^([^-]+)/);
              const name = nameMatch ? nameMatch[1].trim() : text;
              const priceMatch = text.match(/[\d.]+/g);
              const price = priceMatch ? parseFloat(priceMatch[priceMatch.length - 1]) : 0;
              
              if (name && !collectedData.services.find(s => s.name === name && s.country === countryValue)) {
                collectedData.services.push({
                  id: `service_${countryValue}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  name: name,
                  country: countryValue,
                  countryLabel: countryLabel,
                  price: price,
                  priceText: price.toString()
                });
                collectedCount++;
              }
            });
          }
        }
      }
      
      // 再次从Vue组件获取（可能已更新）
      if (collectedCount === 0) {
        await sleep(1000);
        const updatedServices = getServicesFromVue();
        if (updatedServices && Array.isArray(updatedServices)) {
          const countryServices = updatedServices.filter(s => {
            const serviceCountry = s.country || s.country_code || s.category_id || '';
            return serviceCountry === countryValue;
          });
          
          countryServices.forEach(service => {
            if (!collectedData.services.find(s => s.id === service.id && s.country === countryValue)) {
              collectedData.services.push({
                id: service.id || `service_${countryValue}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: service.name || service.title || '',
                country: countryValue,
                countryLabel: countryLabel,
                price: parseFloat(service.price || service.rate || service.amount || 0),
                priceText: (service.price || service.rate || service.amount || 0).toString()
              });
              collectedCount++;
            }
          });
        }
      }
      
      const totalForCountry = collectedData.services.filter(s => s.country === countryValue).length;
      console.log(`✅ ${countryLabel}: 本次采集到 ${collectedCount} 个业务，累计 ${totalForCountry} 个业务`);
      console.log(`📊 总进度: 已采集 ${collectedData.countries.length} 个国家，共 ${collectedData.services.length} 个业务`);
      console.log('⏸️  请手动选择下一个国家继续采集...\n');
      
    } catch (error) {
      console.error('❌ 采集失败:', error);
    } finally {
      isCollecting = false;
    }
  };
  
  // 导出数据
  window.finish = function() {
    console.log('\n📈 采集完成！');
    console.log(`国家数量: ${collectedData.countries.length}`);
    console.log(`业务总数: ${collectedData.services.length}`);
    
    // 按国家统计
    const stats = {};
    collectedData.services.forEach(s => {
      if (!stats[s.country]) {
        stats[s.country] = 0;
      }
      stats[s.country]++;
    });
    
    console.log('\n📊 各国家业务数量统计:');
    Object.entries(stats).forEach(([country, count]) => {
      const countryInfo = collectedData.countries.find(c => c.value === country);
      console.log(`  ${countryInfo?.label || country}: ${count} 个业务`);
    });
    
    // 导出数据
    console.log('\n💾 正在导出数据...');
    downloadJSON(collectedData, `jm273_data_${new Date().getTime()}.json`);
    
    console.log('\n✅ 数据已导出为JSON文件！');
    
    // 停止监听
    if (collectionObserver) {
      collectionObserver.disconnect();
      collectionObserver = null;
    }
    
    return collectedData;
  };
  
  // 查看已采集的数据
  window.showData = function() {
    console.log('\n📋 已采集的数据:');
    console.log(`国家数量: ${collectedData.countries.length}`);
    console.log(`业务总数: ${collectedData.services.length}`);
    console.log('\n国家列表:');
    collectedData.countries.forEach((c, i) => {
      const count = collectedData.services.filter(s => s.country === c.value).length;
      console.log(`  ${i + 1}. ${c.label} (${c.value}) - ${count} 个业务`);
    });
    return collectedData;
  };
  
  // 重置数据
  window.reset = function() {
    if (confirm('确定要重置所有采集数据吗？')) {
      collectedData.countries = [];
      collectedData.services = [];
      collectedData.currentCountry = null;
      console.log('✅ 数据已重置');
    }
  };
  
  // 初始化：采集国家列表并启动监听
  (async function init() {
    try {
      // 采集国家列表
      await collectCountries();
      
      // 如果国家列表为空，使用默认列表
      if (collectedData.countries.length === 0) {
        console.log('⚠️ 未采集到国家数据，使用默认国家列表...');
        collectedData.countries = [
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
      
      console.log(`\n📊 找到 ${collectedData.countries.length} 个国家`);
      console.log('✅ 脚本已就绪，请手动选择国家开始采集...\n');
      
      // 启动国家选择监听
      watchCountryChange();
      
      // 返回控制函数
      return {
        finish: window.finish,
        showData: window.showData,
        reset: window.reset,
        data: collectedData
      };
    } catch (error) {
      console.error('❌ 初始化失败:', error);
    }
  })();
})();

