"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuoteLine {
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface AircoModel {
  id: string;
  brand: string;
  model: string;
  price: number | null;
  installationPrice: number | null;
  active: boolean;
}

const EMPTY_LINE: QuoteLine = { productName: "", description: "", quantity: 1, unitPrice: 0 };

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

export default function NewAdminQuotePage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Customer fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [rooms, setRooms] = useState("");
  const [notes, setNotes] = useState("");

  // Quote settings
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [btwPercentage, setBtwPercentage] = useState(21);
  const [lines, setLines] = useState<QuoteLine[]>([{ ...EMPTY_LINE }]);

  const [aircoModels, setAircoModels] = useState<AircoModel[]>([]);

  useEffect(() => {
    fetch("/api/admin/airco-models")
      .then((res) => res.ok ? res.json() : [])
      .then((data: AircoModel[]) => setAircoModels(data.filter((m) => m.active)));
  }, []);

  const modelsByBrand = useMemo(() => {
    const groups: Record<string, AircoModel[]> = {};
    for (const m of aircoModels) (groups[m.brand] ??= []).push(m);
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [aircoModels]);

  function selectedValue(productName: string): string {
    if (productName === "Diversen") return "DIVERSEN";
    const m = aircoModels.find((m) => `${m.brand} ${m.model}` === productName);
    return m ? m.id : "";
  }

  function handlePickProduct(index: number, value: string) {
    if (value === "") return;
    if (value === "DIVERSEN") {
      setLines((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], productName: "Diversen", unitPrice: 0 };
        return updated;
      });
      return;
    }
    const model = aircoModels.find((m) => m.id === value);
    if (!model) return;
    const productName = `${model.brand} ${model.model}`;
    const unitPrice = (model.price ?? 0) + (model.installationPrice ?? 0);
    setLines((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], productName, unitPrice };
      return updated;
    });
  }

  function updateLine(index: number, field: keyof QuoteLine, value: string | number) {
    setLines((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addLine() {
    setLines((prev) => [...prev, { ...EMPTY_LINE }]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  }

  const subtotal = lines.reduce((sum, l) => sum + (l.quantity * l.unitPrice), 0);
  const btwAmount = subtotal * (btwPercentage / 100);
  const totalInclBtw = subtotal + btwAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !address || !postalCode || !city || !propertyType || !rooms) {
      setError("Vul alle verplichte klantgegevens in");
      return;
    }

    setSaving(true);

    const filledLines = lines.filter((l) => l.productName.trim());

    try {
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name, email, phone, address, postalCode, city,
          propertyType, rooms,
          notes: notes || null,
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

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Aanmaken mislukt");
      }

      router.push(`/admin/quotes/${data.quoteNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aanmaken mislukt");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-sm font-medium text-gray-900">Nieuwe offerte aanmaken</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Klantgegevens</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stad *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type pand *</label>
                  <input
                    type="text"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    required
                    placeholder="Bijv. appartement, rijwoning, bedrijfspand"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ruimte(s) *</label>
                  <input
                    type="text"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    required
                    placeholder="Bijv. woonkamer en slaapkamer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opmerkingen</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Quote settings */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Offerte-instellingen</h2>

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
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                    placeholder="Algemene omschrijving van de offerte..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
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
                        <select
                          value={selectedValue(line.productName)}
                          onChange={(e) => handlePickProduct(i, e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-white"
                        >
                          <option value="">— Kies product —</option>
                          <option value="DIVERSEN">Diversen</option>
                          {modelsByBrand.map(([brand, items]) => (
                            <optgroup key={brand} label={brand}>
                              {items.map((m) => {
                                const p = (m.price ?? 0) + (m.installationPrice ?? 0);
                                return (
                                  <option key={m.id} value={m.id}>
                                    {m.model}{p > 0 ? ` — € ${p.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}` : ""}
                                  </option>
                                );
                              })}
                            </optgroup>
                          ))}
                        </select>
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
                          type="button"
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
              type="button"
              onClick={addLine}
              className="mt-3 text-sm text-[#2563EB] hover:text-[#1d4ed8] font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Regel toevoegen
            </button>

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

          <div className="flex justify-end gap-3">
            <Link
              href="/admin"
              className="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? "Aanmaken..." : "Offerte aanmaken"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
