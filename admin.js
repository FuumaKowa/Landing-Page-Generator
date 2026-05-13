const requestsList = document.getElementById("requestsList");
const emptyState = document.getElementById("emptyState");
const refreshBtn = document.getElementById("refreshBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const refreshPublishedBtn = document.getElementById("refreshPublishedBtn");
const publishedEmptyState = document.getElementById("publishedEmptyState");
const publishedList = document.getElementById("publishedList");

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

function updateAdminNote(id, note) {
    updateSubmission(id, {
      adminNote: note
    });
  }

  function updateRevisionMessage(id, message) {
    updateSubmission(id, {
      revisionMessage: message
    });
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
  
    window.open(`page.html?submission=${encodeURIComponent(submission.id)}`, "_blank");
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

  function deletePublishedPage(id) {
    const confirmDelete = confirm("Delete this locally published page?");
  
    if (!confirmDelete) return;
  
    const publishedPages = getStoredPublishedPages();
    const updatedPages = publishedPages.filter((page) => page.id !== id);
  
    saveStoredPublishedPages(updatedPages);
    renderPublishedPages();
  }
  
  function previewPublishedPage(id) {
    const publishedPages = getStoredPublishedPages();
    const page = publishedPages.find((item) => item.id === id);
  
    if (!page) {
      alert("Published page not found.");
      return;
    }
  
    localStorage.setItem(
      "dogoodAgentLandingDraft",
      JSON.stringify(page.agentData)
    );
  
    window.open(`page.html?slug=${encodeURIComponent(page.slug)}`, "_blank");
  }

  function copyPublishedLink(slug) {
    const localLink = `${window.location.origin}${window.location.pathname.replace("admin.html", "")}page.html?slug=${encodeURIComponent(slug)}`;
  
    navigator.clipboard.writeText(localLink)
      .then(() => {
        alert(`Published page link copied:\n\n${localLink}`);
      })
      .catch(() => {
        prompt("Copy this published page link:", localLink);
      });
  }

  function renderPublishedPages() {
    if (!publishedList || !publishedEmptyState) return;
  
    const publishedPages = getStoredPublishedPages();
  
    if (!publishedPages.length) {
      publishedEmptyState.style.display = "block";
      publishedList.innerHTML = "";
      return;
    }
  
    publishedEmptyState.style.display = "none";
  
    publishedList.innerHTML = publishedPages.map((page) => {
      const data = page.agentData || {};
  
      return `
        <article class="request-card">
          <div class="request-top">
            <div class="request-title">
              <h3>${data.agentName || "Unnamed Agent"}</h3>
              <p>Local preview: page.html?slug=${page.slug || "-"}</p>
              <p>Published: ${formatDate(page.publishedAt)}</p>
            </div>
  
            <div class="badges">
              <span class="badge approved">${page.status || "published"}</span>
              <span class="badge review">${data.theme || "-"}</span>
              <span class="badge payment">${data.language || "-"}</span>
            </div>
          </div>
  
          <div class="request-details">
            <div class="detail-box">
              <span>Slug</span>
              <strong>${page.slug || "-"}</strong>
            </div>
  
            <div class="detail-box">
              <span>WhatsApp</span>
              <strong>${data.whatsappNumber || "-"}</strong>
            </div>
  
            <div class="detail-box">
              <span>Package</span>
              <strong>${data.packageName || "-"}</strong>
            </div>
  
            <div class="detail-box">
              <span>Public Path</span>
              <strong>${page.publicPath || "-"}</strong>
            </div>
          </div>
  
          <div class="request-actions">
            <button type="button" onclick="previewPublishedPage('${page.id}')">
                Preview Published Page
            </button>

            <button class="publish-btn" type="button" onclick="copyPublishedLink('${page.slug}')">
                Copy Local Link
            </button>

            <button class="delete-btn" type="button" onclick="deletePublishedPage('${page.id}')">
                Delete Published Page
            </button>
            </div>
        </article>
      `;
    }).join("");
  }

  function markNeedsChanges(id) {
    const submissions = getStoredSubmissions();
    const submission = submissions.find((item) => item.id === id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    if (!submission.revisionMessage || !submission.revisionMessage.trim()) {
      const confirmWithoutMessage = confirm(
        "No revision message was written for the agent. Mark as needs changes anyway?"
      );
  
      if (!confirmWithoutMessage) return;
    }
  
    updateSubmission(id, {
      status: "needs_changes",
      approvalStatus: "not_approved"
    });
  }

  function openBuilderForRevision(id) {
    const submissions = getStoredSubmissions();
    const submission = submissions.find((item) => item.id === id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    window.open(`index.html?submission=${encodeURIComponent(submission.id)}`, "_blank");
  }

function renderRequests() {
  const submissions = getStoredSubmissions();

  updateStats(submissions);
  renderPublishedPages();

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

        <div class="admin-note-grid">
  <div class="admin-note-box">
    <label>
      Internal Admin Note
      <textarea 
        placeholder="Write internal admin note..."
        onchange="updateAdminNote('${submission.id}', this.value)"
      >${submission.adminNote || ""}</textarea>
    </label>
  </div>

  <div class="admin-note-box">
    <label>
      Agent Revision Message
      <textarea 
        placeholder="Write what the agent needs to change..."
        onchange="updateRevisionMessage('${submission.id}', this.value)"
      >${submission.revisionMessage || ""}</textarea>
    </label>
  </div>
</div>

        <div class="request-actions">
          <button type="button" onclick="previewSubmission('${submission.id}')">
            Preview Page
          </button>

          <button class="changes-btn" type="button" onclick="openBuilderForRevision('${submission.id}')">
            Open Builder
          </button>

          <button class="payment-btn" type="button" onclick="updateSubmission('${submission.id}', { paymentStatus: 'payment_confirmed', status: 'pending_review' })">
            Confirm Payment
          </button>

          <button class="approve-btn" type="button" onclick="updateSubmission('${submission.id}', { approvalStatus: 'approved', status: 'approved' })">
            Approve
          </button>

          <button class="publish-btn" type="button" onclick="publishSubmission('${submission.id}')">
            Publish
          </button>

          <button class="changes-btn" type="button" onclick="markNeedsChanges('${submission.id}')">
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

if (refreshPublishedBtn) {
    refreshPublishedBtn.addEventListener("click", renderPublishedPages);
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
renderPublishedPages();