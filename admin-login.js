const adminLoginForm = document.getElementById("adminLoginForm");
const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const loginMessage = document.getElementById("loginMessage");

function getSupabaseClient() {
  if (window.supabaseClient) return window.supabaseClient;
  if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }

  console.error("Supabase client not found. Check supabase.js.");
  return null;
}

function setLoginMessage(message, type = "") {
  loginMessage.textContent = message;
  loginMessage.className = `login-message ${type}`.trim();
}

async function checkExistingSession() {
  const client = getSupabaseClient();
  if (!client) return;

  const { data } = await client.auth.getSession();

  if (data.session) {
    window.location.href = "admin.html";
  }
}

adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const client = getSupabaseClient();
  if (!client) {
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
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.session) {
      throw new Error("Login failed. No session was created.");
    }

    setLoginMessage("Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 600);
  } catch (error) {
    console.error("Admin login failed:", error);
    setLoginMessage(error.message || "Login failed. Please try again.", "error");
  } finally {
    adminLoginBtn.disabled = false;
    adminLoginBtn.textContent = "Login";
  }
});

checkExistingSession();