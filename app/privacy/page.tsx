
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";
import { useEffect, useState } from "react";

const sections = [
  {
    number: "01",
    title: "Introduction",
    content: [
      "Welcome to WhatIf. Your privacy matters to us. This Privacy Policy explains how information may be collected, used, stored, and protected when you access or use the WhatIf platform.",
      "WhatIf is designed to help people explore decisions, alternative paths, and possible outcomes. By using the platform, you acknowledge that you have read this policy.",
    ],
  },
  {
    number: "02",
    title: "Information You Provide",
    content: [
      "Depending on the features you use, you may provide information such as:",
    ],
    bullets: [
      "Questions, situations, or decisions entered into WhatIf.",
      "Information included in messages or feedback you send us.",
      "Contact details you provide when communicating with us.",
      "Other content you voluntarily submit through platform features.",
    ],
    footer:
      "Please avoid submitting passwords, payment credentials, confidential business information, or sensitive personal information unless a feature specifically requires it and appropriate safeguards are provided.",
  },
  {
    number: "03",
    title: "How Information May Be Used",
    content: [
      "Information may be used for purposes such as:",
    ],
    bullets: [
      "Providing and operating WhatIf features.",
      "Generating AI-assisted decision paths and possible outcomes.",
      "Responding to questions, support requests, and feedback.",
      "Understanding platform performance and improving the user experience.",
      "Maintaining platform security and preventing misuse.",
      "Meeting applicable legal requirements.",
    ],
  },
  {
    number: "04",
    title: "AI Processing",
    content: [
      "WhatIf uses artificial intelligence to help organize decision scenarios and generate possible paths, consequences, risks, and outcomes.",
      "Information you enter into AI-powered features may be processed by third-party AI service providers to generate responses. The handling of that information may also be subject to those providers' privacy policies and terms.",
      "AI-generated content can be incomplete or inaccurate. WhatIf presents possibilities, not guaranteed predictions or professional advice.",
    ],
  },
  {
    number: "05",
    title: "Third-Party Services",
    content: [
      "WhatIf may rely on third-party services to support its operation. These may include hosting providers, AI services, analytics tools, security services, and other technical infrastructure.",
      "Those providers may process information as necessary to perform their services. Their own privacy policies and terms may apply.",
      "We encourage you to review the privacy policies of third-party services where relevant.",
    ],
  },
  {
    number: "06",
    title: "Cookies and Technical Information",
    content: [
      "The platform or its hosting infrastructure may use cookies, local storage, or similar technologies to support essential functionality, remember preferences, maintain sessions, and understand platform usage.",
      "Your browser may allow you to manage or disable certain cookies and storage features. Some platform functionality may not work as expected if essential technologies are disabled.",
    ],
  },
  {
    number: "07",
    title: "Data Storage and Retention",
    content: [
      "Information may be stored for as long as necessary to provide the relevant features, maintain platform operations, resolve issues, meet legal obligations, or protect the platform.",
      "Actual storage and retention periods depend on the features you use and the technical services supporting them.",
      "If you have a question about information associated with your use of WhatIf, contact us using the details provided below.",
    ],
  },
  {
    number: "08",
    title: "Data Security",
    content: [
      "We aim to use reasonable technical and organizational measures to help protect information from unauthorized access, misuse, loss, or alteration.",
      "However, no website, online service, or method of electronic storage can guarantee complete security. Please use the platform responsibly and avoid sharing information that should remain confidential.",
    ],
  },
  {
    number: "09",
    title: "Your Privacy Choices",
    content: [
      "Depending on your location and applicable laws, you may have rights relating to your personal information. These may include requesting access, correction, deletion, or information about how your data is handled.",
      "You may contact us to ask a privacy-related question or make a request. We may need to verify your identity before responding.",
    ],
  },
  {
    number: "10",
    title: "Children's Privacy",
    content: [
      "WhatIf is not intended to knowingly collect personal information from children in circumstances where parental consent is legally required.",
      "If you believe a child has provided personal information inappropriately, please contact us so we can review the matter.",
    ],
  },
  {
    number: "11",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy as WhatIf develops, new features are introduced, or legal requirements change.",
      "When changes are made, the updated policy will be published on this page with a revised effective date. We encourage you to review it periodically.",
    ],
  },
  {
    number: "12",
    title: "Contact Us",
    content: [
      "If you have questions, concerns, or requests relating to this Privacy Policy, you can contact the WhatIf team:",
    ],
    contact: true,
  },
];

