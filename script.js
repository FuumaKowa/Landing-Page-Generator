const landingPage = document.getElementById("landingPage");
const themeSelect = document.getElementById("themeSelect");
const audienceSelect = document.getElementById("audienceSelect");
const structureSelect = document.getElementById("structureSelect");
const heroStyleSelect = document.getElementById("heroStyleSelect");
const languageSelect = document.getElementById("languageSelect");
const sectionCheckboxes = document.querySelectorAll(".section-controls input[type='checkbox']");
const agentNameInput = document.getElementById("agentNameInput");
const whatsappInput = document.getElementById("whatsappInput");
const productNameInput = document.getElementById("productNameInput");
const productDescriptionInput = document.getElementById("productDescriptionInput");
const packageNameInput = document.getElementById("packageNameInput");
const packagePriceInput = document.getElementById("packagePriceInput");
const packageCheckoutLinkInput = document.getElementById("packageCheckoutLinkInput");
const shortMessageInput = document.getElementById("shortMessageInput");
const heroTitleInput = document.getElementById("heroTitleInput");
const heroSubtitleInput = document.getElementById("heroSubtitleInput");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const exportHtmlBtn = document.getElementById("exportHtmlBtn");
const clearDraftBtn = document.getElementById("clearDraftBtn");
const importJsonInput = document.getElementById("importJsonInput");
const validationStatus = document.getElementById("validationStatus");
const packageDetailsInput = document.getElementById("packageDetailsInput");
const productImageInput = document.getElementById("productImageInput");
const agentPhotoInput = document.getElementById("agentPhotoInput");
const agentDescriptionInput = document.getElementById("agentDescriptionInput");
const whatsappMessageInput = document.getElementById("whatsappMessageInput");

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

function getSafeImage(imageUrl, fallbackText) {
  const safeText = encodeURIComponent(fallbackText || "Do Good Image");

  return imageUrl && imageUrl.trim()
    ? imageUrl.trim()
    : `https://placehold.co/600x600?text=${safeText}`;
}

