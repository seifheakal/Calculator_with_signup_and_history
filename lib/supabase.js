import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tsmugyrmdbqimcszenai.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXVneXJtZGJxaW1jc3plbmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODE2NDQsImV4cCI6MjA3MDA1NzY0NH0.rRMBEjcVtscJ6WQJXwXZqDIhxz8HkyQBUaEIMwfyWic'
export const supabase = createClient(supabaseUrl, supabaseKey)
