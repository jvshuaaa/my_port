// supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://lyigktppyznswnynsjvl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aWdrdHBweXpuc3dueW5zanZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTIyNjMsImV4cCI6MjA5MzAyODI2M30.2iO6QjfdkWG-CJyXCB750TNIndTWWlZmE7SDA0ZcYoI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
