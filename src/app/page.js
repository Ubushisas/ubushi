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
import TypeWriter from "@/components/TypeWriter/TypeWriter";
import GeometricBackground from "@/components/GeometricBackground/GeometricBackground";
import { carouselItems } from "./carouselItems";
import { initMenu } from "@/utils/menuScript";

import "./home.css";
import "./mobile.css";
import "./tablet.css";
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

    // Multiple refresh calls to ensure all animations work
    const refresh1 = setTimeout(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.sort();
    }, 500);

    const refresh2 = setTimeout(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.sort();
    }, 1000);

    const refresh3 = setTimeout(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.sort();
    }, 2000);

    return () => {
      clearTimeout(refresh1);
      clearTimeout(refresh2);
      clearTimeout(refresh3);
      cleanup();
    };
  }, []);

  // Auto-scroll on page load to show sphere animation
  useEffect(() => {
    const performAutoScroll = () => {
      const video = heroVideoRef.current;
      if (video && video.duration) {
        // Calculate exact scroll distance for 75% of video (150/200 frames)
        // Video scroll distance = duration * 300 (from ScrollTrigger setup)
        const totalScrollDistance = video.duration * 300;
        const scrollTo75Percent = totalScrollDistance * 0.75;

        if (window.lenis) {
          window.lenis.scrollTo(scrollTo75Percent, {
            duration: 3.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          // Fallback for regular scroll
          window.scrollTo({
            top: scrollTo75Percent,
            behavior: 'smooth'
          });
        }
      } else {
        // Fallback if video not ready - retry after short delay
        setTimeout(performAutoScroll, 500);
      }
    };

    // Start immediately, no delay
    const timer = setTimeout(performAutoScroll, 100);

    return () => clearTimeout(timer);
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

  // controls geometric background animation on scroll (all devices)
  useGSAP(
    () => {
      const isMobile = window.innerWidth <= 768;

      ScrollTrigger.create({
        trigger: ".intro",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const yMove = isMobile ? -400 * progress : -750 * progress;
          const rotation = isMobile ? 180 * progress : 360 * progress;
          const scale = isMobile ? 1 + (0.5 * progress) : 1;

          gsap.to(".geo-bg", {
            y: yMove,
            rotation: rotation,
            scale: scale,
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

      // Add parallax effect and fade-in animations on mobile
      if (isMobile) {
        // Parallax effect for sections
        gsap.utils.toArray("section").forEach((section, i) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              gsap.to(section, {
                y: self.progress * -20,
                duration: 0.1,
                ease: "none",
                overwrite: "auto",
              });
            },
          });
        });

        // Fade-in animations for content
        gsap.utils.toArray(".intro-copy p, .case-studies-copy p, .works-copy p").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => {
              gsap.fromTo(el,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
              );
            },
          });
        });

        // Animate headings on mobile
        gsap.utils.toArray("h2, h3").forEach((heading) => {
          ScrollTrigger.create({
            trigger: heading,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.fromTo(heading,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
              );
            },
          });
        });
      }

      // Refresh ScrollTrigger after DOM changes
      setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.sort();
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
      const isMobile = window.innerWidth <= 768;

      // Wait for images to be in DOM
      const initCaseStudiesAnimations = () => {
        const images = gsap.utils.toArray(".case-studies-img");

        if (images.length === 0) {
          // Try again if images not found
          setTimeout(initCaseStudiesAnimations, 100);
          return;
        }

        images.forEach((img, i) => {
          const imgElement = img.querySelector("img");

          if (!imgElement) return;

          // Scale animation - subtle zoom from 1 to 1.2
          ScrollTrigger.create({
            trigger: img,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
              gsap.to(imgElement, {
                scale: 1 + (self.progress * 0.2),
                duration: 0.1,
                ease: "none",
                overwrite: true,
              });
            },
          });

          // Pin animation (disable on mobile for better performance)
          if (!isMobile) {
            ScrollTrigger.create({
              trigger: img,
              start: "top top",
              end: () => {
                const item = document.querySelector(".case-studies-item");
                if (!item) return "+=100vh";
                return `+=${item.offsetHeight * (images.length - i - 1)}`;
              },
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
            });
          }
        });

        // Force refresh after setup
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      };

      // Initialize animations
      initCaseStudiesAnimations();

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles strip lines animation in abstract section (all devices)
  useGSAP(
    () => {
      const strips = gsap.utils.toArray(".strip");
      const isMobile = window.innerWidth <= 768;

      strips.forEach((strip, i) => {
        ScrollTrigger.create({
          trigger: strip,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            if (isMobile) {
              // Mobile animation - horizontal scaling like desktop
              gsap.to(strip, {
                scaleX: 0.3 + (progress * 0.7),
                translateX: (i % 2 === 0 ? -50 : 50) * (1 - progress),
                duration: 0.1,
                ease: "none",
                overwrite: true,
              });
            } else {
              // Desktop animation - horizontal scaling
              gsap.to(strip, {
                scaleX: 0.5 + (progress * 0.5),
                duration: 0.1,
                ease: "none",
                overwrite: true,
              });
            }
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles logo and button color animation based on background changes
  useGSAP(
    () => {
      const logo = document.querySelector(".menu-logo h3");
      const button = document.querySelector(".discovery-call-btn");
      const buttonText = document.querySelector(".discovery-call-btn p");
      if (!logo) return;

      // Logo color change for works section
      ScrollTrigger.create({
        trigger: ".works",
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(logo, {
            color: "#ffffff",
            duration: 0.3,
            ease: "power2.out",
          });
        },
        onLeave: () => {
          gsap.to(logo, {
            color: "#ffffff",
            duration: 0.3,
            ease: "power2.out",
          });
        },
        onEnterBack: () => {
          gsap.to(logo, {
            color: "#ffffff",
            duration: 0.3,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(logo, {
            color: "#000000",
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });

      // Button color change for works section
      if (button && buttonText) {
        ScrollTrigger.create({
          trigger: ".works",
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            gsap.to(button, {
              backgroundColor: "#ffffff",
              borderColor: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
          },
          onLeave: () => {
            gsap.to(button, {
              backgroundColor: "#ffffff",
              borderColor: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
          },
          onEnterBack: () => {
            gsap.to(button, {
              backgroundColor: "#ffffff",
              borderColor: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
          },
          onLeaveBack: () => {
            gsap.to(button, {
              backgroundColor: "#000000",
              borderColor: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
          },
        });

        // Button color change for case studies images section
        ScrollTrigger.create({
          trigger: ".case-studies-items-images",
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            gsap.to(button, {
              backgroundColor: "#ffffff",
              borderColor: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
          },
          onLeave: () => {
            gsap.to(button, {
              backgroundColor: "#000000",
              borderColor: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
          },
          onEnterBack: () => {
            gsap.to(button, {
              backgroundColor: "#ffffff",
              borderColor: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
          },
          onLeaveBack: () => {
            gsap.to(button, {
              backgroundColor: "#000000",
              borderColor: "#000000",
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(buttonText, {
              color: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            });
          },
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles carousel slide transitions with clip-path animations and footer visibility
  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const projects = gsap.utils.toArray(".project");
      const footer = document.querySelector(".footer");

      // Footer is now always visible but content is hidden
      // The black background is always there, only content fades in

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

          // Show footer text when Case Study 03 appears
          if (footer) {
            // Show footer text when we're on Case Study 03 (slide 2, 0-indexed)
            if (currentSlide >= 2) {
              footer.classList.add("show-footer");
            } else {
              footer.classList.remove("show-footer");
            }
          }

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
              <p>Let's talk</p>
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
                      We are Pedro and Lis. We are the founders of <strong>Ubushi.</strong>
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
                  <p>Let's talk</p>
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
              src="/Sphere_white.mp4"
              autoPlay
              muted
              loop
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
                filter: 'contrast(1.02) saturate(1.05)',
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
          padding: '1em 0'
        }}>
          <Marquee />
        </section>

        <section className="intro" id="intro" style={{
          paddingTop: '2rem'
        }}>
          <div className="geo-bg">
            <GeometricBackground />
          </div>
          <div className="intro-container">
            <div className="container">
              <div className="col">
                <p className="primary">[ 0 to 100 Business Growth ]</p>
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
                text="Portfolio"
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
                  <h2 style={{color: '#000000'}}>How Do We Scale Businesses From 0 to 100?</h2>
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
                <TypeWriter text="[ Entertainment Client — Global Market Access ]" speed={20} />
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
                <h3>Miosotys — Luxury Spa Digital Transformation</h3>
                <TypeWriter text="[ Spa & Wellness — Website & Booking Experience ]" speed={20} />
                <div className="case-studies-item-inner-img">
                  <img
                    src="/images/home/Miosotys.jpg"
                    alt="Miosotys luxury spa digital transformation"
                  />
                </div>
                <p>
                  Colombian luxury spa Miosotys needed a digital presence that matched the elegance of their in-person experience. Their outdated site made booking treatments difficult and didn't reflect their premium brand. Ubushi redesigned their website, integrated a seamless booking system, and crafted a digital catalogue to showcase services with clarity and style. The result: a polished online experience that attracts new clients, simplifies reservations, and elevates their brand. Your transformation is next.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href="/archive">View Spa Transformation</Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className="case-studies-item case-studies-item-3">
              <div className="container">
                <h3>Cenproforest — Industry Authority Transformation</h3>
                <TypeWriter text="[ Forest Services — Digital Catalog & Authority Positioning ]" speed={20} />
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
          </div>
          <div className="case-studies-items-images col">
            <div className="case-studies-img case-studies-img-1">
              <img src="/images/home/DeepDelay.jpg" alt="Festival crowd enjoying live music and entertainment" />
              <div className="hero-img-overlay"></div>
            </div>
            <div className="case-studies-img case-studies-img-2">
              <img src="/images/home/Miosotys.jpg" alt="" />
              <div className="hero-img-overlay"></div>
            </div>
            <div className="case-studies-img case-studies-img-3">
              <img src="/images/home/Cenproforest.jpg" alt="" />
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
                  <h2 style={{color: '#ffffff'}}>Why Choose Ubushi For Your Growth Journey?</h2>
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