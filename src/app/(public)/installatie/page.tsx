import Link from "next/link";

export const metadata = {
  title: "Airco Installatie - EndaTech",
  description: "Professionele airco installatie door F-Gassen gecertificeerde monteurs. Vakkundige montage, snelle service en scherpe prijzen.",
};

export default function InstallatiePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Airco Installatie
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professionele installatie door gecertificeerde monteurs. Van advies tot montage: wij regelen alles.
          </p>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Hoe werkt de installatie?</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Adviesgesprek", desc: "Wij komen bij u langs voor een vrijblijvend adviesgesprek en inspectie van de ruimte.", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              { step: 2, title: "Offerte op maat", desc: "U ontvangt een heldere offerte met alle kosten. Geen verborgen kosten, alles transparant.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { step: 3, title: "Installatie", desc: "Onze F-Gassen gecertificeerde monteurs installeren uw airco vakkundig en netjes.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
              { step: 4, title: "Oplevering", desc: "Wij testen alles, leggen de bediening uit en u geniet direct van een aangenaam klimaat.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wat is inbegrepen */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Wat is inbegrepen?</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Standaard installatie</h3>
              <ul className="space-y-3">
                {[
                  "Montage binnenunit aan de wand",
                  "Plaatsing buitenunit op console of ondergrond",
                  "Aanleg koelleiding (tot 4 meter)",
                  "Aanleg condensafvoer",
                  "Elektrische aansluiting",
                  "Inbedrijfstelling en test",
                  "Uitleg bediening en app",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-[#22D3EE] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Onze garanties</h3>
              <ul className="space-y-3">
                {[
                  "F-Gassen gecertificeerde monteurs",
                  "Nette en stofvrije installatie",
                  "Fabrieksgarantie op alle producten",
                  "Garantie op installatiewerkzaamheden",
                  "Installatie binnen afgesproken termijn",
                  "Persoonlijk advies en nazorg",
                  "Bereikbaar voor vragen na installatie",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-[#2563EB] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certificering */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
            <div className="flex-shrink-0">
              <img
                src="/fgassen-cert.gif"
                alt="F-Gassen Gecertificeerd"
                className="h-24 w-auto"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">F-Gassen Gecertificeerd</h2>
              <p className="text-gray-600">
                Al onze monteurs zijn F-Gassen gecertificeerd conform de Europese verordening (EU) nr. 517/2014.
                Dit betekent dat wij bevoegd zijn om met gefluoreerde broeikasgassen te werken die in airconditioningsystemen worden gebruikt.
                Uw installatie is in veilige en deskundige handen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#2563EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Klaar voor een airco?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Vraag vandaag nog een vrijblijvende offerte aan. Wij nemen snel contact met u op voor een adviesgesprek.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/offerte-aanvragen"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-colors text-lg"
            >
              Offerte aanvragen
            </Link>
            <Link
              href="/producten"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Bekijk ons assortiment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
