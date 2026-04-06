"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface AircoModel {
  id: string;
  brand: string;
  model: string;
  type: string;
  coolingCapacity: string | null;
  heatingCapacity: string | null;
  energyLabel: string | null;
  price: number | null;
  installationPrice: number | null;
  description: string | null;
  imageUrl: string | null;
}

interface SeriesGroup {
  key: string;
  brand: string;
  seriesName: string;
  type: string;
  imageUrl: string | null;
  variants: AircoModel[];
  capacities: string[];
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "Wand": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
    </svg>
  ),
  "Vloer & Plafond": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  ),
  "Cassette": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  ),
  "Buitenunit": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
    </svg>
  ),
  "Dakairco": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5M10.5 21H3m1.5 0h2.25m0 0V3.545M5.25 3.545l6.75-2.795 6.75 2.795" />
    </svg>
  ),
};

const TYPE_ORDER: Record<string, number> = {
  "Wand": 0,
  "Vloer & Plafond": 1,
  "Cassette": 2,
  "Buitenunit": 3,
  "Dakairco": 4,
};

const TYPE_LABELS: Record<string, string> = {
  "Wand": "Wandmodellen",
  "Vloer & Plafond": "Vloer- & Plafondmodellen",
  "Cassette": "Cassettemodellen",
  "Buitenunit": "Buitenunits",
  "Dakairco": "Dakairco\u2019s",
};

function getSeriesName(desc: string | null): string {
  return (desc || "").split("|")[0].trim() || "Overig";
}

function parseKw(cap: string | null): number {
  if (!cap) return 0;
  return parseFloat(cap.replace(" kW", "").replace(",", ".")) || 0;
}

