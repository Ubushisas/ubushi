"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
import Marquee from "@/components/Marquee/Marquee";
import Footer from "@/components/Footer/Footer";
import ShuffleText from "@/components/ShuffleText/ShuffleText";

import "./archive.css";
import "../../styles/original-menu.css";
import { initMenu } from "@/utils/menuScript";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const ArchivePage = () => {
  const container = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuFunctions = useRef(null);

  // Initialize the menu
  useEffect(() => {
    const menuResult = initMenu(setMenuOpen);
    menuFunctions.current = menuResult;
    return () => {
      if (typeof menuResult === 'function') {
        menuResult();
      }
    };
  }, []);

  const handleLogoClick = () => {
    if (menuFunctions.current && menuFunctions.current.forceCloseMenu) {
      menuFunctions.current.forceCloseMenu();
    }
  };

  // controls pinning of the source section
  useGSAP(
    () => {
      let pinAnimation;

      const initPinning = () => {
        if (pinAnimation) {
          pinAnimation.kill();
        }

        if (window.innerWidth > 900) {
          pinAnimation = ScrollTrigger.create({
            trigger: ".sticky-archive",
            start: "top top",
            endTrigger: ".gallery",
            end: "bottom bottom",
            pin: ".source",
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
        }
      };

      initPinning();

      const handleResize = () => {
        initPinning();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        if (pinAnimation) {
          pinAnimation.kill();
        }
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: container }
  );

  return (
    <ReactLenis root>
      {/* Menu Structure */}
      <nav>
        <div className="menu-bar">
          <div className="menu-left">
            <div className="menu-logo">
              <a href="/">
                <h3>Ubushi</h3>
              </a>
            </div>
          </div>
          <div className="menu-center">
            <div className="menu-toggle-btn">
              <div className="menu-toggle-label">
                <p>Menu</p>
              </div>
              <div className="menu-hamburger-icon">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="menu-right">
            <div className="discovery-call-btn">
              <p>Discovery Call</p>
            </div>
          </div>
        </div>

        <div className="menu-overlay">
          <div className="menu-overlay-content">
            <div className="menu-media-wrapper">
              <img src="/images/home/case-study-2.jpeg" alt="" />
            </div>
            <div className="menu-content-wrapper">
              <div className="menu-content-main">
                <div className="menu-col">
                  <div className="menu-link"><a href="#intro">Our process</a></div>
                  <div className="menu-link"><a href="#case-studies">Portfolio</a></div>
                  <div className="menu-link"><a href="#works">Services</a></div>
                  <div className="menu-link"><a href="/archive">Archive</a></div>
                  <div className="menu-link"><a href="#case-studies">Connect</a></div>
                </div>
                <div className="menu-col">
                  <div className="menu-tag"><a href="#intro">growth strategy</a></div>
                  <div className="menu-tag"><a href="#case-studies">case studies</a></div>
                  <div className="menu-tag"><a href="#works">complete solutions</a></div>
                </div>
              </div>
              <div className="menu-footer">
                <div className="menu-col">
                  <p>Global Network</p>
                </div>
                <div className="menu-col">
                  <p>+1 (555) 123-4567</p>
                  <p>hello@Ubushi.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="archive" ref={container}>
        <section className="archive-hero hero">
          <div className="container">
            <ShuffleText
              as="h1"
              text="How We Connected Music Festivals to Global Markets"
            />
            <div className="archive-hero-img-wrapper">
              <div className="archive-hero-img-wrapper-row">
                <p>●</p>
                <p>●</p>
                <p>●</p>
              </div>
              <div className="archive-hero-img-wrapper-row">
                <div className="archive-hero-img">
                  <img src="/images/carousel/carousel1.jpeg" alt="" />
                </div>
              </div>
              <div className="archive-hero-img-wrapper-row">
                <p>●</p>
                <p>●</p>
                <p>●</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky-archive">
          <div className="archive-col source">
            <div className="container">
              <div className="source-img">
                <img src="/images/home/prompt-eg-1.jpeg" alt="" />
              </div>
              <div className="source-content">
                <h4>Break Into The Global Market</h4>
              </div>
            </div>
          </div>
          <div className="archive-col gallery">
            <div className="container">
              <div className="gallery-copy">
                <p style={{color: "white"}}><strong>Deep Delay needed global expansion</strong><br/>
                Their networking efforts hit dead ends<br/><br/>

                <strong>We connected them to Fortune 500 partnerships</strong><br/>
                Took their festivals to Taiwan, Dubai & USA<br/><br/>

                <strong>Result: $100,000+ additional revenue</strong><br/>
                Plus exclusive benefits and sponsorship deals</p>
                <div className="gallery-images-container">
                  <div className="gallery-row main-img">
                    <img src="/images/home/prompt-eg-2.jpeg" alt="" />
                  </div>
                  <div className="gallery-row sub-images">
                    <div className="sub-images-col">
                      <img src="/images/home/prompt-1.jpeg" alt="" />
                    </div>
                    <div className="sub-images-col">
                      <img src="/images/home/prompt-2.jpeg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="next-archive">
          <div className="next-archive-bg"></div>
          <div className="marquee-archive">
            <Marquee />
          </div>
          <div className="container">
            <p className="primary">[ Next Success Story ]</p>
            <div className="next-archive-img">
              <img src="/images/carousel/carousel2.jpeg" alt="" />
            </div>
            <h2>Your International Breakthrough Awaits</h2>
          </div>
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default ArchivePage;
