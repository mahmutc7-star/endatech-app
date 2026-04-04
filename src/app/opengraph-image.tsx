import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EndaTech - Betaalbare airco's, snel geplaatst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoData = await fetch(
    new URL("/logo-horizontal.png", "https://www.endatech.nl")
  ).then((r) => r.arrayBuffer());

  const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            borderRadius: 32,
            padding: "50px 80px",
            width: 1000,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="EndaTech" style={{ height: 90, marginBottom: 32, objectFit: "contain" }} />

          {/* Tagline */}
          <div
            style={{
              fontSize: 30,
              color: "#4b5563",
              fontWeight: 500,
              textAlign: "center",
              marginBottom: 28,
            }}
          >
            Betaalbare airco&apos;s · Snel geplaatst · F-Gassen gecertificeerd
          </div>

          {/* Divider */}
          <div
            style={{
              width: 80,
              height: 4,
              background: "#2563eb",
              borderRadius: 2,
              marginBottom: 24,
            }}
          />

          {/* Contact */}
          <div style={{ display: "flex", gap: 48, color: "#6b7280", fontSize: 22 }}>
            <span>📞 06-41088447</span>
            <span>🌐 endatech.nl</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
