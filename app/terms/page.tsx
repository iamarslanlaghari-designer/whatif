
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";
import { useEffect, useState } from "react";

const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    paragraphs: [
      "Welcome to WhatIf. These Terms and Conditions govern your access to and use of the WhatIf website and its features.",
      "By accessing or using WhatIf, you agree to these terms. If you do not agree with them, please do not use the platform.",
    ],
  },
  {
    number: "02",
    title: "About WhatIf",
    paragraphs: [
      "WhatIf is an AI-powered decision-exploration platform designed to help users examine different choices, explore alternative paths, and understand possible outcomes.",
      "The platform may generate interactive decision flows, branching scenarios, potential consequences, risks, and opportunities based on the information users provide.",
      "WhatIf is a decision-support and exploration tool. It does not make decisions on behalf of users.",
    ],
  },
  {
    number: "03",
    title: "Eligibility and Account Use",
    paragraphs: [
      "You must be legally capable of agreeing to these terms to use WhatIf. If you are using the platform on behalf of an organization, you confirm that you have the authority to accept these terms for that organization.",
      "If an account or sign-in feature is available, you are responsible for maintaining the security of your account credentials and for activities carried out through your account.",
      "You agree to provide accurate information when using features that request it.",
    ],
  },
  {
    number: "04",
    title: "Acceptable Use",
    paragraphs: [
      "You agree to use WhatIf responsibly and in accordance with applicable laws.",
      "You must not:",
    ],
    bullets: [
      "Use the platform for unlawful, fraudulent, or harmful activities.",
      "Attempt to gain unauthorized access to the platform or its systems.",
      "Interfere with the security, availability, or operation of the service.",
      "Upload malicious code or content intended to disrupt the platform.",
      "Abuse, exploit, or overload platform features.",
      "Use WhatIf to generate or distribute content that violates applicable laws or the rights of others.",
      "Misrepresent AI-generated scenarios as verified facts or guaranteed outcomes.",
    ],
  },
  {
    number: "05",
    title: "AI-Generated Content",
    paragraphs: [
      "WhatIf uses artificial intelligence to generate decision paths, possible scenarios, suggestions, risks, opportunities, and other content.",
      "AI-generated content may be incomplete, inaccurate, outdated, or based on assumptions. It should be treated as informational material for exploration and reflection.",
      "WhatIf does not guarantee that any generated scenario or outcome will happen in real life.",
      "You are responsible for reviewing AI-generated information and independently verifying important facts before acting on it.",
    ],
    highlight: "WhatIf explores possibilities, not predictions.",
  },
  {
    number: "06",
    title: "No Professional Advice",
    paragraphs: [
      "Content provided by WhatIf is not a substitute for qualified professional advice.",
      "The platform does not provide medical, legal, financial, psychological, or other regulated professional services.",
      "For decisions involving significant personal, financial, legal, medical, or safety consequences, consult an appropriately qualified professional.",
      "You remain responsible for your own decisions and actions.",
    ],
  },
  {
    number: "07",
    title: "User Content",
    paragraphs: [
      "You retain responsibility for the questions, text, information, and other material you submit to WhatIf.",
      "You confirm that you have the necessary rights and permissions to submit that material.",
      "You should not submit confidential, highly sensitive, or third-party personal information unless you have a lawful reason and understand how the relevant features process it.",
      "To the extent necessary to operate the service, you authorize WhatIf and its relevant service providers to process submitted content to provide the features you request, subject to the Privacy Policy and applicable law.",
    ],
  },
  {
    number: "08",
    title: "Intellectual Property",
    paragraphs: [
      "The WhatIf name, branding, logos, website design, interface, original platform materials, and related intellectual property are owned by WhatIf or used with appropriate permission, unless otherwise stated.",
      "You may use the platform for its intended personal or business decision-exploration purposes.",
      "You must not copy, reproduce, distribute, sell, or commercially exploit protected platform materials without prior permission, except where permitted by law.",
      "Your rights to content you submit remain subject to the rights of any other applicable owners and licenses.",
    ],
  },
  {
    number: "09",
    title: "Third-Party Services and Links",
    paragraphs: [
      "WhatIf may use third-party providers for hosting, AI processing, analytics, security, and other technical services.",
      "The platform may also contain links to external websites or services. These services are operated independently and may have their own terms and privacy policies.",
      "We are not responsible for the content, availability, policies, or practices of third-party services that we do not control.",
    ],
  },
  {
    number: "10",
    title: "Availability and Changes",
    paragraphs: [
      "We aim to keep WhatIf available and functioning properly, but uninterrupted access is not guaranteed.",
      "Features may be updated, modified, suspended, or discontinued as the platform develops.",
      "We may introduce new features, change existing functionality, or temporarily restrict access for maintenance, security, or operational reasons.",
    ],
  },
  {
    number: "11",
    title: "Disclaimer of Warranties",
    paragraphs: [
      "WhatIf is provided on an 'as is' and 'as available' basis to the extent permitted by applicable law.",
      "We do not guarantee that the platform will always be available, error-free, secure, or suitable for every particular purpose.",
      "We make no guarantee regarding the accuracy, completeness, reliability, or real-world results of AI-generated content.",
    ],
  },
  {
    number: "12",
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, WhatIf and its operators will not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the platform.",
      "This includes losses resulting from reliance on AI-generated content, decisions made using the platform, service interruptions, or third-party services.",
      "Nothing in these terms excludes or limits liability where doing so would be unlawful under applicable law.",
    ],
  },
  {
    number: "13",
    title: "Suspension or Termination",
    paragraphs: [
      "We may restrict or suspend access to WhatIf if we reasonably believe that a user has violated these terms, created a security risk, or used the platform in a harmful or unlawful manner.",
      "You may stop using the platform at any time.",
      "Any provisions that by their nature should continue after use ends will remain applicable.",
    ],
  },
  {
    number: "14",
    title: "Changes to These Terms",
    paragraphs: [
      "We may revise these Terms and Conditions as WhatIf evolves or as legal and operational requirements change.",
      "Updated terms will be published on this page with a revised effective date.",
      "Your continued use of WhatIf after updated terms become effective constitutes acceptance of the revised terms, to the extent permitted by applicable law.",
    ],
  },
  {
    number: "15",
    title: "Governing Law",
    paragraphs: [
      "These terms are subject to applicable laws and regulations. Any dispute will be handled by the competent courts or authorities as determined under applicable law.",
      "Nothing in this section is intended to remove any mandatory rights or protections that apply to you under the laws of your jurisdiction.",
    ],
  },
  {
    number: "16",
    title: "Contact Us",
    paragraphs: [
      "If you have questions about these Terms and Conditions, please contact the WhatIf team.",
    ],
    contact: true,
  },
];

