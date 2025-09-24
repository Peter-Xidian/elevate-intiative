/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.querySelector(".nav");
  const header = document.querySelector(".header");
  var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
  //When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 80) {
    nav.classList.add("active");
    header.classList.add("active");
  } else {
    nav.classList.remove("active");
    header.classList.remove("active");
  }
}

window.addEventListener("scroll", scrollHeader);

/* ------------- FAQ TOGGLE LOGIC ------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Get all FAQ containers
  const faqItems = document.querySelectorAll(".fqc");

  // Add click event listener to each FAQ item
  faqItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove 'active' class from all FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== this) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle 'active' class on clicked item
      this.classList.toggle("active");
    });
  });
});

/*==================== TOGGLE MENU MOBILE ====================*/
const navMenu = document.querySelector(".nav-menu");

function toggleMenu() {
  navMenu.classList.toggle("active");
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nml");

function linkAction() {
  const navMenu = document.querySelector(".nav-menu");
  // When we click on each nav__link, we remove the toggle-nav-menu class
  navMenu.classList.remove("active");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== SERVICES/CAUSES PAGE (TOGGLING) LOGIC ====================*/
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".slt");
  const contentItems = document.querySelectorAll(".slw");
  const slWrapper = document.querySelector(".sl-wrapper");

  // Initialize active tab
  let activeTab = "all";

  // Add click event listeners to tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Determine which content to show based on tab text
      const tabText = this.querySelector("p").textContent.trim().toLowerCase();

      if (tabText === "all causes") {
        showAllContent();
        activeTab = "all";
      } else {
        showSingleContent(tabText);
        activeTab = tabText;
      }
    });
  });

  function showAllContent() {
    // Remove active class from wrapper for single item view
    slWrapper.classList.remove("active");

    // Show all content items with default styling
    contentItems.forEach((item) => {
      item.classList.remove("active");
      item.classList.add("default");
      item.style.display = "flex";
    });
  }

  function showSingleContent(tabName) {
    // Add active class to wrapper for single item view
    slWrapper.classList.add("active");

    // Hide all content items first
    contentItems.forEach((item) => {
      item.classList.remove("active", "default");
      item.style.display = "none";
    });

    // Determine which content item to show based on tab name
    let targetIndex = 0; // Default to first item

    if (tabName.includes("economic")) {
      targetIndex = 1;
    } else if (tabName.includes("quality")) {
      targetIndex = 2;
    }

    // Show the targeted content item with active styling
    if (contentItems[targetIndex]) {
      contentItems[targetIndex].classList.add("active");
      contentItems[targetIndex].style.display = "flex";
    }
  }
});

