/**
 * 从 jm273.cc API 接口导出所有服务数据
 * 
 * 使用方法：
 * 1. 在浏览器中打开 https://jm273.cc/#/
 * 2. 按 F12 打开开发者工具
 * 3. 切换到 Console 标签
 * 4. 复制此脚本的全部内容
 * 5. 粘贴到控制台并回车
 * 6. 运行：exportJm273ServicesFromAPI()
 * 7. 等待完成，JSON文件会自动下载
 */

async function exportJm273ServicesFromAPI() {
  console.log('🚀 开始从API接口导出 jm273.cc 的服务数据...\n');
  
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
  
  // 等待页面加载
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('📋 步骤1: 获取国家列表（categories）...\n');
  
  // 方法1: 从Vue组件获取国家列表
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
  
  // 获取国家列表
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
  
  // 创建categories（国家列表）
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
  
  console.log('📋 步骤2: 从Vue组件获取服务数据...\n');
  
  // 优先从Vue组件获取数据（因为API接口可能不存在）
  let allServices = [];
  
  const getServicesFromVue = () => {
    try {
      const app = document.querySelector('#app');
      if (!app || !app.__vue_app__) {
        console.log('  ⚠️ 未找到Vue应用实例');
        return null;
      }
      
      const vueApp = app.__vue_app__;
      console.log('  ✅ 找到Vue应用实例');
      
      // 方法1: 从根实例获取
      if (vueApp._instance) {
        const instance = vueApp._instance;
        console.log('  ✅ 找到Vue根实例');
        
        // 检查 setupState (Composition API)
        if (instance.setupState) {
          console.log('  ✅ 找到 setupState');
          if (instance.setupState.services) {
            console.log(`  ✅ 从 setupState.services 获取到 ${instance.setupState.services.length} 个服务`);
            return instance.setupState.services;
          }
        }
        
        // 检查 data (Options API)
        if (instance.data) {
          const data = typeof instance.data === 'function' ? instance.data() : instance.data;
          if (data && data.services) {
            console.log(`  ✅ 从 data.services 获取到 ${data.services.length} 个服务`);
            return data.services;
          }
        }
        
        // 检查 $data (Options API)
        if (instance.$data && instance.$data.services) {
          console.log(`  ✅ 从 $data.services 获取到 ${instance.$data.services.length} 个服务`);
          return instance.$data.services;
        }
      }
      
      // 方法2: 遍历所有组件实例
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
          if (instance.scope && instance.scope.slots) {
            Object.values(instance.scope.slots).forEach(slot => {
              if (slot && slot.children) {
                slot.children.forEach(child => {
                  if (child.component) {
                    walk(child.component);
                  }
                });
              }
            });
          }
        };
        if (app._instance) {
          walk(app._instance);
        }
        return components;
      };
      
      const components = findAllComponents(vueApp);
      console.log(`  ✅ 找到 ${components.length} 个组件实例`);
      
      for (const comp of components) {
        // 检查 setupState
        if (comp.setupState && comp.setupState.services) {
          const services = comp.setupState.services;
          if (Array.isArray(services) && services.length > 0) {
            console.log(`  ✅ 从组件 setupState.services 获取到 ${services.length} 个服务`);
            return services;
          }
        }
        
        // 检查 data
        if (comp.data) {
          const data = typeof comp.data === 'function' ? comp.data() : comp.data;
          if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
            console.log(`  ✅ 从组件 data.services 获取到 ${data.services.length} 个服务`);
            return data.services;
          }
        }
        
        // 检查 $data
        if (comp.$data && comp.$data.services && Array.isArray(comp.$data.services) && comp.$data.services.length > 0) {
          console.log(`  ✅ 从组件 $data.services 获取到 ${comp.$data.services.length} 个服务`);
          return comp.$data.services;
        }
      }
      
      console.log('  ⚠️ 未在任何组件中找到服务数据');
      return null;
    } catch (error) {
      console.error('  ❌ 从Vue获取服务数据失败:', error);
      return null;
    }
  };
  
  // 尝试从Vue组件获取服务数据
  console.log('正在从Vue组件中提取服务数据...');
  const vueServices = getServicesFromVue();
  
  if (vueServices && Array.isArray(vueServices) && vueServices.length > 0) {
    allServices = vueServices;
    console.log(`\n✅ 成功从Vue组件获取到 ${allServices.length} 个服务\n`);
  } else {
    // 如果Vue组件中没有数据，尝试触发页面加载数据
    console.log('\n⚠️ Vue组件中暂无服务数据，尝试触发数据加载...\n');
    
    // 尝试点击国家输入框，触发数据加载
    const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
    if (countryInput) {
      countryInput.click();
      countryInput.focus();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 再次尝试获取
      const retryServices = getServicesFromVue();
      if (retryServices && Array.isArray(retryServices) && retryServices.length > 0) {
        allServices = retryServices;
        console.log(`✅ 触发加载后获取到 ${allServices.length} 个服务\n`);
      } else {
        console.error('❌ 无法获取服务数据，请确保：');
        console.error('   1. 页面已完全加载');
        console.error('   2. 已选择国家并加载了业务数据');
        console.error('   3. 检查浏览器控制台的网络请求，找到真实的数据接口\n');
        return result;
      }
    } else {
      console.error('❌ 无法找到国家输入框，请刷新页面后重试\n');
      return result;
    }
  }
  
  console.log('📋 步骤3: 处理服务数据并关联到国家分类...\n');
  
  // 处理服务数据
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
      
      // 创建服务对象（标准格式）
      const serviceObj = {
        id: serviceId.toString(),
        name: serviceName,
        price: price.toFixed(5),
        sfcategory_id: category ? category.id : (result.categories[0]?.id || 'US'),
        deletetime: null,
        categoryId: category ? category.id : (result.categories[0]?.id || 'US'),
        categoryName: category ? category.name : (result.categories[0]?.name || 'US/美国 +1')
      };
      
      // 检查是否已存在（避免重复）
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
  
  // 去重服务（基于ID和sfcategory_id）
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
window.exportJm273ServicesFromAPI = exportJm273ServicesFromAPI;

// 如果在浏览器环境中
if (typeof window !== 'undefined') {
  console.log('✅ API导出脚本已加载！');
  console.log('💡 运行 exportJm273ServicesFromAPI() 开始导出数据');
  console.log('');
  console.log('   或者直接运行：');
  console.log('   exportJm273ServicesFromAPI().then(data => {');
  console.log('     console.log("导出完成", data);');
  console.log('   }).catch(err => {');
  console.log('     console.error("导出失败", err);');
  console.log('   });');
}

// 如果在 Node.js 环境中
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { exportJm273ServicesFromAPI };
}

