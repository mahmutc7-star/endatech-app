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
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#10b981',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <span style={{ fontSize: 48, color: 'white', fontWeight: 'bold' }}>O</span>
          </div>
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
