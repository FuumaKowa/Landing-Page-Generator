function getSupabaseClient() {
  if (!window.supabaseClient) {
    console.error("Supabase client not found. Check supabase.js.");
    return null;
  }

  return window.supabaseClient;
}

async function protectAdminPage() {
  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    window.location.href = "admin-login.html";
    return;
  }

  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    window.location.href = "admin-login.html";
    return;
  }

  const { data: isAdmin, error: adminError } =
    await supabaseClient.rpc("is_admin");

  if (adminError || !isAdmin) {
    console.error("Admin verification failed:", adminError);

    await supabaseClient.auth.signOut();
    window.location.href = "admin-login.html";
    return;
  }

  document.body.classList.add("admin-authenticated");
}

async function adminLogout() {
  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    window.location.href = "admin-login.html";
    return;
  }

  await supabaseClient.auth.signOut();
  window.location.href = "admin-login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll("[data-admin-logout]");

  logoutButtons.forEach((button) => {
    button.addEventListener("click", adminLogout);
  });
});

protectAdminPage();