export default function TermsPage() {
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
              Terms & Conditions
            </span>
          </div>

          <h1
            className={`mx-auto text-[46px] font-normal leading-[1.08] tracking-[-0.075em] sm:text-[65px] lg:text-[78px] ${headingColor}`}
          >
            Clear terms.
            <br />
            <span className="text-[#FF6B35]">Better understanding.</span>
          </h1>

          <p
            className={`mx-auto mt-7 max-w-[570px] text-[14px] leading-8 sm:text-[15px] ${mutedColor}`}
          >
            These terms explain the responsibilities and guidelines that
            apply when you use WhatIf.
          </p>

          <p className={`mt-7 text-[11px] ${mutedColor}`}>
            Effective date: November 20, 2026
          </p>
        </div>
      </section>

      {/* Introduction Card */}
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6M8 13h8M8 17h8" />
            </svg>
          </div>

          <div>
            <h2 className={`text-[16px] font-medium ${headingColor}`}>
              A simple understanding of how WhatIf works.
            </h2>

            <p className={`mt-2 text-[13px] leading-8 ${mutedColor}`}>
              We want you to use WhatIf with a clear understanding of its
              purpose, limitations, and responsibilities. Please read these
              terms before using the platform.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-[850px] space-y-5">
          {sections.map((section) => (
            <article
              key={section.number}
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
                {section.paragraphs.map((paragraph, index) => (
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

                {section.highlight && (
                  <div className="rounded-xl border border-[#FF6B35]/20 bg-[#FF6B35]/[0.07] p-5">
                    <p className="font-medium text-[#FF6B35]">
                      {section.highlight}
                    </p>
                  </div>
                )}

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
            Questions About Our Terms?
          </p>

          <h2
            className={`text-[31px] font-normal tracking-[-0.06em] sm:text-[40px] ${headingColor}`}
          >
            Let&apos;s talk.
          </h2>

          <p className={`mx-auto mt-4 max-w-[450px] text-[13px] leading-8 ${mutedColor}`}>
            Contact us if you need clarification about these terms or how
            WhatIf works.
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
