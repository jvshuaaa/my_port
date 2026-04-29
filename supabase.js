// supabase.js
import { createClient } from '@supabase/supabase-js'

// Support env variables untuk Vercel, fallback ke hardcoded untuk local
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 
                     window.ENV?.SUPABASE_URL || 
                     'https://lyigktppyznswnynsjvl.supabase.co'

const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 
                     window.ENV?.SUPABASE_ANON_KEY || 
                     'sb_publishable_A-A8wsurGSU34Bs8SArsmg_Yl2KjExD'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
