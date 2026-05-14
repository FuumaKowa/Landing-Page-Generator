const STORAGE_KEYS = {
    draft: "dogoodAgentLandingDraft",
    submissions: "dogoodLandingSubmissions",
    publishedPages: "dogoodPublishedLandingPages"
  };
  
  function getStoredList(key) {
    const savedData = localStorage.getItem(key);
  
    if (!savedData) return [];
  
    try {
      const parsedData = JSON.parse(savedData);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
      console.warn(`Invalid localStorage list found for ${key}.`, error);
      return [];
    }
  }
  
  function saveStoredList(key, list) {
    localStorage.setItem(key, JSON.stringify(Array.isArray(list) ? list : []));
  }
  
  function getStoredObject(key) {
    const savedData = localStorage.getItem(key);
  
    if (!savedData) return null;
  
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.warn(`Invalid localStorage object found for ${key}.`, error);
      return null;
    }
  }
  
  function saveStoredObject(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
  }
  
  function removeStoredItem(key) {
    localStorage.removeItem(key);
  }
  
  const DoGoodStorage = {
    getDraft() {
      return getStoredObject(STORAGE_KEYS.draft);
    },
  
    saveDraft(data) {
      saveStoredObject(STORAGE_KEYS.draft, data);
    },
  
    clearDraft() {
      removeStoredItem(STORAGE_KEYS.draft);
    },
  
    getSubmissions() {
      return getStoredList(STORAGE_KEYS.submissions);
    },
  
    saveSubmissions(submissions) {
      saveStoredList(STORAGE_KEYS.submissions, submissions);
    },
  
    clearSubmissions() {
      removeStoredItem(STORAGE_KEYS.submissions);
    },
  
    getPublishedPages() {
      return getStoredList(STORAGE_KEYS.publishedPages);
    },
  
    savePublishedPages(pages) {
      saveStoredList(STORAGE_KEYS.publishedPages, pages);
    },
  
    clearPublishedPages() {
      removeStoredItem(STORAGE_KEYS.publishedPages);
    },
  
    getBackupData() {
      const submissions = this.getSubmissions();
      const publishedPages = this.getPublishedPages();
  
      return {
        exportedAt: new Date().toISOString(),
        version: "local-prototype-v1",
        counts: {
          submissions: submissions.length,
          publishedPages: publishedPages.length
        },
        dogoodLandingSubmissions: submissions,
        dogoodPublishedLandingPages: publishedPages
      };
    },
  
    importBackupData(backupData) {
      const submissions = Array.isArray(backupData.dogoodLandingSubmissions)
        ? backupData.dogoodLandingSubmissions
        : [];
  
      const publishedPages = Array.isArray(backupData.dogoodPublishedLandingPages)
        ? backupData.dogoodPublishedLandingPages
        : [];
  
      this.saveSubmissions(submissions);
      this.savePublishedPages(publishedPages);
    }
  };