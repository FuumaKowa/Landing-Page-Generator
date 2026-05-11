const landingPage = document.getElementById("landingPage");
const themeSelect = document.getElementById("themeSelect");
const audienceSelect = document.getElementById("audienceSelect");
const sectionCheckboxes = document.querySelectorAll(".section-controls input[type='checkbox']");
const agentNameInput = document.getElementById("agentNameInput");
const whatsappInput = document.getElementById("whatsappInput");
const packageNameInput = document.getElementById("packageNameInput");
const packagePriceInput = document.getElementById("packagePriceInput");
const shortMessageInput = document.getElementById("shortMessageInput");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const exportHtmlBtn = document.getElementById("exportHtmlBtn");

let currentAgentData = null;

async function loadAgentData() {
  const response = await fetch("data/agent.json");

  if (!response.ok) {
    throw new Error("Failed to load agent data.");
  }

  return await response.json();
}

function createWhatsAppLink(number, message) {
  const cleanNumber = String(number).replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

function HeroSection(data) {
  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    `Hi ${data.agentName}, I want to know more about ${data.productName}.`
  );

  return `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <p class="eyebrow">Do Good Wellness</p>
          <h1>Start Your Daily Wellness Routine with Do Good</h1>
          <p>${data.shortMessage}</p>
          <a class="btn" href="${whatsappLink}" target="_blank">WhatsApp ${data.agentName}</a>
        </div>

        <div class="hero-image">
          <img src="${data.productImage}" alt="${data.productName}">
        </div>
      </div>
    </section>
  `;
}

function getAudienceContent(targetAudience) {
  const audienceContent = {
    "Working adults": {
      painTitle: "For working adults who want better daily balance",
      painIntro: "A busy schedule can make it difficult to maintain consistent meals, rest, and body care habits.",
      painCards: [
        {
          title: "Long Working Hours",
          text: "Your daily routine may leave you feeling drained and inconsistent with self-care."
        },
        {
          title: "Irregular Meals",
          text: "Work pressure and appointments can make proper eating habits harder to maintain."
        },
        {
          title: "Need Simple Support",
          text: "You need a wellness routine that is easy to follow without adding more stress."
        }
      ]
    },

    "Parents / family care": {
      painTitle: "For parents who want to care for themselves and their family",
      painIntro: "Family responsibilities can make it easy to neglect your own daily wellness routine.",
      painCards: [
        {
          title: "Family Comes First",
          text: "You may focus so much on others that your own body care becomes inconsistent."
        },
        {
          title: "Daily Responsibilities",
          text: "Busy home and work routines can make wellness feel difficult to maintain."
        },
        {
          title: "Simple Family Habit",
          text: "You want something easy to understand, easy to prepare, and easy to keep consistent."
        }
      ]
    },

    "Busy lifestyle users": {
      painTitle: "For people with busy lifestyles",
      painIntro: "When your day is packed, simple and convenient wellness support becomes more important.",
      painCards: [
        {
          title: "Always On The Go",
          text: "You may not always have time to prepare a complete wellness routine."
        },
        {
          title: "Inconsistent Schedule",
          text: "Your meals, rest, and daily habits may change from day to day."
        },
        {
          title: "Convenient Support",
          text: "You need something practical that can fit into your lifestyle."
        }
      ]
    },

    "First-time wellness users": {
      painTitle: "For those starting their wellness journey",
      painIntro: "Starting a better routine does not need to feel complicated. A simple first step is enough.",
      painCards: [
        {
          title: "Not Sure Where To Start",
          text: "You may want better habits but feel unsure about what routine to begin with."
        },
        {
          title: "Need Something Simple",
          text: "A daily habit is easier to maintain when it feels clear and practical."
        },
        {
          title: "Guided First Step",
          text: "Your agent can explain the product and help you understand how to start."
        }
      ]
    },

    "General audience": {
      painTitle: "Does this sound familiar?",
      painIntro: "Many people want to take better care of their body, but they struggle to stay consistent with their daily routine.",
      painCards: [
        {
          title: "Tired Daily Routine",
          text: "You often feel worn out after work, errands, or long daily responsibilities."
        },
        {
          title: "Inconsistent Eating Habit",
          text: "Your meals, rest, and body care routine may not always be balanced."
        },
        {
          title: "Need Simple Support",
          text: "You want a wellness habit that is easy to follow and does not feel complicated."
        }
      ]
    }
  };

  return audienceContent[targetAudience] || audienceContent["General audience"];
}

