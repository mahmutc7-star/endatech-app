"use client";

import Script from "next/script";
import { useRef, useEffect } from "react";

const BUSINESS_UNIT_ID = "668aae6374c09786cb00a814";
const SCRIPT_SRC = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
  }
}

function loadWidget(el: HTMLElement | null) {
  if (!el) return;
  if (window.Trustpilot) {
    window.Trustpilot.loadFromElement(el, true);
  }
}

function useTrustpilotWidget(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    // Try immediately if script already loaded (e.g. navigating back to page)
    loadWidget(ref.current);

    // Retry loop — keeps trying until Trustpilot is available
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.Trustpilot) {
        loadWidget(ref.current);
        clearInterval(interval);
      } else if (++attempts > 20) {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Smalle balk in de header */
export function TrustpilotBanner() {
  const ref = useRef<HTMLDivElement>(null);
  useTrustpilotWidget(ref);

  return (
    <>
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => loadWidget(ref.current)}
      />
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="nl-NL"
        data-template-id="5406e65db0d04a09e042d5fc"
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="28px"
        data-style-width="100%"
        data-theme="light"
      >
        <a
          href="https://nl.trustpilot.com/review/endatech.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:underline"
        >
          Bekijk onze reviews op Trustpilot
        </a>
      </div>
    </>
  );
}

/** Grotere widget op de homepage */
export function TrustpilotHomepage() {
  const ref = useRef<HTMLDivElement>(null);
  useTrustpilotWidget(ref);

  return (
    <>
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => loadWidget(ref.current)}
      />
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="nl-NL"
        data-template-id="5419b6a8b0d04a076446a9ad"
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="52px"
        data-style-width="100%"
        data-theme="light"
      >
        <a
          href="https://nl.trustpilot.com/review/endatech.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:underline"
        >
          Bekijk onze reviews op Trustpilot
        </a>
      </div>
    </>
  );
}
