const SUPABASE_URL = "https://dhvwjlujeusznsvgapdg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oXO3NRZhuXYmt1v8AIKpkg_QINjjp89";

window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY;

if (!window.supabase) {
  console.error("Supabase CDN not loaded. Make sure the Supabase script is loaded before supabase.js.");
} else {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("Supabase client initialized.");
}

function isSupabaseConfigured() {
  return (
    SUPABASE_URL &&
    SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_URL.includes("PASTE_YOUR") &&
    !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_YOUR")
  );
}

window.isSupabaseConfigured = isSupabaseConfigured;