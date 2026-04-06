"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoHorizontal } from "@/components/Logo";

const BRANDS = [
  "Mitsubishi Heavy",
  "Mitsubishi Electric",
  "Daikin",
  "LG",
  "Gree",
  "Carrier",
  "Mitsui",
];

const TYPES = ["Wand", "Console", "Cassette", "Kanaal", "Vloer/Plafond", "Vloer", "Buitenunit", "Dakairco", "Kolom"];

const ENERGY_LABELS = ["A+++", "A++", "A+", "A", "B", "C"];

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
  active: boolean;
}

const emptyForm = {
  brand: "",
  model: "",
  type: "",
  coolingCapacity: "",
  heatingCapacity: "",
  energyLabel: "",
  price: "",
  installationPrice: "",
  description: "",
  imageUrl: "",
};

export default function AircoModellenPage() {
  const router = useRouter();
  const [models, setModels] = useState<AircoModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterBrand, setFilterBrand] = useState("ALL");

  const fetchModels = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/airco-models");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setModels(data);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchModels(); }, [fetchModels]);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(m: AircoModel) {
    setForm({
      brand: m.brand,
      model: m.model,
      type: m.type,
      coolingCapacity: m.coolingCapacity || "",
      heatingCapacity: m.heatingCapacity || "",
      energyLabel: m.energyLabel || "",
      price: m.price != null ? String(m.price) : "",
      installationPrice: m.installationPrice != null ? String(m.installationPrice) : "",
      description: m.description || "",
      imageUrl: m.imageUrl || "",
    });
    setEditingId(m.id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        brand: form.brand,
        model: form.model,
        type: form.type,
        coolingCapacity: form.coolingCapacity || null,
        heatingCapacity: form.heatingCapacity || null,
        energyLabel: form.energyLabel || null,
        price: form.price ? Number(form.price) : null,
        installationPrice: form.installationPrice ? Number(form.installationPrice) : null,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
      };

      let res: Response;
      if (editingId) {
        res = await fetch(`/api/admin/airco-models/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/airco-models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Er is iets misgegaan");
        return;
      }

      setShowForm(false);
      setEditingId(null);
      fetchModels();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Model "${name}" verwijderen?`)) return;
    const res = await fetch(`/api/admin/airco-models/${id}`, { method: "DELETE" });
    if (res.ok) setModels((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleToggleActive(m: AircoModel) {
    const res = await fetch(`/api/admin/airco-models/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !m.active }),
    });
    if (res.ok) {
      setModels((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, active: !item.active } : item))
      );
    }
  }

  const filtered = filterBrand === "ALL" ? models : models.filter((m) => m.brand === filterBrand);
  const brandCounts = BRANDS.reduce<Record<string, number>>((acc, b) => {
    acc[b] = models.filter((m) => m.brand === b).length;
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
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Airco Modellen</h1>
            <p className="text-sm text-gray-500 mt-1">{models.length} modellen in catalogus</p>
          </div>
          <button
            onClick={openNew}
            className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#16304d] transition-colors"
          >
            + Nieuw model
          </button>
        </div>

        {/* Brand filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => setFilterBrand("ALL")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterBrand === "ALL"
                ? "bg-[#1e3a5f] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Alles ({models.length})
          </button>
          {BRANDS.filter((b) => brandCounts[b] > 0).map((b) => (
            <button
              key={b}
              onClick={() => setFilterBrand(b)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterBrand === b
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {b} ({brandCounts[b]})
            </button>
          ))}
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editingId ? "Model bewerken" : "Nieuw model toevoegen"}
              </h2>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merk *</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  >
                    <option value="">Selecteer merk...</option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    required
                    placeholder="bijv. SRK25ZS-W"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  >
                    <option value="">Selecteer type...</option>
                    {TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Capacities side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Koelcapaciteit</label>
                    <input
                      type="text"
                      value={form.coolingCapacity}
                      onChange={(e) => setForm({ ...form, coolingCapacity: e.target.value })}
                      placeholder="bijv. 2.5 kW"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verwarmingscapaciteit</label>
                    <input
                      type="text"
                      value={form.heatingCapacity}
                      onChange={(e) => setForm({ ...form, heatingCapacity: e.target.value })}
                      placeholder="bijv. 3.2 kW"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Energy label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energielabel</label>
                  <select
                    value={form.energyLabel}
                    onChange={(e) => setForm({ ...form, energyLabel: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  >
                    <option value="">Selecteer...</option>
                    {ENERGY_LABELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Price & Installation Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Productprijs (excl. BTW)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montageprijs (excl. BTW)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.installationPrice}
                      onChange={(e) => setForm({ ...form, installationPrice: e.target.value })}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Omschrijving</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    placeholder="Extra informatie over dit model..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding URL</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#1e3a5f] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#16304d] transition-colors disabled:opacity-50"
                  >
                    {saving ? "Opslaan..." : editingId ? "Wijzigingen opslaan" : "Model toevoegen"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Laden...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              {models.length === 0 ? "Nog geen modellen toegevoegd" : "Geen modellen gevonden voor dit merk"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Merk</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Model</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Koeling</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Verwarming</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Energie</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Prijs</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Montage</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((m) => (
                    <tr key={m.id} className={`hover:bg-gray-50 transition-colors ${!m.active ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{m.brand}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{m.model}</td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{m.type}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{m.coolingCapacity || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{m.heatingCapacity || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{m.energyLabel || "—"}</td>
                      <td className="px-4 py-3 text-right text-gray-900 hidden sm:table-cell">
                        {m.price != null
                          ? `€ ${m.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`
                          : <span className="text-gray-400">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 hidden lg:table-cell">
                        {m.installationPrice != null
                          ? `€ ${m.installationPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`
                          : <span className="text-gray-400">—</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(m)}
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            m.active
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {m.active ? "Actief" : "Inactief"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEdit(m)}
                            className="text-[#1e3a5f] hover:underline font-medium text-sm"
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => handleDelete(m.id, `${m.brand} ${m.model}`)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Verwijderen"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
