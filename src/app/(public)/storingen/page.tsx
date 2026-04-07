import Link from "next/link";

export const metadata = {
  title: "Storingen Oplossen - EndaTech",
  description: "Airco storing? Wij helpen snel. Diagnose, reparatie en 24/7 bereikbaarheid voor urgente airco problemen.",
};

export default function StoringenPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Storingen Oplossen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Airco storing? Geen paniek. Onze monteurs staan klaar om het probleem snel en vakkundig op te lossen.
          </p>
          <div className="mt-8">
            <a
              href="tel:0641088447"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#DC2626] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Bel direct: 06-41088447
            </a>
          </div>
        </div>
      </section>

      {/* Veelvoorkomende storingen */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Veelvoorkomende storingen</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Airco koelt of verwarmt niet",
                desc: "Kan veroorzaakt worden door een koudemiddeltekort, verstopte filters of een defect onderdeel. Wij diagnosticeren en verhelpen het probleem.",
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                color: "[#22D3EE]",
              },
              {
                title: "Vreemde geluiden",
                desc: "Ratelende, piepende of brommende geluiden kunnen duiden op losse onderdelen, een defecte ventilator of ijsvorming.",
                icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m-4.242-4.242a9 9 0 0012.728 0",
                color: "[#2563EB]",
              },
              {
                title: "Waterlekkage",
                desc: "Water dat uit de binnenunit lekt wijst vaak op een verstopte condensafvoer. Wij reinigen de afvoer en controleren het systeem.",
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
                color: "[#DC2626]",
              },
              {
                title: "Slechte geur",
                desc: "Een muffe of vieze geur komt vaak door schimmel of bacteriën in de filters of het systeem. Een grondige reiniging lost dit op.",
                icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
                color: "green-600",
              },
              {
                title: "Foutcode op display",
                desc: "Uw airco geeft een foutcode weer? Noteer de code en bel ons. Wij weten precies wat er aan de hand is.",
                icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                color: "amber-500",
              },
              {
                title: "Airco slaat steeds af",
                desc: "Als de airco steeds uitschakelt kan dit wijzen op oververhitting, een defecte sensor of elektrische problemen.",
                icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3",
                color: "orange-500",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6">
                <div className={`w-12 h-12 bg-${item.color}/10 rounded-xl flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 text-${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onze aanpak */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Onze aanpak bij storingen</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DC2626] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Melding</h3>
              <p className="text-gray-600 text-sm">Bel ons of stuur een bericht via het contactformulier. Beschrijf het probleem zo goed mogelijk.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DC2626] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Diagnose</h3>
              <p className="text-gray-600 text-sm">Onze monteur komt langs, stelt de diagnose en bespreekt de oplossing en kosten met u.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DC2626] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Reparatie</h3>
              <p className="text-gray-600 text-sm">Na akkoord voeren wij de reparatie direct uit. Uw airco werkt weer als vanouds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#DC2626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Storing melden</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Heeft u een storing? Neem direct contact met ons op. Wij proberen u zo snel mogelijk te helpen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0641088447"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#DC2626] font-semibold rounded-lg hover:bg-red-50 transition-colors text-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Bel 06-41088447
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Contactformulier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
