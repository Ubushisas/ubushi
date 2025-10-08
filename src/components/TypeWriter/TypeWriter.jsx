"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const TypeWriter = ({ text, className = "", speed = 30 }) => {
  const containerRef = useRef(null);
  const [displayText, setDisplayText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Only enable typewriter on mobile (not tablet/desktop)
      setIsMobile(window.innerWidth < 769);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      // Show full text immediately on desktop
      setDisplayText(text);
      return;
    }

    // Mobile typewriter effect with smooth scroll-based progress
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom-=200",
      end: "bottom top+=200",
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = self.progress;
        const charCount = Math.floor(progress * text.length);
        setDisplayText(text.substring(0, charCount));
      },
      onLeave: () => {
        setDisplayText(text);
      },
      onLeaveBack: () => {
        setDisplayText(text);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [text, isMobile]);

  return (
    <p
      ref={containerRef}
      className={`primary ${className}`.trim()}
      style={{ minHeight: isMobile ? '1.75rem' : 'auto' }}
    >
      {displayText || '\u00A0'}
    </p>
  );
};

export default TypeWriter;
