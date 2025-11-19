// 采集 zj211.cc 的商品数据（尝试不同的API端点）

import fs from 'fs';

async function collectProducts() {
  console.log('🚀 开始采集 zj211.cc 的商品数据...\n');

  // 读取已获取的分类数据
  const categoryData = JSON.parse(fs.readFileSync('zj211_products_export.json', 'utf8'));
  const categories = categoryData.categories;
  
  console.log(`📋 共有 ${categories.length} 个分类需要获取商品数据\n`);

  const allProducts = [];
  let successCount = 0;
  let failCount = 0;

  // 尝试不同的API端点格式
  const tryGetProducts = async (categoryId) => {
    const endpoints = [
      `https://data.pay4.cc/api/proinfo/getProList?siteid=101&categoryid=${categoryId}`,
      `https://data.pay4.cc/api/proinfo/getProList?siteid=101&sfcategory_id=${categoryId}`,
      `https://data.pay4.cc/api/proinfo/index?siteid=101&categoryid=${categoryId}`,
      `https://data.pay4.cc/api/proinfo/list?siteid=101&categoryid=${categoryId}`,
      `https://data.pay4.cc/api/proinfo/getList?siteid=101&categoryid=${categoryId}`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': 'https://zj211.cc/',
            'Origin': 'https://zj211.cc'
          }
        });

        const text = await response.text();
        
        // 检查是否是JSON
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
          const data = JSON.parse(text);
          
          // 检查数据结构
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            return data.data;
          }
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
          if (data.list && Array.isArray(data.list) && data.list.length > 0) {
            return data.list;
          }
        }
      } catch (e) {
        // 继续尝试下一个端点
        continue;
      }
    }
    
    return null;
  };

  // 只尝试前10个分类作为测试
  const testCategories = categories.slice(0, 10);
  
  for (const category of testCategories) {
    try {
      const products = await tryGetProducts(category.id);
      
      if (products && products.length > 0) {
        const formattedProducts = products.map(p => ({
          id: p.id || `PROD_${category.id}_${Date.now()}`,
          name: p.name || p.title || '',
          price: parseFloat(p.price || p.amount || 0).toFixed(5),
          categoryId: category.id,
          categoryName: category.name,
          stock: p.stock || p.quantity || 0,
          describe: p.describe || p.description || '',
          deletetime: p.deletetime || null
        }));
        
        allProducts.push(...formattedProducts);
        successCount++;
        console.log(`✅ 分类 "${category.name}" (ID: ${category.id}): ${formattedProducts.length} 个商品`);
      } else {
        failCount++;
        console.log(`⚠️ 分类 "${category.name}" (ID: ${category.id}): 暂无商品数据`);
      }
      
      // 添加延迟
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      failCount++;
      console.error(`❌ 获取分类 "${category.name}" 的商品失败:`, error.message);
    }
  }

  console.log(`\n📊 采集结果:`);
  console.log(`   - 成功: ${successCount} 个分类`);
  console.log(`   - 失败: ${failCount} 个分类`);
  console.log(`   - 总商品数: ${allProducts.length}\n`);

  if (allProducts.length > 0) {
    // 更新数据文件
    categoryData.products = allProducts;
    categoryData.summary.totalProducts = allProducts.length;
    categoryData.updatedAt = new Date().toISOString();
    
    fs.writeFileSync('zj211_products_export.json', JSON.stringify(categoryData, null, 2), 'utf8');
    console.log('✅ 数据已更新到: zj211_products_export.json');
    
    console.log('\n📦 前10个商品:');
    allProducts.slice(0, 10).forEach(prod => {
      console.log(`   - ${prod.name} (${prod.categoryName}) - ${prod.price} USDT`);
    });
  } else {
    console.log('⚠️ 未能获取到商品数据，可能API需要特定的认证或参数');
    console.log('💡 建议：');
    console.log('   1. 检查浏览器网络请求，找到实际使用的商品API');
    console.log('   2. 查看API是否需要特定的请求头或认证信息');
    console.log('   3. 商品数据可能需要在选择分类后才会加载');
  }

  return allProducts;
}

collectProducts().catch(console.error);


