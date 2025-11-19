import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://bxeubvjivqbbbhzngycf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZXVidmppdnFiYmJoem5neWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTU0MDYsImV4cCI6MjA3NzczMTQwNn0.SNMe6XdiUyT5ZntmcfmXFcCRm7gIZhNwjN71q7j5hKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 读取JSON数据
console.log('📖 读取JSON数据文件...');
const jsonData = JSON.parse(fs.readFileSync('jm273_services_export_complete.json', 'utf8'));
console.log(`✅ 已读取数据: ${jsonData.categories.length} 个国家, ${jsonData.services.length} 个服务\n`);

async function importData() {
  console.log('🚀 开始导入数据到 Supabase...\n');

  // 步骤1: 导入国家数据
  console.log('📋 步骤1: 导入国家数据...');
  const countries = jsonData.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    weigh: cat.weigh,
    describe: cat.describe || '',
    deletetime: cat.deletetime || null
  }));

  // 一次性导入所有国家数据（数量不多，可以一次性导入）
  console.log(`   准备导入 ${countries.length} 个国家...`);
  const { data: countryData, error: countryError } = await supabase
    .from('jm273_countries')
    .upsert(countries, { onConflict: 'id' });
  
  if (countryError) {
    console.error(`❌ 导入国家数据失败:`, countryError.message);
    return;
  }
  
  console.log(`✅ 国家数据导入完成！共 ${countries.length} 条记录\n`);

  // 步骤2: 导入业务数据
  console.log('📋 步骤2: 导入业务数据...');
  const services = jsonData.services.map(svc => ({
    id: svc.id,
    name: svc.name,
    price: parseFloat(svc.price),
    country_id: svc.countryId || svc.sfcategory_id,
    country_name: svc.categoryName,
    deletetime: svc.deletetime || null
  }));

  // 分批导入业务数据（每批1000条）
  const serviceBatchSize = 1000;
  let importedServices = 0;
  const totalBatches = Math.ceil(services.length / serviceBatchSize);
  
  console.log(`   准备导入 ${services.length} 个服务，分 ${totalBatches} 批...\n`);
  
  for (let i = 0; i < services.length; i += serviceBatchSize) {
    const batch = services.slice(i, i + serviceBatchSize);
    const batchNum = Math.floor(i / serviceBatchSize) + 1;
    
    const { data, error } = await supabase
      .from('jm273_services')
      .upsert(batch, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ 导入业务数据失败 (批次 ${batchNum}/${totalBatches}):`, error.message);
      // 如果批量导入失败，尝试分成更小的批次（100条）
      console.log(`   尝试使用更小的批次重新导入...`);
      const smallBatchSize = 100;
      for (let j = 0; j < batch.length; j += smallBatchSize) {
        const smallBatch = batch.slice(j, j + smallBatchSize);
        const { error: smallError } = await supabase
          .from('jm273_services')
          .upsert(smallBatch, { onConflict: 'id' });
        if (!smallError) {
          importedServices += smallBatch.length;
        } else {
          console.error(`   小批次 ${Math.floor(j / smallBatchSize) + 1} 也失败了:`, smallError.message);
        }
      }
    } else {
      importedServices += batch.length;
      const progress = ((importedServices / services.length) * 100).toFixed(2);
      console.log(`✅ [${batchNum}/${totalBatches}] 已导入 ${importedServices}/${services.length} 个服务 (${progress}%)`);
    }
    
    // 添加小延迟，避免请求过快
    if (i + serviceBatchSize < services.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log(`\n✅ 业务数据导入完成！共 ${importedServices} 条记录\n`);

  // 验证数据
  console.log('📊 验证导入的数据...');
  const { count: countryCount } = await supabase
    .from('jm273_countries')
    .select('*', { count: 'exact', head: true });
  
  const { count: serviceCount } = await supabase
    .from('jm273_services')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📈 导入结果统计:`);
  console.log(`   - 国家数: ${countryCount}`);
  console.log(`   - 服务数: ${serviceCount}`);
  console.log(`\n✅ 数据导入完成！`);
}

// 执行导入
importData().catch(error => {
  console.error('❌ 导入过程中发生错误:', error);
  process.exit(1);
});


