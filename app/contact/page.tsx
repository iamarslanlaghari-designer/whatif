
"use client";

import Link from "next/link";
import { usePersistentTheme } from "@/lib/use-persistent-theme";
import { useEffect, useState, type FormEvent } from "react";

const EMAIL = "iam.arslan.laghari@gmail.com";
const WHATSAPP = "923272819101";

export default function ContactPage() {
  const [darkMode, setDarkMode] = usePersistentTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mailSubject = encodeURIComponent(
      subject.trim() || `Message from ${name.trim()}`
    );

    const mailBody = encodeURIComponent(
      `Hello WhatIf Team,\n\n${message.trim()}\n\nName: ${name.trim()}\nEmail: ${email.trim()}`
    );

    window.location.href = `mailto:${EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  };

  const pageBg = darkMode ? "bg-[#111111]" : "bg-[#FAFAF9]";
  const headingColor = darkMode ? "text-white" : "text-[#171717]";
  const mutedColor = darkMode ? "text-[#A1A1AA]" : "text-[#85817E]";

  const cardBg = darkMode
    ? "border-white/[0.08] bg-[#191919]"
    : "border-black/[0.06] bg-white";

  const inputClass = `w-full rounded-xl border px-4 py-3.5 text-[13px] outline-none transition placeholder:text-[#999] focus:border-[#FF6B35] ${
    darkMode
      ? "border-white/10 bg-[#222222] text-white focus:bg-[#252525]"
      : "border-black/[0.08] bg-[#FAFAF9] text-[#171717] focus:bg-white"
  }`;

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
        <div className="mx-auto max-w-[1100px] text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/[0.07] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#FF6B35]">
              Get In Touch
            </span>
          </div>

          <h1
            className={`mx-auto max-w-[850px] text-[46px] font-normal leading-[1.08] tracking-[-0.075em] sm:text-[65px] lg:text-[78px] ${headingColor}`}
          >
            Let&apos;s start a
            <br />
            <span className="text-[#FF6B35]">conversation.</span>
          </h1>

          <p
            className={`mx-auto mt-7 max-w-[560px] text-[14px] leading-8 sm:text-[15px] ${mutedColor}`}
          >
            Have a question, suggestion, or feedback about WhatIf? We&apos;d love
            to hear from you. Send us a message and let&apos;s connect.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left Contact Information */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF6B35]">
                Contact Information
              </p>

              <h2
                className={`text-[32px] font-normal leading-tight tracking-[-0.06em] sm:text-[40px] ${headingColor}`}
              >
                We&apos;d love to
                <br />
                hear from you.
              </h2>

              <p
                className={`mt-5 max-w-[390px] text-[13px] leading-8 ${mutedColor}`}
              >
                Whether you need help, want to share an idea, or simply want
                to learn more about WhatIf, our inbox is open.
              </p>
            </div>

            {/* Email Card */}
            <a
              href={`mailto:${EMAIL}`}
              className={`group flex items-center gap-4 rounded-[20px] border p-5 transition hover:-translate-y-1 hover:border-[#FF6B35]/40 ${cardBg}`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35]">
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
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-[11px] ${mutedColor}`}>Email Us</p>
                <p
                  className={`mt-1 break-all text-[13px] font-medium ${headingColor}`}
                >
                  {EMAIL}
                </p>
              </div>

              <span className="text-[#FF6B35] transition group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 rounded-[20px] border p-5 transition hover:-translate-y-1 hover:border-[#FF6B35]/40 ${cardBg}`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35]">
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
                  <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-[11px] ${mutedColor}`}>WhatsApp</p>
                <p className={`mt-1 text-[13px] font-medium ${headingColor}`}>
                  +92 327 2819101
                </p>
              </div>

              <span className="text-[#FF6B35] transition group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* Response Information */}
            <div className={`rounded-[20px] border p-6 ${cardBg}`}>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                <span className={`text-[12px] font-medium ${headingColor}`}>
                  We&apos;re here to help
                </span>
              </div>

              <p className={`text-[12px] leading-7 ${mutedColor}`}>
                Send us your questions or feedback. We&apos;ll do our best to get
                back to you as soon as possible.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`rounded-[25px] border p-6 sm:p-9 ${cardBg}`}>
            <div className="mb-8">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#FF6B35]">
                Send A Message
              </p>

              <h2
                className={`text-[29px] font-normal tracking-[-0.055em] sm:text-[36px] ${headingColor}`}
              >
                Tell us what&apos;s on your mind.
              </h2>

              <p className={`mt-3 text-[12px] leading-7 ${mutedColor}`}>
                Fill in the details below. Your email application will open with
                your message prepared. You will need to send it from your email
                application.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className={`mb-2 block text-[12px] font-medium ${headingColor}`}
                >
                  Your Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className={`mb-2 block text-[12px] font-medium ${headingColor}`}
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className={`mb-2 block text-[12px] font-medium ${headingColor}`}
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  required
                  maxLength={150}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="What is this regarding?"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className={`mb-2 block text-[12px] font-medium ${headingColor}`}
                >
                  Your Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  maxLength={5000}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write your message here..."
                  className={`${inputClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#FF6B35] px-7 py-4 text-[13px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#e95c2c]"
              >
                Send Message
                <span>↗</span>
              </button>

              <p className={`text-center text-[11px] leading-6 ${mutedColor}`}>
                This form opens your default email application. Your message
                is not sent automatically.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-28 sm:px-8">
        <div
          className={`mx-auto max-w-[1100px] rounded-[30px] border px-7 py-14 text-center sm:px-12 sm:py-16 ${
            darkMode
              ? "border-white/[0.08] bg-[#191919]"
              : "border-black/[0.05] bg-[#F1EFEC]"
          }`}
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF6B35]">
            Your Next Step
          </p>

          <h2
            className={`text-[32px] font-normal tracking-[-0.06em] sm:text-[45px] ${headingColor}`}
          >
            Ready to explore what could be?
          </h2>

          <p
            className={`mx-auto mt-5 max-w-[460px] text-[13px] leading-8 ${mutedColor}`}
          >
            Start with a question. Explore different paths. Discover
            possibilities you may not have considered.
          </p>

          <Link
            href="/explore"
            className="mt-8 inline-flex rounded-full bg-[#FF6B35] px-8 py-4 text-[13px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#e95c2c]"
          >
            Start Exploring →
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
