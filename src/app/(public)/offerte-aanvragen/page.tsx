"use client";

import { useState } from "react";
import Link from "next/link";

export default function OfferteAanvragenPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          postalCode: formData.get("postalCode"),
          city: formData.get("city"),
          propertyType: formData.get("propertyType"),
          rooms: formData.get("rooms"),
          notes: formData.get("notes"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Er is iets misgegaan");
      }

      setQuoteNumber(data.quoteNumber);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Aanvraag ontvangen!</h1>
          <p className="text-gray-600 mb-6">
            Bedankt voor je aanvraag. We nemen zo snel mogelijk contact met je op.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-500 mb-2">Je offertenummer</p>
            <p className="text-2xl font-bold text-[#2563EB]">{quoteNumber}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Bewaar dit nummer goed. Hiermee kun je je offerte later bekijken en ondertekenen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/offerte-bekijken"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Bekijk je offerte
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Terug naar home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Offerte aanvragen
          </h1>
          <p className="text-lg text-gray-600">
            Wil je een airco inclusief montage? Vraag hieronder eenvoudig een offerte aan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vul je gegevens in</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Naam */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Naam *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                placeholder="Je volledige naam"
              />
            </div>

            {/* Telefoonnummer */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefoonnummer *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                placeholder="06-41088447"
              />
            </div>

            {/* E-mailadres */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mailadres *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                placeholder="je@email.nl"
              />
            </div>

            {/* Adres */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adres *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                placeholder="Straatnaam en huisnummer"
              />
            </div>

            {/* Postcode */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                Postcode *
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                placeholder="1234 AB"
              />
            </div>

            {/* Plaats */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Plaats *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                placeholder="Plaatsnaam"
              />
            </div>

            {/* Type woning/pand */}
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                Type woning/pand *
              </label>
              <select
                id="propertyType"
                name="propertyType"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Selecteer type</option>
                <option value="appartement">Appartement</option>
                <option value="tussenwoning">Tussenwoning</option>
                <option value="hoekwoning">Hoekwoning</option>
                <option value="vrijstaand">Vrijstaande woning</option>
                <option value="kantoor">Kantoor</option>
                <option value="bedrijfspand">Bedrijfspand</option>
                <option value="anders">Anders</option>
              </select>
            </div>

            {/* Gewenste ruimte(s) */}
            <div>
              <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-2">
                Gewenste ruimte(s) *
              </label>
              <input
                type="text"
                id="rooms"
                name="rooms"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
                placeholder="Bijv. woonkamer, slaapkamer"
              />
            </div>

            {/* Extra opmerkingen */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Extra opmerkingen (optioneel)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Heb je nog specifieke wensen of vragen?"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full py-4 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Bezig met versturen..." : "Offerte versturen"}
          </button>
        </form>

        {/* What happens next */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Wat gebeurt er daarna?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
              <div>
                <h3 className="font-medium text-gray-900">Wij beoordelen je aanvraag</h3>
                <p className="text-gray-600 text-sm">We bekijken je gegevens en situatie.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
              <div>
                <h3 className="font-medium text-gray-900">Je ontvangt een offerte op maat</h3>
                <p className="text-gray-600 text-sm">Met een passend voorstel voor jouw situatie.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
              <div>
                <h3 className="font-medium text-gray-900">Je krijgt een uniek offertenummer</h3>
                <p className="text-gray-600 text-sm">Waarmee je de offerte kunt bekijken.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
              <div>
                <h3 className="font-medium text-gray-900">Je kunt je offerte online bekijken en ondertekenen</h3>
                <p className="text-gray-600 text-sm">Gemakkelijk en snel, zonder papierwerk.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important note */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            <span className="font-medium">Belangrijk:</span> Je hebt geen account nodig. Alles werkt via je unieke offertenummer.
          </p>
        </div>
      </div>
    </div>
  );
}
