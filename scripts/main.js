(function () {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu-principal");
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú de navegación");
    menu.classList.remove("is-open");
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación"
    );
    menu.classList.toggle("is-open", !isOpen);
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
