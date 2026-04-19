"use client";

import { useState, useEffect } from "react";
import { Save, AlertTriangle, Mail, Instagram, Youtube, Facebook, Phone, MapPin } from "lucide-react";

export default function ContactManager() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!data.error) {
        setSettings(data);
      } else {
        setDbError(true);
      }
    } catch (err) {
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert("Contact details updated successfully!");
      } else {
        alert("Failed to update settings");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading Contact settings...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FD853A]/10 rounded-2xl flex items-center justify-center text-[#FD853A]">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1D2939]">Contact Info</h1>
            <p className="text-gray-500">Manage your business details and social connections.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || dbError}
          className="flex items-center gap-2 bg-[#FD853A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e67a2e] transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex gap-3 items-center text-red-700">
          <AlertTriangle size={20} />
          <p className="font-medium">Database connection failed. Please check your configuration.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Core Business Details */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-[#1D2939] border-b pb-4">Business Details</h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#FD853A] mb-1">
              <Mail size={16} />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Public Email</label>
            </div>
            <input
              type="email"
              value={settings?.contactEmail || ""}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FD853A] focus:outline-none transition-all"
              placeholder="e.g. rohit@rohitborana.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#FD853A] mb-1">
              <Phone size={16} />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
            </div>
            <input
              type="text"
              value={settings?.contactPhone || ""}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FD853A] focus:outline-none transition-all"
              placeholder="e.g. +91 98765 43210"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#25D366] mb-1">
              <Phone size={16} />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">WhatsApp Number (For Button)</label>
            </div>
            <input
              type="text"
              value={settings?.whatsappNumber || ""}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25D366] focus:outline-none transition-all"
              placeholder="e.g. 919000000000 (No + or spaces)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#FD853A] mb-1">
              <MapPin size={16} />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Location</label>
            </div>
            <input
              type="text"
              value={settings?.contactLocation || ""}
              onChange={(e) => setSettings({ ...settings, contactLocation: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FD853A] focus:outline-none transition-all"
              placeholder="e.g. Jodhpur, Rajasthan"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-[#1D2939] border-b pb-4">Social Presence</h2>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#FD853A] mb-1">
              <Instagram size={16} />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Instagram Profile Link</label>
            </div>
            <input
              type="text"
              value={settings?.instagram || ""}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FD853A] focus:outline-none transition-all"
              placeholder="https://instagram.com/your-profile"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#FD853A] mb-1">
              <Youtube size={16} />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">YouTube Channel Link</label>
            </div>
            <input
              type="text"
              value={settings?.youtube || ""}
              onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FD853A] focus:outline-none transition-all"
              placeholder="https://youtube.com/@your-channel"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#FD853A] mb-1">
              <Facebook size={16} />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Facebook Page Link</label>
            </div>
            <input
              type="text"
              value={settings?.facebook || ""}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FD853A] focus:outline-none transition-all"
              placeholder="https://facebook.com/your-page"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-xs text-gray-400">Social icons will appear in the footer and contact sections.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
