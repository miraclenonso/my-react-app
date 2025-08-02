// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://erswgwqdcototxoofplu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyc3dnd3FkY290b3R4b29mcGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDk3NjIsImV4cCI6MjA2OTUyNTc2Mn0.J8goHTpvKhTZWo1sIFwT2czuvZ8C8RWSpbL2q5Yuva4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
