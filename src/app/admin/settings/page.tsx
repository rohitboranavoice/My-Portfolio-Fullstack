"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";

export default function SettingsManager() {
  const [formData, setFormData] = useState({
    siteTitle: "",
    heroHeading: "",
    heroSubheading: "",
    aboutText: "",
    contactEmail: "",
    contactPhone: "",
    contactLocation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setFormData({
            siteTitle: data.siteTitle || "",
            heroHeading: data.heroHeading || "",
            heroSubheading: data.heroSubheading || "",
            aboutText: data.aboutText || "",
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
            contactLocation: data.contactLocation || "",
          });
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ text: "Settings saved successfully", type: "success" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      setMessage({ text: "Failed to save settings", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#1D2939]">Global Settings</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-[#FD853A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#e67a2e] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <AlertCircle size={20} />
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold border-b pb-2">Hero & Identity</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Site Title (Browser Tab)</label>
              <input
                type="text"
                name="siteTitle"
                value={formData.siteTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Hero Heading</label>
              <input
                type="text"
                name="heroHeading"
                value={formData.heroHeading}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Hero Subheading</label>
              <input
                type="text"
                name="heroSubheading"
                value={formData.heroSubheading}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A]"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold border-b pb-2">Contact Details</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="contactLocation"
                value={formData.contactLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A]"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold border-b pb-2">About Section</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">About Me Text</label>
            <textarea
              name="aboutText"
              rows={4}
              value={formData.aboutText}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FD853A] resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
