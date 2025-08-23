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

/* ------------- LOADER MODAL && HERO [SCATTERED FLOATING IMAGE LAYOUT] ------------- */
function animateFloatingImages() {
  const images = document.querySelectorAll(".hm-img");

  images.forEach((img, index) => {
    img.style.opacity = 0;
    img.style.transform = "scale(0.8)";
    img.style.animation = "none";
    void img.offsetWidth;

    setTimeout(() => {
      img.style.opacity = 1;
      img.style.transform = "scale(1)";
      img.style.animation = `floatWavy ${
        8 + Math.random() * 5
      }s ease-in-out infinite alternate`;
    }, index * 300 + Math.random() * 300);
  });
}

// Handle loader modal logic
function handleLoaderModal() {
  const modal = document.querySelector(".lm");
  const logo = document.querySelector(".lmdi-img");
  const button = document.querySelector(".lmd-btn");

  const hasVisited = sessionStorage.getItem("hasVisited");

  if (hasVisited) {
    // User already visited
    modal.style.display = "none";
    animateFloatingImages(); // Start images immediately
  } else {
    // First time visitor
    logo.style.opacity = 0;
    button.style.opacity = 0;
    modal.style.display = "flex";

    // Fade in logo
    setTimeout(() => {
      logo.style.transition = "opacity 1s ease";
      logo.style.opacity = 1;

      // After logo fades in, fade in button
      setTimeout(() => {
        button.style.transition = "opacity 1s ease";
        button.style.opacity = 1;
      }, 2000); // 2 seconds after logo fully shown
    }, 500); // 0.5s slight delay on page load

    button.addEventListener("click", () => {
      // Fade out modal
      modal.style.transition = "opacity 1s ease";
      modal.style.opacity = 0;

      // After fade out ends, hide modal and start animations
      setTimeout(() => {
        modal.style.display = "none";
        sessionStorage.setItem("hasVisited", "true"); // Set session flag
        animateFloatingImages();
      }, 1000); // Match fade out time
    });
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  handleLoaderModal();
});

// Re-run image animations smoothly on window resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    animateFloatingImages();
  }, 500);
});

const isSmallScreen = window.innerWidth <= 500;

img.style.animation = `floatWavy ${
  isSmallScreen ? "8s" : "5s"
} ease-in-out infinite`;
