"use client";

import { useState, useEffect } from "react";
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

const ENERGY_LABEL_COLORS: Record<string, string> = {
  "A+++": "bg-green-600 text-white",
  "A++": "bg-green-500 text-white",
  "A+": "bg-lime-500 text-white",
  "A": "bg-yellow-400 text-gray-900",
  "B": "bg-orange-400 text-white",
  "C": "bg-red-500 text-white",
};

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
  const types = [...new Set(models.map((m) => m.type))].sort();

  const filtered = models.filter((m) => {
    if (filterBrand !== "ALL" && m.brand !== filterBrand) return false;
    if (filterType !== "ALL" && m.type !== filterType) return false;
    return true;
  });

  function formatPrice(model: AircoModel): string | null {
    if (model.price == null) return null;
    const total = inclMontage && model.installationPrice
      ? model.price + model.installationPrice
      : model.price;
    return `€ ${total.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

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

      {/* Filters & Toggle */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Brand filter */}
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

              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="ALL">Alle types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Montage toggle */}
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Producten laden...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-lg">Geen producten gevonden</p>
              <p className="text-gray-400 text-sm mt-1">Probeer een ander filter</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{filtered.length} product{filtered.length !== 1 ? "en" : ""} gevonden</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((model) => (
                  <div
                    key={model.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {model.imageUrl ? (
                        <img
                          src={model.imageUrl}
                          alt={`${model.brand} ${model.model}`}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-20 h-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                      {/* Energy label badge */}
                      {model.energyLabel && (
                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold ${ENERGY_LABEL_COLORS[model.energyLabel] || "bg-gray-200 text-gray-700"}`}>
                          {model.energyLabel}
                        </span>
                      )}
                      {/* Type badge */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-gray-700">
                        {model.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-1">
                        {model.brand}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {model.model}
                      </h3>

                      {/* Specs */}
                      <div className="flex gap-4 text-sm text-gray-500 mb-3">
                        {model.coolingCapacity && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>{model.coolingCapacity}</span>
                          </div>
                        )}
                        {model.heatingCapacity && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            <span>{model.heatingCapacity}</span>
                          </div>
                        )}
                      </div>

                      {model.description && (
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{model.description}</p>
                      )}

                      {/* Price */}
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        {model.price != null ? (
                          <div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-bold text-gray-900">
                                {formatPrice(model)}
                              </span>
                              <span className="text-xs text-gray-400">excl. BTW</span>
                            </div>
                            {inclMontage && model.installationPrice ? (
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
                ))}
              </div>
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
