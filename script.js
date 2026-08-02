// ==========================================
// FRIENDSHIP TRIO — SLIDE CONTROLLER
// Fafa • Khai • Bappy
// Works with the existing index.html structure.
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const slides = [...document.querySelectorAll(".slide")];
  const navButtons = [...document.querySelectorAll("#slideNav button")];
  const currentEl = document.getElementById("currentSlide");
  const progress = document.getElementById("progressBar");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const replayBtn = document.getElementById("replay");
  const loader = document.getElementById("loader");
  const slideNav = document.getElementById("slideNav");
  const menuBtn = document.getElementById("menuBtn");

  let current = Math.max(0, slides.findIndex(slide => slide.classList.contains("active")));
  let animating = false;

  if (!slides.length) {
    console.error("Friendship Trio: no .slide elements were found.");
    return;
  }

  // ------------------------------------------
  // LOADER
  // ------------------------------------------
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.remove(), 850);
    }, 450);
  }

  // ------------------------------------------
  // SLIDE UI
  // ------------------------------------------
  function updateUI() {
    if (currentEl) {
      currentEl.textContent = String(current + 1).padStart(2, "0");
    }

    if (progress) {
      progress.style.width = ((current + 1) / slides.length * 100) + "%";
    }

    navButtons.forEach((button, index) => {
      button.classList.toggle("active", index === current);
      button.setAttribute("aria-current", index === current ? "true" : "false");
    });
  }

  function showSlide(index, direction = 1) {
    if (
      animating ||
      index < 0 ||
      index >= slides.length ||
      index === current
    ) return;

    const oldSlide = slides[current];
    const newSlide = slides[index];

    animating = true;

    oldSlide.classList.remove("exit-left");

    if (direction < 0) {
      oldSlide.classList.add("exit-left");
    }

    newSlide.classList.remove("exit-left");
    newSlide.classList.add("active");

    current = index;
    updateUI();

    setTimeout(() => {
      oldSlide.classList.remove("active", "exit-left");
      animating = false;
    }, 800);
  }

  function nextSlide() {
    if (current < slides.length - 1) {
      showSlide(current + 1, 1);
    }
  }

  function previousSlide() {
    if (current > 0) {
      showSlide(current - 1, -1);
    }
  }

  // ------------------------------------------
  // BUTTONS
  // ------------------------------------------
  nextBtn?.addEventListener("click", nextSlide);
  prevBtn?.addEventListener("click", previousSlide);

  document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", nextSlide);
  });

  navButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (index !== current) {
        showSlide(index, index > current ? 1 : -1);
      }

      // Close mobile navigation after choosing a slide.
      if (slideNav && window.innerWidth <= 900) {
        slideNav.classList.remove("menu-open");
      }
    });
  });

  replayBtn?.addEventListener("click", () => {
    if (current === 0) return;
    showSlide(0, -1);
  });

  // ------------------------------------------
  // KEYBOARD NAVIGATION
  // ------------------------------------------
  window.addEventListener("keydown", event => {
    // Don't hijack keys while typing in a form field.
    const tag = event.target?.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

    if (["ArrowRight", " ", "PageDown"].includes(event.key)) {
      event.preventDefault();
      nextSlide();
    }

    if (["ArrowLeft", "PageUp"].includes(event.key)) {
      event.preventDefault();
      previousSlide();
    }

    if (event.key === "Home") {
      event.preventDefault();
      if (current !== 0) showSlide(0, -1);
    }

    if (event.key === "End") {
      event.preventDefault();
      if (current !== slides.length - 1) showSlide(slides.length - 1, 1);
    }

    if (/^[1-7]$/.test(event.key)) {
      const target = Number(event.key) - 1;
      if (target < slides.length && target !== current) {
        showSlide(target, target > current ? 1 : -1);
      }
    }
  });

  // ------------------------------------------
  // TOUCH / SWIPE
  // ------------------------------------------
  let touchX = 0;
  let touchY = 0;

  window.addEventListener("touchstart", event => {
    const touch = event.changedTouches[0];
    touchX = touch.screenX;
    touchY = touch.screenY;
  }, { passive: true });

  window.addEventListener("touchend", event => {
    const touch = event.changedTouches[0];
    const dx = touch.screenX - touchX;
    const dy = touch.screenY - touchY;

    // Only treat a mostly-horizontal gesture as slide navigation.
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

    dx < 0 ? nextSlide() : previousSlide();
  }, { passive: true });

  // ------------------------------------------
  // MOBILE MENU
  // ------------------------------------------
  menuBtn?.addEventListener("click", () => {
    if (!slideNav) return;
    slideNav.classList.toggle("menu-open");
  });

  // ------------------------------------------
  // FLOATING HEARTS
  // ------------------------------------------
  const heartsContainer = document.getElementById("hearts");

  function makeHeart() {
    if (!heartsContainer) return;

    const heart = document.createElement("span");
    heart.className = "heart-float";
    heart.textContent = Math.random() > 0.25 ? "❤️" : "✦";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (10 + Math.random() * 15) + "px";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 6000);
  }

  // Keep the effect gentle.
  const heartTimer = setInterval(makeHeart, 1100);

  // ------------------------------------------
  // QUOTE ROTATION
  // ------------------------------------------
  const quoteText = document.getElementById("quoteText");
  const quoteDots = [...document.querySelectorAll(".quote-dots span")];

  const quotes = [
    "Some people come into our lives for a reason. Some stay for a season. True friends become family.",
    "Three different personalities. One unbreakable bond. A thousand memories still waiting to happen.",
    "No matter where life takes us, the best memories will always have the three of us in them."
  ];

  let quoteIndex = 0;

  if (quoteText && quotes.length > 1) {
    setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;

      quoteText.style.opacity = "0";

      setTimeout(() => {
        quoteText.textContent = quotes[quoteIndex];
        quoteText.style.opacity = "1";

        quoteDots.forEach((dot, index) => {
          dot.classList.toggle("active", index === quoteIndex);
        });
      }, 300);
    }, 5000);
  }

  // ------------------------------------------
  // MUSIC
  // ------------------------------------------
  const music = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicBtn");
  const heroMusic = document.getElementById("heroMusic");
  let musicOn = false;

  function setMusicUI(on, message) {
    musicOn = on;

    if (musicBtn) {
      musicBtn.textContent = on ? "Ⅱ" : "♫";
      musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
    }

    if (heroMusic) {
      heroMusic.textContent = message || (on ? "Pause Music" : "Play Music");
    }
  }

  async function toggleMusic() {
    if (!music) {
      if (heroMusic) heroMusic.textContent = "Add music file first";
      return;
    }

    if (musicOn) {
      music.pause();
      setMusicUI(false);
      return;
    }

    try {
      await music.play();
      setMusicUI(true);
    } catch (error) {
      // The audio file is not available or the browser blocked playback.
      setMusicUI(false, "Add music file first");
      console.warn("Friendship Trio music could not be played:", error);
    }
  }

  musicBtn?.addEventListener("click", toggleMusic);
  heroMusic?.addEventListener("click", toggleMusic);

  music?.addEventListener("ended", () => setMusicUI(false));
  music?.addEventListener("error", () => setMusicUI(false, "Add music file first"));

  // ------------------------------------------
  // MISSING MEDIA: hide only unavailable items
  // ------------------------------------------
  document.querySelectorAll(".memory-grid img").forEach(img => {
    img.addEventListener("error", () => {
      img.closest("figure")?.classList.add("missing");
    });
  });

  const video = document.querySelector(".video-card video");
  if (video) {
    video.addEventListener("error", () => {
      const card = video.closest(".video-card");
      if (card) {
        card.classList.add("media-missing");
        video.remove();
      }
    });
  }

  // ------------------------------------------
  // INITIAL STATE
  // ------------------------------------------
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === current);
    slide.classList.remove("exit-left");
  });

  updateUI();

  // Prevent an unused timer from keeping a page alive unnecessarily
  window.addEventListener("pagehide", () => clearInterval(heartTimer));
});
