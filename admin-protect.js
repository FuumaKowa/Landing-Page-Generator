function getSupabaseClient() {
  if (window.supabaseClient) return window.supabaseClient;
  if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }

  console.error("Supabase client not found. Check supabase.js.");
  return null;
}

async function protectAdminPage() {
  const client = getSupabaseClient();

  if (!client) {
    window.location.href = "admin-login.html";
    return;
  }

  const { data, error } = await client.auth.getSession();

  if (error || !data.session) {
    window.location.href = "admin-login.html";
    return;
  }

  document.body.classList.add("admin-authenticated");
}

async function adminLogout() {
  const client = getSupabaseClient();

  if (!client) {
    window.location.href = "admin-login.html";
    return;
  }

  await client.auth.signOut();
  window.location.href = "admin-login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll("[data-admin-logout]");

  logoutButtons.forEach((button) => {
    button.addEventListener("click", adminLogout);
  });
});

protectAdminPage();