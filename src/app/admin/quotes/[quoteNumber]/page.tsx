"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface QuoteLine {
  id?: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Quote {
  quoteNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  propertyType: string;
  rooms: string;
  notes: string | null;
  description: string | null;
  totalAmount: number | null;
  btwPercentage: number;
  validUntil: string | null;
  signed: boolean;
  signedAt: string | null;
  signature: string | null;
  signedIp: string | null;
  signedDevice: string | null;
  signedLocation: string | null;
  status: string;
  createdAt: string;
  lines: QuoteLine[];
}

const STATUSES = [
  { value: "PENDING",   label: "In behandeling" },
  { value: "SENT",      label: "Verzonden" },
  { value: "VIEWED",    label: "Bekeken" },
  { value: "SIGNED",    label: "Ondertekend" },
  { value: "ACCEPTED",  label: "Geaccepteerd" },
  { value: "COMPLETED", label: "Voltooid" },
  { value: "EXPIRED",   label: "Verlopen" },
  { value: "CANCELLED", label: "Geannuleerd" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800",
  SENT:      "bg-blue-100 text-blue-800",
  VIEWED:    "bg-purple-100 text-purple-800",
  SIGNED:    "bg-green-100 text-green-800",
  ACCEPTED:  "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  EXPIRED:   "bg-red-100 text-red-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const EMPTY_LINE: QuoteLine = { productName: "", description: "", quantity: 1, unitPrice: 0, lineTotal: 0 };

export default function AdminQuotePage() {
  const params = useParams();
  const router = useRouter();
  const quoteNumber = params.quoteNumber as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [status, setStatus] = useState("");
  const [btwPercentage, setBtwPercentage] = useState(21);
  const [lines, setLines] = useState<QuoteLine[]>([{ ...EMPTY_LINE }]);

  const fetchQuote = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/quotes/${quoteNumber}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) { router.push("/admin"); return; }
      const data: Quote = await res.json();
      setQuote(data);
      setDescription(data.description ?? "");
      setValidUntil(data.validUntil ? data.validUntil.slice(0, 10) : "");
      setStatus(data.status);
      setBtwPercentage(data.btwPercentage ?? 21);
      setLines(data.lines.length > 0 ? data.lines : [{ ...EMPTY_LINE }]);
    } finally {
      setLoading(false);
    }
  }, [quoteNumber, router]);

  useEffect(() => { fetchQuote(); }, [fetchQuote]);

  // Line item helpers
  function updateLine(index: number, field: keyof QuoteLine, value: string | number) {
    setLines((prev) => {
      const updated = [...prev];
      const line = { ...updated[index], [field]: value };
      line.lineTotal = line.quantity * line.unitPrice;
      updated[index] = line;
      return updated;
    });
  }

  function addLine() {
    setLines((prev) => [...prev, { ...EMPTY_LINE }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  }

  // Totals
  const subtotal = lines.reduce((sum, l) => sum + (l.quantity * l.unitPrice), 0);
  const btwAmount = subtotal * (btwPercentage / 100);
  const totalInclBtw = subtotal + btwAmount;

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    // Filter out empty lines
    const filledLines = lines.filter((l) => l.productName.trim());

    try {
      const res = await fetch(`/api/admin/quotes/${quoteNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description || null,
          validUntil: validUntil || null,
          status,
          btwPercentage,
          lines: filledLines.map((l) => ({
            productName: l.productName,
            description: l.description || undefined,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Opslaan mislukt");
      }

      const updated: Quote = await res.json();
      setQuote(updated);
      setLines(updated.lines.length > 0 ? updated.lines : [{ ...EMPTY_LINE }]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Laden...</p>
      </div>
    );
  }

  if (!quote) return null;

  const statusColor = STATUS_COLORS[quote.status] ?? "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-mono text-sm text-gray-500">{quoteNumber}</span>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {STATUSES.find((s) => s.value === quote.status)?.label ?? quote.status}
          </span>
          <div className="ml-auto">
            <a
              href={`/api/admin/quotes/${quoteNumber}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Klantgegevens</h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Naam", quote.name],
                ["E-mail", quote.email],
                ["Telefoon", quote.phone],
                ["Adres", quote.address],
                ["Postcode / Stad", `${quote.postalCode} ${quote.city}`],
                ["Type pand", quote.propertyType],
                ["Ruimte(s)", quote.rooms],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <dt className="text-gray-400 w-36 flex-shrink-0">{label}</dt>
                  <dd className="text-gray-900">{value}</dd>
                </div>
              ))}
              {quote.notes && (
                <div className="flex gap-2">
                  <dt className="text-gray-400 w-36 flex-shrink-0">Opmerkingen</dt>
                  <dd className="text-gray-900">{quote.notes}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
              Aangevraagd op {new Date(quote.createdAt).toLocaleString("nl-NL")}
            </p>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Offerte-instellingen</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geldig tot</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BTW-percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={btwPercentage}
                      onChange={(e) => setBtwPercentage(Number(e.target.value))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offerte omschrijving
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                  placeholder="Algemene omschrijving van de offerte..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Line items table */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Producten & diensten</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-2 font-medium text-gray-500 w-[28%]">Product</th>
                  <th className="text-left py-2 pr-2 font-medium text-gray-500 w-[28%]">Omschrijving</th>
                  <th className="text-right py-2 pr-2 font-medium text-gray-500 w-[10%]">Aantal</th>
                  <th className="text-right py-2 pr-2 font-medium text-gray-500 w-[14%]">Prijs/stuk</th>
                  <th className="text-right py-2 pr-2 font-medium text-gray-500 w-[14%]">Totaal</th>
                  <th className="w-[6%]"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={line.productName}
                        onChange={(e) => updateLine(i, "productName", e.target.value)}
                        placeholder="Productnaam"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateLine(i, "description", e.target.value)}
                        placeholder="Omschrijving"
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => updateLine(i, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-right focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-gray-400 text-xs">€</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice || ""}
                          onChange={(e) => updateLine(i, "unitPrice", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full pl-5 pr-2 py-1.5 border border-gray-200 rounded text-sm text-right focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-right font-medium text-gray-900">
                      € {(line.quantity * line.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-2 text-center">
                      <button
                        onClick={() => removeLine(i)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Verwijderen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addLine}
            className="mt-3 text-sm text-[#2563EB] hover:text-[#1d4ed8] font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Regel toevoegen
          </button>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotaal (excl. BTW)</span>
                <span className="font-medium text-gray-900">€ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">BTW ({btwPercentage}%)</span>
                <span className="font-medium text-gray-900">€ {btwAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-base">
                <span className="font-semibold text-gray-900">Totaal (incl. BTW)</span>
                <span className="font-bold text-gray-900">€ {totalInclBtw.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save & delete buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            Offerte verwijderen
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? "Opslaan..." : saved ? "Opgeslagen!" : "Opslaan"}
          </button>
        </div>

        {/* Signature & stamp */}
        {quote.signed && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Handtekening & ondertekeningsbewijs</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Signature image */}
              {quote.signature && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Handtekening</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={quote.signature}
                    alt="Handtekening"
                    className="border border-gray-200 rounded-lg max-h-40 bg-white"
                  />
                </div>
              )}

              {/* Stamp details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Ondertekeningsgegevens</p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-gray-400 w-32 flex-shrink-0">Datum/tijd</dt>
                      <dd className="text-gray-900">
                        {quote.signedAt ? new Date(quote.signedAt).toLocaleString("nl-NL", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit", second: "2-digit"
                        }) : "—"}
                      </dd>
                    </div>
                    {quote.signedIp && (
                      <div className="flex gap-2">
                        <dt className="text-gray-400 w-32 flex-shrink-0">IP-adres</dt>
                        <dd className="text-gray-900 font-mono text-xs">{quote.signedIp}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Device info */}
                {quote.signedDevice && (() => {
                  try {
                    const device = JSON.parse(quote.signedDevice);
                    return (
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Apparaat</p>
                        <dl className="space-y-2 text-sm">
                          <div className="flex gap-2">
                            <dt className="text-gray-400 w-32 flex-shrink-0">Type</dt>
                            <dd className="text-gray-900">{device.deviceType || "Onbekend"}</dd>
                          </div>
                          {device.platform && (
                            <div className="flex gap-2">
                              <dt className="text-gray-400 w-32 flex-shrink-0">Platform</dt>
                              <dd className="text-gray-900">{device.platform}</dd>
                            </div>
                          )}
                          {device.screenWidth && (
                            <div className="flex gap-2">
                              <dt className="text-gray-400 w-32 flex-shrink-0">Scherm</dt>
                              <dd className="text-gray-900">
                                {device.screenWidth}×{device.screenHeight}px
                                {device.pixelRatio > 1 ? ` (@${device.pixelRatio}x)` : ""}
                              </dd>
                            </div>
                          )}
                          {device.touchSupport !== undefined && (
                            <div className="flex gap-2">
                              <dt className="text-gray-400 w-32 flex-shrink-0">Touchscreen</dt>
                              <dd className="text-gray-900">{device.touchSupport ? "Ja" : "Nee"}</dd>
                            </div>
                          )}
                          {device.language && (
                            <div className="flex gap-2">
                              <dt className="text-gray-400 w-32 flex-shrink-0">Taal</dt>
                              <dd className="text-gray-900">{device.language}</dd>
                            </div>
                          )}
                          {device.userAgent && (
                            <div className="flex gap-2">
                              <dt className="text-gray-400 w-32 flex-shrink-0">Browser</dt>
                              <dd className="text-gray-900 text-xs break-all leading-relaxed">{device.userAgent}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    );
                  } catch { return null; }
                })()}

                {/* Location info */}
                {quote.signedLocation && (() => {
                  try {
                    const loc = JSON.parse(quote.signedLocation);
                    return (
                      <div>
                        <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Locatie</p>
                        <dl className="space-y-2 text-sm">
                          <div className="flex gap-2">
                            <dt className="text-gray-400 w-32 flex-shrink-0">Coördinaten</dt>
                            <dd className="text-gray-900 font-mono text-xs">
                              {loc.latitude?.toFixed(6)}, {loc.longitude?.toFixed(6)}
                            </dd>
                          </div>
                          {loc.accuracy && (
                            <div className="flex gap-2">
                              <dt className="text-gray-400 w-32 flex-shrink-0">Nauwkeurigheid</dt>
                              <dd className="text-gray-900">{loc.accuracy}m</dd>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <dt className="text-gray-400 w-32 flex-shrink-0">Kaart</dt>
                            <dd>
                              <a
                                href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2563EB] hover:underline text-xs"
                              >
                                Bekijk op Google Maps →
                              </a>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    );
                  } catch { return null; }
                })()}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Offerte verwijderen?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Weet je zeker dat je offerte <strong>{quoteNumber}</strong> wilt verwijderen? Dit kan niet ongedaan worden.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  try {
                    const res = await fetch(`/api/admin/quotes/${quoteNumber}`, {
                      method: "DELETE",
                      credentials: "include",
                    });
                    if (res.ok) {
                      router.push("/admin");
                    } else {
                      const data = await res.text();
                      setError("Verwijderen mislukt: " + data);
                      setShowDeleteModal(false);
                    }
                  } catch {
                    setError("Verwijderen mislukt — probeer opnieuw");
                    setShowDeleteModal(false);
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Verwijderen..." : "Verwijderen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
