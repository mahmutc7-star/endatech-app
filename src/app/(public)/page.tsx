import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TrustpilotHomepage } from "@/components/TrustpilotWidget";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Snel een airco nodig?
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Bij <span className="font-semibold text-[#2563EB]">EndaTech</span> regel je snel en voordelig een airco inclusief montage.
              </p>

              {/* USP List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#22D3EE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Scherpe prijzen</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#22D3EE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Snelle installatie</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#22D3EE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Levering + montage</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#22D3EE]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Offerte online bekijken en ondertekenen</span>
                </li>
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/offerte-aanvragen"
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  Vraag direct een offerte aan
                </Link>
                <Link
                  href="/offerte-bekijken"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#2563EB] text-[#2563EB] font-semibold rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors"
                >
                  Bekijk je offerte
                </Link>
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-center">
              <Logo className="scale-150" />
            </div>
          </div>
        </div>
      </section>

      {/* Trustpilot */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustpilotHomepage />
        </div>
      </section>

      {/* Why EndaTech */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Waarom EndaTech?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Betaalbaar */}
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#DC2626]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Betaalbaar</h3>
              <p className="text-gray-600">Geen onnodige kosten, gewoon eerlijke prijzen.</p>
            </div>

            {/* Snel geregeld */}
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#22D3EE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Snel geregeld</h3>
              <p className="text-gray-600">Snelle offerte en korte wachttijden voor installatie.</p>
            </div>

            {/* Alles in één */}
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alles in één</h3>
              <p className="text-gray-600">Van advies tot montage: wij regelen alles.</p>
            </div>

            {/* Transparant */}
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparant</h3>
              <p className="text-gray-600">Bekijk en onderteken je offerte eenvoudig online.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Onze diensten</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#22D3EE]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Airco verkoop</h3>
              <p className="text-gray-600">Hoogwaardige airconditioning systemen van topmerken tegen scherpe prijzen.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#2563EB]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Airco installatie</h3>
              <p className="text-gray-600">Professionele installatie door gecertificeerde monteurs.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#DC2626]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Onderhoud & service</h3>
              <p className="text-gray-600">Regelmatig onderhoud voor optimale prestaties en langere levensduur.</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/onderhoud-service"
              className="text-[#2563EB] font-semibold hover:underline"
            >
              Meer over onze diensten →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hoe werkt het?</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Vraag een offerte aan", desc: "Vul het formulier in met je gegevens" },
              { step: 2, title: "Ontvang een unieke code", desc: "Je krijgt een offertenummer" },
              { step: 3, title: "Bekijk je offerte online", desc: "Log in met je code" },
              { step: 4, title: "Onderteken digitaal", desc: "Bevestig met je handtekening" },
              { step: 5, title: "Wij plannen installatie", desc: "We nemen contact op" },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#2563EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Direct starten?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Vraag vandaag nog een vrijblijvende offerte aan en ontdek hoe voordelig airco kan zijn.
          </p>
          <Link
            href="/offerte-aanvragen"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-colors text-lg"
          >
            Offerte aanvragen
          </Link>
        </div>
      </section>
    </div>
  );
}
