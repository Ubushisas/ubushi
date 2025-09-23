"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

const MagicalMenu = ({ isOpen, onClose }) => {
  const menuRef = useRef();
  const overlayRef = useRef();
  const itemsRef = useRef([]);

  // Custom easing function
  const hopEasing = (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  const menuItems = [
    { text: "Our Process", href: "#intro" },
    { text: "Portfolio", href: "#case-studies" },
    { text: "Services", href: "#works" },
    { text: "Archive", href: "/archive" },
    { text: "Business Growth", href: "#intro" },
    { text: "International Markets", href: "#case-studies" },
    { text: "Fortune 500 Connections", href: "#works" },
  ];

  useEffect(() => {
    const overlay = overlayRef.current;
    const menu = menuRef.current;

    if (!overlay || !menu) return;

    if (isOpen) {
      // Show overlay with clip-path animation - no app transforms!
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(
        overlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: hopEasing,
        }
      );

      // Animate menu items
      const items = itemsRef.current.filter(Boolean);
      gsap.fromTo(
        items,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.3,
          ease: hopEasing,
        }
      );

      // Split text animation for each item
      items.forEach((item, index) => {
        setTimeout(() => {
          if (item.querySelector("a")) {
            const splitText = new SplitType(item.querySelector("a"), {
              types: "lines",
            });

            gsap.fromTo(
              splitText.lines,
              { y: 100, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.05,
                ease: hopEasing,
              }
            );
          }
        }, index * 100);
      });
    } else {
      // Hide overlay
      gsap.to(overlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.8,
        ease: hopEasing,
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  const handleItemClick = (href) => {
    if (href.startsWith("#")) {
      // Handle smooth scroll for anchors
      const lenis = window.lenis;
      if (lenis) {
        const element = document.getElementById(href.substring(1));
        if (element) {
          lenis.scrollTo(element, {
            offset: 0,
            immediate: false,
            duration: 1.5,
          });
        }
      }
    } else {
      // Handle regular navigation
      window.location.href = href;
    }
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="magical-menu-overlay"
      style={{ display: "none" }}
    >
      <div ref={menuRef} className="magical-menu">
        <div className="magical-menu-header">
          <div className="magical-menu-close" onClick={onClose}>
            <span>✕</span>
          </div>
        </div>

        <div className="magical-menu-content">
          <div className="magical-menu-items">
            {menuItems.map((item, index) => (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className="magical-menu-item"
                onClick={() => handleItemClick(item.href)}
              >
                <a href={item.href}>{item.text}</a>
              </div>
            ))}
          </div>

          <div className="magical-menu-contact">
            <div
              ref={(el) => (itemsRef.current[menuItems.length] = el)}
              className="magical-menu-item"
            >
              <a href="mailto:hello@ubushi.com">hello@ubushi.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicalMenu;