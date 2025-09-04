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

/*==================== RECENT PROJECTS CAROUSEL LOGIC ====================*/
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-carousel]");
  const cards = [...carousel.children];
  const prevBtn = document.getElementById("rnv-left");
  const nextBtn = document.getElementById("rnv-right");

  // ✅ Duplicate cards for infinite effect
  carousel.append(...cards.map((card) => card.cloneNode(true)));

  let cardWidth = cards[0].offsetWidth + 12; // includes gap
  let currentIndex = 0;
  let autoSlide;
  let userInteracted = false;

  // --- Helpers ---
  function goToSlide(index, animate = true) {
    if (!animate) {
      carousel.style.transition = "none";
    } else {
      carousel.style.transition = "transform 0.6s ease";
    }
    carousel.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  function nextSlide() {
    currentIndex++;
    goToSlide(currentIndex);

    if (currentIndex >= cards.length) {
      setTimeout(() => {
        currentIndex = 0;
        goToSlide(currentIndex, false);
      }, 600);
    }
  }

  function prevSlide() {
    if (currentIndex === 0) {
      currentIndex = cards.length;
      goToSlide(currentIndex, false);
    }
    setTimeout(() => {
      currentIndex--;
      goToSlide(currentIndex);
    }, 20);
  }

  function startAutoPlay() {
    autoSlide = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoSlide);
  }

  function userInteraction(action) {
    stopAutoPlay();
    action();
    if (userInteracted) clearTimeout(userInteracted);
    userInteracted = setTimeout(startAutoPlay, 5000);
  }

  // --- Navigation ---
  nextBtn.addEventListener("click", () => userInteraction(nextSlide));
  prevBtn.addEventListener("click", () => userInteraction(prevSlide));

  // --- Drag/Swipe Support ---
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function onDragStart(e) {
    stopAutoPlay();
    isDragging = true;
    startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    carousel.style.transition = "none"; // stop transition while dragging
  }

  function onDragMove(e) {
    if (!isDragging) return;
    currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const delta = currentX - startX;
    const offset = -currentIndex * cardWidth + delta;
    carousel.style.transform = `translateX(${offset}px)`;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const delta = currentX - startX;

    // threshold: 1/4 of card width
    if (delta > cardWidth / 4) {
      prevSlide();
    } else if (delta < -cardWidth / 4) {
      nextSlide();
    } else {
      goToSlide(currentIndex);
    }

    // resume autoplay after delay
    if (userInteracted) clearTimeout(userInteracted);
    userInteracted = setTimeout(startAutoPlay, 5000);
  }

  // Mouse events
  carousel.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  // Touch events
  carousel.addEventListener("touchstart", onDragStart);
  window.addEventListener("touchmove", onDragMove);
  window.addEventListener("touchend", onDragEnd);

  // --- Resize handling ---
  window.addEventListener("resize", () => {
    cardWidth = cards[0].offsetWidth + 12;
    goToSlide(currentIndex, false);
  });

  // Init
  goToSlide(0, false);
  startAutoPlay();
});
