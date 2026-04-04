import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.endatech.nl"),
  title: "EndaTech - Betaalbare airco's, snel geplaatst",
  description: "Bij EndaTech regel je snel en voordelig een airco inclusief montage. Scherpe prijzen, snelle installatie, levering + montage.",
  keywords: ["airco", "airconditioning", "installatie", "koeling", "verwarming", "warmtepomp", "Nederland"],
  authors: [{ name: "EndaTech" }],
  openGraph: {
    title: "EndaTech - Betaalbare airco's, snel geplaatst",
    description: "Bij EndaTech regel je snel en voordelig een airco inclusief montage. Scherpe prijzen, snelle installatie.",
    type: "website",
    locale: "nl_NL",
    url: "https://www.endatech.nl",
    siteName: "EndaTech",
    images: [
      {
        url: "https://www.endatech.nl/og-image.png",
        width: 2000,
        height: 500,
        alt: "EndaTech - Betaalbare airco's, snel geplaatst",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="min-h-screen flex flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
