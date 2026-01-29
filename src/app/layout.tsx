import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import Header from '@/components/layout/Header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'OpdrachtHub - Vind de perfecte match voor uw opdracht',
  description:
    'OpdrachtHub verbindt opdrachtgevers met zelfstandige professionals. Plaats opdrachten, vind talent, en werk samen.',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
  metadataBase: new URL('https://www.opdrachthub.nl'),
  openGraph: {
    title: 'OpdrachtHub - Vind de perfecte match voor uw opdracht',
    description: 'OpdrachtHub verbindt opdrachtgevers met zelfstandige professionals. Plaats opdrachten, vind talent, en werk samen.',
    url: 'https://www.opdrachthub.nl',
    siteName: 'OpdrachtHub',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpdrachtHub - Vind de perfecte match voor uw opdracht',
    description: 'OpdrachtHub verbindt opdrachtgevers met zelfstandige professionals.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="bg-slate-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <img src="/icon.svg" alt="OpdrachtHub" className="h-8 w-8" />
                      <span className="text-xl font-bold">
                        Opdracht<span className="text-emerald-500">Hub</span>
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Het platform dat opdrachtgevers en zelfstandige professionals verbindt.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Platform</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                      <li><a href="/opdrachten" className="hover:text-emerald-500 transition-colors">Opdrachten</a></li>
                      <li><a href="/registreren" className="hover:text-emerald-500 transition-colors">Registreren</a></li>
                      <li><a href="/login" className="hover:text-emerald-500 transition-colors">Inloggen</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Voorwaarden</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                      <li><a href="/voorwaarden/zzp" className="hover:text-emerald-500 transition-colors">Voorwaarden ZZP'ers</a></li>
                      <li><a href="/voorwaarden/opdrachtgever" className="hover:text-emerald-500 transition-colors">Voorwaarden Opdrachtgevers</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Over ons</h3>
                    <p className="text-slate-400 text-sm">
                      OpdrachtHub is een bemiddelingsplatform. Wij faciliteren de match en contractvorming tussen opdrachtgevers en ZZP'ers.
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
                  <p>&copy; {new Date().getFullYear()} OpdrachtHub. Alle rechten voorbehouden.</p>
                </div>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
