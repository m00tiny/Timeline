/**
 * ============================================================================
 * app.js
 * Author: Stuart Cannon Gray
 * Description: Interactive controller for rendering timeline events, toggling
 *              vertical/horizontal layouts, switching light/dark modes, and
 *              managing live personalization via the slide-over drawer.
 * ============================================================================
 */

(function () {
  "use strict";

  const STORAGE_KEY = "scg_timeline_config_v1";

  // Deep-clone helper to prevent mutating the original default object
  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  // Load saved state from localStorage or fall back to config.js defaults
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...clone(window.DEFAULT_TIMELINE_CONFIG), ...JSON.parse(saved) };
      }
    } catch (err) {
      console.warn("Could not read saved timeline state:", err);
    }
    return clone(window.DEFAULT_TIMELINE_CONFIG);
  }

  let state = loadState();
  let activeTheme = state.defaultTheme || "light";
  let activeLayout = state.defaultLayout || "vertical";

  // Cache DOM Elements
  const dom = {
    html: document.documentElement,
    navTitle: document.getElementById("nav-title"),
    heroEyebrow: document.getElementById("hero-eyebrow"),
    heroTitle: document.getElementById("hero-title"),
    heroSubtitle: document.getElementById("hero-subtitle"),
    footerAuthor: document.getElementById("footer-author"),
    timelineContainer: document.getElementById("timeline-container"),
    horizontalHint: document.getElementById("horizontal-hint"),

    // Controls
    btnVertical: document.getElementById("btn-vertical"),
    btnHorizontal: document.getElementById("btn-horizontal"),
    btnTheme: document.getElementById("btn-theme"),
    themeIcon: document.getElementById("theme-icon"),
    themeLabel: document.getElementById("theme-label"),
    btnCustomize: document.getElementById("btn-customize"),

    // Drawer & Form Inputs
    drawer: document.getElementById("customizer-drawer"),
    backdrop: document.getElementById("drawer-backdrop"),
    btnCloseDrawer: document.getElementById("btn-close-drawer"),
    cfgTitle: document.getElementById("cfg-title"),
    cfgEyebrow: document.getElementById("cfg-eyebrow"),
    cfgSubtitle: document.getElementById("cfg-subtitle"),
    cfgAuthor: document.getElementById("cfg-author"),
    cfgAccent: document.getElementById("cfg-accent"),
    cfgDensity: document.getElementById("cfg-density"),
    cfgShowTags: document.getElementById("cfg-show-tags"),
    eventEditorList: document.getElementById("event-editor-list"),
    btnAddEvent: document.getElementById("btn-add-event"),
    btnExportConfig: document.getElementById("btn-export-config"),
    btnResetDefaults: document.getElementById("btn-reset-defaults")
  };

  /**
   * Persist current configuration state to localStorage
   */
  function saveState() {
    try {
      state.defaultTheme = activeTheme;
      state.defaultLayout = activeLayout;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Could not save timeline state:", err);
    }
  }

  /**
   * Apply Light or Dark Theme to <html> and update button labels
   */
  function applyTheme(theme) {
    activeTheme = theme === "dark" ? "dark" : "light";
    dom.html.setAttribute("data-theme", activeTheme);

    if (activeTheme === "dark") {
      dom.themeIcon.textContent = "☀️";
      dom.themeLabel.textContent = "Light";
    } else {
      dom.themeIcon.textContent = "🌙";
      dom.themeLabel.textContent = "Dark";
    }
    saveState();
  }

  /**
   * Switch between Vertical and Horizontal timeline orientations
   */
  function applyLayout(layout) {
    activeLayout = layout === "horizontal" ? "horizontal" : "vertical";

    dom.timelineContainer.classList.remove("layout-vertical", "layout-horizontal");
    dom.timelineContainer.classList.add(`layout-${activeLayout}`);

    const isHorizontal = activeLayout === "horizontal";
    dom.btnVertical.classList.toggle("active", !isHorizontal);
    dom.btnVertical.setAttribute("aria-pressed", String(!isHorizontal));
    dom.btnHorizontal.classList.toggle("active", isHorizontal);
    dom.btnHorizontal.setAttribute("aria-pressed", String(isHorizontal));
    dom.horizontalHint.classList.toggle("hidden", !isHorizontal);

    saveState();
  }

  /**
   * Apply Accent Color, Card Density, and Text Metadata
   */
  function applyAppearanceAndMetadata() {
    dom.html.style.setProperty("--accent", state.accentColor || "#2563eb");
    dom.html.style.setProperty("--accent-soft", hexToRgba(state.accentColor || "#2563eb", 0.14));
    dom.html.setAttribute("data-density", state.density || "comfortable");

    dom.navTitle.textContent = state.title;
    dom.heroEyebrow.textContent = state.eyebrow;
    dom.heroTitle.textContent = state.title;
    dom.heroSubtitle.textContent = state.subtitle;
    dom.footerAuthor.textContent = state.author;
    document.title = `${state.title} — ${state.author}`;
  }

  /**
   * Convert a 6-digit hex string into an rgba() CSS string for subtle badges
   */
  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return `rgba(37, 99, 235, ${alpha})`;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Render all timeline event cards into the DOM
   */
  function renderTimeline() {
    dom.timelineContainer.innerHTML = "";

    state.events.forEach((item) => {
      const article = document.createElement("article");
      article.className = "timeline-item";

      const node = document.createElement("span");
      node.className = "timeline-node";
      node.setAttribute("aria-hidden", "true");

      const card = document.createElement("div");
      card.className = "timeline-card";

      // Meta row (Date + optional Category Tag)
      const meta = document.createElement("div");
      meta.className = "card-meta";

      const dateEl = document.createElement("span");
      dateEl.className = "card-date";
      dateEl.textContent = item.date;
      meta.appendChild(dateEl);

      if (state.showTags && item.tag) {
        const tagEl = document.createElement("span");
        tagEl.className = "card-tag";
        tagEl.textContent = item.tag;
        meta.appendChild(tagEl);
      }

      // Title & Description
      const titleEl = document.createElement("h3");
      titleEl.className = "card-title";
      titleEl.textContent = item.title;

      const descEl = document.createElement("p");
      descEl.className = "card-desc";
      descEl.textContent = item.description;

      card.appendChild(meta);
      card.appendChild(titleEl);
      card.appendChild(descEl);

      // Optional External Link
      if (item.linkText && item.linkUrl) {
        const linkEl = document.createElement("a");
        linkEl.className = "card-link";
        linkEl.href = item.linkUrl;
        linkEl.textContent = item.linkText;
        if (item.linkUrl.startsWith("http")) {
          linkEl.target = "_blank";
          linkEl.rel = "noopener noreferrer";
        }
        card.appendChild(linkEl);
      }

      article.appendChild(node);
      article.appendChild(card);
      dom.timelineContainer.appendChild(article);
    });
  }

  /**
   * Populate the Personalization Drawer inputs with current state
   */
  function syncDrawerInputs() {
    dom.cfgTitle.value = state.title;
    dom.cfgEyebrow.value = state.eyebrow;
    dom.cfgSubtitle.value = state.subtitle;
    dom.cfgAuthor.value = state.author;
    dom.cfgAccent.value = state.accentColor;
    dom.cfgDensity.value = state.density;
    dom.cfgShowTags.checked = Boolean(state.showTags);

    renderEventEditors();
  }

  /**
   * Render editable form blocks for each timeline milestone inside the drawer
   */
  function renderEventEditors() {
    dom.eventEditorList.innerHTML = "";

    state.events.forEach((ev, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "event-editor-card";

      wrapper.innerHTML = `
        <div class="event-editor-top">
          <span>Milestone #${index + 1}</span>
          <button type="button" class="btn-remove-event" data-index="${index}">Remove</button>
        </div>
        <div class="field-row">
          <label class="field">
            <span>Date</span>
            <input type="text" data-field="date" data-index="${index}" value="${escapeHtml(ev.date)}" />
          </label>
          <label class="field">
            <span>Category Tag</span>
            <input type="text" data-field="tag" data-index="${index}" value="${escapeHtml(ev.tag || "")}" />
          </label>
        </div>
        <label class="field">
          <span>Title</span>
          <input type="text" data-field="title" data-index="${index}" value="${escapeHtml(ev.title)}" />
        </label>
        <label class="field">
          <span>Description</span>
          <textarea rows="2" data-field="description" data-index="${index}">${escapeHtml(ev.description)}</textarea>
        </label>
      `;

      dom.eventEditorList.appendChild(wrapper);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Generate and download an updated config.js file ready to commit to GitHub
   */
  function downloadConfigFile() {
    const exportPayload = {
      ...state,
      defaultTheme: activeTheme,
      defaultLayout: activeLayout
    };

    const fileContent = `/**
 * ============================================================================
 * config.js
 * Author: ${exportPayload.author}
 * Generated: ${new Date().toISOString()}
 * ============================================================================
 */

window.DEFAULT_TIMELINE_CONFIG = ${JSON.stringify(exportPayload, null, 2)};
`;

    const blob = new Blob([fileContent], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "config.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Open / Close Drawer Helpers
   */
  function openDrawer() {
    syncDrawerInputs();
    dom.drawer.classList.add("open");
    dom.drawer.setAttribute("aria-hidden", "false");
    dom.backdrop.classList.remove("hidden");
  }

  function closeDrawer() {
    dom.drawer.classList.remove("open");
    dom.drawer.setAttribute("aria-hidden", "true");
    dom.backdrop.classList.add("hidden");
  }

  /**
   * Bind All UI Event Listeners
   */
  function bindEvents() {
    // Orientation Toggles
    dom.btnVertical.addEventListener("click", () => applyLayout("vertical"));
    dom.btnHorizontal.addEventListener("click", () => applyLayout("horizontal"));

    // Theme Toggle
    dom.btnTheme.addEventListener("click", () => {
      applyTheme(activeTheme === "light" ? "dark" : "light");
    });

    // Translate vertical mouse-wheel scrolling into horizontal scrolling when in horizontal mode
    dom.timelineContainer.addEventListener(
      "wheel",
      (e) => {
        if (activeLayout === "horizontal" && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          dom.timelineContainer.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );

    // Drawer Controls
    dom.btnCustomize.addEventListener("click", openDrawer);
    dom.btnCloseDrawer.addEventListener("click", closeDrawer);
    dom.backdrop.addEventListener("click", closeDrawer);

    // Live Metadata & Style Inputs
    dom.cfgTitle.addEventListener("input", (e) => {
      state.title = e.target.value;
      applyAppearanceAndMetadata();
      saveState();
    });

    dom.cfgEyebrow.addEventListener("input", (e) => {
      state.eyebrow = e.target.value;
      applyAppearanceAndMetadata();
      saveState();
    });

    dom.cfgSubtitle.addEventListener("input", (e) => {
      state.subtitle = e.target.value;
      applyAppearanceAndMetadata();
      saveState();
    });

    dom.cfgAuthor.addEventListener("input", (e) => {
      state.author = e.target.value;
      applyAppearanceAndMetadata();
      saveState();
    });

    dom.cfgAccent.addEventListener("input", (e) => {
      state.accentColor = e.target.value;
      applyAppearanceAndMetadata();
      saveState();
    });

    dom.cfgDensity.addEventListener("change", (e) => {
      state.density = e.target.value;
      applyAppearanceAndMetadata();
      saveState();
    });

    dom.cfgShowTags.addEventListener("change", (e) => {
      state.showTags = e.target.checked;
      renderTimeline();
      saveState();
    });

    // Event List Editing (Event Delegation)
    dom.eventEditorList.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.index);
      const field = e.target.dataset.field;
      if (!Number.isNaN(idx) && field && state.events[idx]) {
        state.events[idx][field] = e.target.value;
        renderTimeline();
        saveState();
      }
    });

    dom.eventEditorList.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-remove-event")) {
        const idx = Number(e.target.dataset.index);
        state.events.splice(idx, 1);
        renderEventEditors();
        renderTimeline();
        saveState();
      }
    });

    // Add New Milestone
    dom.btnAddEvent.addEventListener("click", () => {
      state.events.push({
        date: "2026",
        tag: "Milestone",
        title: "New Timeline Event",
        description: "Describe the impact, architecture, or outcome of this milestone.",
        linkText: "",
        linkUrl: ""
      });
      renderEventEditors();
      renderTimeline();
      saveState();
    });

    // Export config.js for GitHub
    dom.btnExportConfig.addEventListener("click", downloadConfigFile);

    // Reset to config.js Defaults
    dom.btnResetDefaults.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state = clone(window.DEFAULT_TIMELINE_CONFIG);
      applyTheme(state.defaultTheme);
      applyLayout(state.defaultLayout);
      applyAppearanceAndMetadata();
      renderTimeline();
      syncDrawerInputs();
    });
  }

  /**
   * Initialize Application
   */
  function init() {
    applyTheme(activeTheme);
    applyLayout(activeLayout);
    applyAppearanceAndMetadata();
    renderTimeline();
    bindEvents();
  }

  init();
})();
