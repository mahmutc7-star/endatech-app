"use client";

import { useState } from "react";
import Link from "next/link";
import SignaturePad from "@/components/signing/SignaturePad";

interface QuoteLine {
  productName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Quote {
  quoteNumber: string;
  name: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  propertyType: string;
  rooms: string;
  description: string | null;
  totalAmount: number | null;
  btwPercentage: number;
  validUntil: string | null;
  status: string;
  signed: boolean;
  signedAt: string | null;
  lines: QuoteLine[];
}

function fmt(n: number) {
  return n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function OfferteBekijkenPage() {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuote(null);

    try {
      const response = await fetch(`/api/quotes/${quoteNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Offerte niet gevonden");
      }

      setQuote(data);
      if (data.signed) {
        setSigned(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan");
    } finally {
      setLoading(false);
    }
  }

  async function handleSign(signData: { signature: string; device: unknown; location: unknown }) {
    if (!quote) return;
    setShowSignaturePad(false);
    setSigning(true);

    try {
      const response = await fetch(`/api/quotes/${quote.quoteNumber}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: signData.signature,
          device: signData.device,
          location: signData.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ondertekenen mislukt");
      }

      setSigned(true);
      setQuote({ ...quote, signed: true, signedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan");
    } finally {
      setSigning(false);
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: { text: string; color: string } } = {
      PENDING: { text: "In behandeling", color: "bg-yellow-100 text-yellow-800" },
      SENT: { text: "Verzonden", color: "bg-blue-100 text-blue-800" },
      VIEWED: { text: "Bekeken", color: "bg-purple-100 text-purple-800" },
      SIGNED: { text: "Ondertekend", color: "bg-green-100 text-green-800" },
      ACCEPTED: { text: "Geaccepteerd", color: "bg-green-100 text-green-800" },
      COMPLETED: { text: "Voltooid", color: "bg-gray-100 text-gray-800" },
      EXPIRED: { text: "Verlopen", color: "bg-red-100 text-red-800" },
      CANCELLED: { text: "Geannuleerd", color: "bg-red-100 text-red-800" },
    };
    return labels[status] || { text: status, color: "bg-gray-100 text-gray-800" };
  };

  // Calculate totals from lines
  const subtotal = quote?.lines.reduce((sum, l) => sum + l.lineTotal, 0) ?? 0;
  const btwPct = quote?.btwPercentage ?? 21;
  const btwAmount = subtotal * (btwPct / 100);
  const totalInclBtw = subtotal + btwAmount;

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Offerte bekijken
          </h1>
          <p className="text-lg text-gray-600">
            Heb je een offerte ontvangen van EndaTech? Voer hieronder je offertenummer in.
          </p>
        </div>

        {/* Lookup Form */}
        {!quote && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Offerte openen</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLookup}>
              <div className="mb-6">
                <label htmlFor="quoteNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Offertenummer
                </label>
                <input
                  type="text"
                  id="quoteNumber"
                  value={quoteNumber}
                  onChange={(e) => setQuoteNumber(e.target.value.toUpperCase())}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all font-mono text-lg"
                  placeholder="END-2026-00124"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !quoteNumber}
                className="w-full py-4 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Bezig met zoeken..." : "Bekijk offerte"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4">Wat kun je doen?</h3>
              <ul className="space-y-3">
                {["Offerte bekijken", "PDF downloaden", "Digitaal ondertekenen"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-[#22D3EE]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">Problemen?</h3>
              <p className="text-gray-600">
                Neem contact op via{" "}
                <a href="mailto:info@endatech.nl" className="text-[#2563EB] hover:underline">
                  info@endatech.nl
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Quote Display */}
        {quote && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => {
                setQuote(null);
                setQuoteNumber("");
                setSigned(false);
              }}
              className="text-[#2563EB] hover:underline flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Andere offerte bekijken
            </button>

            {/* Quote header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Offertenummer</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">{quote.quoteNumber}</p>
                </div>
                <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getStatusLabel(quote.status).color}`}>
                  {getStatusLabel(quote.status).text}
                </div>
              </div>

              {/* Customer info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Klantgegevens</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="text-gray-400">Naam:</span> {quote.name}</p>
                    <p><span className="text-gray-400">E-mail:</span> {quote.email}</p>
                    <p><span className="text-gray-400">Adres:</span> {quote.address}</p>
                    <p><span className="text-gray-400">Postcode/Plaats:</span> {quote.postalCode} {quote.city}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Projectdetails</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="text-gray-400">Type pand:</span> {quote.propertyType}</p>
                    <p><span className="text-gray-400">Ruimte(s):</span> {quote.rooms}</p>
                  </div>
                </div>
              </div>

              {/* Quote description */}
              {quote.description && (
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-3">Offerte beschrijving</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 whitespace-pre-wrap">{quote.description}</p>
                  </div>
                </div>
              )}

              {/* Line items table */}
              {quote.lines.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-3">Producten & diensten</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Omschrijving</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Aantal</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Prijs/stuk</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Totaal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quote.lines.map((line, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="py-3 px-4 text-gray-900 font-medium">{line.productName}</td>
                            <td className="py-3 px-4 text-gray-600">{line.description || "—"}</td>
                            <td className="py-3 px-4 text-right text-gray-900">{line.quantity}</td>
                            <td className="py-3 px-4 text-right text-gray-900">€ {fmt(line.unitPrice)}</td>
                            <td className="py-3 px-4 text-right text-gray-900 font-medium">€ {fmt(line.lineTotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-4 flex justify-end">
                    <div className="w-72 space-y-2 text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Subtotaal (excl. BTW)</span>
                        <span className="text-gray-900">€ {fmt(subtotal)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">BTW ({btwPct}%)</span>
                        <span className="text-gray-900">€ {fmt(btwAmount)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-200 text-base">
                        <span className="font-semibold text-gray-900">Totaal (incl. BTW)</span>
                        <span className="font-bold text-[#2563EB]">€ {fmt(totalInclBtw)}</span>
                      </div>
                    </div>
                  </div>

                  {quote.validUntil && (
                    <p className="text-sm text-gray-500 mt-3 text-right">
                      Offerte geldig tot: {new Date(quote.validUntil).toLocaleDateString("nl-NL")}
                    </p>
                  )}
                </div>
              )}

              {/* Fallback: show old-style total if no lines */}
              {quote.lines.length === 0 && quote.totalAmount && (
                <div className="bg-[#2563EB]/5 rounded-xl p-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Totaalbedrag</span>
                    <span className="text-3xl font-bold text-[#2563EB]">
                      € {fmt(Number(quote.totalAmount))}
                    </span>
                  </div>
                  {quote.validUntil && (
                    <p className="text-sm text-gray-500 mt-2">
                      Geldig tot: {new Date(quote.validUntil).toLocaleDateString("nl-NL")}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              {showSignaturePad && (
                <SignaturePad
                  signerName={quote.name}
                  onSave={handleSign}
                  onCancel={() => setShowSignaturePad(false)}
                />
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {!signed && quote.status !== "PENDING" && (
                  <button
                    onClick={() => setShowSignaturePad(true)}
                    disabled={signing}
                    className="flex-1 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {signing ? "Bezig met ondertekenen..." : "Offerte ondertekenen"}
                  </button>
                )}
                {signed && (
                  <div className="flex-1 py-4 bg-green-100 text-green-800 font-semibold rounded-lg text-center">
                    Offerte ondertekend op {quote.signedAt ? new Date(quote.signedAt).toLocaleDateString("nl-NL") : "vandaag"}
                  </div>
                )}
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>

              {quote.status === "PENDING" && (
                <p className="mt-4 text-center text-gray-500 text-sm">
                  Je offerte wordt nog samengesteld. Je kunt ondertekenen zodra de offerte gereed is.
                </p>
              )}
            </div>
          </div>
        )}

        {/* No quote CTA */}
        {!quote && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Nog geen offerte?</p>
            <Link
              href="/offerte-aanvragen"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Vraag nu een offerte aan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
