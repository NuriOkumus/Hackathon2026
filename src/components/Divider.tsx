/**
 * Decorative section divider — a subtle SVG separator between sections.
 * No longer uses opaque from/to colors. Instead, uses a semi-transparent
 * gradient overlay that maintains the premium background visibility.
 */
export default function Divider({
    variant = "slant",
}: {
    variant?: "wave" | "slant" | "slant-r";
}) {
    return (
        <div className="relative" style={{ lineHeight: 0 }}>
            <svg
                viewBox="0 0 1440 70"
                preserveAspectRatio="none"
                style={{ display: "block", width: "100%", height: "50px" }}
                aria-hidden="true"
            >
                {variant === "slant" && (
                    <polygon
                        points="0,0 1440,70 1440,70 0,70"
                        fill="rgba(255,255,255,0.02)"
                    />
                )}
                {variant === "slant-r" && (
                    <polygon
                        points="0,70 1440,0 1440,70"
                        fill="rgba(255,255,255,0.02)"
                    />
                )}
                {variant === "wave" && (
                    <path
                        d="M0,35 C180,0 360,70 540,35 C720,0 900,70 1080,35 C1260,0 1380,55 1440,35 L1440,70 L0,70 Z"
                        fill="rgba(255,255,255,0.02)"
                    />
                )}
                {/* Thin accent line at the edge */}
                {variant === "slant" && (
                    <line x1="0" y1="0" x2="1440" y2="70" stroke="rgba(34,211,238,0.08)" strokeWidth="1" />
                )}
                {variant === "slant-r" && (
                    <line x1="0" y1="70" x2="1440" y2="0" stroke="rgba(34,211,238,0.08)" strokeWidth="1" />
                )}
            </svg>
        </div>
    );
}
