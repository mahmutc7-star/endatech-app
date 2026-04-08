"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  related: AircoModel[];
}

function parseDesc(desc: string | null) {
  const parts = (desc || "").split("|").map((p) => p.trim());
  const result: Record<string, string> = {};
  parts.forEach((p) => {
    if (p.startsWith("Serie:")) result.serie = p.replace("Serie:", "").trim();
    else if (p.startsWith("Kleur:")) result.kleur = p.replace("Kleur:", "").trim();
    else if (p.includes("fase")) result.fase = p;
    else if (p.includes("BTU")) result.btu = p;
    else if (p.includes("poorten")) result.poorten = p;
    else if (!result.lijn) result.lijn = p;
    else result.extra = p;
  });
  return result;
}

function getCapacityRoom(kw: number): string {
  if (kw <= 2.0) return "tot 20 m\u00B2 (~50 m\u00B3)";
  if (kw <= 2.7) return "tot 30 m\u00B2 (~75 m\u00B3)";
  if (kw <= 3.5) return "tot 40 m\u00B2 (~100 m\u00B3)";
  if (kw <= 5.0) return "tot 55 m\u00B2 (~140 m\u00B3)";
  if (kw <= 6.0) return "tot 65 m\u00B2 (~165 m\u00B3)";
  return "tot 80 m\u00B2 (~200 m\u00B3)";
}

