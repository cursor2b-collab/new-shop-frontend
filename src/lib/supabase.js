import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://bxeubvjivqbbbhzngycf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZXVidmppdnFiYmJoem5neWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTU0MDYsImV4cCI6MjA3NzczMTQwNn0.SNMe6XdiUyT5ZntmcfmXFcCRm7gIZhNwjN71q7j5hKI'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

