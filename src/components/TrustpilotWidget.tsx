const TP_URL = "https://nl.trustpilot.com/review/endatech.nl";
const SCORE = 4.9;
const REVIEWS = 68;

function TrustpilotLogo({ height = 18 }: { height?: number }) {
  // Official Trustpilot logo: green star + wordmark
  return (
    <svg height={height} viewBox="0 0 137 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Trustpilot">
      {/* Green star */}
      <path d="M13 0L15.9 9H25.4L18.2 14.5L21 23.5L13 18L5 23.5L7.8 14.5L0.6 9H10.1L13 0Z" fill="#00b67a"/>
      {/* Wordmark */}
      <text x="30" y="20" fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fontWeight="700" fontSize="18" fill="#191919" letterSpacing="-0.3">Trustpilot</text>
    </svg>
  );
}

function StarRating({ score, size = 18 }: { score: number; size?: number }) {
  const full = Math.floor(score);
  const partial = score - full;

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${score} van 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = i < full ? "#00b67a" : i === full && partial > 0 ? "url(#half)" : "#dcdce6";
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {i === full && partial > 0 && (
              <defs>
                <linearGradient id="half">
                  <stop offset={`${Math.round(partial * 100)}%`} stopColor="#00b67a" />
                  <stop offset={`${Math.round(partial * 100)}%`} stopColor="#dcdce6" />
                </linearGradient>
              </defs>
            )}
            <path d="M12 2l2.9 6.3 6.8.6-5 4.7 1.5 6.8L12 17.3l-6.2 3.1 1.5-6.8-5-4.7 6.8-.6L12 2z" fill={fill} />
          </svg>
        );
      })}
    </span>
  );
}

/** Smalle balk in de header */
export function TrustpilotBanner() {
  return (
    <a
      href={TP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      aria-label={`EndaTech scoort ${SCORE} op Trustpilot gebaseerd op ${REVIEWS} beoordelingen`}
    >
      <TrustpilotLogo height={16} />
      <StarRating score={SCORE} size={14} />
      <span className="text-xs text-gray-500">
        <strong className="text-gray-700">{SCORE}</strong> · {REVIEWS} beoordelingen
      </span>
    </a>
  );
}

/** Grotere widget op de homepage */
export function TrustpilotHomepage() {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-3">Wat onze klanten zeggen</p>
      <a
        href={TP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-col items-center gap-2 group"
        aria-label={`EndaTech scoort ${SCORE} op Trustpilot gebaseerd op ${REVIEWS} beoordelingen`}
      >
        <TrustpilotLogo height={22} />
        <StarRating score={SCORE} size={28} />
        <p className="text-sm text-gray-600">
          TrustScore <strong>{SCORE}</strong> op basis van{" "}
          <strong>{REVIEWS} beoordelingen</strong>
        </p>
        <span className="text-xs text-[#00b67a] group-hover:underline">
          Bekijk alle beoordelingen →
        </span>
      </a>
    </div>
  );
}
