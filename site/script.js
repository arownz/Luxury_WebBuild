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

  /* ---------- Gallery carousel (center slide + prev/next peek) ---------- */
  var track = document.getElementById("galleryTrack");
  var prev = document.getElementById("galleryPrev");
  var next = document.getElementById("galleryNext");
  var dotsEl = document.getElementById("galleryDots");
  var realSlides = Array.prototype.slice.call(track.children);
  var n = realSlides.length;

  if (n > 1) {
    // Clone first/last so the wrap-around always has a peek on both sides
    var firstClone = realSlides[0].cloneNode(true);
    var lastClone = realSlides[n - 1].cloneNode(true);
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");
    track.insertBefore(lastClone, realSlides[0]);
    track.appendChild(firstClone);

    var all = track.children;
    var pos = 1;

    for (var i = 0; i < n; i++) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to photo " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", (function (k) { return function () { go(k + 1); }; })(i));
      dotsEl.appendChild(dot);
    }
    var dots = dotsEl.children;

    function targetLeft(p) {
      return all[p].offsetLeft + all[p].clientWidth / 2 - track.clientWidth / 2;
    }

    function scrollTo(p, smooth) {
      track.scrollTo({ left: targetLeft(p), behavior: smooth ? "smooth" : "auto" });
    }

    function setActive(p) {
      for (var i = 0; i < all.length; i++) all[i].classList.toggle("active", i === p);
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("active", d === p - 1);
    }

    function nearest() {
      var cx = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestD = Infinity;
      for (var i = 0; i < all.length; i++) {
        var d = Math.abs(all[i].offsetLeft + all[i].clientWidth / 2 - cx);
        if (d < bestD) { bestD = d; best = i; }
      }
      return best;
    }

    function go(p) {
      pos = ((p - 1) % n + n) % n + 1; // keep within 1..n
      scrollTo(pos, true);
      setActive(pos);
    }

    function normalize() {
      var p = nearest();
      if (p === 0) { pos = n; scrollTo(n, false); setActive(n); }
      else if (p === n + 1) { pos = 1; scrollTo(1, false); setActive(1); }
      else if (p !== pos) { pos = p; setActive(p); }
    }

    var idle;
    track.addEventListener("scroll", function () {
      setActive(nearest());
      clearTimeout(idle);
      idle = setTimeout(normalize, 140);
    }, { passive: true });

    prev.addEventListener("click", function () { go(pos - 1); });
    next.addEventListener("click", function () { go(pos + 1); });

    var auto = setInterval(function () { go(pos + 1); }, 5000);
    track.addEventListener("mouseenter", function () { clearInterval(auto); });
    track.addEventListener("mouseleave", function () {
      auto = setInterval(function () { go(pos + 1); }, 5000);
    });

    scrollTo(1, false);
    setActive(1);
  }

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