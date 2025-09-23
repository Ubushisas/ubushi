"use client";

import { useState, useRef, useEffect } from "react";
import { MdClosedCaption, MdClosedCaptionOff } from "react-icons/md";
import "./VideoPlayer.css";

export default function VideoPlayer({ src, poster, className, style, ...props }) {
  const [showSubtitles, setShowSubtitles] = useState(false);
  const videoRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;

    if (video && track) {
      track.mode = showSubtitles ? "showing" : "hidden";
    }
  }, [showSubtitles]);

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  return (
    <div className="video-player-container" {...(props['data-autoplay-on-scroll'] ? { 'data-autoplay-on-scroll': true } : {})}>
      <video
        ref={videoRef}
        className={className}
        style={style}
        {...props}
      >
        <track
          ref={trackRef}
          kind="subtitles"
          src="/captions.vtt"
          srcLang="en"
          label="English"
          default
        />
      </video>

      <div className="video-controls">
        <button
          className={`cc-button ${showSubtitles ? 'active' : ''}`}
          onClick={toggleSubtitles}
          aria-label={showSubtitles ? "Hide subtitles" : "Show subtitles"}
        >
          {showSubtitles ? <MdClosedCaption size={24} /> : <MdClosedCaptionOff size={24} />}
        </button>
      </div>
    </div>
  );
}