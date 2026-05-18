// admin-login.js

const adminLoginForm = document.getElementById("adminLoginForm");
const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const loginMessage = document.getElementById("loginMessage");

function setLoginMessage(message, type = "") {
  loginMessage.textContent = message;
  loginMessage.className = `login-message ${type}`.trim();
}

function getSupabaseClient() {
  if (!window.supabaseClient) {
    console.error("Supabase client not found. Check supabase.js.");
    return null;
  }

  return window.supabaseClient;
}

function showLoginReasonMessage() {
  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason");

  if (!reason) return;

  const messages = {
    unauthorized: "You are signed in, but this account does not have admin access.",
    session_required: "Please login to access the admin dashboard.",
    connection_failed: "Supabase connection failed. Please check the project setup.",
  };

  setLoginMessage(messages[reason] || "Please login again.", "error");
}

async function checkExistingSession() {
  const supabaseClient = getSupabaseClient();
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) return;

  const { data: isAdmin, error: adminError } =
    await supabaseClient.rpc("is_admin");

  if (adminError || !isAdmin) {
    await supabaseClient.auth.signOut();
    setLoginMessage("This account does not have admin access.", "error");
    return;
  }

  window.location.href = "admin.html";
}

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const supabaseClient = getSupabaseClient();

  if (!supabaseClient) {
    setLoginMessage("Supabase connection failed.", "error");
    return;
  }

  const email = adminEmail.value.trim();
  const password = adminPassword.value.trim();

  if (!email || !password) {
    setLoginMessage("Please enter your email and password.", "error");
    return;
  }

  adminLoginBtn.disabled = true;
  adminLoginBtn.textContent = "Logging in...";
  setLoginMessage("");

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.session) {
      throw new Error("Login failed. No session was created.");
    }

    const { data: isAdmin, error: adminError } =
      await supabaseClient.rpc("is_admin");

    if (adminError || !isAdmin) {
      await supabaseClient.auth.signOut();
      throw new Error("This account does not have admin access.");
    }

    setLoginMessage("Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 500);
  } catch (error) {
    console.error("Admin login failed:", error);
    setLoginMessage(error.message || "Login failed. Please try again.", "error");
  } finally {
    adminLoginBtn.disabled = false;
    adminLoginBtn.textContent = "Login";
  }
});

showLoginReasonMessage();
checkExistingSession();