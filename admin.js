const requestsList = document.getElementById("requestsList");
const emptyState = document.getElementById("emptyState");
const refreshBtn = document.getElementById("refreshBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

const totalRequests = document.getElementById("totalRequests");
const pendingRequests = document.getElementById("pendingRequests");
const paidRequests = document.getElementById("paidRequests");
const approvedRequests = document.getElementById("approvedRequests");
const publishedRequests = document.getElementById("publishedRequests");

function getStoredSubmissions() {
  const savedSubmissions = localStorage.getItem("dogoodLandingSubmissions");

  if (!savedSubmissions) return [];

  try {
    const parsedSubmissions = JSON.parse(savedSubmissions);
    return Array.isArray(parsedSubmissions) ? parsedSubmissions : [];
  } catch (error) {
    console.warn("Invalid submission list found.", error);
    return [];
  }
}

function saveStoredSubmissions(submissions) {
  localStorage.setItem("dogoodLandingSubmissions", JSON.stringify(submissions));
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-MY", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function getStatusBadgeClass(value) {
  if (value === "approved" || value === "published" || value === "payment_confirmed") {
    return "approved";
  }

  if (value === "rejected") {
    return "rejected";
  }

  if (value === "unpaid" || value === "payment_submitted") {
    return "payment";
  }

  return "review";
}

function updateStats(submissions) {
    totalRequests.textContent = submissions.length;
  
    pendingRequests.textContent = submissions.filter(
      (item) => item.status === "pending_review"
    ).length;
  
    paidRequests.textContent = submissions.filter(
      (item) => item.paymentStatus === "payment_confirmed"
    ).length;
  
    approvedRequests.textContent = submissions.filter(
      (item) => item.approvalStatus === "approved"
    ).length;
  
    if (publishedRequests) {
      publishedRequests.textContent = submissions.filter(
        (item) => item.status === "published"
      ).length;
    }
  }

function updateSubmission(id, updates) {
  const submissions = getStoredSubmissions();

  const updatedSubmissions = submissions.map((submission) => {
    if (submission.id !== id) return submission;

    return {
      ...submission,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  });

  saveStoredSubmissions(updatedSubmissions);
  renderRequests();
}

function deleteSubmission(id) {
  const confirmDelete = confirm("Delete this test submission?");

  if (!confirmDelete) return;

  const submissions = getStoredSubmissions();
  const updatedSubmissions = submissions.filter((submission) => submission.id !== id);

  saveStoredSubmissions(updatedSubmissions);
  renderRequests();
}

function previewSubmission(id) {
  const submissions = getStoredSubmissions();
  const submission = submissions.find((item) => item.id === id);

  if (!submission) {
    alert("Submission not found.");
    return;
  }

  localStorage.setItem(
    "dogoodAgentLandingDraft",
    JSON.stringify(submission.agentData)
  );

  window.open("index.html", "_blank");
}

function getStoredPublishedPages() {
    const savedPages = localStorage.getItem("dogoodPublishedLandingPages");
  
    if (!savedPages) return [];
  
    try {
      const parsedPages = JSON.parse(savedPages);
      return Array.isArray(parsedPages) ? parsedPages : [];
    } catch (error) {
      console.warn("Invalid published pages list found.", error);
      return [];
    }
  }
  
  function saveStoredPublishedPages(pages) {
    localStorage.setItem("dogoodPublishedLandingPages", JSON.stringify(pages));
  }
  
  function publishSubmission(id) {
    const submissions = getStoredSubmissions();
    const submission = submissions.find((item) => item.id === id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    if (submission.paymentStatus !== "payment_confirmed") {
      alert("Payment must be confirmed before publishing.");
      return;
    }
  
    if (submission.approvalStatus !== "approved") {
      alert("Landing page must be approved before publishing.");
      return;
    }
  
    const agentData = submission.agentData || {};
    const slug = agentData.slug || `agent-${Date.now()}`;
  
    const publishedPages = getStoredPublishedPages();
  
    const publishedPage = {
      id: `published-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      submissionId: submission.id,
      slug,
      publicPath: `/a/${slug}`,
      publishedAt: new Date().toISOString(),
      status: "published",
      agentData
    };
  
    const filteredPages = publishedPages.filter((page) => page.slug !== slug);
    filteredPages.unshift(publishedPage);
  
    saveStoredPublishedPages(filteredPages);
  
    updateSubmission(id, {
      status: "published",
      approvalStatus: "published",
      publishedAt: publishedPage.publishedAt,
      publicPath: publishedPage.publicPath
    });
  
    alert(`Page published locally.\n\nPublic path: ${publishedPage.publicPath}`);
  }

function renderRequests() {
  const submissions = getStoredSubmissions();

  updateStats(submissions);

  if (!submissions.length) {
    emptyState.style.display = "block";
    requestsList.innerHTML = "";
    return;
  }

  emptyState.style.display = "none";

  requestsList.innerHTML = submissions.map((submission) => {
    const data = submission.agentData || {};

    return `
      <article class="request-card">
        <div class="request-top">
          <div class="request-title">
            <h3>${data.agentName || "Unnamed Agent"}</h3>
            <p>${submission.id}</p>
            <p>Submitted: ${formatDate(submission.submittedAt)}</p>
          </div>

          <div class="badges">
            <span class="badge ${getStatusBadgeClass(submission.status)}">${submission.status || "pending_review"}</span>
            <span class="badge ${getStatusBadgeClass(submission.paymentStatus)}">${submission.paymentStatus || "unpaid"}</span>
            <span class="badge ${getStatusBadgeClass(submission.approvalStatus)}">${submission.approvalStatus || "not_approved"}</span>
          </div>
        </div>

        <div class="request-details">
          <div class="detail-box">
            <span>WhatsApp</span>
            <strong>${data.whatsappNumber || "-"}</strong>
          </div>

          <div class="detail-box">
            <span>Theme</span>
            <strong>${data.theme || "-"}</strong>
          </div>

          <div class="detail-box">
            <span>Language</span>
            <strong>${data.language || "-"}</strong>
          </div>

          <div class="detail-box">
            <span>Package</span>
            <strong>${data.packageName || "-"}</strong>
          </div>
        </div>

        <div class="request-actions">
          <button type="button" onclick="previewSubmission('${submission.id}')">Preview Page</button>

          <button class="payment-btn" type="button" onclick="updateSubmission('${submission.id}', { paymentStatus: 'payment_confirmed', status: 'pending_review' })">
            Confirm Payment
          </button>

          <button class="approve-btn" type="button" onclick="updateSubmission('${submission.id}', { approvalStatus: 'approved', status: 'approved' })">
            Approve
          </button>

          <button class="publish-btn" type="button" onclick="publishSubmission('${submission.id}')">
            Publish
          </button>

          <button class="changes-btn" type="button" onclick="updateSubmission('${submission.id}', { status: 'needs_changes', approvalStatus: 'not_approved' })">
            Needs Changes
          </button>

          <button class="reject-btn" type="button" onclick="updateSubmission('${submission.id}', { status: 'rejected', approvalStatus: 'not_approved' })">
            Reject
          </button>

          <button class="delete-btn" type="button" onclick="deleteSubmission('${submission.id}')">
            Delete
          </button>
        </div>
      </article>
    `;
  }).join("");
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", renderRequests);
}

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    const confirmClear = confirm("Clear all local test submissions?");

    if (!confirmClear) return;

    localStorage.removeItem("dogoodLandingSubmissions");
    renderRequests();
  });
}

renderRequests();