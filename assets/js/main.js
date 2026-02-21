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
 * Shows a spinner loading.
 */
function spinnerLoading(container) {
  container.innerHTML = [
    '<div class="spinner" aria-live="polite" aria-busy="true">',
    '  <span class="spinner__loading" aria-hidden="true"></span>',
    "  <p>Cargando noticias...</p>",
    "</div>"
  ].join("\n");
}

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

/**
 * Render latest Instagram posts in the news section.
 */
(function () {
  var newsContainer = document.getElementById("news-list");
  if (!newsContainer) return;
  var SLIDE_POSTS = 3;
  var currentIndex = 0;
  var allPosts = [];
  var touchStartX = 0;
  var touchStartY = 0;
  var SWIPE_THRESHOLD = 40;
  var config = window.APP_CONFIG || {};

  var configuredNews = Array.isArray(config.news)
    ? config.news
    : (Array.isArray(config.noticias) ? config.noticias : []);

  function mergeConfiguredNews(postsFromJson) {
    var jsonPosts = Array.isArray(postsFromJson) ? postsFromJson : [];
    return configuredNews.concat(jsonPosts);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildTitle(post) {
    if (typeof post.title === "string" && post.title.trim()) return post.title.trim();
    if (typeof post.caption === "string" && post.caption.trim()) {
      return post.caption.trim().split(/\r?\n/)[0].slice(0, 80);
    }
    return "Noticia";
  }

  function buildDescription(post) {
    if (typeof post.description === "string" && post.description.trim()) return post.description.trim();
    if (typeof post.caption === "string" && post.caption.trim()) return post.caption.trim().slice(0, 220);
    return "Ver noticia en Instagram.";
  }

  function renderPostCard(post) {
    var imageUrl = typeof post.imageUrl === "string" ? post.imageUrl : "";
    var permalink = typeof post.permalink === "string" ? post.permalink : "";
    var title = escapeHtml(buildTitle(post));
    var description = escapeHtml(buildDescription(post));

    var imageBlock = imageUrl
      ? '<a class="news-post__media-link" href="' + escapeHtml(permalink || "#") + '" target="_blank" rel="noopener noreferrer"><img class="news-post__media" src="' + escapeHtml(imageUrl) + '" alt="' + title + '" loading="lazy" /></a>'
      : '<div class="news-post__media news-post__media--placeholder" role="img" aria-label="Publicación en Instagram"></div>';

    return [
      '<article class="news-post">',
      "  " + imageBlock,
      '  <div class="news-post__body">',
      permalink
        ? '    <h3><a href="' + escapeHtml(permalink) + '" target="_blank" rel="noopener noreferrer">' + title + "</a></h3>"
        : "    <h3>" + title + "</h3>",
      "    <p>" + description + "</p>",
      "  </div>",
      "</article>"
    ].join("\n");
  }

  function renderCarousel(posts) {
    var html = '';
    if (!Array.isArray(posts) || !posts.length) {
      html = [
        '<article class="news-post news-post--empty">',
        '  <div class="news-post__media news-post__media--placeholder" role="img" aria-label="Próximamente"></div>',
        '  <div class="news-post__body">',
        "    <h3>No hay noticias</h3>",
        "    <p>Cuando haya posts en Instagram, aparecerán aquí automáticamente.</p>",
        "  </div>",
        "</article>"
      ].join("\n");
      var noticias = document.getElementById('noticias');
      if (noticias) {
        noticias.classList.add('section--sm');
      }
    } else {
      html = [
        '<div class="news-carousel">',
        '  <button class="news-carousel__arrow news-carousel__arrow--prev" type="button" data-carousel-action="prev" aria-label="Slide anterior">‹</button>',
        '  <div class="news-carousel__viewport">',
        '    <div class="news-carousel__track">',
        posts.map(renderPostCard).join("\n"),
        "    </div>",
        "  </div>",
        '  <button class="news-carousel__arrow news-carousel__arrow--next" type="button" data-carousel-action="next" aria-label="Slide siguiente">›</button>',
        "</div>"
      ].join("\n");
    }

    newsContainer.innerHTML = html;
    syncCarousel();
  }

  function getMetrics() {
    var track = newsContainer.querySelector(".news-carousel__track");
    var viewport = newsContainer.querySelector(".news-carousel__viewport");
    if (!track || !viewport) return null;

    var card = track.querySelector(".news-post:not(.news-post--empty)");
    if (!card) return null;

    var trackStyles = window.getComputedStyle(track);
    var gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0") || 0;
    var step = card.getBoundingClientRect().width + gap;

    if (!step) return null;

    var viewportStyles = window.getComputedStyle(viewport);
    var paddingLeft = Number.parseFloat(viewportStyles.paddingLeft || "0") || 0;
    var paddingRight = Number.parseFloat(viewportStyles.paddingRight || "0") || 0;
    var viewportInnerWidth = Math.max(0, viewport.clientWidth - paddingLeft - paddingRight);
    var visibleCards = Math.max(1, Math.floor((viewportInnerWidth + gap) / step));
    var maxIndex = Math.max(0, allPosts.length - visibleCards);

    return {
      track: track,
      maxIndex: maxIndex,
      step: step
    };
  }

  function syncCarousel() {
    var prev = newsContainer.querySelector('.news-carousel__arrow--prev');
    var next = newsContainer.querySelector('.news-carousel__arrow--next');

    var metrics = getMetrics();

    if (!metrics) {
      if (prev) prev.disabled = true;
      if (next) next.disabled = true;
      return;
    }

    if (currentIndex > metrics.maxIndex) currentIndex = metrics.maxIndex;
    metrics.track.style.transform = "translateX(-" + (currentIndex * metrics.step) + "px)";
    metrics.track.classList.toggle("news-carousel__track--centered", allPosts.length < SLIDE_POSTS);

    if (prev) prev.disabled = currentIndex <= 0;
    if (next) next.disabled = currentIndex >= metrics.maxIndex;
  }

  function setPosts(posts) {
    allPosts = Array.isArray(posts) ? posts : [];
    currentIndex = 0;
    renderCarousel(allPosts);

    if (allPosts.length <= SLIDE_POSTS) {
      var prev = newsContainer.querySelector('.news-carousel__arrow--prev');
      var next = newsContainer.querySelector('.news-carousel__arrow--next');
      if (prev) prev.style.visibility = "hidden";
      if (next) next.style.visibility = "hidden";
    }
  }

  function moveCarousel(delta) {
    var metrics = getMetrics();
    if (!metrics) return;

    var nextIndex = Math.max(0, Math.min(metrics.maxIndex, currentIndex + delta));
    if (nextIndex === currentIndex) return;
    currentIndex = nextIndex;
    syncCarousel();
  }

  newsContainer.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.matches("[data-carousel-action]")) return;

    var action = target.getAttribute("data-carousel-action");
    if (action === "prev") moveCarousel(-1);
    if (action === "next") moveCarousel(1);
  });

  newsContainer.addEventListener("touchstart", function (event) {
    if (!event.touches || event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  newsContainer.addEventListener("touchend", function (event) {
    if (!event.changedTouches || event.changedTouches.length !== 1) return;

    var touchEndX = event.changedTouches[0].clientX;
    var touchEndY = event.changedTouches[0].clientY;
    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;

    // Ignore mostly vertical swipes so page scroll keeps working.
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) moveCarousel(1);
    if (deltaX > 0) moveCarousel(-1);
  });

  window.addEventListener("resize", function () {
    if (!allPosts.length) return;
    syncCarousel();
  });

  spinnerLoading(newsContainer);

  fetch("./assets/data/instagram-posts.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("No se pudo cargar el feed de Instagram.");
      return response.json();
    })
    .then(function (payload) {
      var posts = payload && Array.isArray(payload.posts) ? payload.posts : [];
      setPosts(mergeConfiguredNews(posts));
    })
    .catch(function () {
      setPosts(mergeConfiguredNews([]));
    });
})();
