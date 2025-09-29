"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { MdArrowOutward } from "react-icons/md";
import Marquee from "@/components/Marquee/Marquee";
import Footer from "@/components/Footer/Footer";
import ShuffleText from "@/components/ShuffleText/ShuffleText";
import GeometricBackground from "@/components/GeometricBackground/GeometricBackground";
import { carouselItems } from "./carouselItems";
import { initMenu } from "@/utils/menuScript";

import "./home.css";
import "../styles/original-menu.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef();
  const heroVideoRef = useRef();
  const heroSectionRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuImage, setMenuImage] = useState("/images/home/Menu-picture.jpg");
  const [imageOpacity, setImageOpacity] = useState(1);

  // initialize Lenis smooth scrolling instance on window
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      window.lenis = lenis;
    }

    return () => {
      window.lenis = null;
    };
  }, [lenis]);

  // Initialize the original menu
  useEffect(() => {
    const cleanup = initMenu(setMenuOpen);
    return cleanup;
  }, []);

  // Scroll-controlled hero video
  useGSAP(
    () => {
      const video = heroVideoRef.current;
      const heroSection = heroSectionRef.current;

      if (!video || !heroSection) return;

      let scrollTriggerInstance;

      const initVideoScroll = () => {
        const videoDuration = video.duration;

        // Calculate scroll distance - about 300px per second of video
        const scrollDistance = videoDuration * 300;

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            if (video.duration && !isNaN(video.duration)) {
              const newTime = progress * videoDuration;
              if (Math.abs(video.currentTime - newTime) > 0.01) {
                video.currentTime = newTime;
              }
            }
          },
          onComplete: () => {
            // Video finished, continue scrolling normally
            if (video.duration && !isNaN(video.duration)) {
              video.currentTime = video.duration - 0.01;
            }
          }
        });

        // Refresh all ScrollTriggers after adding the video one
        setTimeout(() => {
          ScrollTrigger.refresh();
          ScrollTrigger.sort();
        }, 100);
      };

      // Wait for video to load
      if (video.readyState >= 1) {
        initVideoScroll();
      } else {
        const handleLoadedMetadata = () => {
          initVideoScroll();
        };
        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
          }
        };
      }
    },
    { dependencies: [] }
  );

  // Image loop effect for menu with fade transition
  useEffect(() => {
    if (menuOpen) {
      const interval = setInterval(() => {
        // Fade out
        setImageOpacity(0);

        setTimeout(() => {
          // Change image
          setMenuImage(prev =>
            prev === "/images/home/Menu-picture.jpg"
              ? "/images/home/Menu-picture2.jpg"
              : "/images/home/Menu-picture.jpg"
          );
          // Fade in
          setImageOpacity(1);
        }, 1200);
      }, 7000);

      return () => clearInterval(interval);
    } else {
      // Reset when menu closes
      setImageOpacity(1);
      setMenuImage("/images/home/Menu-picture.jpg");
    }
  }, [menuOpen]);

  // controls geometric background animation on scroll
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ".intro",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const yMove = -750 * progress;
          const rotation = 360 * progress;

          gsap.to(".geo-bg", {
            y: yMove,
            rotation: rotation,
            transformOrigin: "center center",
            duration: 0.1,
            ease: "none",
            overwrite: true,
          });
        },
      });

      // Video autoplay on scroll
      const video = document.querySelector('[data-autoplay-on-scroll]');
      if (video) {
        ScrollTrigger.create({
          trigger: video,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => video.play(),
          onLeave: () => video.pause(),
          onEnterBack: () => video.play(),
          onLeaveBack: () => video.pause(),
        });
      }

      // Refresh ScrollTrigger after DOM changes
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles case studies image pinning and scale animations on scroll
  useGSAP(
    () => {
      const images = gsap.utils.toArray(".case-studies-img");

      images.forEach((img, i) => {
        const imgElement = img.querySelector("img");

        ScrollTrigger.create({
          trigger: img,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            gsap.to(imgElement, {
              scale: 2 - self.progress,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        ScrollTrigger.create({
          trigger: img,
          start: "top top",
          end: () =>
            `+=${
              document.querySelector(".case-studies-item").offsetHeight *
              (images.length - i - 1)
            }`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles carousel slide transitions with clip-path animations
  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const projects = gsap.utils.toArray(".project");

      ScrollTrigger.create({
        trigger: ".carousel",
        start: "top top",
        end: `+=${window.innerHeight * (projects.length - 1)}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress * (projects.length - 1);
          const currentSlide = Math.floor(progress);
          const slideProgress = progress - currentSlide;

          if (currentSlide < projects.length - 1) {
            gsap.set(projects[currentSlide], {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            });

            const nextSlideProgress = gsap.utils.interpolate(
              "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              slideProgress
            );

            gsap.set(projects[currentSlide + 1], {
              clipPath: nextSlideProgress,
            });
          }

          projects.forEach((project, index) => {
            if (index < currentSlide) {
              gsap.set(project, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              });
            } else if (index > currentSlide + 1) {
              gsap.set(project, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              });
            }
          });
        },
      });

      gsap.set(projects[0], {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      }}
    >
      {/* Original Menu Structure */}
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
                <p>About us</p>
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
              <img
                src={menuImage}
                alt=""
                style={{
                  opacity: imageOpacity,
                  transition: 'opacity 1.2s ease-in-out, filter 0.3s ease-in-out',
                  filter: 'grayscale(100%)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.filter = 'grayscale(0%)'}
                onMouseLeave={(e) => e.target.style.filter = 'grayscale(100%)'}
              />
            </div>
            <div className="menu-content-wrapper">
              <div className="menu-content-main">
                <div className="menu-col">
                  <div className="menu-link">
                    <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                      We are Pedro and Lis. We are the founders of <strong>Ubushi</strong>.
                    </p>
                    <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                      Our mission is to help companies around the world become the main hubs for their customers—and, of course, their partners—through our <strong>Ubushi network</strong>.
                    </p>
                    <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                      Our network was built from the ground up by us. The core of this system lies in our team's expertise in setting up outbound infrastructure, optimizing workflow and creating bespoke, goal-specific promotions.
                    </p>
                    <p style={{fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic', fontWeight: 'bold'}}>
                      These strategies are entirely unique and tailored to your needs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="menu-footer">
                <div className="menu-col">
                  <p>Global Network</p>
                </div>
                <div className="menu-col">
                  <p>hello@Ubushi.com</p>
                  <p>Schedule a Discovery Call</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="app" ref={container}>
        <section className="hero" ref={heroSectionRef}>
          <div className="hero-img">
            <video
              ref={heroVideoRef}
              src="/Sphere.mp4"
              muted
              playsInline
              preload="auto"
              style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                objectPosition: 'center center',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: '#000',
                filter: 'contrast(1.05) saturate(1.1)',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0) scale(1.01)',
                willChange: 'transform'
              }}
            />
          </div>
          <div className="hero-img-gradient"></div>
          <div className="container">
            <div className="hero-copy">
              <div className="hero-copy-col">
                <h1>The Creative<br />Growth Studio</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="marquee-section" style={{
          backgroundColor: 'var(--background)',
          padding: '2em 0'
        }}>
          <Marquee />
        </section>


        <section className="intro" id="intro">
          <div className="geo-bg">
            <GeometricBackground />
          </div>
          <div className="intro-container">
            <div className="container">
              <div className="col">
                <p className="primary">[ Zero to 100 Business Growth ]</p>
              </div>
              <div className="col">
                <div className="intro-copy">
                  <p>
                    Ubushi partners with ambitious businesses ready for measurable growth. From startups needing their first professional website to established companies seeking $250,000 sponsorship deals and international expansion—we're the strategic partner that delivers results.
                  </p>
                  <p>
                    We don't just build websites - we architect complete growth systems. Our clients gain access to Taiwan, Dubai & USA markets, secure Fortune 500 investment connections, and unlock $100,000+ in additional revenue. Your transformation starts here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case-studies" id="case-studies">
          <div className="case-studies-header">
            <div className="container">
              <ShuffleText
                as="h2"
                text="Website Design Portfolio"
                triggerOnScroll={true}
              />
            </div>
          </div>
          <div className="case-studies-content">
            <div className="container">
              <div className="col">
                <p className="primary">[ Recent Projects ]</p>
              </div>
              <div className="col">
                <div className="case-studies-copy">
                  <h2>How Do We Scale Businesses From Zero to 100?</h2>
                  <p>
                    We establish your digital foundation with conversion-focused websites that position you as an industry leader. Then, we unlock doors to international markets and Fortune 500 partnerships. Real results: $360,000+ in value delivered, from worldwide expansion to Fortune 500 connections. Your success story is next.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case-studies-items">
          <div className="case-studies-items-content col">
            <div className="case-studies-item case-studies-item-1">
              <div className="container">
                <h3>International Festival Expansion</h3>
                <p className="primary">[ Entertainment Client — Global Market Access ]</p>
                <div className="case-studies-item-inner-img">
                  <img
                    src="/images/home/DeepDelay.jpg"
                    alt="Festival crowd enjoying live music and entertainment"
                  />
                </div>
                <p>
                  Deep Delay Management needed access to investors and elite partnerships in tech and entertainment. Ubushi connected them with top entertainment investors such as KKR and Superstruct, while also facilitating partnerships with Jim Beam, Google, Kia, Kawasaki, and more. Your access to investors awaits.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href="/archive">Discover the Journey</Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="case-studies-item case-studies-item-2">
              <div className="container">
                <h3>Cenproforest — Industry Authority Transformation</h3>
                <p className="primary">[ Forest Services — Digital Catalog & Authority Positioning ]</p>
                <div className="case-studies-item-inner-img">
                  <img
                    src="/images/home/Cenproforest.jpg"
                    alt="Cenproforest industry authority showcase"
                  />
                </div>
                <p>
                  Forest services company Cenproforest needed a digital presence that matched their expertise and positioned them for high-value projects. Ubushi created a comprehensive catalog redesign and website transformation that established them as the go-to choice in their industry. The result: a professional foundation that opens doors to enterprise clients and premium partnerships. Your industry authority awaits.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href="/archive">See Authority Transformation</Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className="case-studies-item case-studies-item-3">
              <div className="container">
                <h3>Cultivart — European Cannabis Market Access</h3>
                <p className="primary">
                  [ Cannabis Company — European Distribution Network ]
                </p>
                <div className="case-studies-item-inner-img">
                  <img
                    src="/images/home/Cultivart.jpg"
                    alt="Cultivart European cannabis distribution network"
                  />
                </div>
                <p>
                  Colombian cannabis company Cultivart faced the complex challenge of entering Europe's regulated CBD and THC markets without established connections. Operating in one of the industry's most challenging regulatory environments, they lacked a client pipeline and distribution network. Ubushi architected strategic introductions to premium European resellers, navigating compliance frameworks and building trust with key distributors across multiple markets. Your breakthrough is next.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href="/archive">View Market Entry Strategy</Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="case-studies-items-images col">
            <div className="case-studies-img case-studies-img-1">
              <img src="/images/home/DeepDelay.jpg" alt="Festival crowd enjoying live music and entertainment" />
              <div className="hero-img-overlay"></div>
            </div>
            <div className="case-studies-img case-studies-img-2">
              <img src="/images/home/Cenproforest.jpg" alt="" />
              <div className="hero-img-overlay"></div>
            </div>
            <div className="case-studies-img case-studies-img-3">
              <img src="/images/home/Cultivart.jpg" alt="" />
              <div className="hero-img-overlay"></div>
            </div>
          </div>
        </section>

        <section className="abstract-bg">
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
        </section>

        <section className="works" id="works">
          <div className="works-header">
            <div className="container">
              <ShuffleText
                as="h2"
                text="Complete Growth Architecture"
                triggerOnScroll={true}
              />
            </div>
          </div>

          <div className="works-content">
            <div className="container">
              <div className="col">
                <p className="primary">[ Growth Solutions ]</p>
              </div>
              <div className="col">
                <div className="works-copy">
                  <h2>Why Choose Ubushi For Your Growth Journey?</h2>
                  <p>
                    From launching your first professional website to securing $250,000 sponsorship deals and Fortune 500 connections, we're your complete growth partner. Our clients unlock Taiwan, Dubai & USA markets, gain KKR investment access, and generate $100,000+ additional revenue. Your breakthrough awaits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="carousel">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              id={`project-${item.id}`}
              className="project"
              style={{
                clipPath:
                  item.id === "01"
                    ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
                    : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              }}
            >
              <div className="project-bg">
                <img src={item.bg} alt="" />

                <div className="hero-img-overlay"></div>
                <div className="hero-img-gradient"></div>
              </div>
              <div className="project-main">
                <img src={item.main} alt="" />
              </div>
              <div className="project-header">
                <div className="project-id">
                  <h2>Case Study {item.id}</h2>
                </div>
                <div className="project-whitespace"></div>
                <div className="project-title">
                  <h2>{item.title}</h2>
                </div>
              </div>
              <div className="project-info">
                <div className="project-url">
                  <Link href={item.url}></Link>
                </div>
              </div>
              <Link
                href={item.url}
                className="project-overlay-link"
                aria-label={`View ${item.title} project`}
              />
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
}