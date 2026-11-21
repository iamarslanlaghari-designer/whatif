
import Image from "next/image";

type WhatIfLogoProps = {
  theme?: "light" | "dark";
  variant?: "wordmark" | "mark";
  className?: string;
  priority?: boolean;
};

export default function WhatIfLogo({
  theme = "light",
  variant = "wordmark",
  className = "",
  priority = false,
}: WhatIfLogoProps) {
  const logoFile =
    variant === "mark"
      ? theme === "dark"
        ? "/whatif-mark-white.png"
        : "/whatif-mark-black.png"
      : theme === "dark"
        ? "/whatif-wordmark-white.png"
        : "/whatif-wordmark-black.png";

  const isMark = variant === "mark";

  return (
    <Image
      src={logoFile}
      alt="WhatIf — Explore What Could Be"
      width={isMark ? 48 : 220}
      height={isMark ? 48 : 64}
      priority={priority}
      className={`h-auto object-contain ${
        isMark ? "w-10" : "w-40 sm:w-48"
      } ${className}`}
    />
  );
}
