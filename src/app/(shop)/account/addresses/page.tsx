"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Edit, Loader2 } from "lucide-react";

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
      isDefault: false,
    });
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(addr: Address) {
    setForm({
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setEditId(addr.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.fullName || !form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const res = await fetch("/api/addresses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { id: editId, ...form } : form),
      });

      if (res.ok) {
        toast.success(editId ? "Address updated" : "Address added");
        fetchAddresses();
        resetForm();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save address");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address removed");
        fetchAddresses();
      }
    } catch {
      toast.error("Failed to delete");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          My Addresses
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} /> Add Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">
            {editId ? "Edit Address" : "New Address"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Address Line 1 *</label>
              <input name="addressLine1" value={form.addressLine1} onChange={handleChange} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Address Line 2</label>
              <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">City *</label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">State *</label>
              <input name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Postal Code *</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} id="isDefault" className="accent-amber-600" />
              <label htmlFor="isDefault" className="text-sm text-stone-700">Set as default address</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editId ? "Update" : "Save"} Address
            </button>
            <button onClick={resetForm} className="border border-stone-300 text-stone-700 px-6 py-2.5 rounded-lg font-medium hover:bg-stone-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-amber-600" />
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <MapPin size={48} className="mx-auto text-stone-300 mb-4" />
          <p className="text-stone-500 mb-4">No saved addresses yet.</p>
          <button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium transition">
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-stone-200 rounded-xl p-5 relative">
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Default</span>
              )}
              <p className="font-semibold text-stone-900">{addr.fullName}</p>
              <p className="text-stone-600 text-sm mt-1">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="text-stone-600 text-sm">{addr.addressLine2}</p>}
              <p className="text-stone-600 text-sm">{addr.city}, {addr.state} {addr.postalCode}</p>
              <p className="text-stone-600 text-sm">{addr.country}</p>
              <p className="text-stone-500 text-sm mt-1">Phone: {addr.phone}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => startEdit(addr)} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
