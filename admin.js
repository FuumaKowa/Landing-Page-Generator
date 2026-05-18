const requestsList = document.getElementById("requestsList");
const emptyState = document.getElementById("emptyState");
const refreshBtn = document.getElementById("refreshBtn");
const clearAllBtn = document.getElementById("clearTestDataBtn");
const exportBackupBtn = document.getElementById("exportBackupBtn");
const importBackupInput = document.getElementById("importBackupInput");
const quickBackupBtn = document.getElementById("quickBackupBtn");
const statusFilter = document.getElementById("statusFilter");
const requestSearchInput = document.getElementById("requestSearchInput");
const sortFilter = document.getElementById("sortFilter");
const refreshPublishedBtn = document.getElementById("refreshPublishedBtn");
const publishedEmptyState = document.getElementById("publishedEmptyState");
const publishedList = document.getElementById("publishedList");
const openBuilderBtn = document.getElementById("openBuilderBtn");

const totalRequests = document.getElementById("totalRequests");
const pendingRequests = document.getElementById("pendingRequests");
const paidRequests = document.getElementById("paidRequests");
const approvedRequests = document.getElementById("approvedRequests");
const publishedRequests = document.getElementById("publishedRequests");

const dangerModal = document.getElementById("dangerModal");
const dangerConfirmInput = document.getElementById("dangerConfirmInput");
const dangerConfirmBtn = document.getElementById("dangerConfirmBtn");
const closeDangerModalBtns = document.querySelectorAll("[data-close-danger-modal]");
let currentAdminSubmissions = [];

function getStoredSubmissions() {
  return DoGoodStorage.getSubmissions();
}

async function getSubmissionsFromSupabase() {
  if (typeof supabaseClient === "undefined" || !isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Loading local submissions only.");
    return null;
  }

  const { data, error } = await supabaseClient
    .from("landing_page_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.warn("Supabase submissions read failed. Falling back to localStorage.", error);
    return null;
  }

  return data.map((item) => ({
    id: item.id,
    supabaseId: item.id,
    status: item.status,
    paymentStatus: item.payment_status,
    approvalStatus: item.approval_status,
    revisionMessage: item.revision_message || "",
    adminNote: item.admin_note || "",
    submittedAt: item.submitted_at,
    resubmittedAt: item.resubmitted_at,
    reviewedAt: item.reviewed_at,
    updatedAt: item.updated_at,
    agentData: item.page_data || {}
  }));
}

function getCurrentAdminSubmissions() {
  return Array.isArray(currentAdminSubmissions) && currentAdminSubmissions.length
    ? currentAdminSubmissions
    : getStoredSubmissions();
}

function findSubmissionById(id) {
  const submissions = getCurrentAdminSubmissions();

  return submissions.find((submission) => {
    return submission.id === id || submission.supabaseId === id;
  }) || null;
}