function SeriesCard({ group, inclMontage }: { group: SeriesGroup; inclMontage: boolean }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = group.variants[selectedIdx] || group.variants[0];

  function formatPrice(model: AircoModel): string | null {
    if (model.price == null) return null;
    const total = inclMontage && model.installationPrice
      ? model.price + model.installationPrice
      : model.price;
    return `\u20AC ${total.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {selected.imageUrl ? (
          <img
            src={selected.imageUrl}
            alt={`${group.brand} ${group.seriesName}`}
            className="w-full h-full object-contain p-6"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {selected.energyLabel && (
          <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold ${
            selected.energyLabel === "A+++" ? "bg-green-600 text-white" :
            selected.energyLabel === "A++" ? "bg-green-500 text-white" :
            selected.energyLabel === "A+" ? "bg-lime-500 text-white" :
            "bg-gray-200 text-gray-700"
          }`}>
            {selected.energyLabel}
          </span>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-gray-700">
          {group.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-1">
          {group.brand}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          {group.seriesName}
        </h3>

        {/* Koelcapaciteit selector */}
        {group.capacities.length > 1 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Koelcapaciteit</p>
            <div className="flex flex-wrap gap-1.5">
              {group.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedIdx(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    selectedIdx === i
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {v.coolingCapacity || "n.v.t."}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Specs */}
        <div className="flex gap-4 text-sm text-gray-500 mb-3">
          {selected.coolingCapacity && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Koelen: {selected.coolingCapacity}</span>
            </div>
          )}
          {selected.heatingCapacity && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span>Verwarmen: {selected.heatingCapacity}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          {selected.price != null ? (
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(selected)}
                </span>
                <span className="text-xs text-gray-400">excl. BTW</span>
              </div>
              {inclMontage && selected.installationPrice ? (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Inclusief professionele montage
                </p>
              ) : inclMontage ? (
                <p className="text-xs text-gray-400 mt-1">Montageprijs op aanvraag</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Alleen product, zonder montage</p>
              )}
            </div>
          ) : (
            <p className="text-lg font-semibold text-gray-400">Prijs op aanvraag</p>
          )}
        </div>

        {/* CTA */}
        <Link
          href="/offerte-aanvragen"
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors"
        >
          Offerte aanvragen
        </Link>
      </div>
    </div>
  );
}

export default function ProductenPage() {
  const [models, setModels] = useState<AircoModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBrand, setFilterBrand] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [inclMontage, setInclMontage] = useState(true);

  useEffect(() => {
    fetch("/api/producten")
      .then((res) => res.json())
      .then((data) => setModels(data))
      .finally(() => setLoading(false));
  }, []);

  const brands = [...new Set(models.map((m) => m.brand))].sort();
  const types = [...new Set(models.map((m) => m.type))].sort(
    (a, b) => (TYPE_ORDER[a] ?? 99) - (TYPE_ORDER[b] ?? 99)
  );

  // Build series groups from all models
  const allGroups = useMemo(() => {
    const groupMap = new Map<string, SeriesGroup>();

    for (const m of models) {
      const seriesName = getSeriesName(m.description);
      const key = `${m.brand}::${seriesName}::${m.type}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          key,
          brand: m.brand,
          seriesName,
          type: m.type,
          imageUrl: m.imageUrl,
          variants: [],
          capacities: [],
        });
      }

      const group = groupMap.get(key)!;
      const cap = m.coolingCapacity;

      // Skip duplicate capacities (color variants at same kW)
      if (cap && group.capacities.includes(cap)) continue;

      group.variants.push(m);
      if (cap) group.capacities.push(cap);
    }

    // Sort variants within each group by kW
    for (const group of groupMap.values()) {
      group.variants.sort((a, b) => parseKw(a.coolingCapacity) - parseKw(b.coolingCapacity));
      group.capacities = group.variants.map((v) => v.coolingCapacity).filter(Boolean) as string[];
    }

    return [...groupMap.values()];
  }, [models]);

  // Filter groups
  const filtered = allGroups.filter((g) => {
    if (filterBrand !== "ALL" && g.brand !== filterBrand) return false;
    if (filterType !== "ALL" && g.type !== filterType) return false;
    return true;
  });

  // Group filtered series by type
  const groupedByType = useMemo(() => {
    const typeGroups: { type: string; series: SeriesGroup[] }[] = [];
    const seen = new Set<string>();
    const sortedTypes = [...new Set(filtered.map((g) => g.type))].sort(
      (a, b) => (TYPE_ORDER[a] ?? 99) - (TYPE_ORDER[b] ?? 99)
    );
    for (const t of sortedTypes) {
      if (seen.has(t)) continue;
      seen.add(t);
      typeGroups.push({ type: t, series: filtered.filter((g) => g.type === t) });
    }
    return typeGroups;
  }, [filtered]);

  const totalSeries = filtered.length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Onze Airco&apos;s
            </h1>
            <p className="text-lg text-gray-600">
              Bekijk ons assortiment airconditioning systemen van topmerken.
              Kies voor alleen het product of inclusief professionele montage.
            </p>
          </div>
        </div>
      </section>

      {/* Categorie kiezer */}
      {!loading && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Kies een categorie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <button
                onClick={() => { setFilterType("ALL"); window.scrollTo({ top: document.getElementById("producten-grid")?.offsetTop ?? 0, behavior: "smooth" }); }}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all text-center ${
                  filterType === "ALL"
                    ? "border-[#2563EB] bg-[#2563EB]/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`${filterType === "ALL" ? "text-[#2563EB]" : "text-gray-400"}`}>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${filterType === "ALL" ? "text-[#2563EB]" : "text-gray-900"}`}>Alles</p>
                  <p className="text-xs text-gray-400">
                    {allGroups.filter((g) => filterBrand === "ALL" || g.brand === filterBrand).length} series
                  </p>
                </div>
              </button>

              {types.map((t) => {
                const count = allGroups.filter((g) => g.type === t && (filterBrand === "ALL" || g.brand === filterBrand)).length;
                if (count === 0) return null;
                return (
                  <button
                    key={t}
                    onClick={() => { setFilterType(t); window.scrollTo({ top: document.getElementById("producten-grid")?.offsetTop ?? 0, behavior: "smooth" }); }}
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all text-center ${
                      filterType === t
                        ? "border-[#2563EB] bg-[#2563EB]/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`${filterType === t ? "text-[#2563EB]" : "text-gray-400"}`}>
                      {TYPE_ICONS[t] || (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${filterType === t ? "text-[#2563EB]" : "text-gray-900"}`}>{TYPE_LABELS[t] || t}</p>
                      <p className="text-xs text-gray-400">{count} serie{count !== 1 ? "s" : ""}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Filters & Toggle */}
      <section className="py-4 bg-white border-b border-gray-100 sticky top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="ALL">Alle merken</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {filterType !== "ALL" && (
                <button
                  onClick={() => setFilterType("ALL")}
                  className="flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#2563EB]/20 transition-colors"
                >
                  {TYPE_LABELS[filterType] || filterType}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
              <span className={`text-sm font-medium ${!inclMontage ? "text-gray-900" : "text-gray-400"}`}>
                Excl. montage
              </span>
              <button
                onClick={() => setInclMontage(!inclMontage)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  inclMontage ? "bg-[#2563EB]" : "bg-gray-300"
                }`}
                aria-label="Toggle montage"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    inclMontage ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${inclMontage ? "text-gray-900" : "text-gray-400"}`}>
                Incl. montage
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="producten-grid" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Producten laden...</p>
            </div>
          ) : totalSeries === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-lg">Geen producten gevonden</p>
              <p className="text-gray-400 text-sm mt-1">Probeer een ander filter</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{totalSeries} serie{totalSeries !== 1 ? "s" : ""} gevonden</p>

              {groupedByType.map((typeGroup) => (
                <div key={typeGroup.type} className="mb-12 last:mb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {TYPE_LABELS[typeGroup.type] || typeGroup.type}
                    </h2>
                    <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {typeGroup.series.length}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeGroup.series.map((group) => (
                      <SeriesCard key={group.key} group={group} inclMontage={inclMontage} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2563EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Niet gevonden wat je zoekt?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Neem contact met ons op voor persoonlijk advies. Wij helpen je graag bij het kiezen van de juiste airco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/offerte-aanvragen"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-colors text-lg"
            >
              Offerte aanvragen
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Contact opnemen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
