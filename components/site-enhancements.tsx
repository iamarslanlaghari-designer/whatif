
"use client";

import { useCallback, useEffect, useState } from "react";

const features = [
  {
    number: "01",
    title: "AI-Powered Decision Maps",
    description:
      "Describe a decision in your own words. WhatIf creates a structured visual map of possible directions and outcomes.",
    icon: "map",
  },
  {
    number: "02",
    title: "Explore Different Paths",
    description:
      "Follow connected branches and explore how different choices may lead to different situations.",
    icon: "branches",
  },
  {
    number: "03",
    title: "Understand Consequences",
    description:
      "Explore potential benefits, risks, challenges and consequences associated with each possible direction.",
    icon: "compass",
  },
  {
    number: "04",
    title: "Compare Your Options",
    description:
      "Look at alternative paths side by side and understand the differences before making a decision.",
    icon: "compare",
  },
  {
    number: "05",
    title: "See the Bigger Picture",
    description:
      "Move beyond a single answer. Discover intermediate steps, possible outcomes and assumptions.",
    icon: "layers",
  },
  {
    number: "06",
    title: "Make More Informed Choices",
    description:
      "Use structured exploration to think through uncertainty and consider possibilities you may have missed.",
    icon: "lightbulb",
  },
];

function FeatureIcon({ name }: { name: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "map":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="7" height="6" rx="1.5" />
          <rect x="14" y="14" width="7" height="6" rx="1.5" />
          <path d="M10 7h3a2 2 0 0 1 2 2v5" />
          <path d="m12 12 3 3 3-3" />
        </svg>
      );
    case "branches":
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M8.5 12H11a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2" />
          <path d="M11 12a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
        </svg>
      );
    case "compare":
      return (
        <svg {...common}>
          <path d="M8 4H4v16h4" />
          <path d="M16 4h4v16h-4" />
          <path d="M9 8h6M9 12h6M9 16h6" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M8.5 14.5a7 7 0 1 1 7 0c-.8.6-1.3 1.5-1.5 2.5h-4c-.2-1-.7-1.9-1.5-2.5Z" />
        </svg>
      );
  }
}

function SunIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export default function SiteEnhancements() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("whatif-theme");
    } catch {
      savedTheme = null;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialDark = savedTheme
      ? savedTheme === "dark"
      : prefersDark;

    // Synchronize the component with the persisted browser preference on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(initialDark);
    document.documentElement.dataset.theme = initialDark
      ? "dark"
      : "light";
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((current) => {
      const next = !current;
      document.documentElement.dataset.theme = next
        ? "dark"
        : "light";

      try {
        localStorage.setItem(
          "whatif-theme",
          next ? "dark" : "light"
        );
      } catch {
        // Theme still works when browser storage is unavailable.
      }

      return next;
    });
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        scrollable > 0
          ? (window.scrollY / scrollable) * 100
          : 0;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setShowBackToTop(window.scrollY > 450);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });
    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        className="whatif-scroll-progress"
        aria-hidden="true"
        style={{ width: `${scrollProgress}%` }}
      />

      <section
        id="whatif-interactive-lab"
        className="whatif-lab"
        aria-labelledby="whatif-lab-heading"
      >
        <div className="whatif-lab-inner">
          <div className="whatif-lab-heading">
            <span className="whatif-lab-eyebrow">
              WHATIF PLATFORM
            </span>

            <h2 id="whatif-lab-heading">
              Explore what you can do.
            </h2>

            <p>
              Turn complicated decisions into structured,
              interactive possibilities. Explore different
              directions, understand potential outcomes and
              make more informed choices with WhatIf.
            </p>
          </div>

          <div className="whatif-feature-grid">
            {features.map((feature) => (
              <article
                className="whatif-feature-card"
                key={feature.number}
              >
                <div className="whatif-feature-top">
                  <div className="whatif-feature-icon">
                    <FeatureIcon name={feature.icon} />
                  </div>

                  <span className="whatif-feature-number">
                    {feature.number}
                  </span>
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <a
                  href="/explore"
                  className="whatif-feature-link"
                >
                  Explore with WhatIf
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>

          <div className="whatif-lab-cta">
            <div>
              <span className="whatif-lab-eyebrow">
                YOUR NEXT DECISION STARTS HERE
              </span>

              <h3>
                One decision. Many possibilities.
              </h3>

              <p>
                Start exploring the paths your decision could take.
              </p>
            </div>

            <a href="/explore" className="whatif-lab-cta-button">
              Explore a decision
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <div className="whatif-floating-tools">
        <button
          type="button"
          className="whatif-tool-button whatif-theme-toggle"
          onClick={toggleTheme}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          aria-pressed={darkMode}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {showBackToTop && (
        <button
          type="button"
          className="whatif-back-top"
          onClick={backToTop}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUpIcon />
        </button>
      )}

      <style jsx global>{`
        .whatif-scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          z-index: 99999;
          background: #ff6b35;
          pointer-events: none;
          transition: width 100ms linear;
        }

        .whatif-lab {
          position: relative;
          width: 100%;
          padding: 100px 24px;
          background: #f7f7f5;
          color: #171717;
          overflow: hidden;
        }

        .whatif-lab-inner {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .whatif-lab-heading {
          max-width: 680px;
          margin: 0 auto 52px;
          text-align: center;
        }

        .whatif-lab-eyebrow {
          display: inline-block;
          margin-bottom: 16px;
          color: #e96535;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 0.15em;
        }

        .whatif-lab-heading h2 {
          margin: 0;
          color: #171717;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          letter-spacing: -0.045em;
          line-height: 1.12;
        }

        .whatif-lab-heading > p {
          max-width: 600px;
          margin: 18px auto 0;
          color: #696969;
          font-size: 16px;
          line-height: 1.8;
        }

        .whatif-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .whatif-feature-card {
          display: flex;
          min-height: 265px;
          flex-direction: column;
          align-items: flex-start;
          padding: 27px;
          border: 1px solid #e8e7e4;
          border-radius: 18px;
          background: #fff;
          transition:
            transform 200ms ease,
            border-color 200ms ease,
            box-shadow 200ms ease;
        }

        .whatif-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 107, 53, 0.4);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.055);
        }

        .whatif-feature-top {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .whatif-feature-icon {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border-radius: 14px;
          background: #fff0e9;
          color: #ed6939;
        }

        .whatif-feature-number {
          color: #a3a3a3;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .whatif-feature-card h3 {
          margin: 0 0 10px;
          color: #191919;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }

        .whatif-feature-card > p {
          margin: 0 0 22px;
          color: #737373;
          font-size: 14px;
          line-height: 1.75;
        }

        .whatif-feature-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          color: #e96535;
          font-size: 13px;
          font-weight: 650;
          text-decoration: none;
        }

        .whatif-feature-link span,
        .whatif-lab-cta-button span {
          transition: transform 180ms ease;
        }

        .whatif-feature-link:hover span,
        .whatif-lab-cta-button:hover span {
          transform: translate(3px, -3px);
        }

        .whatif-lab-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-top: 25px;
          padding: 35px;
          border-radius: 20px;
          background: #191919;
          color: #fff;
        }

        .whatif-lab-cta .whatif-lab-eyebrow {
          margin-bottom: 10px;
        }

        .whatif-lab-cta h3 {
          margin: 0;
          color: #fff;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .whatif-lab-cta p {
          margin: 9px 0 0;
          color: #b8b8b8;
          font-size: 14px;
          line-height: 1.6;
        }

        .whatif-lab-cta-button {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 10px;
          background: #ff6b35;
          color: #fff;
          font-size: 14px;
          font-weight: 650;
          text-decoration: none;
          transition:
            background 180ms ease,
            transform 180ms ease;
        }

        .whatif-lab-cta-button:hover {
          transform: translateY(-2px);
          background: #ed5d2b;
        }

        .whatif-floating-tools {
          position: fixed;
          right: 20px;
          bottom: 22px;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          gap: 9px;
          pointer-events: none;
        }

        .whatif-tool-button,
        .whatif-back-top {
          display: grid;
          width: 44px;
          height: 44px;
          padding: 0;
          place-items: center;
          border: 1px solid rgba(23, 23, 23, 0.1);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.96);
          color: #252525;
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.09);
          backdrop-filter: blur(14px);
          cursor: pointer;
          pointer-events: auto;
          transition:
            transform 180ms ease,
            background 180ms ease,
            color 180ms ease,
            border-color 180ms ease;
        }

        .whatif-tool-button:hover,
        .whatif-back-top:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 107, 53, 0.35);
          background: #fff3ed;
          color: #e96535;
        }

        .whatif-tool-button svg,
        .whatif-back-top svg {
          display: block;
          width: 19px;
          height: 19px;
        }

        .whatif-back-top {
          position: fixed;
          right: 20px;
          bottom: 78px;
          z-index: 9998;
        }

        html[data-theme="dark"] .whatif-lab {
          background: #111111;
          color: #f5f5f5;
        }

        html[data-theme="dark"] .whatif-lab-heading h2 {
          color: #f5f5f5;
        }

        html[data-theme="dark"] .whatif-lab-heading > p {
          color: #a6a6a6;
        }

        html[data-theme="dark"] .whatif-feature-card {
          border-color: #303030;
          background: #1b1b1b;
        }

        html[data-theme="dark"] .whatif-feature-card:hover {
          border-color: rgba(255, 107, 53, 0.45);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        html[data-theme="dark"] .whatif-feature-icon {
          background: rgba(255, 107, 53, 0.12);
          color: #ff936d;
        }

        html[data-theme="dark"] .whatif-feature-card h3 {
          color: #f5f5f5;
        }

        html[data-theme="dark"] .whatif-feature-card > p {
          color: #aaa;
        }

        html[data-theme="dark"] .whatif-feature-number {
          color: #777;
        }

        html[data-theme="dark"] .whatif-lab-cta {
          border: 1px solid #333;
          background: #1b1b1b;
        }

        html[data-theme="dark"] .whatif-tool-button,
        html[data-theme="dark"] .whatif-back-top {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(35, 35, 35, 0.96);
          color: #f5f5f5;
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.25);
        }

        html[data-theme="dark"] .whatif-tool-button:hover,
        html[data-theme="dark"] .whatif-back-top:hover {
          border-color: rgba(255, 107, 53, 0.4);
          background: #33251f;
          color: #ff9a73;
        }

        @media (max-width: 900px) {
          .whatif-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .whatif-lab {
            padding: 72px 18px;
          }

          .whatif-lab-heading {
            margin-bottom: 35px;
          }

          .whatif-lab-heading > p {
            font-size: 14px;
          }

          .whatif-feature-grid {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .whatif-feature-card {
            min-height: 0;
            padding: 23px;
          }

          .whatif-feature-top {
            margin-bottom: 18px;
          }

          .whatif-lab-cta {
            align-items: flex-start;
            flex-direction: column;
            padding: 26px 22px;
          }

          .whatif-lab-cta-button {
            width: 100%;
          }

          .whatif-floating-tools {
            right: 13px;
            bottom: 14px;
          }

          .whatif-back-top {
            right: 13px;
            bottom: 68px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .whatif-feature-card,
          .whatif-feature-link span,
          .whatif-lab-cta-button,
          .whatif-tool-button,
          .whatif-back-top {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
