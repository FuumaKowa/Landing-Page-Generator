// admin-protect.js

function getSupabaseClient() {
  if (!window.supabaseClient) {
    console.error("Supabase client not found. Check supabase.js.");
    return null;
  }

  return window.supabaseClient;
}

function redirectToLogin(reason = "") {
  const query = reason ? `?reason=${encodeURIComponent(reason)}` : "";
  window.location.href = `admin-login.html${query}`;
}

function showAdminEmail(session) {
  const emailElements = document.querySelectorAll("[data-admin-email]");
  const email = session?.user?.email || "Admin";

  emailElements.forEach((element) => {
    element.textContent = email;
  });
}

async function protectAdminPage() {
  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    redirectToLogin("connection_failed");
    return;
  }

  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    redirectToLogin("session_required");
    return;
  }

  const { data: isAdmin, error: adminError } =
    await supabaseClient.rpc("is_admin");

  if (adminError || !isAdmin) {
    console.error("Admin verification failed:", adminError);

    await supabaseClient.auth.signOut();
    redirectToLogin("unauthorized");
    return;
  }

  showAdminEmail(sessionData.session);
  document.body.classList.add("admin-authenticated");
}

async function adminLogout() {
  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    redirectToLogin("connection_failed");
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