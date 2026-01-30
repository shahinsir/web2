// supabase-config.js
// ====================================================
// YOUR SUPABASE CREDENTIALS - এখানে বসান
// ====================================================

const SUPABASE_URL = "https://cczayjqesmfimhedarzt.supabase.co";  // আপনার Supabase Project URL
const SUPABASE_KEY = "sb_publishable_uJgBtz07LsFp_6R3yD5l3w_oFRYe9p7";                 // আপনার anon public key

// Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("✅ Supabase initialized");