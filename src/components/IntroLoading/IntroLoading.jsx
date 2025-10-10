"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./IntroLoading.css";

export default function IntroLoading() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef();
  const sectionRef = useRef();

  useEffect(() => {
    // GSAP animation timeline - Smooth and optimized
    let tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        // After loading animation, show video
        setShowVideo(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.log("Video play failed:", err);
            });
          }
        }, 100);
      }
    });

    // Smooth column slide
    tl.to(".intro-col", {
      top: "0",
      duration: 2,
      ease: "power3.inOut"
    });

    // Staggered items - smooth
    tl.to(".intro-c-1 .intro-item", {
      top: "0",
      stagger: 0.15,
      duration: 2,
      ease: "power3.inOut"
    }, "-=1.3");

    tl.to(".intro-c-2 .intro-item", {
      top: "0",
      stagger: -0.15,
      duration: 2,
      ease: "power3.inOut"
    }, "-=2.8");

    tl.to(".intro-c-3 .intro-item", {
      top: "0",
      stagger: 0.15,
      duration: 2,
      ease: "power3.inOut"
    }, "-=2.8");

    tl.to(".intro-c-4 .intro-item", {
      top: "0",
      stagger: -0.15,
      duration: 2,
      ease: "power3.inOut"
    }, "-=2.8");

    tl.to(".intro-c-5 .intro-item", {
      top: "0",
      stagger: 0.15,
      duration: 2,
      ease: "power3.inOut"
    }, "-=2.8");

    // Smooth zoom with fade - overlapped for seamless transition
    tl.to(".intro-loading-container", {
      scale: 6,
      duration: 2,
      ease: "power3.in"
    }, "-=0.8");

    // Fade out overlaps with zoom for smooth transition
    tl.to(".intro-loading-container", {
      opacity: 0,
      duration: 1,
      ease: "power2.in"
    }, "-=1.2");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="intro-loading-section">
      <div className="intro-loading-container">
        <div className="intro-col intro-c-1">
          <div className="intro-item"><img src="/assets/Intro_pictures/1..jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/2.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/3.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/4.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/5.jpg" alt="" /></div>
        </div>
        <div className="intro-col intro-c-2">
          <div className="intro-item"><img src="/assets/Intro_pictures/6.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/7.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/8.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/9.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/10.jpg" alt="" /></div>
        </div>
        <div className="intro-col intro-c-3">
          <div className="intro-item"><img src="/assets/Intro_pictures/11.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/12.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/intro-frame.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/13.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/14.jpg" alt="" /></div>
        </div>
        <div className="intro-col intro-c-4">
          <div className="intro-item"><img src="/assets/Intro_pictures/15.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/1..jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/6.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/2.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/7.jpg" alt="" /></div>
        </div>
        <div className="intro-col intro-c-5">
          <div className="intro-item"><img src="/assets/Intro_pictures/3.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/8.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/4.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/9.jpg" alt="" /></div>
          <div className="intro-item"><img src="/assets/Intro_pictures/5.jpg" alt="" /></div>
        </div>
      </div>

      {/* Video intro */}
      <div className={`intro-video-wrapper ${showVideo ? 'show' : ''}`}>
        <video
          ref={videoRef}
          className="intro-video"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/assets/Intro_pictures/INTRO.mp4" type="video/mp4" />
        </video>

        {/* Keep scrolling indicator */}
        <div className="scroll-indicator">
          <p>Keep scrolling</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