function saveStoredSubmissions(submissions) {
  DoGoodStorage.saveSubmissions(submissions);
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

  function mapSubmissionUpdatesToSupabase(updates) {
    const payload = {};
  
    if ("status" in updates) {
      payload.status = updates.status;
    }
  
    if ("paymentStatus" in updates) {
      payload.payment_status = updates.paymentStatus;
    }
  
    if ("approvalStatus" in updates) {
      payload.approval_status = updates.approvalStatus;
    }
  
    if ("revisionMessage" in updates) {
      payload.revision_message = updates.revisionMessage;
    }
  
    if ("adminNote" in updates) {
      payload.admin_note = updates.adminNote;
    }
  
    if ("resubmittedAt" in updates) {
      payload.resubmitted_at = updates.resubmittedAt;
    }
  
    if ("reviewedAt" in updates) {
      payload.reviewed_at = updates.reviewedAt;
    }
  
    if ("publishedAt" in updates) {
      payload.reviewed_at = updates.publishedAt;
    }
  
    return payload;
  }
  
  async function updateSubmissionInSupabase(id, updates) {
    if (typeof supabaseClient === "undefined" || !isSupabaseConfigured()) {
      console.warn("Supabase is not configured. Submission updated locally only.");
      return;
    }
  
    const payload = mapSubmissionUpdatesToSupabase(updates);
  
    if (!Object.keys(payload).length) {
      return;
    }
  
    const { error } = await supabaseClient
      .from("landing_page_submissions")
      .update(payload)
      .eq("id", id);
  
    if (error) {
      console.warn("Supabase submission update failed. Local update still completed.", error);
      alert("The admin change was saved locally, but Supabase update failed. Check the console error.");
    }
  }

  async function updateSubmission(id, updates) {
    const submissions = getCurrentAdminSubmissions();
  
    const updatedSubmissions = submissions.map((submission) => {
      if (submission.id !== id && submission.supabaseId !== id) return submission;
  
      return {
        ...submission,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });
  
    saveStoredSubmissions(updatedSubmissions);
    currentAdminSubmissions = updatedSubmissions;
  
    await updateSubmissionInSupabase(id, updates);
  
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

  async function deleteSubmission(id) {
    const submission = findSubmissionById(id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    const confirmDelete = confirm("Delete this submission from local data and Supabase?");
  
    if (!confirmDelete) return;
  
    const localSubmissions = getStoredSubmissions();
    const updatedLocalSubmissions = localSubmissions.filter((item) => {
      return item.id !== submission.id && item.supabaseId !== submission.id;
    });
  
    saveStoredSubmissions(updatedLocalSubmissions);
  
    if (typeof supabaseClient !== "undefined" && isSupabaseConfigured()) {
      const { error } = await supabaseClient
        .from("landing_page_submissions")
        .delete()
        .eq("id", submission.id);
  
      if (error) {
        console.warn("Supabase submission delete failed. Local delete still completed.", error);
        alert("The submission was deleted locally, but Supabase delete failed. Check the console error.");
      }
    }
  
    renderRequests();
  }

function previewSubmission(id) {
  const submission = findSubmissionById(id);

  if (!submission) {
    alert("Submission not found.");
    return;
  }

  window.open(`page.html?submission=${encodeURIComponent(submission.id)}`, "_blank");
}

  function getStoredPublishedPages() {
    return DoGoodStorage.getPublishedPages();
  }

  async function getPublishedPagesFromSupabase() {
    if (typeof supabaseClient === "undefined" || !isSupabaseConfigured()) {
      console.warn("Supabase is not configured. Loading local published pages only.");
      return null;
    }
  
    const { data, error } = await supabaseClient
      .from("published_landing_pages")
      .select("*")
      .order("published_at", { ascending: false });
  
    if (error) {
      console.warn("Supabase published pages read failed. Falling back to localStorage.", error);
      return null;
    }
  
    return data.map((item) => ({
      id: item.id,
      submissionId: item.submission_id,
      agentId: item.agent_id,
      slug: item.slug,
      publicPath: item.public_path,
      status: item.status,
      publishedAt: item.published_at,
      updatedAt: item.updated_at,
      agentData: item.page_data || {}
    }));
  }
  
  function saveStoredPublishedPages(pages) {
    DoGoodStorage.savePublishedPages(pages);
  }

  function approveSubmission(id) {
    const submission = findSubmissionById(id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    if (submission.status === "published") {
      alert("This landing page is already published.");
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
  
    updateSubmission(submission.id, {
      approvalStatus: "approved",
      status: "approved"
    });
  }

  async function publishPageToSupabase(publishedPage) {
    if (typeof supabaseClient === "undefined" || !isSupabaseConfigured()) {
      console.warn("Supabase is not configured. Published page saved locally only.");
      return;
    }
  
    const payload = {
      submission_id: null,
      agent_id: null,
      slug: publishedPage.slug,
      public_path: publishedPage.publicPath,
      status: "published",
      page_data: publishedPage.agentData,
      published_at: publishedPage.publishedAt
    };
  
    const { error } = await supabaseClient
      .from("published_landing_pages")
      .upsert(payload, {
        onConflict: "slug"
      });
  
    if (error) {
      console.warn("Supabase publish failed. Local publish still completed.", error);
      alert(
        "The page was published locally, but Supabase publishing failed. Check the console error."
      );
    }
  }
  
  async function publishSubmission(id) {
    const submission = findSubmissionById(id);
  
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

    await publishPageToSupabase(publishedPage);
    
    updateSubmission(id, {
      status: "published",
      approvalStatus: "published",
      publishedAt: publishedPage.publishedAt,
      publicPath: publishedPage.publicPath
    });
    
    alert(`Page published.\n\nPublic path: ${publishedPage.publicPath}`);
  }

  async function deletePublishedPage(id) {
    const supabasePublishedPages = await getPublishedPagesFromSupabase();
    const publishedPages = supabasePublishedPages || getStoredPublishedPages();
    const page = publishedPages.find((item) => item.id === id);
  
    if (!page) {
      alert("Published page not found.");
      return;
    }
  
    const confirmDelete = confirm("Delete this published page from local data and Supabase?");
  
    if (!confirmDelete) return;
  
    const updatedLocalPages = publishedPages.filter((item) => item.id !== id);
    saveStoredPublishedPages(updatedLocalPages);
  
    if (typeof supabaseClient !== "undefined" && isSupabaseConfigured()) {
      const { error } = await supabaseClient
        .from("published_landing_pages")
        .delete()
        .eq("slug", page.slug);
  
      if (error) {
        console.warn("Supabase published page delete failed. Local delete still completed.", error);
        alert("The published page was deleted locally, but Supabase delete failed. Check the console error.");
      }
    }
  
    renderPublishedPages();
  }
  
  function previewPublishedPage(slug) {
    if (!slug) {
      alert("Published page slug not found.");
      return;
    }
  
    window.open(`page.html?slug=${encodeURIComponent(slug)}`, "_blank");
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

 async function renderPublishedPages() {
    if (!publishedList || !publishedEmptyState) return;
  
    const supabasePublishedPages = await getPublishedPagesFromSupabase();
    const publishedPages = supabasePublishedPages || getStoredPublishedPages();
  
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
          <button type="button" onclick="previewPublishedPage('${page.slug}')">
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
    const submission = findSubmissionById(id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    if (submission.status === "published") {
      alert("This landing page is already published. Published pages should be edited through a separate update workflow.");
      return;
    }
  
    if (!submission.revisionMessage || !submission.revisionMessage.trim()) {
      const confirmWithoutMessage = confirm(
        "No revision message was written for the agent. Mark as needs changes anyway?"
      );
  
      if (!confirmWithoutMessage) return;
    }
  
    updateSubmission(submission.id, {
      status: "needs_changes",
      approvalStatus: "not_approved"
    });
  }

  function openBuilderForRevision(id) {
    const submission = findSubmissionById(id);
  
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

  function rejectSubmission(id) {
    const submission = findSubmissionById(id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    if (submission.status === "published") {
      alert("This landing page is already published and cannot be rejected.");
      return;
    }
  
    const confirmReject = confirm("Reject this landing page request?");
  
    if (!confirmReject) return;
  
    updateSubmission(submission.id, {
      status: "rejected",
      approvalStatus: "not_approved"
    });
  }

  function confirmPayment(id) {
    const submission = findSubmissionById(id);
  
    if (!submission) {
      alert("Submission not found.");
      return;
    }
  
    if (submission.status === "published") {
      alert("This landing page is already published.");
      return;
    }
  
    if (submission.paymentStatus === "payment_confirmed") {
      alert("Payment is already confirmed.");
      return;
    }
  
    updateSubmission(submission.id, {
      paymentStatus: "payment_confirmed",
      status: "pending_review"
    });
  }

  function getRequestActions(submission) {
    const isPublished = submission.status === "published";
    const isRejected = submission.status === "rejected";
    const needsChanges = submission.status === "needs_changes";
    const paymentConfirmed = submission.paymentStatus === "payment_confirmed";
    const approved = submission.approvalStatus === "approved";
  
    const actions = [];
  
    actions.push(`
      <button type="button" onclick="previewSubmission('${submission.id}')">
        Preview Page
      </button>
    `);
  
    if (!isPublished && !isRejected) {
      actions.push(`
        <button class="changes-btn" type="button" onclick="openBuilderForRevision('${submission.id}')">
          Open Builder
        </button>
      `);
  
      actions.push(`
        <button class="changes-btn" type="button" onclick="copyRevisionLink('${submission.id}')">
          Copy Revision Link
        </button>
      `);
    }
  
    if (!paymentConfirmed && !isPublished && !isRejected) {
      actions.push(`
        <button class="payment-btn" type="button" onclick="confirmPayment('${submission.id}')">
          Confirm Payment
        </button>
      `);
    }
  
    if (paymentConfirmed && !approved && !needsChanges && !isPublished && !isRejected) {
      actions.push(`
        <button class="approve-btn" type="button" onclick="approveSubmission('${submission.id}')">
          Approve
        </button>
      `);
    }
  
    if (paymentConfirmed && approved && !isPublished && !isRejected) {
      actions.push(`
        <button class="publish-btn" type="button" onclick="publishSubmission('${submission.id}')">
          Publish
        </button>
      `);
    }
  
    if (!isPublished && !isRejected) {
      actions.push(`
        <button class="changes-btn" type="button" onclick="markNeedsChanges('${submission.id}')">
          Needs Changes
        </button>
      `);
  
      actions.push(`
        <button class="reject-btn" type="button" onclick="rejectSubmission('${submission.id}')">
          Reject
        </button>
      `);
    }
  
    actions.push(`
      <button class="delete-btn" type="button" onclick="deleteSubmission('${submission.id}')">
        Delete
      </button>
    `);
  
    return actions.join("");
  }

async function renderRequests() {
    const supabaseSubmissions = await getSubmissionsFromSupabase();
    const submissions = supabaseSubmissions || getStoredSubmissions();

    currentAdminSubmissions = submissions;

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

          <button class="payment-btn" type="button" onclick="confirmPayment('${submission.id}')">
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

          <button class="reject-btn" type="button" onclick="rejectSubmission('${submission.id}')">
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

function downloadJsonFile(data, filename) {
    const jsonText = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
  
    URL.revokeObjectURL(url);
  }
  
  function exportAdminBackup() {
    const backupData = DoGoodStorage.getBackupData();
  
    const dateStamp = new Date().toISOString().slice(0, 10);
    const filename = `dogood-local-fallback-backup-${dateStamp}-requests-${backupData.counts.submissions}-published-${backupData.counts.publishedPages}.json`;
  
    downloadJsonFile(backupData, filename);
  }
  
  function importAdminBackup(file) {
    const reader = new FileReader();
  
    reader.onload = () => {
      try {
        const backupData = JSON.parse(reader.result);
  
        const confirmImport = confirm(
          "Importing this backup will replace current local admin data. Continue?"
        );
        
        if (!confirmImport) return;
        
        DoGoodStorage.importBackupData(backupData);
  
        renderRequests();
  
        alert("Backup imported successfully.");
      } catch (error) {
        alert("Invalid backup file. Please import a valid Do Good admin backup JSON file.");
        console.error(error);
      }
    };
  
    reader.readAsText(file);
  }

  function openDangerModal() {
    if (!dangerModal || !dangerConfirmInput || !dangerConfirmBtn) {
      alert("Danger confirmation modal is missing from admin.html.");
      return;
    }
  
    dangerModal.classList.add("active");
    dangerModal.setAttribute("aria-hidden", "false");
  
    dangerConfirmInput.value = "";
    dangerConfirmBtn.disabled = true;
  
    setTimeout(() => {
      dangerConfirmInput.focus();
    }, 50);
  }
  
  function closeDangerModal() {
    if (!dangerModal || !dangerConfirmInput || !dangerConfirmBtn) return;
  
    dangerModal.classList.remove("active");
    dangerModal.setAttribute("aria-hidden", "true");
  
    dangerConfirmInput.value = "";
    dangerConfirmBtn.disabled = true;
  }
  
  async function deleteAllSupabaseRows(tableName) {
    if (typeof supabaseClient === "undefined" || !isSupabaseConfigured()) {
      console.warn(`Supabase is not configured. Skipping ${tableName} clear.`);
      return;
    }
  
    const { data, error: readError } = await supabaseClient
      .from(tableName)
      .select("id");
  
    if (readError) {
      throw readError;
    }
  
    const ids = Array.isArray(data) ? data.map((item) => item.id).filter(Boolean) : [];
  
    if (!ids.length) {
      return;
    }
  
    const { error: deleteError } = await supabaseClient
      .from(tableName)
      .delete()
      .in("id", ids);
  
    if (deleteError) {
      throw deleteError;
    }
  }
  
  async function clearAllTestData() {
    await deleteAllSupabaseRows("landing_page_submissions");
    await deleteAllSupabaseRows("published_landing_pages");
  
    DoGoodStorage.clearSubmissions();
    saveStoredPublishedPages([]);
  
    currentAdminSubmissions = [];
  
    await renderRequests();
    await renderPublishedPages();
  
    alert("All test submissions and published pages have been cleared.");
  }

  if (openBuilderBtn) {
    openBuilderBtn.addEventListener("click", () => {
      window.open("index.html", "_blank");
    });
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
    clearAllBtn.addEventListener("click", openDangerModal);
  }
  
  if (dangerConfirmInput) {
    dangerConfirmInput.addEventListener("input", () => {
      dangerConfirmBtn.disabled = dangerConfirmInput.value.trim() !== "DELETE";
    });
  }
  
  if (dangerConfirmBtn) {
    dangerConfirmBtn.addEventListener("click", async () => {
      if (dangerConfirmInput.value.trim() !== "DELETE") return;
  
      dangerConfirmBtn.disabled = true;
      dangerConfirmBtn.textContent = "Clearing...";
  
      try {
        await clearAllTestData();
        closeDangerModal();
      } catch (error) {
        console.error("Clear test data failed:", error);
        alert("Failed to clear test data. Please check the console.");
      } finally {
        dangerConfirmBtn.textContent = "Clear Data";
        dangerConfirmBtn.disabled = dangerConfirmInput.value.trim() !== "DELETE";
      }
    });
  }
  
  closeDangerModalBtns.forEach((button) => {
    button.addEventListener("click", closeDangerModal);
  });
  
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dangerModal?.classList.contains("active")) {
      closeDangerModal();
    }
  });

  if (exportBackupBtn) {
    exportBackupBtn.addEventListener("click", exportAdminBackup);
  }

  if (quickBackupBtn) {
    quickBackupBtn.addEventListener("click", exportAdminBackup);
  }
  
  if (importBackupInput) {
    importBackupInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
  
      if (!file) return;
  
      importAdminBackup(file);
    });
  }

renderRequests();