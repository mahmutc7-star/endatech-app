"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoHorizontal } from "./Logo";
import { TrustpilotBanner } from "./TrustpilotWidget";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/offerte-aanvragen", label: "Offerte aanvragen" },
    { href: "/offerte-bekijken", label: "Offerte bekijken" },
    { href: "/onderhoud-service", label: "Onderhoud & Service" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <LogoHorizontal />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#2563EB] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/offerte-aanvragen"
              className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
            >
              Gratis offerte
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-[#2563EB] font-medium px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/offerte-aanvragen"
                className="bg-[#2563EB] text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-[#1d4ed8] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gratis offerte
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div className="border-t border-gray-100 bg-gray-50 py-1.5 px-4">
        <div className="max-w-7xl mx-auto">
          <TrustpilotBanner />
        </div>
      </div>
    </header>
  );
}
