"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "./Navbar.css";

const MusicToggle = dynamic(() => import("../MusicToggle/MusicToggle"), {
  ssr: false,
});

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigation = (event, sectionId) => {
    event.preventDefault();

    if (isHomePage) {
      const lenis = window.lenis;
      if (lenis) {
        const element = document.getElementById(sectionId);
        if (element) {
          lenis.scrollTo(element, {
            offset: 0,
            immediate: false,
            duration: 1.5,
          });
        }
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-col navbar-left">
        <div className="navbar-sub-col logo">
          <Link href="/">
            <h3>Ubushi</h3>
          </Link>
        </div>
      </div>
      <div className="navbar-col navbar-center">
        <div className="navbar-sub-col nav-items">
          <div
            className="dropdown"
            onMouseEnter={() => !isMobile && setDropdownOpen(true)}
            onMouseLeave={() => !isMobile && setDropdownOpen(false)}
          >
            <div
              className="dropdown-toggle"
              onClick={() => {
                if (isMobile) {
                  setDropdownOpen(!dropdownOpen);
                }
              }}
            >
              {isMobile ? (
                <p>☰</p>
              ) : (
                <p>Menu</p>
              )}
            </div>
            <div className={`dropdown-menu ${dropdownOpen ? 'dropdown-menu-open' : ''}`}>
              <a href="#intro" onClick={(e) => {handleNavigation(e, "intro"); setDropdownOpen(false);}}>
                <p>Our Process</p>
              </a>
              <a
                href="#case-studies"
                onClick={(e) => {handleNavigation(e, "case-studies"); setDropdownOpen(false);}}
              >
                <p>Portfolio</p>
              </a>
              <a href="#works" onClick={(e) => {handleNavigation(e, "works"); setDropdownOpen(false);}}>
                <p>Services</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-col navbar-right">
        <div className="navbar-sub-col discovery-call-wrapper">
          <a href="#contact" className="discovery-call-btn">
            <p>Discovery Call</p>
          </a>
        </div>
        <div className="navbar-sub-col music-toggle-wrapper">
          <MusicToggle />
        </div>
      </div>

    </div>
  );
};

export default Navbar;
