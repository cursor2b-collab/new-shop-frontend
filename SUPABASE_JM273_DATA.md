# JM273 数据表结构说明

## 数据库表

### 1. jm273_countries（国家分类表）

存储所有国家分类信息。

**表结构：**
- `id` (VARCHAR(10), PRIMARY KEY) - 国家代码（如CN、US等）
- `name` (VARCHAR(100), NOT NULL) - 国家名称（如CN/中国 +86）
- `weigh` (INTEGER, DEFAULT 100) - 排序权重，数值越大越靠前
- `describe` (TEXT, DEFAULT '') - 国家描述
- `deletetime` (TIMESTAMP WITH TIME ZONE) - 删除时间，NULL表示未删除
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()) - 创建时间
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()) - 更新时间

**索引：**
- `idx_jm273_countries_weigh` - 按权重排序
- `idx_jm273_countries_deletetime` - 按删除时间过滤

**数据统计：**
- 总记录数：181
- 活跃记录数：181

### 2. jm273_services（业务服务表）

存储所有业务服务信息，每个服务关联一个国家。

**表结构：**
- `id` (VARCHAR(50), PRIMARY KEY) - 服务ID
- `name` (VARCHAR(200), NOT NULL) - 服务名称
- `price` (DECIMAL(10, 5), NOT NULL, DEFAULT 0.00000) - 服务价格（USDT）
- `country_id` (VARCHAR(10), NOT NULL, FOREIGN KEY) - 关联的国家ID
- `country_name` (VARCHAR(100), NOT NULL) - 国家名称（冗余字段，便于查询）
- `deletetime` (TIMESTAMP WITH TIME ZONE) - 删除时间，NULL表示未删除
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()) - 创建时间
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW()) - 更新时间

**索引：**
- `idx_jm273_services_country_id` - 按国家ID查询
- `idx_jm273_services_name` - 按服务名称查询
- `idx_jm273_services_price` - 按价格查询
- `idx_jm273_services_deletetime` - 按删除时间过滤

**外键约束：**
- `fk_jm273_services_country` - 关联到 `jm273_countries(id)`，级联删除

**数据统计：**
- 总记录数：35,114
- 活跃记录数：35,114

## 使用示例

### 查询所有国家
```sql
SELECT * FROM jm273_countries 
WHERE deletetime IS NULL 
ORDER BY weigh DESC;
```

### 查询指定国家的所有服务
```sql
SELECT * FROM jm273_services 
WHERE country_id = 'CN' 
  AND deletetime IS NULL 
ORDER BY name;
```

### 查询服务并关联国家信息
```sql
SELECT 
  s.name,
  s.price,
  c.name as country_name
FROM jm273_services s
JOIN jm273_countries c ON s.country_id = c.id
WHERE s.deletetime IS NULL
  AND c.deletetime IS NULL
ORDER BY c.weigh DESC, s.name;
```

### 统计每个国家的服务数量
```sql
SELECT 
  c.name as country_name,
  COUNT(s.id) as service_count
FROM jm273_countries c
LEFT JOIN jm273_services s ON c.id = s.country_id AND s.deletetime IS NULL
WHERE c.deletetime IS NULL
GROUP BY c.id, c.name
ORDER BY c.weigh DESC;
```

## 在 Vue 应用中使用

### 获取所有国家
```javascript
import { supabase } from '@/lib/supabase'

const { data: countries, error } = await supabase
  .from('jm273_countries')
  .select('*')
  .is('deletetime', null)
  .order('weigh', { ascending: false })
```

### 获取指定国家的服务
```javascript
const { data: services, error } = await supabase
  .from('jm273_services')
  .select('*')
  .eq('country_id', 'CN')
  .is('deletetime', null)
  .order('name')
```

### 搜索服务
```javascript
const { data: services, error } = await supabase
  .from('jm273_services')
  .select('*, jm273_countries(*)')
  .ilike('name', `%${searchTerm}%`)
  .is('deletetime', null)
```

## 数据来源

- 采集网站：https://jm273.cc
- 采集时间：2025-01-17
- 数据格式：JSON (jm273_services_export_complete.json)
- 导入脚本：import-to-supabase-sync.js

## 注意事项

1. 所有表都启用了 RLS（行级安全），当前策略允许：
   - 所有人可以读取（SELECT）
   - 所有人可以插入（INSERT）
   - 所有人可以更新（UPDATE）

2. 如果需要限制写入权限，可以修改 RLS 策略。

3. 数据使用 `upsert` 方式导入，如果记录已存在（根据主键），则会更新。

4. `country_name` 字段是冗余字段，用于提高查询性能，避免频繁 JOIN。