function getText(language = "en") {
  const texts = {
    en: {
      brand: "Do Good",
      whatsapp: "WhatsApp",
      product: "Product",
      package: "Package",
      agent: "Agent",
      faq: "FAQ",

      heroProductEyebrow: "Do Good Wellness",
      heroProductTitle: "Start Your Daily Wellness Routine with Do Good",
      heroProductFallback: "A simple wellness routine guided by your Do Good agent.",

      heroAgentEyebrow: "Personal Agent Guidance",
      heroAgentTitle: "Start Your Wellness Journey with",
      heroAgentFallback: "Your Do Good Agent",
      heroAgentText: "Get simple product guidance, package explanation, and support before you begin your daily wellness routine.",

      heroProblemEyebrow: "Simple Daily Wellness",
      heroProblemTitle: "Feeling Tired, Heavy, or Inconsistent with Your Routine?",
      heroProblemText: "Do Good helps you begin with a simple daily wellness habit that is easy to understand and easy to follow.",
      askHowToStart: "Ask How To Start",

      dailyConcern: "Daily Wellness Concern",
      productIntro: "Product Introduction",
      whyItHelps: "Why It Helps",
      benefitsTitle: "What makes it easy to start?",
      benefitSachetTitle: "Sachet Format",
      benefitSachetText: "Easy to bring, prepare, and consume wherever your day takes you.",
      benefitMonthlyTitle: "Monthly Routine",
      benefitMonthlyText: "One box can support a simple and consistent daily wellness habit.",
      benefitAgentTitle: "Agent Guidance",
      benefitAgentText: "Your Do Good agent can guide you before and after you begin.",
      packageOffer: "Package Offer",
      includedPackage: "Included in this package",
      packageIncludedText: "Product details, basic usage guidance, ordering support, and follow-up from your Do Good agent.",
      agentGuidance: "Agent Guidance",
      agentGuidanceTitle: "Your Do Good Agent Will Guide You",
      questions: "Questions",
      faqTitle: "Frequently Asked Questions",
      faqOneQuestion: "What is Do Good Enzyme?",
      faqOneAnswer: "It is an enzyme-based wellness drink designed to support a simple daily health routine.",
      faqTwoQuestion: "Is it suitable for first-time users?",
      faqTwoAnswer: "Yes, it is designed to be simple and easy to include in a daily routine.",
      faqThreeQuestion: "How do I order?",
      faqThreeAnswer: "You can contact the agent directly through the WhatsApp button on this page.",
      startToday: "Start Today",
      finalCtaTitle: "Ready to start your simple wellness routine?",
      finalCtaButton: "WhatsApp My Agent Now",
      disclaimer: "This product is a wellness supplement and is not intended to diagnose, treat, cure, or prevent any disease. Individual experiences may vary. Please consult a doctor or pharmacist before consumption if you are pregnant, breastfeeding, under medication, have allergies, or have an existing medical condition."
    },

    zh: {
      brand: "善金",
      whatsapp: "WhatsApp",
      product: "产品",
      package: "配套",
      agent: "代理",
      faq: "常见问题",

      heroProductEyebrow: "善金健康生活",
      heroProductTitle: "从善金开始你的每日健康习惯",
      heroProductFallback: "由你的善金代理为你提供简单的日常健康指导。",

      heroAgentEyebrow: "个人代理指导",
      heroAgentTitle: "与你的善金代理开始健康旅程：",
      heroAgentFallback: "善金代理",
      heroAgentText: "在开始每日健康习惯之前，获得产品说明、配套讲解和基本指导。",

      heroProblemEyebrow: "简单日常养护",
      heroProblemTitle: "是否经常感到疲惫、沉重，或生活习惯不稳定？",
      heroProblemText: "善金帮助你从简单、容易理解、容易坚持的日常健康习惯开始。",
      askHowToStart: "询问如何开始",

      dailyConcern: "日常健康关注",
      productIntro: "产品介绍",
      whyItHelps: "产品优势",
      benefitsTitle: "为什么容易开始？",
      benefitSachetTitle: "独立小包设计",
      benefitSachetText: "方便携带、冲泡和饮用，适合日常生活、上班或外出时使用。",
      benefitMonthlyTitle: "简单月度习惯",
      benefitMonthlyText: "一盒可帮助你建立更简单、更持续的每日健康习惯。",
      benefitAgentTitle: "代理贴心指导",
      benefitAgentText: "你的善金代理可以在你开始前后提供基本说明和跟进。",
      packageOffer: "产品配套",
      includedPackage: "此配套包含",
      packageIncludedText: "产品资料、基本使用指导、下单协助，以及善金代理的后续跟进。",
      agentGuidance: "代理指导",
      agentGuidanceTitle: "你的善金代理将为你提供指导",
      questions: "常见问题",
      faqTitle: "常见问题",
      faqOneQuestion: "什么是善金酵素？",
      faqOneAnswer: "这是一款酵素型健康饮品，适合想建立简单日常健康习惯的人群。",
      faqTwoQuestion: "第一次使用适合吗？",
      faqTwoAnswer: "适合。它的设计方向是简单、方便，并容易加入日常生活习惯中。",
      faqThreeQuestion: "我要如何下单？",
      faqThreeAnswer: "你可以直接点击页面上的 WhatsApp 按钮联系代理了解详情。",
      startToday: "立即开始",
      finalCtaTitle: "准备开始你的简单健康习惯了吗？",
      finalCtaButton: "立即 WhatsApp 我的代理",
      disclaimer: "本产品为健康辅助食品，并非用于诊断、治疗、治愈或预防任何疾病。个人体验可能有所不同。如你正在怀孕、哺乳、服用药物、对特定成分敏感，或有任何既有健康状况，食用前请先咨询医生或药剂师。"
    }
  };

  return texts[language] || texts.en;
}

