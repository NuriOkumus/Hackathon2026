"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";
import CustomCursor from "./CustomCursor";
import ScrollProgress from "./ScrollProgress";
import StickyBar from "./StickyBar";

const EXCLUDED_PATHS = ["/admin", "/apply", "/katilim-sartlari", "/kvkk", "/gizlilik", "/program", "/submit"];

export default function GlobalLayoutComponents() {
  const pathname = usePathname();
  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  // On excluded paths Preloader never mounts, so hide the SSR cover here instead
  useEffect(() => {
    if (isExcluded) {
      const cover = document.getElementById("ssr-cover");
      if (cover) cover.style.display = "none";
    }
  }, [isExcluded]);

  return (
    <>
      <CustomCursor />
      {!isExcluded && (
        <>
          <Preloader />
          <ScrollProgress />
          <StickyBar />
        </>
      )}
    </>
  );
}
