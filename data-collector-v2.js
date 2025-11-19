/**
 * 数据采集脚本 V2 - 采集 jm273.cc 的数据并生成标准格式JSON
 * 
 * 使用方法：
 * 1. 打开浏览器，访问 https://jm273.cc/#/
 * 2. 打开浏览器开发者工具（F12）
 * 3. 切换到 Console（控制台）标签
 * 4. 复制粘贴此脚本并运行
 * 5. 手动选择每个国家，脚本自动采集业务数据
 * 6. 所有国家采集完成后，输入 finish() 导出数据
 * 
 * 数据格式：与 sf312_services_export 格式一致
 */

(function() {
  console.log('🚀 数据采集脚本 V2 已启动！');
  console.log('📋 使用说明：');
  console.log('   1. 手动点击选择国家');
  console.log('   2. 脚本会自动采集该国家的业务数据');
  console.log('   3. 采集完成后，手动选择下一个国家');
  console.log('   4. 所有国家采集完成后，输入 finish() 导出数据');
  console.log('   5. 输入 showData() 查看已采集的数据');
  console.log('   6. 输入 reset() 重置采集数据');
  console.log('');
  
  // 存储采集的数据（标准格式）
  const collectedData = {
    timestamp: new Date().toISOString(),
    url: window.location.origin,
    siteId: null, // 可以从页面获取或手动设置
    categories: [], // 业务分类（相当于国家）
    services: [], // 业务服务
    summary: {
      totalCategories: 0,
      totalServices: 0
    }
  };
  
  // 采集状态
  let isCollecting = false;
  let collectionObserver = null;
  
  // 等待指定时间
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // 从Vue组件获取服务数据
  const getServicesFromVue = () => {
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
      
      if (instance.setupState && instance.setupState.countries) {
        countries = instance.setupState.countries;
      }
      
      if (!countries && instance.data && instance.data.countries) {
        countries = instance.data.countries;
      }
      
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
  
  // 初始化国家分类（categories）
  const initCategories = async () => {
    const vueCountries = getCountriesFromVue();
    
    if (vueCountries && Array.isArray(vueCountries) && vueCountries.length > 0) {
      vueCountries.forEach((country, index) => {
        const categoryId = country.value || `CAT_${index + 1}`;
        const categoryName = country.label || country.name || country.value;
        
        // 检查是否已存在
        if (!collectedData.categories.find(c => c.id === categoryId)) {
          collectedData.categories.push({
            id: categoryId,
            name: categoryName,
            weigh: 100 - index, // 权重，按顺序递减
            describe: '', // 描述可以为空
            deletetime: null
          });
        }
      });
      
      console.log(`✅ 初始化 ${collectedData.categories.length} 个国家分类`);
    } else {
      // 使用默认国家列表
      const defaultCountries = [
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
      
      defaultCountries.forEach((country, index) => {
        collectedData.categories.push({
          id: country.value,
          name: country.label,
          weigh: 100 - index,
          describe: '',
          deletetime: null
        });
      });
      
      console.log(`✅ 使用默认国家列表，初始化 ${collectedData.categories.length} 个分类`);
    }
  };
  
  // 监听国家选择变化
  const watchCountryChange = () => {
    if (collectionObserver) {
      collectionObserver.disconnect();
    }
    
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
      
      // 查找或创建分类
      let category = collectedData.categories.find(c => 
        c.id === countryValue || c.name === countryLabel
      );
      
      if (!category) {
        category = {
          id: countryValue,
          name: countryLabel,
          weigh: 100 - collectedData.categories.length,
          describe: '',
          deletetime: null
        };
        collectedData.categories.push(category);
      }
      
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
          // 检查是否已存在（通过id和categoryId）
          const existingService = collectedData.services.find(s => 
            s.id === service.id && s.sfcategory_id === category.id
          );
          
          if (!existingService) {
            collectedData.services.push({
              id: service.id || `SERVICE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: service.name || service.title || '',
              price: (service.price || service.rate || service.amount || 0).toString(),
              sfcategory_id: category.id,
              deletetime: null,
              categoryId: category.id,
              categoryName: category.name
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
            serviceOptions.forEach((option, index) => {
              const text = option.textContent.trim();
              if (!text) return;
              
              const nameMatch = text.match(/^([^-]+)/);
              const name = nameMatch ? nameMatch[1].trim() : text;
              const priceMatch = text.match(/[\d.]+/g);
              const price = priceMatch ? parseFloat(priceMatch[priceMatch.length - 1]) : 0;
              
              // 生成唯一ID
              const serviceId = `SERVICE_${category.id}_${Date.now()}_${index}`;
              
              if (name && !collectedData.services.find(s => s.name === name && s.sfcategory_id === category.id)) {
                collectedData.services.push({
                  id: serviceId,
                  name: name,
                  price: price.toString(),
                  sfcategory_id: category.id,
                  deletetime: null,
                  categoryId: category.id,
                  categoryName: category.name
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
            const existingService = collectedData.services.find(s => 
              s.id === service.id && s.sfcategory_id === category.id
            );
            
            if (!existingService) {
              collectedData.services.push({
                id: service.id || `SERVICE_${category.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: service.name || service.title || '',
                price: (service.price || service.rate || service.amount || 0).toString(),
                sfcategory_id: category.id,
                deletetime: null,
                categoryId: category.id,
                categoryName: category.name
              });
              collectedCount++;
            }
          });
        }
      }
      
      const totalForCountry = collectedData.services.filter(s => s.sfcategory_id === category.id).length;
      console.log(`✅ ${countryLabel}: 本次采集到 ${collectedCount} 个业务，累计 ${totalForCountry} 个业务`);
      console.log(`📊 总进度: 已采集 ${collectedData.categories.length} 个国家，共 ${collectedData.services.length} 个业务`);
      console.log('⏸️  请手动选择下一个国家继续采集...\n');
      
    } catch (error) {
      console.error('❌ 采集失败:', error);
    } finally {
      isCollecting = false;
    }
  };
  
  // 下载JSON数据
  const downloadJSON = (data, filename) => {
    // 更新summary
    data.summary = {
      totalCategories: data.categories.length,
      totalServices: data.services.length
    };
    
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
  
  // 导出数据
  window.finish = function() {
    console.log('\n📈 采集完成！');
    console.log(`分类数量: ${collectedData.categories.length}`);
    console.log(`业务总数: ${collectedData.services.length}`);
    
    // 按分类统计
    const stats = {};
    collectedData.services.forEach(s => {
      const catName = s.categoryName || s.sfcategory_id;
      if (!stats[catName]) {
        stats[catName] = 0;
      }
      stats[catName]++;
    });
    
    console.log('\n📊 各分类业务数量统计:');
    Object.entries(stats).forEach(([catName, count]) => {
      console.log(`  ${catName}: ${count} 个业务`);
    });
    
    // 更新summary
    collectedData.summary = {
      totalCategories: collectedData.categories.length,
      totalServices: collectedData.services.length
    };
    
    // 导出数据
    console.log('\n💾 正在导出数据...');
    const filename = `jm273_services_export_${Date.now()}.json`;
    downloadJSON(collectedData, filename);
    
    console.log('\n✅ 数据已导出为JSON文件！');
    console.log(`文件名: ${filename}`);
    console.log('\n📋 数据预览（前5条）:');
    console.log(JSON.stringify({
      ...collectedData,
      categories: collectedData.categories.slice(0, 5),
      services: collectedData.services.slice(0, 5)
    }, null, 2));
    
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
    console.log(`分类数量: ${collectedData.categories.length}`);
    console.log(`业务总数: ${collectedData.services.length}`);
    console.log('\n分类列表:');
    collectedData.categories.forEach((c, i) => {
      const count = collectedData.services.filter(s => s.sfcategory_id === c.id).length;
      console.log(`  ${i + 1}. ${c.name} (${c.id}) - ${count} 个业务`);
    });
    return collectedData;
  };
  
  // 重置数据
  window.reset = function() {
    if (confirm('确定要重置所有采集数据吗？')) {
      collectedData.categories = [];
      collectedData.services = [];
      collectedData.summary = {
        totalCategories: 0,
        totalServices: 0
      };
      console.log('✅ 数据已重置');
    }
  };
  
  // 初始化
  (async function init() {
    try {
      // 初始化分类
      await initCategories();
      
      console.log(`\n📊 找到 ${collectedData.categories.length} 个分类`);
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