export default function PrivacyPage() {
  const [darkMode, setDarkMode] = usePersistentTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight > 0
          ? (window.scrollY / scrollableHeight) * 100
          : 0;

      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pageBg = darkMode ? "bg-[#111111]" : "bg-[#FAFAF9]";
  const headingColor = darkMode ? "text-white" : "text-[#171717]";
  const mutedColor = darkMode ? "text-[#A1A1AA]" : "text-[#85817E]";

  const cardBg = darkMode
    ? "border-white/[0.08] bg-[#191919]"
    : "border-black/[0.06] bg-white";

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${pageBg}`}
    >
      {/* Scroll Progress */}
      <div className="fixed left-0 top-0 z-[200] h-[3px] w-full bg-transparent">
        <div
          className="h-full bg-[#FF6B35] transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero */}
      <section className="px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-[950px] text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.07] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#FF6B35]">
              Your Privacy Matters
            </span>
          </div>

          <h1
            className={`mx-auto text-[46px] font-normal leading-[1.08] tracking-[-0.075em] sm:text-[65px] lg:text-[78px] ${headingColor}`}
          >
            Privacy,
            <br />
            <span className="text-[#FF6B35]">with transparency.</span>
          </h1>

          <p
            className={`mx-auto mt-7 max-w-[570px] text-[14px] leading-8 sm:text-[15px] ${mutedColor}`}
          >
            We believe you should understand how your information may be
            handled when you use WhatIf. Here&apos;s what you need to know.
          </p>

          <p className={`mt-7 text-[11px] ${mutedColor}`}>
            Effective date: November 20, 2026
          </p>
        </div>
      </section>

      {/* Privacy Introduction Card */}
      <section className="px-5 pb-14 sm:px-8">
        <div
          className={`mx-auto flex max-w-[850px] gap-5 rounded-[22px] border p-6 sm:p-8 ${cardBg}`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div>
            <h2 className={`text-[16px] font-medium ${headingColor}`}>
              Your information deserves care.
            </h2>

            <p className={`mt-2 text-[13px] leading-8 ${mutedColor}`}>
              WhatIf is built to help you explore decisions. Share only the
              information needed for your exploration, and take a moment to
              understand how AI-powered services may process your input.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-[850px]">
          <div className="space-y-5">
            {sections.map((section) => (
              <article
                key={section.number}
                id={`section-${section.number}`}
                className={`rounded-[22px] border p-6 sm:p-8 ${cardBg}`}
              >
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6B35]/10 text-[11px] font-semibold text-[#FF6B35]">
                    {section.number}
                  </span>

                  <h2
                    className={`text-[19px] font-medium tracking-[-0.04em] sm:text-[21px] ${headingColor}`}
                  >
                    {section.title}
                  </h2>
                </div>

                <div className={`space-y-4 text-[13px] leading-8 ${mutedColor}`}>
                  {section.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  {section.bullets && (
                    <ul className="space-y-3 pl-1">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.footer && <p>{section.footer}</p>}

                  {section.contact && (
                    <div
                      className={`mt-5 space-y-4 rounded-[16px] border p-5 ${
                        darkMode
                          ? "border-white/10 bg-[#222222]"
                          : "border-black/[0.06] bg-[#FAFAF9]"
                      }`}
                    >
                      <div>
                        <p className={`text-[11px] ${mutedColor}`}>
                          Email Address
                        </p>
                        <a
                          href="mailto:iam.arslan.laghari@gmail.com"
                          className="mt-1 inline-block break-all text-[13px] font-medium text-[#FF6B35] hover:underline"
                        >
                          iam.arslan.laghari@gmail.com
                        </a>
                      </div>

                      <div>
                        <p className={`text-[11px] ${mutedColor}`}>
                          WhatsApp
                        </p>
                        <a
                          href="https://wa.me/923272819101"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-[13px] font-medium text-[#FF6B35] hover:underline"
                        >
                          +92 327 2819101
                        </a>
                      </div>

                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-[12px] font-medium text-[#FF6B35] hover:underline"
                      >
                        Visit Contact Page <span>↗</span>
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-28 sm:px-8">
        <div
          className={`mx-auto max-w-[850px] rounded-[28px] border px-7 py-14 text-center sm:px-12 ${
            darkMode
              ? "border-white/[0.08] bg-[#191919]"
              : "border-black/[0.05] bg-[#F1EFEC]"
          }`}
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF6B35]">
            Need More Information?
          </p>

          <h2
            className={`text-[31px] font-normal tracking-[-0.06em] sm:text-[40px] ${headingColor}`}
          >
            We&apos;re here to help.
          </h2>

          <p className={`mx-auto mt-4 max-w-[450px] text-[13px] leading-8 ${mutedColor}`}>
            If you have any questions about your privacy or how WhatIf works,
            feel free to reach out.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-[#FF6B35] px-8 py-4 text-[13px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#e95c2c]"
          >
            Contact Us →
          </Link>
        </div>
      </section>

      {/* Dark Mode Toggle */}
      <button
        type="button"
        onClick={() => setDarkMode((current) => !current)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Light mode" : "Dark mode"}
        className={`fixed bottom-24 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition hover:scale-105 ${
          darkMode
            ? "border-white/10 bg-[#292929] text-white"
            : "border-black/[0.06] bg-white text-[#171717]"
        }`}
      >
        {darkMode ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
          </svg>
        )}
      </button>

      {/* Back To Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-5 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-lg transition hover:scale-105 hover:bg-[#e95c2c]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}
    </main>
  );
}