/*==================== RECENT PROJECTS CAROUSEL LOGIC ====================*/
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-carousel]"); // your track
  if (!carousel) return;

  // original slides (before clone)
  const originals = Array.from(carousel.children);
  const originalCount = originals.length;

  // clone once for seamless looping
  originals.forEach((slide) => carousel.appendChild(slide.cloneNode(true)));

  // state
  let slides = Array.from(carousel.children); // now doubled
  let cardStep = 0; // the true distance we should translate each step
  let currentIndex = 0; // index in the track (0..)
  const TRANS_MS = 600; // transition duration in ms (keep in sync with CSS)
  let autoTimer = null;
  let resumeTimer = null;
  const AUTOPLAY_MS = 6000;
  const RESUME_AFTER_MS = 5000;

  // ---------- Utilities ----------
  function calculateCardStep() {
    // Temporarily remove transform/transition so positions are stable for measurement
    const prevTransition = carousel.style.transition;
    const prevTransform = carousel.style.transform;

    carousel.style.transition = "none";
    carousel.style.transform = "translateX(0px)";
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    carousel.offsetHeight;

    const first = carousel.children[0]?.getBoundingClientRect();
    const second = carousel.children[1]?.getBoundingClientRect();

    let step = 0;
    if (first && second) {
      step = Math.abs(second.left - first.left); // accounts for gap and rounding
    }
    if (!step) {
      // fallback
      step = first ? first.width : 0;
    }

    // restore previous transform/transition
    carousel.style.transform =
      prevTransform || `translateX(-${currentIndex * step}px)`;
    carousel.style.transition =
      prevTransition || `transform ${TRANS_MS}ms ease`;

    // round to integer to avoid fractional pixel problems
    return Math.round(step);
  }

  function updateMeasurementsAndJumpTo(index = currentIndex) {
    cardStep = calculateCardStep();
    // ensure tracked index is valid in case layout changed
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    goTo(currentIndex, false);
  }

  // ---------- Movement ----------
  function goTo(index, animate = true) {
    carousel.style.transition = animate
      ? `transform ${TRANS_MS}ms ease`
      : "none";
    carousel.style.transform = `translateX(-${index * cardStep}px)`;
  }

  function nextSlide() {
    currentIndex++;
    goTo(currentIndex, true);
    // if we've moved past the originals block, wait for transitionend to snap back
    // transitionend handler below will reset when needed
  }

  function prevSlide() {
    // If at start, jump instantly to the "cloned" second block, then move left one
    if (currentIndex === 0) {
      carousel.style.transition = "none";
      currentIndex = originalCount; // jump to clones start
      carousel.style.transform = `translateX(-${currentIndex * cardStep}px)`;
      // force reflow so next animated move is smooth
      // eslint-disable-next-line no-unused-expressions
      carousel.offsetHeight;
      // then animate one step backward
      setTimeout(() => {
        currentIndex--;
        goTo(currentIndex, true);
      }, 20);
      return;
    }
    currentIndex--;
    goTo(currentIndex, true);
  }

  // ---------- Autoplay ----------
  function startAutoplay() {
    stopAutoplay();
    autoTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }
  function pauseThenResume() {
    stopAutoplay();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoplay, RESUME_AFTER_MS);
  }

  // ---------- Event handling ----------
  // When a transform transition ends, if we've passed the originalCount boundary,
  // jump (without transition) back to the logically equivalent index to create seamless loop.
  carousel.addEventListener("transitionend", (evt) => {
    if (evt.propertyName !== "transform") return;

    // Forward wrap: if we moved into clones area beyond originalCount - 1
    if (currentIndex >= originalCount) {
      carousel.style.transition = "none";
      currentIndex = currentIndex - originalCount; // equivalent index in first set (commonly 0)
      carousel.style.transform = `translateX(-${currentIndex * cardStep}px)`;
      // force reflow then restore transition (so next animated move works)
      // eslint-disable-next-line no-unused-expressions
      carousel.offsetHeight;
      carousel.style.transition = `transform ${TRANS_MS}ms ease`;
    }
  });

  // Navigation buttons
  const prevBtn = document.getElementById("rnv-left");
  const nextBtn = document.getElementById("rnv-right");
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      stopAutoplay();
      nextSlide();
      pauseThenResume();
    });
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      stopAutoplay();
      prevSlide();
      pauseThenResume();
    });

  // ---------- Pointer (drag / swipe) ----------
  let isDragging = false;
  let startX = 0;
  let lastX = 0;

  function onPointerDown(e) {
    // only primary button or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    lastX = startX;
    stopAutoplay();
    carousel.setPointerCapture?.(e.pointerId);
    carousel.style.transition = "none";
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const cx = e.clientX;
    const delta = cx - startX;
    lastX = cx;
    const offset = -currentIndex * cardStep + delta;
    carousel.style.transform = `translateX(${offset}px)`;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const delta = lastX - startX;
    const threshold = cardStep * 0.25; // 1/4th of the step
    if (delta > threshold) {
      // swipe right -> previous
      prevSlide();
    } else if (delta < -threshold) {
      // swipe left -> next
      nextSlide();
    } else {
      // not far enough, snap back
      goTo(currentIndex, true);
    }
    pauseThenResume();
  }

  // attach pointer events (covers touch & mouse)
  carousel.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  // ---------- Resize / orientation ----------
  let resizeTimer = null;
  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateMeasurementsAndJumpTo(currentIndex % originalCount);
      // update slides array if DOM changed
      slides = Array.from(carousel.children);
    }, 120);
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);

  // ---------- Init ----------
  updateMeasurementsAndJumpTo(0);
  startAutoplay();
});

/*==================== GET INVOLVED MODAL (TOGGLING) LOGIC ====================*/
document.addEventListener("DOMContentLoaded", function () {
  // Get the necessary elements
  const giModal = document.querySelector(".gi");
  const gimCards = document.querySelector(".gim.gim-cards");
  const gimDetails = document.querySelector(".gim.gi-details");
  const firstGc = document.querySelector(".gc.donate"); // First .gc element
  const gidAction = document.querySelector(".gid-action"); // Go back button
  const giClose = document.querySelector("#gi-close");

  // Function to reset to default state
  function resetToDefaultState() {
    // Ensure cards are active and details are hidden
    gimCards.classList.add("active");
    gimDetails.classList.remove("active");
    // Close the modal
    giModal.classList.remove("active");
  }

  // Add click event to the first .gc element
  if (firstGc) {
    firstGc.addEventListener("click", function () {
      // Remove active class from cards and add to details
      gimCards.classList.remove("active");
      gimDetails.classList.add("active");
    });
  }

  // Add click event to the go back button
  if (gidAction) {
    gidAction.addEventListener("click", function () {
      // Remove active class from details and add to cards
      gimDetails.classList.remove("active");
      gimCards.classList.add("active");
    });
  }

  // Add click event to close button - reset to default state
  if (giClose) {
    giClose.addEventListener("click", resetToDefaultState);
  }

  // Optional: Also reset if user clicks outside the modal (if you have overlay)
  if (giModal) {
    giModal.addEventListener("click", function (e) {
      // If click is on the modal backdrop (not the content)
      if (e.target === giModal) {
        resetToDefaultState();
      }
    });
  }
});

function openModal() {
  const giModal = document.querySelector(".gi");
  giModal.classList.add("active");
}
