"use client";
import Link from "next/link";

import "./Footer.css";

const Footer = () => {
  return (
    <>
      <section className="footer-area"></section>

      <footer>
        <div className="container">
          <div className="footer-row footer-content">
            <div className="footer-col">
              <h3>
                Transforming businesses from zero to 100 through design and elite networks © 2025 Ubushi — All
                rights reserved.
              </h3>
            </div>
            <div className="footer-col">
              <div className="footer-sub-col"></div>
              <div className="footer-sub-col footer-links">
                <p className="footer-col-header">[ * Case Studies ]</p>
                <Link href="/archive">
                  <p>Deep Delay Management</p>
                </Link>
                <Link href="/archive">
                  <p>SuperMartxé Global</p>
                </Link>
                <Link href="/archive">
                  <p>Myosotis Spa</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="footer-row footer-pattern">
            <p>+</p>
            <p>+</p>
            <p>+</p>
          </div>
          <div className="footer-row">
            <h1>Ubushi</h1>
          </div>
          <div className="footer-row footer-pattern">
            <p>+</p>
            <p>+</p>
            <p>+</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
