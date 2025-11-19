// 采集 zj211.cc 的商品分类和商品数据

async function collectData() {
  console.log('🚀 开始采集 zj211.cc 的数据...\n');

  try {
    // 1. 获取商品分类
    console.log('📋 步骤1: 获取商品分类...');
    const categoryResponse = await fetch('https://data.pay4.cc/api/proinfo/getCategory?siteid=101');
    const categoryData = await categoryResponse.json();
    
    if (!categoryData.data || !Array.isArray(categoryData.data)) {
      console.error('❌ 获取分类数据失败:', categoryData);
      return;
    }
    
    const categories = categoryData.data;
    console.log(`✅ 获取到 ${categories.length} 个分类\n`);
    
    // 2. 获取每个分类的商品
    console.log('📋 步骤2: 获取商品数据...');
    const allProducts = [];
    
    for (const category of categories) {
      try {
        // 尝试多个可能的API端点
        const apiEndpoints = [
          `https://data.pay4.cc/api/proinfo/getProList?siteid=101&categoryid=${category.id}`,
          `https://data.pay4.cc/api/proinfo/getProList?siteid=101&sfcategory_id=${category.id}`,
          `https://data.pay4.cc/api/proinfo/index?siteid=101&categoryid=${category.id}`
        ];
        
        let productData = null;
        for (const endpoint of apiEndpoints) {
          try {
            const productResponse = await fetch(endpoint, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            const text = await productResponse.text();
            if (text.startsWith('{') || text.startsWith('[')) {
              productData = JSON.parse(text);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (productData && productData.data && Array.isArray(productData.data)) {
          const products = productData.data.map(p => ({
            ...p,
            categoryId: category.id,
            categoryName: category.name
          }));
          allProducts.push(...products);
          console.log(`✅ 分类 "${category.name}" (ID: ${category.id}): ${products.length} 个商品`);
        } else {
          console.log(`⚠️ 分类 "${category.name}" (ID: ${category.id}): 暂无商品数据`);
        }
        
        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`❌ 获取分类 "${category.name}" 的商品失败:`, error.message);
      }
    }
    
    console.log(`\n✅ 总共获取到 ${allProducts.length} 个商品\n`);
    
    // 3. 整理数据格式
    const result = {
      timestamp: new Date().toISOString(),
      url: 'https://zj211.cc/',
      siteId: 101,
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        weigh: cat.weigh || 100,
        describe: cat.describe || '',
        deletetime: cat.deletetime || null
      })),
      products: allProducts.map(prod => ({
        id: prod.id,
        name: prod.name,
        price: parseFloat(prod.price || 0).toFixed(5),
        categoryId: prod.categoryId,
        categoryName: prod.categoryName,
        stock: prod.stock || 0,
        describe: prod.describe || '',
        deletetime: prod.deletetime || null
      })),
      summary: {
        totalCategories: categories.length,
        totalProducts: allProducts.length
      }
    };
    
    // 4. 保存数据
    const fs = await import('fs');
    const outputPath = 'zj211_products_export.json';
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    
    console.log('📊 数据统计:');
    console.log(`   - 分类数: ${result.summary.totalCategories}`);
    console.log(`   - 商品数: ${result.summary.totalProducts}`);
    console.log(`\n✅ 数据已保存到: ${outputPath}`);
    
    // 显示前几个分类和商品
    console.log('\n📋 前5个分类:');
    result.categories.slice(0, 5).forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id})`);
    });
    
    console.log('\n📦 前10个商品:');
    result.products.slice(0, 10).forEach(prod => {
      console.log(`   - ${prod.name} (${prod.categoryName}) - ${prod.price} USDT`);
    });
    
    return result;
  } catch (error) {
    console.error('❌ 采集数据失败:', error);
    throw error;
  }
}

// 执行采集
collectData().catch(console.error);

