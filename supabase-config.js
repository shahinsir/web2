// supabase-config.js
// ====================================================
// YOUR SUPABASE CREDENTIALS - এখানে বসান
// ====================================================

const SUPABASE_URL = "https://cczayjqesmfimhedarzt.supabase.co";  // আপনার Supabase Project URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjemF5anFlc21maW1oZWRhcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTQ5NjQsImV4cCI6MjA4NTI3MDk2NH0.SsiTxRliy5oJxjH47bW6rukX367_iGVCSZpZF3-1CC4";                 // আপনার anon public key

// Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("✅ Supabase initialized");