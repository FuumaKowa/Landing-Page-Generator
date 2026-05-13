const requestsList = document.getElementById("requestsList");
const emptyState = document.getElementById("emptyState");
const refreshBtn = document.getElementById("refreshBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const statusFilter = document.getElementById("statusFilter");
const requestSearchInput = document.getElementById("requestSearchInput");
const sortFilter = document.getElementById("sortFilter");
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

  function approveSubmission(id) {
    const submissions = getStoredSubmissions();
    const submission = submissions.find((item) => item.id === id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    if (submission.paymentStatus !== "payment_confirmed") {
      alert("Payment must be confirmed before this landing page can be approved.");
      return;
    }
  
    if (submission.status === "needs_changes") {
      alert("This request still needs changes. It must be resubmitted before approval.");
      return;
    }
  
    if (submission.status === "rejected") {
      alert("This request has been rejected and cannot be approved.");
      return;
    }
  
    updateSubmission(id, {
      approvalStatus: "approved",
      status: "approved"
    });
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
  
    if (submission.status === "needs_changes") {
      alert("This request still needs changes. It must be resubmitted before publishing.");
      return;
    }
  
    if (submission.status === "rejected") {
      alert("This request has been rejected and cannot be published.");
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

  function copyRevisionLink(id) {
    const localLink = `${window.location.origin}${window.location.pathname.replace("admin.html", "")}index.html?submission=${encodeURIComponent(id)}`;
  
    navigator.clipboard.writeText(localLink)
      .then(() => {
        alert(`Agent revision link copied:\n\n${localLink}`);
      })
      .catch(() => {
        prompt("Copy this agent revision link:", localLink);
      });
  }

  function sortSubmissions(submissions) {
    const selectedSort = sortFilter ? sortFilter.value : "newest";
    const sortedSubmissions = [...submissions];
  
    if (selectedSort === "oldest") {
      return sortedSubmissions.sort((a, b) => {
        return new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0);
      });
    }
  
    if (selectedSort === "agent_az") {
      return sortedSubmissions.sort((a, b) => {
        const nameA = (a.agentData?.agentName || "").toLowerCase();
        const nameB = (b.agentData?.agentName || "").toLowerCase();
  
        return nameA.localeCompare(nameB);
      });
    }
  
    if (selectedSort === "agent_za") {
      return sortedSubmissions.sort((a, b) => {
        const nameA = (a.agentData?.agentName || "").toLowerCase();
        const nameB = (b.agentData?.agentName || "").toLowerCase();
  
        return nameB.localeCompare(nameA);
      });
    }
  
    if (selectedSort === "status") {
      return sortedSubmissions.sort((a, b) => {
        const statusA = `${a.status || ""} ${a.paymentStatus || ""} ${a.approvalStatus || ""}`;
        const statusB = `${b.status || ""} ${b.paymentStatus || ""} ${b.approvalStatus || ""}`;
  
        return statusA.localeCompare(statusB);
      });
    }
  
    return sortedSubmissions.sort((a, b) => {
      return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
    });
  }

  function getFilteredSubmissions(submissions) {
    const selectedFilter = statusFilter ? statusFilter.value : "all";
    const searchTerm = requestSearchInput
      ? requestSearchInput.value.trim().toLowerCase()
      : "";
  
    let filteredSubmissions = submissions;
  
    if (selectedFilter === "payment_confirmed") {
      filteredSubmissions = filteredSubmissions.filter(
        (submission) => submission.paymentStatus === "payment_confirmed"
      );
    } else if (selectedFilter === "approved") {
      filteredSubmissions = filteredSubmissions.filter(
        (submission) => submission.approvalStatus === "approved"
      );
    } else if (selectedFilter !== "all") {
      filteredSubmissions = filteredSubmissions.filter(
        (submission) => submission.status === selectedFilter
      );
    }
  
    if (!searchTerm) {
        return sortSubmissions(filteredSubmissions);
      }
  
    if (!searchTerm) {
        return sortSubmissions(filteredSubmissions);
      }
      
      const searchedSubmissions = filteredSubmissions.filter((submission) => {
        const data = submission.agentData || {};
      
        const searchableText = [
          data.agentName,
          data.whatsappNumber,
          data.packageName,
          data.productName,
          submission.id
        ]
          .join(" ")
          .toLowerCase();
      
        return searchableText.includes(searchTerm);
      });
      
      return sortSubmissions(searchedSubmissions);
  }

function renderRequests() {
    const submissions = getStoredSubmissions();
    const filteredSubmissions = getFilteredSubmissions(submissions);
    
    updateStats(submissions);
    renderPublishedPages();
    
    if (!filteredSubmissions.length) {
      emptyState.style.display = "block";
      requestsList.innerHTML = "";
      emptyState.textContent = submissions.length
        ? "No requests match the selected filter."
        : "No landing page requests submitted yet.";
      return;
    }
    
    emptyState.style.display = "none";
    
    requestsList.innerHTML = filteredSubmissions.map((submission) => {
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

          <button class="changes-btn" type="button" onclick="copyRevisionLink('${submission.id}')">
            Copy Revision Link
          </button>

          <button class="payment-btn" type="button" onclick="updateSubmission('${submission.id}', { paymentStatus: 'payment_confirmed', status: 'pending_review' })">
            Confirm Payment
          </button>

          <button class="approve-btn" type="button" onclick="approveSubmission('${submission.id}')">
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

if (statusFilter) {
    statusFilter.addEventListener("change", renderRequests);
  }

  if (requestSearchInput) {
    requestSearchInput.addEventListener("input", renderRequests);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", renderRequests);
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