function getWhatsAppMessage(data, fallbackMessage) {
  return data.whatsappMessage && data.whatsappMessage.trim()
    ? data.whatsappMessage.trim()
    : fallbackMessage;
}

function HeaderSection(data) {
  const text = getText(data.language);
  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    getWhatsAppMessage(
      data,
      `Hi ${data.agentName}, I want to know more about ${data.productName}.`
    )
  );

  const selectedSections = Array.isArray(data.sections) ? data.sections : [];

  const navItems = [
    {
      label: text.product,
      target: "product",
      section: "product"
    },
    {
      label: text.package,
      target: "package",
      section: "package"
    },
    {
      label: text.agent,
      target: "agent",
      section: "agent"
    },
    {
      label: text.faq,
      target: "faq",
      section: "faq"
    }
  ];

  const visibleNavItems = navItems.filter((item) =>
    selectedSections.includes(item.section)
  );

  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="#hero" class="brand">
          <span class="brand-mark">DG</span>
          <span>${text.brand}</span>
        </a>

        <nav class="site-nav">
          ${visibleNavItems.map((item) => `
            <a href="#${item.target}">${item.label}</a>
          `).join("")}
        </nav>

        <a class="header-cta" href="${whatsappLink}" target="_blank">
        ${text.whatsapp}
        </a>
      </div>
    </header>
  `;
}

function getHeroContent(data) {
  const text = getText(data.language);

  const heroStyles = {
    "product-focus": {
      eyebrow: text.heroProductEyebrow,
      title: data.heroTitle || text.heroProductTitle,
      text: data.heroSubtitle || data.shortMessage || text.heroProductFallback,
      image: getSafeImage(data.productImage, "Do Good Product"),
      imageAlt: data.productName || "Do Good Product",
      buttonText: `WhatsApp ${data.agentName || "Agent"}`
    },

    "agent-focus": {
      eyebrow: text.heroAgentEyebrow,
      title: data.heroTitle || `${text.heroAgentTitle} ${data.agentName || text.heroAgentFallback}`,
      text: data.heroSubtitle || text.heroAgentText,
      image: getSafeImage(data.agentPhoto, "Agent Photo"),
      imageAlt: data.agentName || "Do Good Agent",
      buttonText: `Chat with ${data.agentName || "Agent"}`
    },

    "problem-focus": {
      eyebrow: text.heroProblemEyebrow,
      title: data.heroTitle || text.heroProblemTitle,
      text: data.heroSubtitle || text.heroProblemText,
      image: getSafeImage(data.productImage, "Do Good Product"),
      imageAlt: data.productName || "Do Good Product",
      buttonText: text.askHowToStart
    }
  };

  return heroStyles[data.heroStyle] || heroStyles["product-focus"];
}

function HeroSection(data) {
  const heroContent = getHeroContent(data);

  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    getWhatsAppMessage(
      data,
      `Hi ${data.agentName}, I want to know more about ${data.productName}.`
    )
  );

  return `
    <section id="hero" class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <p class="eyebrow">${heroContent.eyebrow}</p>
          <h1>${heroContent.title}</h1>
          <p>${heroContent.text}</p>
          <a class="btn" href="${whatsappLink}" target="_blank">${heroContent.buttonText}</a>
        </div>

        <div class="hero-image">
          <img src="${heroContent.image}" alt="${heroContent.imageAlt}" onerror="this.src='https://placehold.co/600x600?text=Do+Good+Image'">
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
  const text = getText(data.language);
  return `
    <section id="product">
      <div class="container product-grid">
        <div class="product-image">
          <img src="${data.productImage}" alt="${data.productName}">
        </div>

        <div>
          <p class="eyebrow">${text.productIntro}</p>
          <h2>${data.productName}</h2>
          <p>${data.productDescription}</p>
        </div>
      </div>
    </section>
  `;
}

