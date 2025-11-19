/**
 * 智能数据采集脚本 - 自动发现API接口并从Vue组件获取数据
 * 
 * 使用方法：
 * 1. 在浏览器中打开 https://jm273.cc/#/
 * 2. 按 F12 打开开发者工具
 * 3. 切换到 Console 标签
 * 4. 复制此脚本的全部内容
 * 5. 粘贴到控制台并回车
 * 6. 运行：exportJm273ServicesSmart()
 * 7. 等待完成，JSON文件会自动下载
 */

async function exportJm273ServicesSmart() {
  console.log('🚀 智能数据采集脚本已启动！\n');
  
  const result = {
    timestamp: new Date().toISOString(),
    url: window.location.origin,
    siteId: null,
    categories: [],
    services: [],
    summary: {
      totalCategories: 0,
      totalServices: 0
    }
  };
  
  // 步骤1: 监听网络请求，找到真实的数据接口
  console.log('📋 步骤1: 监听网络请求，查找数据接口...\n');
  
  const capturedRequests = [];
  const originalFetch = window.fetch;
  
  // 拦截 fetch 请求
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && (
      url.includes('/api/') || 
      url.includes('services') || 
      url.includes('country') ||
      url.includes('service')
    )) {
      console.log(`🔍 发现API请求: ${url}`);
      capturedRequests.push({
        url: url,
        timestamp: new Date().toISOString()
      });
    }
    return originalFetch.apply(this, args);
  };
  
  // 等待一段时间，让页面加载并触发请求
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 恢复原始 fetch
  window.fetch = originalFetch;
  
  if (capturedRequests.length > 0) {
    console.log(`✅ 捕获到 ${capturedRequests.length} 个相关API请求\n`);
    capturedRequests.forEach((req, index) => {
      console.log(`   ${index + 1}. ${req.url}`);
    });
    console.log('');
  } else {
    console.log('⚠️ 未捕获到API请求，将直接从Vue组件获取数据\n');
  }
  
  // 步骤2: 获取国家列表
  console.log('📋 步骤2: 获取国家列表（categories）...\n');
  
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
      
      // 检查 setupState (Composition API)
      if (instance.setupState && instance.setupState.countries) {
        return instance.setupState.countries;
      }
      
      // 检查 data (Options API)
      if (instance.data) {
        const data = typeof instance.data === 'function' ? instance.data() : instance.data;
        if (data && data.countries) {
          return data.countries;
        }
      }
      
      // 遍历所有组件
      const findAllComponents = (app) => {
        const components = [];
        const walk = (instance) => {
          if (!instance) return;
          components.push(instance);
          if (instance.subTree && instance.subTree.children) {
            for (const child of instance.subTree.children) {
              if (child.component) {
                walk(child.component);
              }
            }
          }
        };
        if (app._instance) {
          walk(app._instance);
        }
        return components;
      };
      
      const components = findAllComponents(vueApp);
      for (const comp of components) {
        if (comp.setupState && comp.setupState.countries) {
          return comp.setupState.countries;
        }
        if (comp.data) {
          const data = typeof comp.data === 'function' ? comp.data() : instance.data();
          if (data && data.countries) {
            return data.countries;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('从Vue获取国家列表失败:', error);
      return null;
    }
  };
  
  let countries = getCountriesFromVue();
  
  if (!countries || countries.length === 0) {
    console.log('⚠️ 未从Vue组件获取到国家列表，使用默认列表...');
    countries = [
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
    ];
  }
  
  // 创建categories
  countries.forEach((country, index) => {
    const categoryId = country.value || `CAT_${index + 1}`;
    const categoryName = country.label || country.name || country.value;
    
    result.categories.push({
      id: categoryId,
      name: categoryName,
      weigh: 100 - index,
      describe: '',
      deletetime: null
    });
  });
  
  console.log(`✅ 获取到 ${result.categories.length} 个国家分类\n`);
  
  // 步骤3: 从Vue组件获取服务数据
  console.log('📋 步骤3: 从Vue组件获取服务数据...\n');
  
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
      
      // 检查 setupState (Composition API)
      if (instance.setupState && instance.setupState.services) {
        const services = instance.setupState.services;
        if (Array.isArray(services) && services.length > 0) {
          return services;
        }
      }
      
      // 检查 data (Options API)
      if (instance.data) {
        const data = typeof instance.data === 'function' ? instance.data() : instance.data;
        if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
          return data.services;
        }
      }
      
      // 遍历所有组件
      const findAllComponents = (app) => {
        const components = [];
        const walk = (instance) => {
          if (!instance) return;
          components.push(instance);
          if (instance.subTree && instance.subTree.children) {
            for (const child of instance.subTree.children) {
              if (child.component) {
                walk(child.component);
              }
            }
          }
        };
        if (app._instance) {
          walk(app._instance);
        }
        return components;
      };
      
      const components = findAllComponents(vueApp);
      for (const comp of components) {
        if (comp.setupState && comp.setupState.services) {
          const services = comp.setupState.services;
          if (Array.isArray(services) && services.length > 0) {
            return services;
          }
        }
        if (comp.data) {
          const data = typeof comp.data === 'function' ? comp.data() : instance.data();
          if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
            return data.services;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('从Vue获取服务数据失败:', error);
      return null;
    }
  };
  
  let allServices = getServicesFromVue();
  
  // 如果Vue中没有数据，尝试触发加载
  if (!allServices || allServices.length === 0) {
    console.log('⚠️ Vue组件中暂无服务数据，尝试触发数据加载...\n');
    
    // 尝试点击国家输入框
    const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
    if (countryInput) {
      console.log('正在点击国家输入框以触发数据加载...');
      countryInput.click();
      countryInput.focus();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 再次尝试获取
      allServices = getServicesFromVue();
      if (allServices && allServices.length > 0) {
        console.log(`✅ 触发加载后获取到 ${allServices.length} 个服务\n`);
      }
    }
  }
  
  if (!allServices || allServices.length === 0) {
    console.error('❌ 无法从Vue组件获取服务数据\n');
    console.error('💡 请尝试以下方法：');
    console.error('   1. 手动选择一个国家，等待业务数据加载');
    console.error('   2. 然后再次运行此脚本');
    console.error('   3. 或者使用交互式采集脚本 data-collector-v2.js\n');
    
    // 显示捕获到的API请求，供用户参考
    if (capturedRequests.length > 0) {
      console.log('📋 捕获到的API请求（可手动尝试）：');
      capturedRequests.forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.url}`);
      });
      console.log('');
    }
    
    return result;
  }
  
  console.log(`✅ 成功获取到 ${allServices.length} 个服务\n`);
  
  // 步骤4: 处理服务数据
  console.log('📋 步骤4: 处理服务数据并关联到国家分类...\n');
  
  allServices.forEach((service, index) => {
    try {
      // 确定服务所属的国家
      const serviceCountry = service.country || 
                            service.country_code || 
                            service.category_id || 
                            service.sfcategory_id || '';
      
      // 查找对应的分类
      let category = result.categories.find(c => 
        c.id === serviceCountry || 
        c.id.toLowerCase() === serviceCountry.toLowerCase()
      );
      
      // 如果找不到，使用第一个分类作为默认
      if (!category && result.categories.length > 0) {
        category = result.categories[0];
      }
      
      // 提取服务信息
      const serviceId = service.id || 
                       service.service_id || 
                       `SERVICE_${Date.now()}_${index}`;
      
      const serviceName = service.name || 
                         service.title || 
                         service.service_name || 
                         '';
      
      const price = parseFloat(service.price || 
                               service.rate || 
                               service.amount || 
                               service.cost || 
                               0);
      
      // 创建服务对象
      const serviceObj = {
        id: serviceId.toString(),
        name: serviceName,
        price: price.toFixed(5),
        sfcategory_id: category ? category.id : (result.categories[0]?.id || 'US'),
        deletetime: null,
        categoryId: category ? category.id : (result.categories[0]?.id || 'US'),
        categoryName: category ? category.name : (result.categories[0]?.name || 'US/美国 +1')
      };
      
      // 检查是否已存在
      const exists = result.services.find(s => 
        s.id === serviceObj.id && 
        s.sfcategory_id === serviceObj.sfcategory_id
      );
      
      if (!exists && serviceName) {
        result.services.push(serviceObj);
      }
      
    } catch (error) {
      console.warn(`处理服务 ${index} 失败:`, error);
    }
  });
  
  // 去重
  const uniqueServices = [];
  const seenKeys = new Set();
  result.services.forEach(service => {
    const key = `${service.id}_${service.sfcategory_id}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueServices.push(service);
    }
  });
  result.services = uniqueServices;
  
  // 更新统计
  result.summary.totalCategories = result.categories.length;
  result.summary.totalServices = result.services.length;
  
  // 显示统计
  console.log('📊 导出统计:');
  console.log(`   - 分类数量: ${result.summary.totalCategories}`);
  console.log(`   - 服务数量: ${result.summary.totalServices}\n`);
  
  // 显示分类统计
  if (result.categories.length > 0) {
    console.log('📁 各国家服务数量统计:');
    result.categories.forEach(category => {
      const count = result.services.filter(s => s.sfcategory_id === category.id).length;
      if (count > 0) {
        console.log(`   - ${category.name} (${category.id}): ${count} 个服务`);
      }
    });
    console.log('');
  }
  
  // 生成并下载JSON文件
  const jsonStr = JSON.stringify(result, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jm273_services_export_${new Date().getTime()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ 数据导出完成！');
  console.log('📁 JSON文件已自动下载\n');
  
  // 显示数据预览
  if (result.services.length > 0) {
    console.log('📋 服务数据预览（前10个）:');
    result.services.slice(0, 10).forEach((service, index) => {
      console.log(`   ${index + 1}. [${service.id}] ${service.name}`);
      console.log(`      价格: ${service.price}`);
      console.log(`      国家: ${service.categoryName} (${service.sfcategory_id})`);
      console.log('');
    });
  }
  
  // 保存到全局变量
  window.jm273ExportedData = result;
  console.log('💾 数据已保存到 window.jm273ExportedData，可在控制台查看完整数据');
  
  return result;
}

// 确保函数在全局作用域中可用
if (typeof window !== 'undefined') {
  window.exportJm273ServicesSmart = exportJm273ServicesSmart;
  console.log('✅ 智能数据采集脚本已加载！');
  console.log('💡 运行 exportJm273ServicesSmart() 开始采集数据');
  console.log('');
  console.log('   或者直接运行：');
  console.log('   exportJm273ServicesSmart().then(data => {');
  console.log('     console.log("采集完成", data);');
  console.log('   }).catch(err => {');
  console.log('     console.error("采集失败", err);');
  console.log('   });');
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = { exportJm273ServicesSmart };
}

