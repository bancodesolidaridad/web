/**
 * Render data from app configuration.
 */
(function () {
  var config = window.APP_CONFIG || {};

  var CC = typeof config.CC === "string" ? config.CC.trim() : "";
  if (CC) {
    document.querySelectorAll("[data-app-bank-account]").forEach(function (node) {
      node.textContent = CC;
    });
  }
  var email = typeof config.email === "string" ? config.email.trim() : "";
  if (email) {
    document.querySelectorAll("[data-app-email]").forEach(function (node) {
      node.textContent = email;
      node.setAttribute("href", "mailto:" + email);
    });
  }
  var rrss = config.rrss && typeof config.rrss === "object" ? config.rrss : {};
  document.querySelectorAll("[data-app-rrss]").forEach(function (node) {
    var key = node.getAttribute("data-app-rrss");
    var href = typeof rrss[key] === "string" ? rrss[key].trim() : "";
    if (!href) return;
    node.setAttribute("href", href);
  });
})();

/**
 * Sync header height into a CSS variable for mobile overlays.
 */
(function () {
  var header = document.querySelector("header");
  if (!header) return;
  var root = document.documentElement;
  var visualViewport = window.visualViewport;

  function updateHeaderOffset() {
    root.style.setProperty("--header-offset", header.offsetHeight + "px");
  }

  function updateViewportBottomOffset() {
    var viewportBottomOffset = 0;

    if (visualViewport) {
      viewportBottomOffset = Math.max(
        0,
        Math.round(window.innerHeight - visualViewport.height - visualViewport.offsetTop)
      );
    }

    root.style.setProperty("--viewport-bottom-offset", viewportBottomOffset + "px");
  }

  function syncViewportVars() {
    updateHeaderOffset();
    updateViewportBottomOffset();
  }

  window.addEventListener("resize", syncViewportVars);
  window.addEventListener("load", syncViewportVars);

  if (typeof ResizeObserver === "function") {
    var resizeObserver = new ResizeObserver(updateHeaderOffset);
    resizeObserver.observe(header);
  }

  if (visualViewport) {
    visualViewport.addEventListener("resize", updateViewportBottomOffset);
  }

  syncViewportVars();
})();

/**
 * Render KPIs from app configuration.
 */
(function () {
  var kpisContainer = document.getElementById("kpis");
  if (!kpisContainer) return;

  var config = window.APP_CONFIG || {};
  var kpis = Array.isArray(config.kpis) ? config.kpis : [];
  if (!kpis.length) return;

  var html = kpis.map(function (kpi) {
    var icon = typeof kpi.icon === "string" ? kpi.icon : "";
    var iconAlt = typeof kpi.iconAlt === "string" ? kpi.iconAlt : "";
    var value = typeof kpi.value === "string" ? kpi.value : "";
    var label = typeof kpi.label === "string" ? kpi.label : "";

    return [
      '<div class="kpi">',
      "  <div>",
      '    <img src="' + icon + '" alt="' + iconAlt + '" />',
      "    <strong>" + value + "</strong>",
      "  </div>",
      "  <span>" + label + "</span>",
      "</div>"
    ].join("\n");
  }).join("\n");

  kpisContainer.innerHTML = html;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var kpiNodes = kpisContainer.querySelectorAll(".kpi");

  if (prefersReducedMotion) {
    kpiNodes.forEach(function (kpiNode) {
      kpiNode.classList.add("is-visible");
    });
    return;
  }

  kpiNodes.forEach(function (kpiNode, index) {
    window.setTimeout(function () {
      kpiNode.classList.add("is-visible");
    }, index * 220);
  });
})();

/**
 * Menu toggle.
 */
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu-principal");
  var header = document.querySelector("header");
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación"
    );
    var nextIsOpen = !isOpen;
    menu.classList.toggle("is-open", nextIsOpen);
    document.body.classList.toggle("menu-open", nextIsOpen);
    if (nextIsOpen && header) {
      header.classList.remove("is-hidden");
    }
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 560) closeMenu();
  });
})();

/**
 * Hide header on scroll down and show it on scroll up.
 */
(function () {
  var header = document.querySelector("header");
  if (!header) return;

  var menu = document.getElementById("menu-principal");
  var lastY = window.scrollY;
  var minScrollToHide = 100;
  var minDelta = 6;

  function updateHeaderVisibility() {
    var currentY = window.scrollY;
    var delta = currentY - lastY;
    var isMenuOpen = menu && menu.classList.contains("is-open");

    if (currentY <= 0 || isMenuOpen) {
      header.classList.remove("is-hidden");
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < minDelta) return;

    if (delta > 0 && currentY > minScrollToHide) {
      header.classList.add("is-hidden");
    } else if (delta < 0) {
      header.classList.remove("is-hidden");
    }

    lastY = currentY;
  }

  window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
  window.addEventListener("resize", updateHeaderVisibility);
  updateHeaderVisibility();
})();

/**
 * Shows the scroll-top button when the footer is shown.
 */
(function () {
  var button = document.getElementById("scroll-top");
  var footer = document.querySelector("footer");
  if (!button || !footer) return;

  function updateScrollTopButton() {
    var doc = document.documentElement;
    var scrollBottom = window.scrollY + window.innerHeight;
    var isAtEnd = scrollBottom >= doc.scrollHeight - 4;
    var footerRect = footer.getBoundingClientRect();
    var overlap = window.innerHeight - footerRect.top;
    var baseBottom = 16;

    button.classList.toggle("is-visible", isAtEnd);
    button.style.bottom = (overlap > 0 ? baseBottom + overlap : baseBottom) + "px";
  }

  button.addEventListener("click", function () {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", updateScrollTopButton, { passive: true });
  window.addEventListener("resize", updateScrollTopButton);
  updateScrollTopButton();
})();

/**
 * Animate the kpi numbers.
 */
(function () {
  var counters = document.querySelectorAll(".kpi strong");
  if (!counters.length) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var numberFormat = new Intl.NumberFormat("es-ES");

  counters.forEach(function (counter, index) {
    var originalText = (counter.textContent || "").trim();
    var prefix = originalText.startsWith("+") ? "+" : "";
    var target = Number(originalText.replace(/[^\d]/g, ""));

    if (!Number.isFinite(target) || target <= 0) return;

    if (prefersReducedMotion) {
      counter.textContent = prefix + numberFormat.format(target);
      return;
    }

    var duration = 1000 + index * 180;
    var startTime;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);

      counter.textContent = prefix + numberFormat.format(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = prefix + numberFormat.format(target);
      }
    }

    counter.textContent = prefix + "0";
    window.requestAnimationFrame(step);
  });
})();
