(function () {
  "use strict";

  /* ---------- Sticky header ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Gallery carousel ---------- */
  var track = document.getElementById("galleryTrack");
  var prev = document.getElementById("galleryPrev");
  var next = document.getElementById("galleryNext");
  var dotsEl = document.getElementById("galleryDots");
  var slides = track.children;
  var index = 0;

  for (var i = 0; i < slides.length; i++) {
    var dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to photo " + (i + 1));
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", (function (n) { return function () { go(n); }; })(i));
    dotsEl.appendChild(dot);
  }
  var dots = dotsEl.children;

  function go(n) {
    index = (n + slides.length) % slides.length;
    track.scrollTo({ left: slides[index].offsetLeft, behavior: "smooth" });
    for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("active", d === index);
  }
  prev.addEventListener("click", function () { go(index - 1); });
  next.addEventListener("click", function () { go(index + 1); });

  var auto = setInterval(function () { go(index + 1); }, 5000);
  track.addEventListener("mouseenter", function () { clearInterval(auto); });
  track.addEventListener("mouseleave", function () {
    auto = setInterval(function () { go(index + 1); }, 5000);
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.classList.add("submitted");
    var note = document.getElementById("formNote");
    note.textContent = "Thank you — your message has been received. We'll be in touch shortly!";
    form.querySelectorAll("input, textarea").forEach(function (el) { el.disabled = true; });
  });
})();