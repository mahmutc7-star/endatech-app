import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'OpdrachtHub - Vind de perfecte match voor uw opdracht'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="100"
            height="100"
            viewBox="0 0 256 256"
            style={{ marginRight: 24 }}
          >
            <rect x="16" y="16" width="224" height="224" rx="56" fill="#0F172A" stroke="#10b981" strokeWidth="4"/>
            <g transform="translate(64,40) scale(2.0)">
              <path d="M32 4C20.4 4 11 13.4 11 25c0 13.8 17.7 34.5 20 37.1c.5.6 1.5.6 2 0C35.3 59.5 53 38.8 53 25 53 13.4 43.6 4 32 4zM32 15c5.5 0 10 4.5 10 10 0 5.1-3.8 9.3-8.7 9.9c-.4.1-.7.4-.7.8v3.2l6.2-3.6c.3-.2.7-.2 1 0l4.6 2.7c.6.4.4 1.3-.3 1.5l-5.6 1.7v5.1c0 .8-.9 1.2-1.5.7l-4.4-4.1l-4.4 4.1c-.6.5-1.5.1-1.5-.7v-5.1l-5.6-1.7c-.7-.2-.9-1.1-.3-1.5l4.6-2.7c.3-.2.7-.2 1 0l6.2 3.6v-3.2c0-.4-.3-.7-.7-.8C25.8 34.3 22 30.1 22 25c0-5.5 4.5-10 10-10z" fill="#10b981"/>
              <circle cx="32" cy="25" r="2.2" fill="#10b981"/>
              <circle cx="26" cy="29.5" r="1.9" fill="#10b981"/>
              <circle cx="38" cy="29.5" r="1.9" fill="#10b981"/>
            </g>
          </svg>
          <span style={{ fontSize: 64, color: 'white', fontWeight: 'bold' }}>
            Opdracht
            <span style={{ color: '#10b981' }}>Hub</span>
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Vind de perfecte match voor uw opdracht
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#64748b',
            marginTop: 20,
          }}
        >
          Verbindt opdrachtgevers met zelfstandige professionals
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
