
import Link from "next/link";
import WhatIfLogo from "@/components/whatif-logo";

export default function SiteFooter() {
  return (
    <footer className="bg-[#191919] px-5 pb-8 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-[1350px]">
        <div className="grid gap-10 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          <div>
            <Link href="/" className="inline-flex items-center" aria-label="WhatIf home">
              <WhatIfLogo
                theme="dark"
                variant="wordmark"
                className="!h-[50px] !w-[175px] object-contain"
              />
            </Link>

            <p className="mt-5 max-w-xs text-[12px] leading-7 text-white/40">
              A space to explore decisions, understand possibilities, and
              think through different paths.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold">Explore</h4>
            <div className="mt-5 space-y-3 text-[11px] text-white/45">
              <Link className="block hover:text-white" href="/how-it-works">How it works</Link>
              <Link className="block hover:text-white" href="/features">Capabilities</Link>
              <Link className="block hover:text-white" href="/explore">Scenario explorer</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold">Learn</h4>
            <div className="mt-5 space-y-3 text-[11px] text-white/45">
              <Link className="block hover:text-white" href="/about">About us</Link>
              <Link className="block hover:text-white" href="/faq">FAQs</Link>
              <Link className="block hover:text-white" href="/privacy">Privacy policy</Link>
              <Link className="block hover:text-white" href="/terms">Terms of service</Link>
              <Link className="block hover:text-white" href="/disclaimer">Disclaimer</Link>
              <Link className="block hover:text-white" href="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold">Contact</h4>
            <div className="mt-5 space-y-4 text-[11px] text-white/50">
              <a className="block break-all transition hover:text-white" href="mailto:iam.arslan.laghari@gmail.com">
                iam.arslan.laghari@gmail.com
              </a>
              <a className="block transition hover:text-white" href="https://wa.me/923272819101" target="_blank" rel="noopener noreferrer">
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
        </div>
      </div>
    </footer>
  );
}
