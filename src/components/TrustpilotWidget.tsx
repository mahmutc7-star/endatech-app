"use client";

import { useEffect } from "react";

const BUSINESS_UNIT_ID = "668aae6374c09786cb00a814";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement) => void };
  }
}

export function TrustpilotBanner() {
  useEffect(() => {
    if (window.Trustpilot) {
      const el = document.getElementById("trustpilot-banner");
      if (el) window.Trustpilot.loadFromElement(el);
    }
  }, []);

  return (
    <>
      <script
        async
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
      />
      <div
        id="trustpilot-banner"
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

export function TrustpilotHomepage() {
  useEffect(() => {
    if (window.Trustpilot) {
      const el = document.getElementById("trustpilot-homepage");
      if (el) window.Trustpilot.loadFromElement(el);
    }
  }, []);

  return (
    <>
      <script
        async
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
      />
      <div
        id="trustpilot-homepage"
        className="trustpilot-widget"
        data-locale="nl-NL"
        data-template-id="53aa8807dec7e10d38f59f32"
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="150px"
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
