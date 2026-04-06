"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoHorizontal } from "@/components/Logo";

interface Quote {
  quoteNumber: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  totalAmount: number | null;
  signed: boolean;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  PENDING:   { text: "In behandeling", color: "bg-yellow-100 text-yellow-800" },
  SENT:      { text: "Verzonden",       color: "bg-blue-100 text-blue-800" },
  VIEWED:    { text: "Bekeken",         color: "bg-purple-100 text-purple-800" },
  SIGNED:    { text: "Ondertekend",     color: "bg-green-100 text-green-800" },
  ACCEPTED:  { text: "Geaccepteerd",    color: "bg-green-100 text-green-800" },
  COMPLETED: { text: "Voltooid",        color: "bg-gray-100 text-gray-800" },
  EXPIRED:   { text: "Verlopen",        color: "bg-red-100 text-red-800" },
  CANCELLED: { text: "Geannuleerd",     color: "bg-red-100 text-red-800" },
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

export default function AdminPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/quotes");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setQuotes(data);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const filtered = filter === "ALL" ? quotes : quotes.filter((q) => q.status === filter);

  const counts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = quotes.filter((q) => q.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoHorizontal />
            <span className="text-sm font-medium text-gray-500 border-l border-gray-200 pl-3">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/airco-modellen"
              className="text-sm text-[#2563EB] hover:text-[#1d4ed8] font-medium transition-colors"
            >
              Airco Modellen
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Totaal", value: quotes.length, color: "text-gray-900" },
            { label: "In behandeling", value: counts.PENDING ?? 0, color: "text-yellow-600" },
            { label: "Ondertekend", value: counts.SIGNED ?? 0, color: "text-green-600" },
            { label: "Voltooid", value: counts.COMPLETED ?? 0, color: "text-gray-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "ALL"
                ? "bg-[#2563EB] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Alles ({quotes.length})
          </button>
          {ALL_STATUSES.filter((s) => counts[s] > 0).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === s
                  ? "bg-[#2563EB] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {STATUS_LABELS[s].text} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Laden...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Geen offertes gevonden</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Nummer</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Naam</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Stad</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Telefoon</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Bedrag</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Datum</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((quote) => {
                    const status = STATUS_LABELS[quote.status] ?? { text: quote.status, color: "bg-gray-100 text-gray-800" };
                    return (
                      <tr key={quote.quoteNumber} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{quote.quoteNumber}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{quote.name}</td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{quote.city}</td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{quote.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900 hidden md:table-cell">
                          {quote.totalAmount != null
                            ? `€ ${Number(quote.totalAmount).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`
                            : <span className="text-gray-400">—</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                          {new Date(quote.createdAt).toLocaleDateString("nl-NL")}
                        </td>
                        <td className="px-4 py-3 text-right flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/quotes/${quote.quoteNumber}`}
                            className="text-[#2563EB] hover:underline font-medium"
                          >
                            Bekijken
                          </Link>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm(`Offerte ${quote.quoteNumber} verwijderen?`)) return;
                              const res = await fetch(`/api/admin/quotes/${quote.quoteNumber}`, { method: "DELETE" });
                              if (res.ok) setQuotes((prev) => prev.filter((q) => q.quoteNumber !== quote.quoteNumber));
                            }}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Verwijderen"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
