"use client";

import { useEffect, useRef } from "react";

// If you're using Next.js, ensure NEXT_PUBLIC_TURNSTILE_SITEKEY is defined in your .env.local.
// Otherwise, this fallback will be used.
const getSiteKey = () => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY) {
    return process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;
  }
  return "0x4AAAAAAA-sYmxnwb0OWcFMjF1eLI4Ne8o"; // Replace with your actual site key
};

const CaptchaWidget = ({ onVerify }) => {
  const captchaRef = useRef(null);
  const sitekey = getSiteKey();

  useEffect(() => {
    const initializeTurnstile = () => {
      if (window.turnstile && captchaRef.current) {
        // Clear the container to avoid duplicate renders
        captchaRef.current.innerHTML = "";
        try {
          window.turnstile.render(captchaRef.current, {
            sitekey,
            theme: "light", // Change to "dark" if preferred
            callback: (token) => {
              if (onVerify) {
                onVerify(token);
              }
            },
          });
        } catch (error) {
          console.error("Error rendering Turnstile widget:", error);
        }
      }
    };

    // Check if the Turnstile script is already present.
    const existingScript = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = initializeTurnstile;
      document.body.appendChild(script);
    } else {
      initializeTurnstile();
    }
    // Do not remove the script on unmount; let it persist.
  }, [onVerify, sitekey]);

  return (
    <div className="my-4">
      <div
        ref={captchaRef}
        className="w-full h-[65px] bg-secondary/50 rounded-xl flex items-center justify-center text-sm text-muted-foreground"
      >
        Loading Captcha...
      </div>
    </div>
  );
};

export default CaptchaWidget;