function BenefitsSection(data) {
  const text = getText(data.language);

  return `
    <section>
      <div class="container">
        <p class="eyebrow">${text.whyItHelps}</p>
        <h2>${text.benefitsTitle}</h2>

        <div class="card-grid">
          <div class="card">
            <h3>${text.benefitSachetTitle}</h3>
            <p>${text.benefitSachetText}</p>
          </div>

          <div class="card">
            <h3>${text.benefitMonthlyTitle}</h3>
            <p>${text.benefitMonthlyText}</p>
          </div>

          <div class="card">
            <h3>${text.benefitAgentTitle}</h3>
            <p>${text.benefitAgentText}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function PackageSection(data) {
  const text = getText(data.language);
  const packageLink = data.packageCheckoutLink && data.packageCheckoutLink.trim()
  ? data.packageCheckoutLink.trim()
  : createWhatsAppLink(
      data.whatsappNumber,
      getWhatsAppMessage(
        data,
        `Hi ${data.agentName}, I want to ask about the ${data.packageName}.`
      )
    );

  return `
    <section id="package">
      <div class="container package-grid">
        <div>
          <p class="eyebrow">${text.packageOffer}</p>
          <h2>${data.packageName}</h2>
          <p>${data.packageDetails}</p>
          <div class="package-price">${data.packagePrice}</div>
          <a class="btn" href="${packageLink}" target="_blank">Checkout Package</a>
        </div>

        <div class="package-box">
        <h3>${text.includedPackage}</h3>
        <p>${text.packageIncludedText}</p>
        </div>
      </div>
    </section>
  `;
}

function AgentSection(data) {
  const text = getText(data.language);
  const agentDescription = data.agentDescription && data.agentDescription.trim()
  ? data.agentDescription
  : `When you order through this page, ${data.agentName} can help you understand the product, choose a suitable package, explain the daily routine, and support your reorder process.`;
  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    getWhatsAppMessage(
      data,
      `Hi ${data.agentName}, I need guidance before starting Do Good.`
    )
  );

  return `
    <section id="agent">
      <div class="container agent-grid">
        <div class="agent-photo">
          <img src="${getSafeImage(data.agentPhoto, "Agent Photo")}" alt="${data.agentName}" onerror="this.src='https://placehold.co/600x600?text=Agent+Photo'">
        </div>

        <div>
        <p class="eyebrow">${text.agentGuidance}</p>
        <h2>${text.agentGuidanceTitle}</h2>
          <p>${agentDescription}</p>
          <a class="btn" href="${whatsappLink}" target="_blank">Chat with ${data.agentName}</a>
        </div>
      </div>
    </section>
  `;
}

function FAQSection(data) {
  const text = getText(data.language);

  return `
    <section id="faq">
      <div class="container">
        <p class="eyebrow">${text.questions}</p>
        <h2>${text.faqTitle}</h2>

        <div class="faq-list">
          <div class="faq-item">
            <h3>${text.faqOneQuestion}</h3>
            <p>${text.faqOneAnswer}</p>
          </div>

          <div class="faq-item">
            <h3>${text.faqTwoQuestion}</h3>
            <p>${text.faqTwoAnswer}</p>
          </div>

          <div class="faq-item">
            <h3>${text.faqThreeQuestion}</h3>
            <p>${text.faqThreeAnswer}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function FinalCTASection(data) {
  const text = getText(data.language);
  const whatsappLink = createWhatsAppLink(
    data.whatsappNumber,
    getWhatsAppMessage(
      data,
      `Hi ${data.agentName}, I am ready to start my wellness routine with Do Good.`
    )
  );

  return `
    <section class="final-cta">
      <div class="container">
        <p class="eyebrow">${text.startToday}</p>
        <h2>${text.finalCtaTitle}</h2>
        <p>Speak with ${data.agentName} today and get guidance before you begin.</p>
        <a class="btn" href="${whatsappLink}" target="_blank">${text.finalCtaButton}</a>
      </div>
    </section>

    <div class="disclaimer">
      ${text.disclaimer}
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

  document.body.classList.remove(
    "theme-clean-bright",
    "theme-premium-dark",
    "theme-natural-cream",
    "theme-soft-pink"
  );

  document.body.classList.add(`theme-${selectedTheme}`);
  document.documentElement.style.background = "var(--bg)";
}

function validateAgentData(data) {
  const issues = [];

  if (!data.agentName || !data.agentName.trim()) {
    issues.push("Agent name is missing.");
  }

  if (!data.whatsappNumber || !String(data.whatsappNumber).trim()) {
    issues.push("WhatsApp number is missing.");
  }

  const cleanWhatsapp = String(data.whatsappNumber || "").replace(/\D/g, "");

  if (cleanWhatsapp && cleanWhatsapp.length < 10) {
    issues.push("WhatsApp number looks too short.");
  }

  if (!data.packageName || !data.packageName.trim()) {
    issues.push("Package name is missing.");
  }

  if (!data.packagePrice || !data.packagePrice.trim()) {
    issues.push("Package price is missing.");
  }

  if (!data.productImage || !data.productImage.trim()) {
    issues.push("Product image is missing.");
  }

  if (!data.agentPhoto || !data.agentPhoto.trim()) {
    issues.push("Agent photo is missing.");
  }

  return issues;
}

function updateValidationStatus(data) {
  if (!validationStatus) return;

  const issues = validateAgentData(data);

  if (!issues.length) {
    validationStatus.className = "validation-status valid";
    validationStatus.innerHTML = "Page status: Ready to export.";
    return;
  }

  validationStatus.className = "validation-status warning";
  validationStatus.innerHTML = `
    <strong>Page status: Needs attention before final export.</strong>
    <ul>
      ${issues.map((issue) => `<li>${issue}</li>`).join("")}
    </ul>
  `;
}

function renderLandingPage(data) {
  applyTheme(data.theme);
  updateValidationStatus(data);

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

  const renderedSections = selectedSections
    .filter((sectionName) => sectionComponents[sectionName])
    .map((sectionName) => sectionComponents[sectionName](data))
    .join("");
  landingPage.innerHTML = `
    ${HeaderSection(data)}
    ${renderedSections}
  `;
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

function getStructureSections(structure) {
  const structures = {
    standard: [
      "hero",
      "pain-point",
      "product",
      "benefits",
      "package",
      "agent",
      "faq",
      "cta"
    ],

    simple: [
      "hero",
      "product",
      "package",
      "agent",
      "cta"
    ],

    "sales-focus": [
      "hero",
      "pain-point",
      "benefits",
      "package",
      "faq",
      "cta"
    ],

    "trust-focus": [
      "hero",
      "pain-point",
      "product",
      "agent",
      "faq",
      "cta"
    ]
  };

  return structures[structure] || structures.standard;
}

function getStructureFromSections(sections) {
  const sectionString = Array.isArray(sections) ? sections.join(",") : "";

  const structureMap = {
    standard: getStructureSections("standard").join(","),
    simple: getStructureSections("simple").join(","),
    "sales-focus": getStructureSections("sales-focus").join(","),
    "trust-focus": getStructureSections("trust-focus").join(",")
  };

  return Object.keys(structureMap).find(
    (key) => structureMap[key] === sectionString
  ) || "custom";
}

function syncSectionCheckboxes(sections) {
  sectionCheckboxes.forEach((checkbox) => {
    checkbox.checked = sections.includes(checkbox.value);
  });
}

function setupPreviewControls(data) {
  if (
    !themeSelect ||
    !audienceSelect ||
    !structureSelect ||
    !heroStyleSelect ||
    !languageSelect
  ) {
    return;
  }
  themeSelect.value = data.theme || "natural-cream";
  audienceSelect.value = data.targetAudience || "General audience";
  heroStyleSelect.value = data.heroStyle || "product-focus";
  languageSelect.value = data.language || "en";
  structureSelect.value = data.structure && data.structure !== "custom"
    ? data.structure
    : "standard";

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

  syncSectionCheckboxes(currentSections);

sectionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedOptionalSections = Array.from(sectionCheckboxes)
      .filter((item) => item.checked)
      .map((item) => item.value);

    currentAgentData.sections = [
      "hero",
      ...selectedOptionalSections,
      "cta"
    ];

    currentAgentData.structure = getStructureFromSections(currentAgentData.sections);
    structureSelect.value = currentAgentData.structure === "custom"
      ? "standard"
      : currentAgentData.structure;

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

heroStyleSelect.addEventListener("change", () => {
  currentAgentData.heroStyle = heroStyleSelect.value;
  renderLandingPage(currentAgentData);
  saveDraftToBrowser();
});

languageSelect.addEventListener("change", () => {
  currentAgentData.language = languageSelect.value;
  renderLandingPage(currentAgentData);
  saveDraftToBrowser();
});

structureSelect.addEventListener("change", () => {
  const selectedStructure = structureSelect.value;
  const selectedSections = getStructureSections(selectedStructure);

  currentAgentData.structure = selectedStructure;
  currentAgentData.sections = selectedSections;

  syncSectionCheckboxes(selectedSections);
  renderLandingPage(currentAgentData);
  saveDraftToBrowser();
});

}

function normalizeAgentData(data) {
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

  return {
    slug: data.slug || createSlug(data.agentName || "agent-page"),
    agentName: data.agentName || "Do Good Agent",
    whatsappNumber: data.whatsappNumber || "",
    theme: data.theme || "natural-cream",
    language: data.language || "en",
    heroStyle: data.heroStyle || "product-focus",
    heroTitle: data.heroTitle || "",
    heroSubtitle: data.heroSubtitle || "",
    structure: data.structure || getStructureFromSections(data.sections || defaultSections),
    sections: Array.isArray(data.sections) && data.sections.length
    ? data.sections
    : getStructureSections(data.structure || "standard"),
    targetAudience: data.targetAudience || "General audience",
    packageName: data.packageName || "Starter Wellness Package",
    packagePrice: data.packagePrice || "",
    packageCheckoutLink: data.packageCheckoutLink || "https://dogood.asia/Checkout?cl=8f14e45fceea167a5a36dedd4bea2543",
    packageDetails: data.packageDetails || "",
    shortMessage: data.shortMessage || "Start your simple daily wellness routine with guidance from your Do Good agent.",
    productName: data.productName || "Do Good Premium Natural Complex Enzyme 131",
    productDescription: data.productDescription || "Do Good is a convenient enzyme-based wellness drink designed for people who want to build a simple daily health routine. It comes in sachet form, making it easy to consume at home, at work, or while travelling.",
    productImage: data.productImage || "https://via.placeholder.com/600x600?text=Do+Good+Product",
    agentPhoto: data.agentPhoto || "https://via.placeholder.com/400x400?text=Agent+Photo",
    agentDescription: data.agentDescription || "",
    whatsappMessage: data.whatsappMessage || ""
  };
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
  <main id="landingPage">
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
    !productNameInput ||
    !productDescriptionInput ||
    !packageNameInput ||
    !packagePriceInput ||
    !packageCheckoutLinkInput ||
    !shortMessageInput ||
    !heroTitleInput ||
    !heroSubtitleInput ||
    !packageDetailsInput ||
    !productImageInput ||
    !agentPhotoInput ||
    !agentDescriptionInput ||
    !whatsappMessageInput
  ) {
    return;
  }

  agentNameInput.value = data.agentName || "";
  whatsappInput.value = data.whatsappNumber || "";
  productNameInput.value = data.productName || "";
  productDescriptionInput.value = data.productDescription || "";
  packageNameInput.value = data.packageName || "";
  packagePriceInput.value = data.packagePrice || "";
  packageCheckoutLinkInput.value = data.packageCheckoutLink || "";
  shortMessageInput.value = data.shortMessage || "";
  heroTitleInput.value = data.heroTitle || "";
  heroSubtitleInput.value = data.heroSubtitle || "";
  packageDetailsInput.value = data.packageDetails || "";
  productImageInput.value = data.productImage || "";
  agentPhotoInput.value = data.agentPhoto || "";
  agentDescriptionInput.value = data.agentDescription || "";
  whatsappMessageInput.value = data.whatsappMessage || "";

  const updateContent = () => {
    currentAgentData.agentName = agentNameInput.value.trim();
    currentAgentData.slug = createSlug(currentAgentData.agentName);
    currentAgentData.whatsappNumber = whatsappInput.value.trim();
    currentAgentData.productName = productNameInput.value.trim();
    currentAgentData.productDescription = productDescriptionInput.value.trim();
    currentAgentData.packageName = packageNameInput.value.trim();
    currentAgentData.packagePrice = packagePriceInput.value.trim();
    currentAgentData.packageCheckoutLink = packageCheckoutLinkInput.value.trim();
    currentAgentData.shortMessage = shortMessageInput.value.trim();
    currentAgentData.heroTitle = heroTitleInput.value.trim();
    currentAgentData.heroSubtitle = heroSubtitleInput.value.trim();
    currentAgentData.packageDetails = packageDetailsInput.value.trim();
    currentAgentData.productImage = productImageInput.value.trim();
    currentAgentData.agentPhoto = agentPhotoInput.value.trim();
    currentAgentData.agentDescription = agentDescriptionInput.value.trim();
    currentAgentData.whatsappMessage = whatsappMessageInput.value.trim();

    renderLandingPage(currentAgentData);
    saveDraftToBrowser();
  };

  agentNameInput.addEventListener("input", updateContent);
  whatsappInput.addEventListener("input", updateContent);
  productNameInput.addEventListener("input", updateContent);
  productDescriptionInput.addEventListener("input", updateContent);
  packageNameInput.addEventListener("input", updateContent);
  packagePriceInput.addEventListener("input", updateContent);
  packageCheckoutLinkInput.addEventListener("input", updateContent);
  shortMessageInput.addEventListener("input", updateContent);
  heroTitleInput.addEventListener("input", updateContent);
  heroSubtitleInput.addEventListener("input", updateContent);
  packageDetailsInput.addEventListener("input", updateContent);
  productImageInput.addEventListener("input", updateContent);
  agentPhotoInput.addEventListener("input", updateContent);
  agentDescriptionInput.addEventListener("input", updateContent);
  whatsappMessageInput.addEventListener("input", updateContent);
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

  if (clearDraftBtn) {
    clearDraftBtn.addEventListener("click", () => {
      const confirmClear = confirm(
        "Clear saved draft and reload the original agent data?"
      );

      if (!confirmClear) return;

      localStorage.removeItem("dogoodAgentLandingDraft");
      window.location.reload();
    });
  }
}

function setupImportControls() {
  if (!importJsonInput) return;

  importJsonInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedData = JSON.parse(reader.result);
        currentAgentData = normalizeAgentData(importedData);

        saveDraftToBrowser();
        window.location.reload();
      } catch (error) {
        alert("Invalid JSON file. Please import a valid agent JSON file.");
        console.error(error);
      }
    };

    reader.readAsText(file);
  });
}

async function init() {
  try {
    const agentData = await loadAgentData();
    const savedDraft = loadDraftFromBrowser();
    
    currentAgentData = normalizeAgentData(savedDraft || agentData);

    renderLandingPage(currentAgentData);
    setupPreviewControls(currentAgentData);
    setupContentControls(currentAgentData);
    setupExportControls();
    setupImportControls();
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