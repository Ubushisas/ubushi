"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollVideo.css";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideo() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    let scrollTriggerInstance;

    // Function to initialize ScrollTrigger
    const initScrollTrigger = () => {
      const videoDuration = video.duration;

      // Calculate the scroll distance based on video duration
      // Approximately 500px of scroll per second of video
      const scrollDistance = videoDuration * 500;

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;

          // Update video time based on scroll progress
          if (video.duration && !isNaN(video.duration)) {
            const newTime = progress * videoDuration;
            if (Math.abs(video.currentTime - newTime) > 0.01) {
              video.currentTime = newTime;
            }
          }

          // Hide scroll indicator after initial scroll
          if (progress > 0.02 && !scrolled) {
            setScrolled(true);
          }
        },
        onLeave: () => {
          // When scroll leaves the video section, ensure it's at the end
          if (video.duration && !isNaN(video.duration)) {
            video.currentTime = video.duration - 0.01;
          }
        },
        onEnterBack: () => {
          // Show scroll indicator when scrolling back to top
          setScrolled(false);
        }
      });
    };

    // Wait for video metadata to load
    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
      initScrollTrigger();
    };

    if (video.readyState >= 1) {
      // Video metadata already loaded
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Cleanup
    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [scrolled]);

  return (
    <div ref={containerRef} className={`scroll-video-container ${scrolled ? 'scrolled' : ''}`}>
      <video
        ref={videoRef}
        className="scroll-video"
        src="/videos/Sphere.mp4"
        playsInline
        muted
        preload="auto"
      />
      <div className="scroll-indicator">
        <span>Scroll to play</span>
        <div className="scroll-arrow">↓</div>
      </div>
      {!isVideoLoaded && (
        <div className="video-loading">
          <span>Loading video...</span>
        </div>
      )}
    </div>
  );
}