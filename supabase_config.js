// supabase_config.js
// 1. Replace these with your actual Project URL and Anon Key from your Supabase Dashboard
const SUPABASE_URL = 'https://zmxbhgzdgviktkdsgbau.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpteGJoZ3pkZ3Zpa3RrZHNnYmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjMyNTMsImV4cCI6MjA5NDY5OTI1M30.YAMBtJaPwAxhzUiFbsi4O5C8v0pCmoKP4AGGOdb6wZM';

// 2. Initialize the Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to check if Supabase is properly configured
async function checkSupabaseConnection() {
    if (SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
        console.warn("Supabase is not configured yet. Please update supabase_config.js with your keys.");
        return false;
    }
    return true;
}
