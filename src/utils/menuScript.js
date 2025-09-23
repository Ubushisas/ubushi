import { gsap } from "gsap";
import SplitType from "split-type";

// Custom hop easing function - exact from original
const hopEasing = (t) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

let isMenuOpen = false;
let isAnimating = false;
let splitTextByContainer = [];

export const initMenu = (onMenuStateChange) => {
  const heroSection = document.querySelector(".hero");
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuOverlayContainer = document.querySelector(".menu-overlay-content");
  const menuMediaWrapper = document.querySelector(".menu-media-wrapper");
  const copyContainers = document.querySelectorAll(".menu-col");
  const menuToggleLabel = document.querySelector(".menu-toggle-label p");
  const hamburgerIcon = document.querySelector(".menu-hamburger-icon");

  if (!heroSection || !menuToggleBtn || !menuOverlay) {
    console.warn("Menu elements not found");
    return;
  }

  // Force reset menu state on initialization
  const resetMenuState = () => {
    isMenuOpen = false;
    isAnimating = false;

    // Reset all menu styles immediately
    if (heroSection) {
      gsap.set(heroSection, { y: "0svh" });
    }
    if (menuOverlay) {
      gsap.set(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      });
    }
    if (menuOverlayContainer) {
      gsap.set(menuOverlayContainer, { yPercent: -50 });
    }
    if (menuToggleLabel) {
      gsap.set(menuToggleLabel, { y: "0%" });
    }
    if (menuMediaWrapper) {
      gsap.set(menuMediaWrapper, { opacity: 0 });
    }
    if (copyContainers.length > 0) {
      gsap.set(copyContainers, { opacity: 1 });
    }
    if (hamburgerIcon) {
      hamburgerIcon.classList.remove("active");
    }

    onMenuStateChange?.(false);
  };

  // Call reset immediately
  resetMenuState();

  // Initialize split text exactly like original
  const textContainers = document.querySelectorAll(".menu-col");
  splitTextByContainer = [];

  textContainers.forEach((container) => {
    const textElements = container.querySelectorAll("a, p");
    let containerSplits = [];

    textElements.forEach((element) => {
      const split = new SplitType(element, {
        types: "lines",
      });
      containerSplits.push(split);

      gsap.set(split.lines, { y: "-110%" });
    });

    splitTextByContainer.push(containerSplits);
  });

  const openMenu = () => {
    if (isAnimating || isMenuOpen) return;

    isAnimating = true;
    isMenuOpen = true;
    onMenuStateChange?.(true);

    // Disable Lenis scrolling when menu opens
    if (window.lenis) {
      window.lenis.stop();
    }

    const tl = gsap.timeline();

    tl.to(
      menuToggleLabel,
      {
        y: "-110%",
        duration: 1,
        ease: hopEasing,
      },
      "<"
    )
    .to(
      heroSection,
      {
        y: "100svh",
        duration: 1,
        ease: hopEasing,
      },
      "<"
    )
    .to(
      menuOverlay,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: hopEasing,
      },
      "<"
    )
    .to(
      menuOverlayContainer,
      {
        yPercent: 0,
        duration: 1,
        ease: hopEasing,
      },
      "<"
    )
    .to(
      menuMediaWrapper,
      {
        opacity: 1,
        duration: 0.75,
        ease: "power2.out",
        delay: 0.5,
      },
      "<"
    );

    splitTextByContainer.forEach((containerSplits) => {
      const copyLines = containerSplits.flatMap((split) => split.lines);
      tl.to(
        copyLines,
        {
          y: "0%",
          duration: 2,
          ease: hopEasing,
          stagger: -0.075,
        },
        -0.15
      );
    });

    hamburgerIcon.classList.add("active");

    tl.call(() => {
      isAnimating = false;
    });
  };

  const closeMenu = () => {
    if (isAnimating || !isMenuOpen) return;

    isAnimating = true;
    isMenuOpen = false;
    onMenuStateChange?.(false);

    hamburgerIcon.classList.remove("active");
    const tl = gsap.timeline();

    tl.to(heroSection, {
      y: "0svh",
      duration: 1,
      ease: hopEasing,
    })
    .to(
      menuOverlay,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: hopEasing,
      },
      "<"
    )
    .to(
      menuOverlayContainer,
      {
        yPercent: -50,
        duration: 1,
        ease: hopEasing,
      },
      "<"
    )
    .to(
      menuToggleLabel,
      {
        y: "0%",
        duration: 1,
        ease: hopEasing,
      },
      "<"
    )
    .to(
      copyContainers,
      {
        opacity: 0.25,
        duration: 1,
        ease: hopEasing,
      },
      "<"
    );

    tl.call(() => {
      splitTextByContainer.forEach((containerSplits) => {
        const copyLines = containerSplits.flatMap((split) => split.lines);
        gsap.set(copyLines, { y: "-110%" });
      });

      gsap.set(copyContainers, { opacity: 1 });
      gsap.set(menuMediaWrapper, { opacity: 0 });

      // Re-enable Lenis scrolling when menu closes
      if (window.lenis) {
        window.lenis.start();
      }

      isAnimating = false;
    });
  };

  // Event listener
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", () => {
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Force close menu function
  const forceCloseMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    }
  };

  return { openMenu, closeMenu, forceCloseMenu, resetMenuState, isMenuOpen: () => isMenuOpen };
};