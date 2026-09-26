"use client";

/**
 * SmoothScrollProvider — now a pure passthrough.
 * Lenis was removed because it caused severe jank (14 FPS, 93% frame drops)
 * on this content-heavy page. Native browser scrolling is much smoother.
 */
export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
