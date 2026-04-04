const TP_PAGE_URL = "https://nl.trustpilot.com/review/endatech.nl";

export interface TrustpilotData {
  score: number;
  reviews: number;
}

const FALLBACK: TrustpilotData = { score: 4.9, reviews: 68 };

export async function fetchTrustpilotData(): Promise<TrustpilotData> {
  try {
    const res = await fetch(TP_PAGE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        "Accept-Language": "nl-NL,nl;q=0.9",
      },
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) return FALLBACK;

    const html = await res.text();

    const scoreMatch = html.match(/"ratingValue":"([\d.]+)"/);
    const reviewMatch = html.match(/"reviewCount":(\d+)/);

    const score = scoreMatch ? parseFloat(scoreMatch[1]) : FALLBACK.score;
    // Use the highest known count — Trustpilot may lag on pending reviews
    const liveReviews = reviewMatch ? parseInt(reviewMatch[1]) : 0;
    const reviews = Math.max(liveReviews, FALLBACK.reviews);

    return { score, reviews };
  } catch {
    return FALLBACK;
  }
}
