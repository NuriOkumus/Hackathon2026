"use client";

import { useState, useEffect } from "react";

/**
 * Detects whether the device is a touch-only device (no fine pointer / no hover).
 * Returns `true` on mobile/tablet, `false` on desktop with a mouse.
 * Defaults to `true` (safe fallback — disables heavy effects) until hydrated.
 */
export function useIsTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState<boolean>(true); // safe default for SSR

    useEffect(() => {
        // Run only on client side
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");

        // Use a function to set the state avoiding synchronous effect setting directly
        const updateIsTouch = () => setIsTouch(!mq.matches);

        // Initial set - without causing cascading renders strictly 
        updateIsTouch();

        mq.addEventListener("change", updateIsTouch);
        return () => mq.removeEventListener("change", updateIsTouch);
    }, []);

    return isTouch;
}
