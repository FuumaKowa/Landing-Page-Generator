const SUPABASE_URL = "https://dhvwjlujeusznsvgapdg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_oXO3NRZhuXYmt1v8AIKpkg_QINjjp89";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

function isSupabaseConfigured() {
  return (
    SUPABASE_URL &&
    SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_URL.includes("PASTE_YOUR") &&
    !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_YOUR")
  );
}