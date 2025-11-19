/**
 * 简单数据采集脚本 - 从Vue组件获取数据
 * 
 * 使用方法：
 * 1. 在浏览器中打开 https://jm273.cc/#/
 * 2. 按 F12 打开开发者工具
 * 3. 切换到 Console 标签
 * 4. 复制此脚本的全部内容
 * 5. 粘贴到控制台并回车
 * 6. 运行：exportJm273Services()
 */

// 直接在全局作用域定义函数
async function exportJm273Services() {
    console.log('🚀 数据采集脚本已启动！\n');
    
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
    
    // 步骤1: 获取国家列表
    console.log('📋 步骤1: 获取国家列表...\n');
    
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
        { value: 'CA', label: 'CA/加拿大 +1' }
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
    
    // 步骤2: 获取服务数据
    console.log('📋 步骤2: 获取服务数据...\n');
    
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
      
      const countryInput = document.querySelector('input[placeholder*="国家"], input[placeholder*="选择国家"]');
      if (countryInput) {
        console.log('正在点击国家输入框以触发数据加载...');
        // 使用更安全的方式触发事件，避免 isTrusted 错误
        countryInput.focus();
        // 直接设置值而不是触发事件
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
      return result;
    }
    
    console.log(`✅ 成功获取到 ${allServices.length} 个服务\n`);
    
    // 步骤3: 处理服务数据
    console.log('📋 步骤3: 处理服务数据...\n');
    
    allServices.forEach((service, index) => {
      try {
        const serviceCountry = service.country || 
                              service.country_code || 
                              service.category_id || 
                              service.sfcategory_id || '';
        
        let category = result.categories.find(c => 
          c.id === serviceCountry || 
          c.id.toLowerCase() === serviceCountry.toLowerCase()
        );
        
        if (!category && result.categories.length > 0) {
          category = result.categories[0];
        }
        
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
        
        const serviceObj = {
          id: serviceId.toString(),
          name: serviceName,
          price: price.toFixed(5),
          sfcategory_id: category ? category.id : (result.categories[0]?.id || 'US'),
          deletetime: null,
          categoryId: category ? category.id : (result.categories[0]?.id || 'US'),
          categoryName: category ? category.name : (result.categories[0]?.name || 'US/美国 +1')
        };
        
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
    
    // 保存到全局变量
    window.jm273ExportedData = result;
    console.log('💾 数据已保存到 window.jm273ExportedData');
    
    return result;
}

// 确保函数在全局作用域中可用
if (typeof window !== 'undefined') {
  window.exportJm273Services = exportJm273Services;
  console.log('✅ 数据采集脚本已加载！');
  console.log('💡 运行 exportJm273Services() 开始采集数据');
  console.log('');
} else {
  // Node.js 环境
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exportJm273Services };
  }
}