const BRAND_INFO: Record<string, { country: string; founded: string; tagline: string }> = {
  "Daikin": { country: "Japan", founded: "1924", tagline: "Wereldleider in airconditioningsystemen" },
  "Gree": { country: "China", founded: "1991", tagline: "'s Werelds grootste fabrikant van airconditioners" },
  "LG": { country: "Zuid-Korea", founded: "1958", tagline: "Life's Good - innovatieve elektronica en klimaattechniek" },
  "Mitsubishi Electric": { country: "Japan", founded: "1921", tagline: "Changes for the Better - premium klimaatoplossingen" },
  "Mitsubishi Heavy": { country: "Japan", founded: "1884", tagline: "Heavy Industries - robuuste en effici\u00EBnte airco's" },
  "Mitsui": { country: "Europa", founded: "2010", tagline: "Betaalbare kwaliteitsairco's voor de Europese markt" },
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<AircoModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [inclMontage, setInclMontage] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/producten/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product niet gevonden</h1>
        <Link href="/producten" className="text-[#2563EB] hover:underline">Terug naar producten</Link>
      </div>
    );
  }

  const desc = parseDesc(product.description);
  const kw = parseFloat((product.coolingCapacity || "0").replace(" kW", ""));
  const roomSize = kw > 0 ? getCapacityRoom(kw) : null;
  const brandInfo = BRAND_INFO[product.brand];

  function formatPrice(p: number | null, inst: number | null): string | null {
    if (p == null) return null;
    const total = inclMontage && inst ? p + inst : p;
    return `\u20AC ${total.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/producten" className="hover:text-[#2563EB]">Producten</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-400">{product.brand}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">{desc.lijn || product.model}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center aspect-square">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={`${product.brand} ${product.model}`} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-gray-300">
                  <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{desc.lijn || product.model}</h1>
              {desc.kleur && <p className="text-gray-500 mb-4">Kleur: {desc.kleur}</p>}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{product.type}</span>
                {product.energyLabel && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    product.energyLabel.includes("A+++") ? "bg-green-100 text-green-800" :
                    product.energyLabel.includes("A++") ? "bg-green-50 text-green-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>{product.energyLabel}</span>
                )}
                {desc.fase && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{desc.fase}</span>}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.coolingCapacity && (
                  <div className="bg-cyan-50 rounded-xl p-4">
                    <p className="text-xs text-cyan-600 font-medium mb-1">Koelcapaciteit</p>
                    <p className="text-xl font-bold text-gray-900">{product.coolingCapacity}</p>
                  </div>
                )}
                {product.heatingCapacity && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-xs text-red-500 font-medium mb-1">Verwarmingscapaciteit</p>
                    <p className="text-xl font-bold text-gray-900">{product.heatingCapacity}</p>
                  </div>
                )}
                {roomSize && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-blue-600 font-medium mb-1">Geschikt voor</p>
                    <p className="text-lg font-bold text-gray-900">{roomSize}</p>
                  </div>
                )}
                {desc.btu && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-xs text-purple-600 font-medium mb-1">Capaciteit</p>
                    <p className="text-lg font-bold text-gray-900">{desc.btu}</p>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-sm font-medium cursor-pointer ${!inclMontage ? "text-gray-900" : "text-gray-400"}`} onClick={() => setInclMontage(false)}>Excl. montage</span>
                  <button onClick={() => setInclMontage(!inclMontage)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${inclMontage ? "bg-[#2563EB]" : "bg-gray-300"}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${inclMontage ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className={`text-sm font-medium cursor-pointer ${inclMontage ? "text-gray-900" : "text-gray-400"}`} onClick={() => setInclMontage(true)}>Incl. montage</span>
                </div>
                {product.price != null ? (
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price, product.installationPrice)}</span>
                    <span className="text-sm text-gray-400 ml-2">excl. BTW</span>
                    {inclMontage && product.installationPrice && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Inclusief professionele montage
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-2xl font-semibold text-gray-400">Prijs op aanvraag</p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/offerte-aanvragen" className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors">
                  Offerte aanvragen
                </Link>
                <Link href="/contact" className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  Vraag advies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productdetails */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Productdetails</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Technische specificaties */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technische specificaties</h3>
              <dl className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-500">Merk</dt>
                  <dd className="font-medium text-gray-900">{product.brand}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-500">Model</dt>
                  <dd className="font-medium text-gray-900 text-right text-sm">{product.model}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium text-gray-900">{product.type}</dd>
                </div>
                {desc.serie && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Serie</dt>
                    <dd className="font-medium text-gray-900">{desc.serie}</dd>
                  </div>
                )}
                {product.coolingCapacity && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Koelcapaciteit</dt>
                    <dd className="font-medium text-gray-900">{product.coolingCapacity}</dd>
                  </div>
                )}
                {product.heatingCapacity && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Verwarmingscapaciteit</dt>
                    <dd className="font-medium text-gray-900">{product.heatingCapacity}</dd>
                  </div>
                )}
                {desc.btu && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">BTU/h</dt>
                    <dd className="font-medium text-gray-900">{desc.btu}</dd>
                  </div>
                )}
                {roomSize && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Geschikt voor</dt>
                    <dd className="font-medium text-gray-900">{roomSize}</dd>
                  </div>
                )}
                {product.energyLabel && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Energielabel</dt>
                    <dd className="font-medium text-gray-900">{product.energyLabel}</dd>
                  </div>
                )}
                {desc.kleur && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Kleur</dt>
                    <dd className="font-medium text-gray-900">{desc.kleur}</dd>
                  </div>
                )}
                {desc.fase && (
                  <div className="flex justify-between py-2">
                    <dt className="text-gray-500">Aansluiting</dt>
                    <dd className="font-medium text-gray-900">{desc.fase}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Kenmerken + Merk info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kenmerken</h3>
                <ul className="space-y-3">
                  {[
                    "Inverter technologie voor optimaal rendement",
                    "Koelen en verwarmen in \u00E9\u00E9n systeem",
                    "Milieuvriendelijk R32 koudemiddel",
                    "Fluisterstille werking",
                    product.type === "Wand" ? "WiFi-besturing via app" : null,
                    product.type === "Wand" ? "Eenvoudige wandmontage" : null,
                    product.type === "Vloer & Plafond" ? "Flexibele plaatsing" : null,
                    product.type === "Cassette" ? "Inbouw in verlaagd plafond" : null,
                  ].filter(Boolean).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-[#22D3EE] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {brandInfo && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Over {product.brand}</h3>
                  <p className="text-gray-600 text-sm mb-3">{brandInfo.tagline}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Opgericht: {brandInfo.founded}</span>
                    <span>Herkomst: {brandInfo.country}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Inclusief bij montage */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Inclusief bij montage</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", title: "Vakkundige installatie", desc: "Door F-Gassen gecertificeerde monteurs" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Garantie", desc: "Fabrieksgarantie op product en montage" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Inbedrijfstelling", desc: "Compleet getest en ingeregeld" },
              { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "Uitleg & nazorg", desc: "Bediening uitgelegd, bereikbaar voor vragen" },
            ].map((item) => (
              <div key={item.title} className="text-center p-4">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gerelateerde producten */}
      {product.related && product.related.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Andere varianten</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.related.map((rel) => {
                const relDesc = parseDesc(rel.description);
                return (
                  <Link key={rel.id} href={`/producten/${rel.id}`} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    {rel.imageUrl && (
                      <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center p-3">
                        <img src={rel.imageUrl} alt={rel.model} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <p className="text-xs text-[#2563EB] font-semibold uppercase">{rel.brand}</p>
                    <p className="text-sm font-bold text-gray-900">{relDesc.lijn || rel.model}</p>
                    <div className="flex gap-2 mt-1 text-xs text-gray-500">
                      {rel.coolingCapacity && <span>{rel.coolingCapacity}</span>}
                      {relDesc.kleur && <span>- {relDesc.kleur}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#2563EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Interesse in dit product?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Vraag een vrijblijvende offerte aan of neem contact op voor persoonlijk advies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/offerte-aanvragen" className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-colors text-lg">
              Offerte aanvragen
            </Link>
            <a href="tel:0641088447" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Bel 06-41088447
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
