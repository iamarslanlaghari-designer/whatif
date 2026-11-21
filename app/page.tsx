
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WhatIfLogo from "@/components/whatif-logo";
import SiteEnhancements from "@/components/site-enhancements";

type IconName =
  | "arrow" | "check" | "chevron" | "close" | "menu" | "plus"
  | "spark" | "target" | "shield" | "chart" | "layers" | "branch"
  | "clock" | "light" | "compass" | "play" | "minus" | "refresh"
  | "globe" | "message" | "zap";

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1 1-2.5Z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
    branch: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M6 7v5a7 7 0 0 0 7 7h3" /><path d="M6 12a7 7 0 0 1 7-7h3" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    light: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8 14c-1.3-1-2-2.5-2-4a6 6 0 0 1 12 0c0 1.5-.7 3-2 4-.8.7-1 1.5-1 2h-6c0-.5-.2-1.3-1-2Z" /></>,
    compass: <><circle cx="12" cy="12" r="10" /><path d="m16.2 7.8-2.5 5.9-5.9 2.5 2.5-5.9 5.9-2.5Z" /></>,
    play: <path d="m8 5 12 7-12 7V5Z" />,
    minus: <path d="M5 12h14" />,
    refresh: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" /><path d="M18.4 15a7 7 0 0 1-11.6 2L4 12" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" /></>,
    message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></>,
    zap: <path d="m13 2-3 9h7l-6 11 2-9H6l7-11Z" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function Logo() {
  return (
    <a
      href="#home"
      className="flex shrink-0 items-center"
      aria-label="WhatIf home"
    >
      <span className="whatif-logo-light inline-flex h-[42px] w-[155px] items-center">
        <WhatIfLogo
          theme="light"
          variant="wordmark"
          priority
          className="!h-[42px] !w-[155px] object-contain"
        />
      </span>

      <span className="whatif-logo-dark inline-flex h-[42px] w-[155px] items-center">
        <WhatIfLogo
          theme="dark"
          variant="wordmark"
          priority
          className="!h-[42px] !w-[155px] object-contain"
        />
      </span>
    </a>
  );
}

const navItems = [
  ["About", "#about"],
  ["Capabilities", "#features"],
  ["How It Works", "#how-it-works"],
  ["Explore", "#start"],
  ["FAQ", "#faq"],
];

const faqs = [
  ["What exactly is WhatIf?", "WhatIf is a decision-exploration tool. It helps you describe a situation, explore alternative choices, and understand possible outcomes, benefits, risks, and assumptions before making a decision."],
  ["Does WhatIf predict the future?", "No. WhatIf does not know or predict the future. It explores hypothetical scenarios based on the information, decisions, and assumptions you provide."],
  ["Can I explore more than two options?", "Yes. WhatIf is designed to help you compare multiple options and alternative paths rather than limiting you to a simple yes-or-no choice."],
  ["Who can use WhatIf?", "Students, professionals, entrepreneurs, business owners, and anyone thinking through an important personal or professional decision can use the platform."],
  ["Are the results guaranteed?", "No. Scenarios are possibilities, not guarantees. Real outcomes depend on many factors, including circumstances that may not be known or included in your scenario."],
];

const featureItems = [
  { n: "01", icon: "branch" as const, title: "Explore multiple paths", text: "Move beyond one decision. Explore different choices and see how each could lead to a different direction." },
  { n: "02", icon: "chart" as const, title: "Compare possible outcomes", text: "Understand potential benefits, challenges, risks, and trade-offs side by side." },
  { n: "03", icon: "layers" as const, title: "Build decision sequences", text: "Break a complex situation into smaller decisions and explore how they connect." },
  { n: "04", icon: "target" as const, title: "Think with more clarity", text: "Organize your thoughts, identify assumptions, and consider factors you may have overlooked." },
  { n: "05", icon: "shield" as const, title: "Understand the risks", text: "Consider what could go wrong, what you might gain, and what you should prepare for." },
  { n: "06", icon: "compass" as const, title: "Make informed decisions", text: "Use structured exploration to support your own judgment instead of relying on guesswork." },
];