function PainPointSection(data) {
  const content = getAudienceContent(data.targetAudience);

  return `
    <section>
      <div class="container">
        <p class="eyebrow">Daily Wellness Concern</p>
        <h2>${content.painTitle}</h2>
        <p>${content.painIntro}</p>

        <div class="card-grid">
          ${content.painCards.map((card) => `
            <div class="card">
              <h3>${card.title}</h3>
              <p>${card.text}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function ProductSection(data) {
  return `
    <section>
      <div class="container product-grid">
        <div class="product-image">
          <img src="${data.productImage}" alt="${data.productName}">
        </div>

        <div>
          <p class="eyebrow">Product Introduction</p>
          <h2>${data.productName}</h2>
          <p>Do Good is a convenient enzyme-based wellness drink designed for people who want to build a simple daily health routine. It comes in sachet form, making it easy to consume at home, at work, or while travelling.</p>
        </div>
      </div>
    </section>
  `;
}

function BenefitsSection() {
  return `
    <section>
      <div class="container">
        <p class="eyebrow">Why It Helps</p>
        <h2>What makes it easy to start?</h2>

        <div class="card-grid">
          <div class="card">
            <h3>Sachet Format</h3>
            <p>Easy to bring, prepare, and consume wherever your day takes you.</p>
          </div>

          <div class="card">
            <h3>Monthly Routine</h3>
            <p>One box can support a simple and consistent daily wellness habit.</p>
          </div>

          <div class="card">
            <h3>Agent Guidance</h3>
            <p>Your Do Good agent can guide you before and after you begin.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function PackageSection(data) {
  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    `Hi ${data.agentName}, I want to ask about the ${data.packageName}.`
  );

  return `
    <section>
      <div class="container package-grid">
        <div>
          <p class="eyebrow">Package Offer</p>
          <h2>${data.packageName}</h2>
          <p>${data.packageDetails}</p>
          <div class="package-price">${data.packagePrice}</div>
          <a class="btn" href="${whatsappLink}" target="_blank">Ask for Package Details</a>
        </div>

        <div class="package-box">
          <h3>Included in this package</h3>
          <p>Product details, basic usage guidance, ordering support, and follow-up from your Do Good agent.</p>
        </div>
      </div>
    </section>
  `;
}

function AgentSection(data) {
  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    `Hi ${data.agentName}, I need guidance before starting Do Good.`
  );

  return `
    <section>
      <div class="container agent-grid">
        <div class="agent-photo">
          <img src="${data.agentPhoto}" alt="${data.agentName}">
        </div>

        <div>
          <p class="eyebrow">Agent Guidance</p>
          <h2>Your Do Good Agent Will Guide You</h2>
          <p>When you order through this page, ${data.agentName} can help you understand the product, choose a suitable package, explain the daily routine, and support your reorder process.</p>
          <a class="btn" href="${whatsappLink}" target="_blank">Chat with ${data.agentName}</a>
        </div>
      </div>
    </section>
  `;
}

function FAQSection() {
  return `
    <section>
      <div class="container">
        <p class="eyebrow">Questions</p>
        <h2>Frequently Asked Questions</h2>

        <div class="faq-list">
          <div class="faq-item">
            <h3>What is Do Good Enzyme?</h3>
            <p>It is an enzyme-based wellness drink designed to support a simple daily health routine.</p>
          </div>

          <div class="faq-item">
            <h3>Is it suitable for first-time users?</h3>
            <p>Yes, it is designed to be simple and easy to include in a daily routine.</p>
          </div>

          <div class="faq-item">
            <h3>How do I order?</h3>
            <p>You can contact the agent directly through the WhatsApp button on this page.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function FinalCTASection(data) {
  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    `Hi ${data.agentName}, I am ready to start my wellness routine with Do Good.`
  );

  return `
    <section class="final-cta">
      <div class="container">
        <p class="eyebrow">Start Today</p>
        <h2>Ready to start your simple wellness routine?</h2>
        <p>Speak with ${data.agentName} today and get guidance before you begin.</p>
        <a class="btn" href="${whatsappLink}" target="_blank">WhatsApp My Agent Now</a>
      </div>
    </section>

    <div class="disclaimer">
      This product is a wellness supplement and is not intended to diagnose, treat, cure, or prevent any disease. Individual experiences may vary. Please consult a doctor or pharmacist before consumption if you are pregnant, breastfeeding, under medication, have allergies, or have an existing medical condition.
    </div>
  `;
}

function applyTheme(theme) {
  const allowedThemes = [
    "clean-bright",
    "premium-dark",
    "natural-cream",
    "soft-pink"
  ];

  const selectedTheme = allowedThemes.includes(theme)
    ? theme
    : "natural-cream";

  document.body.className = `theme-${selectedTheme}`;
}

function renderLandingPage(data) {
  applyTheme(data.theme);

  const defaultSections = [
    "hero",
    "pain-point",
    "product",
    "benefits",
    "package",
    "agent",
    "faq",
    "cta"
  ];

  const selectedSections = Array.isArray(data.sections) && data.sections.length
    ? data.sections
    : defaultSections;

  const sectionComponents = {
    "hero": HeroSection,
    "pain-point": PainPointSection,
    "product": ProductSection,
    "benefits": BenefitsSection,
    "package": PackageSection,
    "agent": AgentSection,
    "faq": FAQSection,
    "cta": FinalCTASection
  };

  landingPage.innerHTML = selectedSections
    .filter((sectionName) => sectionComponents[sectionName])
    .map((sectionName) => sectionComponents[sectionName](data))
    .join("");
}

function saveDraftToBrowser() {
  if (!currentAgentData) return;

  localStorage.setItem(
    "dogoodAgentLandingDraft",
    JSON.stringify(currentAgentData)
  );
}

function loadDraftFromBrowser() {
  const savedDraft = localStorage.getItem("dogoodAgentLandingDraft");

  if (!savedDraft) return null;

  try {
    return JSON.parse(savedDraft);
  } catch (error) {
    console.warn("Invalid saved draft found. Ignoring draft.", error);
    return null;
  }
}

function setupPreviewControls(data) {
  if (!themeSelect || !audienceSelect) return;

  themeSelect.value = data.theme || "natural-cream";
  audienceSelect.value = data.targetAudience || "General audience";

  const currentSections = Array.isArray(data.sections) && data.sections.length
    ? data.sections
    : [
        "hero",
        "pain-point",
        "product",
        "benefits",
        "package",
        "agent",
        "faq",
        "cta"
      ];

  sectionCheckboxes.forEach((checkbox) => {
    checkbox.checked = currentSections.includes(checkbox.value);

    checkbox.addEventListener("change", () => {
      const selectedOptionalSections = Array.from(sectionCheckboxes)
        .filter((item) => item.checked)
        .map((item) => item.value);

      currentAgentData.sections = [
        "hero",
        ...selectedOptionalSections,
        "cta"
      ];

      renderLandingPage(currentAgentData);
      saveDraftToBrowser();
    });
  });

  themeSelect.addEventListener("change", () => {
  currentAgentData.theme = themeSelect.value;
  renderLandingPage(currentAgentData);
  saveDraftToBrowser();
});

audienceSelect.addEventListener("change", () => {
  currentAgentData.targetAudience = audienceSelect.value;
  renderLandingPage(currentAgentData);
  saveDraftToBrowser();
});
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

function downloadTextFile(text, filename, type = "text/html") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.click();

  URL.revokeObjectURL(url);
}

function getGeneratedCss() {
  const stylesheets = Array.from(document.styleSheets);

  let cssText = "";

  stylesheets.forEach((stylesheet) => {
    try {
      const rules = Array.from(stylesheet.cssRules);
      rules.forEach((rule) => {
        cssText += `${rule.cssText}\n`;
      });
    } catch (error) {
      console.warn("Unable to read stylesheet:", error);
    }
  });

  return cssText;
}

function generateStandaloneHtml(data) {
  const pageHtml = landingPage.innerHTML;
  const pageCss = getGeneratedCss();

  return `<!DOCTYPE html>
<html lang="${data.language || "en"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.agentName || "Do Good Agent"} | Do Good Agent Landing Page</title>
  <style>
${pageCss}
  </style>
</head>
<body class="${document.body.className}">
  <main>
${pageHtml}
  </main>
</body>
</html>`;
}

function createSlug(text) {
  return String(text || "agent-page")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "agent-page";
}

function setupContentControls(data) {
  if (
    !agentNameInput ||
    !whatsappInput ||
    !packageNameInput ||
    !packagePriceInput ||
    !shortMessageInput
  ) {
    return;
  }

  agentNameInput.value = data.agentName || "";
  whatsappInput.value = data.whatsappNumber || "";
  packageNameInput.value = data.packageName || "";
  packagePriceInput.value = data.packagePrice || "";
  shortMessageInput.value = data.shortMessage || "";

  const updateContent = () => {
  currentAgentData.agentName = agentNameInput.value.trim();
  currentAgentData.slug = createSlug(currentAgentData.agentName);
  currentAgentData.whatsappNumber = whatsappInput.value.trim();
  currentAgentData.packageName = packageNameInput.value.trim();
  currentAgentData.packagePrice = packagePriceInput.value.trim();
  currentAgentData.shortMessage = shortMessageInput.value.trim();

  renderLandingPage(currentAgentData);
  saveDraftToBrowser();
};

  agentNameInput.addEventListener("input", updateContent);
  whatsappInput.addEventListener("input", updateContent);
  packageNameInput.addEventListener("input", updateContent);
  packagePriceInput.addEventListener("input", updateContent);
  shortMessageInput.addEventListener("input", updateContent);
}

function setupExportControls() {
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener("click", () => {
      if (!currentAgentData) return;

      const safeSlug = currentAgentData.slug || "agent-page";
      downloadJsonFile(currentAgentData, `${safeSlug}.json`);
    });
  }

  if (exportHtmlBtn) {
    exportHtmlBtn.addEventListener("click", () => {
      if (!currentAgentData) return;

      const safeSlug = currentAgentData.slug || "agent-page";
      const htmlText = generateStandaloneHtml(currentAgentData);

      downloadTextFile(htmlText, `${safeSlug}.html`);
    });
  }
}

async function init() {
  try {
    const agentData = await loadAgentData();
    const savedDraft = loadDraftFromBrowser();

    currentAgentData = savedDraft || agentData;

    renderLandingPage(currentAgentData);
    setupPreviewControls(currentAgentData);
    setupContentControls(currentAgentData);
    setupExportControls();
  } catch (error) {
    landingPage.innerHTML = `
      <section>
        <div class="container">
          <h1>Unable to load landing page</h1>
          <p>${error.message}</p>
        </div>
      </section>
    `;
  }
}

init();