const samplePaths = [
  { id: "A", title: "Start small", detail: "Test your idea with a smaller initial commitment.", status: "Lower initial commitment" },
  { id: "B", title: "Launch fully", detail: "Commit more resources to a complete launch.", status: "Larger initial commitment" },
  { id: "C", title: "Find a partner", detail: "Share responsibilities, resources, and expertise.", status: "Shared responsibility" },
];

export default function Home() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState("A");
  const [scenario, setScenario] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const selectedPath =
    samplePaths.find((path) => path.id === activePath) ?? samplePaths[0];

  const handleExplore = () => {
    if (!scenario.trim()) {
      document.getElementById("scenario-input")?.focus();
      return;
    }

    sessionStorage.setItem("whatif_scenario", scenario.trim());
    router.push("/explore");
  };

  return (
    <main id="home" className="min-h-screen overflow-hidden bg-white text-[#171717]">
      {/* Floating navigation */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-2 rounded-[22px] border border-black/[0.065] bg-white/90 p-2 shadow-[0_8px_35px_rgba(0,0,0,0.075)] backdrop-blur-2xl sm:gap-3 sm:px-3">
          <div className="pl-1 sm:pl-2">
            <Logo />
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-1 py-1 lg:flex">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="whitespace-nowrap rounded-full px-3 py-2.5 text-[12px] font-medium text-[#555] transition hover:bg-black/[0.045] hover:text-black xl:px-4 xl:text-[13px]"
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="#start"
            className="hidden shrink-0 items-center gap-2 rounded-[16px] bg-[#FF6B35] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_5px_15px_rgba(255,107,53,0.24)] transition hover:-translate-y-0.5 hover:bg-[#ed5d2b] lg:flex"
          >
            Get Started <Icon name="arrow" size={16} />
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-3 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
          </button>
        </nav>

        {mobileOpen && (
          <div className="mx-auto mt-2 max-w-[1100px] rounded-2xl border border-black/5 bg-white p-4 shadow-xl lg:hidden">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-black/5 py-3 text-sm font-medium last:border-0"
              >
                {label}
              </a>
            ))}

            <a
              href="#start"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-3 text-sm font-semibold text-white"
            >
              Get Started <Icon name="arrow" size={16} />
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="px-5 pb-16 pt-36 sm:px-7 sm:pt-40 lg:px-10 lg:pb-20 lg:pt-44">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#888] sm:text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                Decision intelligence, made clearer
              </p>

              <h1 className="max-w-[850px] text-[clamp(3.4rem,7.8vw,7.6rem)] font-normal leading-[0.91] tracking-[-0.085em]">
                Explore what
                <br />
                <span className="text-[#92908E]">could be.</span>
              </h1>
            </div>

            <div className="max-w-[520px] pb-2 lg:justify-self-end">
              <p className="text-[17px] leading-[1.75] tracking-[-0.025em] text-[#555] sm:text-[19px] lg:text-[21px]">
                Every important decision opens more than one path. Explore your
                options, understand the trade-offs, and find the direction that
                best fits what matters to you.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#start"
                  className="inline-flex items-center gap-3 rounded-[15px] bg-[#FF6B35] px-6 py-4 text-[13px] font-semibold text-white shadow-[0_7px_18px_rgba(255,107,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ed5d2b]"
                >
                  Explore a decision <Icon name="arrow" size={16} />
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-[15px] border border-black/10 bg-white px-5 py-4 text-[13px] font-semibold text-[#444] transition hover:border-black/25"
                >
                  <Icon name="play" size={14} /> How it works
                </a>
              </div>
            </div>
          </div>

          {/* Three-panel product showcase */}
          <div className="mt-16 grid gap-4 xl:mt-20 xl:grid-cols-[1.02fr_0.9fr_1.12fr] xl:gap-4">
            {/* Orange scenario panel */}
            <div className="relative min-h-[560px] overflow-hidden rounded-[28px] bg-[#FF713B] p-6 text-white sm:p-8">
              <div
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,.8) .7px, transparent .7px)",
                  backgroundSize: "5px 5px",
                }}
              />
              <div className="absolute -right-28 top-24 h-80 w-80 rounded-full border border-white/20" />
              <div className="absolute -right-16 top-36 h-56 w-56 rounded-full border border-white/20" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-[#252525]">
                  ● WhatIf Explorer
                </span>
                <span className="text-[10px] font-semibold tracking-[0.12em] text-white/70">
                  01 / 03
                </span>
              </div>

              <div className="relative z-10 mt-20">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
                  A question to explore
                </p>
                <h2 className="mt-4 max-w-sm text-[42px] font-medium leading-[1.02] tracking-[-0.065em] sm:text-[50px]">
                  What if you started your own business?
                </h2>
                <p className="mt-5 max-w-sm text-[13px] leading-6 text-white/80">
                  One situation. Different choices. A clearer view of the
                  possibilities ahead.
                </p>
              </div>

              <div className="absolute bottom-7 left-6 right-6 z-10 rounded-[19px] border border-white/25 bg-[#E85D2B]/70 p-4 backdrop-blur-sm sm:left-8 sm:right-8">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-white/70">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  YOUR STARTING POINT
                </div>
                <p className="mt-3 text-[14px] font-medium leading-6">
                  “I have an idea, but I’m not sure which direction to take.”
                </p>
                <div className="mt-4 flex items-center justify-between text-[10px] text-white/65">
                  <span>Explore the question</span>
                  <Icon name="arrow" size={15} />
                </div>
              </div>
            </div>

            {/* Path list panel */}
            <div className="rounded-[28px] border border-black/[0.07] bg-[#F5F5F4] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#929292]">
                    Alternative paths
                  </p>
                  <h3 className="mt-2 text-[21px] font-medium tracking-[-0.045em]">
                    Explore your options
                  </h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-[#777]">
                  03 paths
                </span>
              </div>

              <div className="mt-7 space-y-3">
                {samplePaths.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => setActivePath(path.id)}
                    className={`w-full rounded-[18px] border p-4 text-left transition sm:p-5 ${
                      activePath === path.id
                        ? "border-[#FF6B35]/60 bg-white shadow-[0_5px_18px_rgba(0,0,0,0.045)]"
                        : "border-black/[0.055] bg-white/65 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                          activePath === path.id
                            ? "text-[#F36B39]"
                            : "text-[#929292]"
                        }`}
                      >
                        PATH {path.id}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          activePath === path.id
                            ? "border-[#FF6B35] bg-[#FF6B35] text-white"
                            : "border-[#D1D1D1] text-transparent"
                        }`}
                      >
                        <Icon name="check" size={12} />
                      </span>
                    </div>

                    <p className="mt-3 text-[16px] font-semibold tracking-[-0.025em]">
                      {path.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-[#888]">
                      {path.detail}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-black/[0.055] pt-3">
                      <span className="text-[10px] text-[#999]">
                        {path.status}
                      </span>
                      {activePath === path.id && (
                        <span className="rounded-full bg-[#FFF0E9] px-2.5 py-1 text-[9px] font-semibold text-[#D95B31]">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[17px] bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#999]">
                  Your selected path
                </p>
                <p className="mt-2 text-[14px] font-semibold">
                  {selectedPath.title}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#888]">
                  This path can be explored further by considering the
                  resources, risks, and next decisions involved.
                </p>
              </div>
            </div>

            {/* Analysis panel */}
            <div className="overflow-hidden rounded-[28px] border border-black/[0.07] bg-white">
              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                  Decision insights
                </div>
                <h3 className="mt-5 text-[27px] font-normal leading-[1.12] tracking-[-0.055em] sm:text-[31px]">
                  See the trade-offs before you choose.
                </h3>
              </div>

              <div className="mx-5 overflow-hidden rounded-[18px] border border-black/[0.07] sm:mx-7">
                <div className="flex items-center justify-between border-b border-black/[0.06] bg-[#FAFAF9] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold tracking-[-0.06em]">
                      WhatIf<span className="text-[#FF6B35]">.</span>
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#999]">
                      Analysis view
                    </span>
                  </div>
                  <span className="rounded-full bg-[#FFF0E9] px-2.5 py-1 text-[9px] font-semibold text-[#D95B31]">
                    Example
                  </span>
                </div>

                <div className="flex gap-5 border-b border-black/[0.06] px-4 py-3 text-[10px] font-medium text-[#999]">
                  <span className="border-b-2 border-[#FF6B35] pb-1 text-[#222]">
                    Overview
                  </span>
                  <span>Benefits</span>
                  <span>Risks</span>
                  <span>Assumptions</span>
                </div>

                <div className="space-y-0">
                  {[
                    ["Potential upside", "Validate demand before expanding", "text-[#22945A]"],
                    ["Key risk", "Time and available resources", "text-[#D66A36]"],
                    ["Important unknown", "How customers will respond", "text-[#777]"],
                    ["Next consideration", "What can you test first?", "text-[#777]"],
                  ].map(([label, value, color]) => (
                    <div
                      key={label}
                      className="border-b border-black/[0.055] px-4 py-4 last:border-0"
                    >
                      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0A0A0]">
                        {label}
                      </p>
                      <p className={`mt-1.5 text-[12px] font-medium ${color}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-5 mb-5 mt-4 rounded-[17px] bg-[#FFF5F0] p-4 sm:mx-7 sm:mb-7">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <Icon name="light" size={15} className="text-[#F06B39]" />
                  A question worth asking
                </div>
                <p className="mt-2 text-[11px] leading-5 text-[#777]">
                  What is the smallest practical step that could help you learn
                  whether this path makes sense?
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[10px] text-[#A0A0A0]">
            Illustrative product preview · Possible outcomes are not
            predictions or guarantees.
          </p>
        </div>
      </section>

      {/* Intro strip */}
      <section
        id="about"
        className="border-y border-black/[0.06] bg-[#F7F7F5] px-5 py-12 sm:px-8"
      >
        <div className="mx-auto grid max-w-[1350px] gap-8 md:grid-cols-3 md:gap-10">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6B35]" />
            <div>
              <p className="text-[14px] font-semibold">Think beyond one option</p>
              <p className="mt-1 text-[11px] text-[#929292]">
                Explore alternative directions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6B35]" />
            <div>
              <p className="text-[14px] font-semibold">
                Understand the trade-offs
              </p>
              <p className="mt-1 text-[11px] text-[#929292]">
                Consider benefits and risks
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6B35]" />
            <div>
              <p className="text-[14px] font-semibold">Keep your judgment</p>
              <p className="mt-1 text-[11px] text-[#929292]">
                You remain the decision-maker
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1350px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F06B39]">
              The idea behind WhatIf
            </p>
            <h2 className="mt-6 max-w-[700px] text-[clamp(2.7rem,5vw,5.2rem)] font-normal leading-[0.98] tracking-[-0.075em]">
              One question can lead to{" "}
              <span className="text-[#969390]">many directions.</span>
            </h2>
          </div>

          <div className="max-w-[570px] lg:justify-self-end">
            <p className="text-[16px] leading-8 text-[#777]">
              Important decisions are rarely simple. One choice can create new
              opportunities, introduce challenges, or change the direction of
              what comes next.
            </p>
            <p className="mt-5 text-[16px] leading-8 text-[#777]">
              WhatIf helps you slow down, examine your options, and explore
              different possibilities in a structured way.
            </p>
            <a
              href="#how-it-works"
              className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-[#E96535]"
            >
              Discover the process <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-[#F5F5F3] px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-[1350px]">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F06B39]">
                A clear process
              </p>
              <h2 className="mt-5 max-w-[760px] text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.075em]">
                From a question to{" "}
                <span className="text-[#969390]">different paths.</span>
              </h2>
            </div>
            <p className="max-w-[440px] text-[14px] leading-7 text-[#858585] lg:justify-self-end">
              Turn a complicated situation into a structured exploration of
              choices and possible consequences.
            </p>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {[
              {
                n: "01",
                icon: "message" as const,
                title: "Describe your situation",
                body: "Start with the question, challenge, or decision you are trying to understand. Add context that matters.",
              },
              {
                n: "02",
                icon: "branch" as const,
                title: "Explore different choices",
                body: "Consider alternative decisions, build paths, and examine how one choice could lead to another.",
              },
              {
                n: "03",
                icon: "chart" as const,
                title: "Compare possibilities",
                body: "Review potential outcomes, risks, benefits, and assumptions to think through your next move.",
              },
            ].map((item) => (
              <div
                key={item.n}
                className="min-h-[290px] rounded-[22px] border border-black/[0.055] bg-white p-7 sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0A0A0]">
                    {item.n} / 03
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0E9] text-[#F06B39]">
                    <Icon name={item.icon} size={19} />
                  </span>
                </div>
                <h3 className="mt-16 text-[20px] font-medium tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-[12px] leading-6 text-[#888]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="#start"
              className="inline-flex items-center gap-3 rounded-[14px] bg-[#171717] px-6 py-4 text-[12px] font-semibold text-white transition hover:bg-[#333]"
            >
              Try the scenario explorer <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Scenario builder */}
      <section id="start" className="px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1350px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F06B39]">
              Your possibilities start here
            </p>
            <h2 className="mt-5 text-[clamp(2.7rem,5vw,4.8rem)] font-normal leading-[0.98] tracking-[-0.075em]">
              What decision is on{" "}
              <span className="text-[#969390]">your mind?</span>
            </h2>
            <p className="mt-6 max-w-md text-[14px] leading-7 text-[#888]">
              Describe a situation you are thinking about. Start with one
              question, then consider the different directions you could take.
            </p>

            <div className="mt-10">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#AAA]">
                Need an idea? Try one
              </p>
              <div className="space-y-2">
                {[
                  "Should I start my own business?",
                  "What if I change my career?",
                  "Should I move to another country?",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setScenario(example)}
                    className="flex w-full items-center justify-between rounded-[13px] border border-black/[0.07] px-4 py-3.5 text-left text-[12px] text-[#666] transition hover:border-[#FF6B35]/50 hover:bg-[#FFF8F4]"
                  >
                    {example}
                    <Icon
                      name="arrow"
                      size={15}
                      className="text-[#F06B39]"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[25px] border border-black/[0.07] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.055)] sm:p-9">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#AAA]">
                  Scenario builder
                </p>
                <h3 className="mt-2 text-[22px] font-medium tracking-[-0.045em]">
                  Start with your question
                </h3>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0E9] text-[#F06B39]">
                <Icon name="spark" size={20} />
              </span>
            </div>

            <label
              htmlFor="scenario-input"
              className="mt-9 block text-[12px] font-semibold"
            >
              Describe your situation
            </label>

            <textarea
              id="scenario-input"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="For example: I have a full-time job, but I am considering starting my own business. What different paths could I explore?"
              rows={6}
              maxLength={1200}
              className="mt-3 w-full resize-y rounded-[15px] border border-black/[0.09] bg-[#F8F8F7] p-4 text-[13px] leading-7 outline-none transition placeholder:text-[#B5B5B5] focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10"
            />

            <div className="mt-2 flex justify-between text-[10px] text-[#AAA]">
              <span>Include the details that matter to your decision.</span>
              <span>{scenario.length}/1200</span>
            </div>

            <div className="mt-6 rounded-[14px] bg-[#F5F5F3] p-4">
              <div className="flex gap-3">
                <Icon
                  name="shield"
                  size={17}
                  className="mt-0.5 shrink-0 text-[#F06B39]"
                />
                <p className="text-[11px] leading-6 text-[#888]">
                  Your scenario is a starting point for exploration. Possible
                  outcomes should be treated as hypothetical, not certain
                  predictions.
                </p>
              </div>
            </div>

            <button
              onClick={handleExplore}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-[14px] bg-[#FF6B35] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#ed5d2b]"
            >
              Explore this scenario <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-[#171717] px-5 py-24 text-white sm:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-[1350px]">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF9068]">
                Built for better thinking
              </p>
              <h2 className="mt-5 max-w-[760px] text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.075em]">
                More than a question.{" "}
                <span className="text-[#FF9068]">
                  A world of possibilities.
                </span>
              </h2>
            </div>
            <p className="max-w-[440px] text-[13px] leading-7 text-white/45 lg:justify-self-end">
              A decision can have multiple dimensions. Explore the paths,
              understand the trade-offs, and see the bigger picture.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {featureItems.map((feature) => (
              <div
                key={feature.n}
                className="min-h-[235px] bg-[#202020] p-7 transition hover:bg-[#292929] sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-white/35">
                    {feature.n}
                  </span>
                  <Icon
                    name={feature.icon}
                    size={21}
                    className="text-[#FF9068]"
                  />
                </div>
                <h3 className="mt-12 text-[17px] font-medium">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-sm text-[11px] leading-6 text-white/45">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision tree */}
      <section className="bg-[#F6F6F4] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1350px]">
          <div className="max-w-[760px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F06B39]">
              Think in branches
            </p>
            <h2 className="mt-5 text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.075em]">
              See how one choice can{" "}
              <span className="text-[#969390]">change the path.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[13px] leading-7 text-[#888]">
              Explore a visual example of how different decisions can create
              different possibilities.
            </p>
          </div>

          <div className="mt-14 overflow-x-auto rounded-[23px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-10">
            <div className="min-w-[650px]">
              <div className="mx-auto w-64 rounded-[14px] bg-[#202020] p-5 text-center text-white">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
                  Starting point
                </span>
                <p className="mt-2 text-[13px] font-semibold">
                  You want to grow your business
                </p>
              </div>

              <div className="mx-auto h-10 w-px border-l border-dashed border-[#BBB]" />
              <div className="mx-auto h-px w-[66%] border-t border-dashed border-[#BBB]" />

              <div className="grid grid-cols-3">
                {[
                  {
                    label: "PATH A",
                    title: "Grow organically",
                    desc: "Build gradually",
                    color: "#FF6B35",
                  },
                  {
                    label: "PATH B",
                    title: "Invest in growth",
                    desc: "Commit more resources",
                    color: "#64748B",
                  },
                  {
                    label: "PATH C",
                    title: "Find a partner",
                    desc: "Share responsibilities",
                    color: "#222222",
                  },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="flex flex-col items-center"
                  >
                    <div className="h-8 w-px border-l border-dashed border-[#BBB]" />
                    <div className="w-[90%] rounded-[14px] border border-black/[0.07] p-4 text-center">
                      <span
                        className="text-[9px] font-bold tracking-wider"
                        style={{ color: p.color }}
                      >
                        {p.label}
                      </span>
                      <p className="mt-2 text-[12px] font-semibold">
                        {p.title}
                      </p>
                      <p className="mt-1 text-[10px] text-[#999]">
                        {p.desc}
                      </p>
                    </div>
                    <div className="h-8 w-px border-l border-dashed border-[#BBB]" />
                    <div className="w-[90%] rounded-[10px] bg-[#F6F6F4] p-3 text-center">
                      <p className="text-[10px] font-semibold">
                        Possible next step
                      </p>
                      <p className="mt-1 text-[9px] text-[#999]">
                        Another decision to consider
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <span className="rounded-full border border-[#FF6B35]/20 bg-[#FFF5F0] px-4 py-2 text-[9px] font-semibold text-[#D95B31]">
                  Illustrative decision tree · Not a prediction
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible approach */}
      <section
        id="principles"
        className="px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1350px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F06B39]">
              A responsible approach
            </p>
            <h2 className="mt-5 text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.075em]">
              Explore what could be.{" "}
              <span className="text-[#969390]">
                Never claim what will be.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-[14px] leading-8 text-[#888]">
              The future is not something a tool can know with certainty.
              WhatIf is built around exploring possibilities, examining
              assumptions, and helping people think more carefully about their
              decisions.
            </p>
          </div>

          <div className="space-y-2">
            {[
              [
                "Possibilities, not predictions",
                "We present hypothetical paths rather than claiming to know future events.",
                "compass" as const,
              ],
              [
                "Assumptions made clear",
                "Scenario outcomes depend on the information and assumptions used.",
                "light" as const,
              ],
              [
                "Risks and benefits together",
                "We encourage consideration of both potential advantages and disadvantages.",
                "chart" as const,
              ],
              [
                "Your judgment comes first",
                "WhatIf supports your thinking. It does not make important decisions for you.",
                "shield" as const,
              ],
            ].map(([title, body, icon]) => (
              <div
                key={title}
                className="flex gap-4 rounded-[16px] border border-black/[0.07] bg-[#FAFAF9] p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E9] text-[#F06B39]">
                  <Icon name={icon as IconName} size={18} />
                </span>
                <div>
                  <h3 className="text-[13px] font-semibold">{title}</h3>
                  <p className="mt-2 text-[11px] leading-6 text-[#888]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="bg-[#F6F6F4] px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1350px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F06B39]">
              Questions & answers
            </p>
            <h2 className="mt-5 text-[clamp(2.7rem,5vw,4.7rem)] font-normal leading-[0.98] tracking-[-0.075em]">
              Good questions deserve{" "}
              <span className="text-[#969390]">clear answers.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[13px] leading-7 text-[#888]">
              Learn more about the WhatIf concept, how scenario exploration
              works, and what to expect.
            </p>
          </div>

          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {faqs.map(([question, answer], index) => (
              <div key={question}>
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-5 py-6 text-left"
                  aria-expanded={expandedFaq === index}
                >
                  <span className="text-[13px] font-semibold sm:text-[15px]">
                    {question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      expandedFaq === index
                        ? "rotate-45 bg-[#FFECE3] text-[#F06B39]"
                        : "bg-white text-[#777]"
                    }`}
                  >
                    <Icon name="plus" size={16} />
                  </span>
                </button>

                {expandedFaq === index && (
                  <p className="max-w-2xl pb-6 pr-10 text-[12px] leading-7 text-[#888]">
                    {answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[28px] bg-[#FF713B] px-6 py-20 text-center text-white sm:px-12 lg:py-28">
          <div className="pointer-events-none absolute -right-20 -top-36 h-96 w-96 rounded-full border border-white/20" />
          <div className="pointer-events-none absolute -right-5 -top-20 h-64 w-64 rounded-full border border-white/20" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/20" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Icon name="spark" size={23} />
            </span>

            <h2 className="mt-7 text-[clamp(2.7rem,6vw,5.8rem)] font-normal leading-[0.95] tracking-[-0.075em]">
              The next step starts with a question.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-[13px] leading-7 text-white/80 sm:text-[15px]">
              Explore different choices. Think through possible outcomes. Give
              yourself a clearer way to consider what comes next.
            </p>

            <a
              href="#start"
              className="mt-9 inline-flex items-center gap-3 rounded-[14px] bg-white px-7 py-4 text-[12px] font-semibold text-[#171717] transition hover:-translate-y-1 hover:shadow-xl"
            >
              Explore what could be <Icon name="arrow" size={16} />
            </a>

            <p className="mt-5 text-[9px] font-semibold tracking-[0.16em] text-white/65">
              WHATIF · EXPLORE WHAT COULD BE.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Lab: rendered here so it appears directly before footer */}
      <SiteEnhancements />

      {/* Footer */}
      <footer className="bg-[#191919] px-5 pb-8 pt-16 text-white sm:px-8">
        <div className="mx-auto max-w-[1350px]">
          <div className="grid gap-10 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <a
                href="#home"
                className="inline-flex items-center"
                aria-label="WhatIf home"
              >
                <WhatIfLogo
                  theme="dark"
                  variant="wordmark"
                  className="!h-[50px] !w-[175px] object-contain"
                />
              </a>

              <p className="mt-5 max-w-xs text-[12px] leading-7 text-white/40">
                A space to explore decisions, understand possibilities, and
                think through different paths.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold">Explore</h4>
              <div className="mt-5 space-y-3 text-[11px] text-white/45">
                <a className="block hover:text-white" href="#how-it-works">
                  How it works
                </a>
                <a className="block hover:text-white" href="#features">
                  Capabilities
                </a>
                <a className="block hover:text-white" href="#start">
                  Scenario explorer
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold">Learn</h4>
              <div className="mt-5 space-y-3 text-[11px] text-white/45">
                <a className="block hover:text-white" href="#principles">
                  Our approach
                </a>
                <a className="block hover:text-white" href="#faq">
                  FAQs
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold">Contact</h4>
              <div className="mt-5 space-y-4 text-[11px] text-white/50">
                <a
                  className="flex items-start gap-2 transition hover:text-white"
                  href="mailto:iam.arslan.laghari@gmail.com"
                >
                  <Icon name="message" size={15} />
                  <span className="break-all">iam.arslan.laghari@gmail.com</span>
                </a>

                <a
                  className="flex items-center gap-2 transition hover:text-white"
                  href="https://wa.me/923272819101"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="message" size={15} />
                  +92 327 2819101
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 pt-7 text-center sm:flex-row sm:text-left">
            <p className="text-[9px] text-white/35">
              © 2026 WhatIf. All rights reserved.
            </p>

            <p className="text-[9px] text-white/35">
              Possibilities, not predictions.
            </p>

            <p className="text-[9px] text-white/45">
              Made by <span className="font-semibold text-white/70">Arslan Laghari</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
