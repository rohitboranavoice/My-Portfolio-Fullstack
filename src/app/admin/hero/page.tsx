"use client";

import { useState, useEffect, useRef } from "react";
import { Save, AlertTriangle, Upload, Home, Scissors } from "lucide-react";
import Image from "next/image";
import ImageCropModal from "@/frontend/components/admin/ImageCropModal";
import { useData } from "@/frontend/context/DataContext";

export default function HeroManager() {
  const { mutate } = useData();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dbError, setDbError] = useState(false);

  // Cropping State
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        alert("Hero section updated successfully!");
        if (mutate) mutate(); // Refresh the global frontend context!
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    
    // Reset input value so same file can be selected again if needed
    if (e.target) e.target.value = "";
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    setIsCropModalOpen(false);
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", croppedBlob, "hero-crop.png");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setSettings({ ...settings, heroImage: data.url });
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
      setTempImageSrc(null);
    }
  };

  if (loading) return <div className="p-8">Loading Hero settings...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FD853A]/10 rounded-2xl flex items-center justify-center text-[#FD853A]">
            <Home size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1D2939]">Hero Section</h1>
            <p className="text-gray-500">Manage your home page&apos;s first impression.</p>
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
        {/* Text Settings */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-[#1D2939] border-b pb-4">Content Settings</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Main Heading</label>
            <input
              type="text"
              value={settings?.heroHeading || ""}
              onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FD853A] focus:border-transparent outline-none transition-all text-lg font-bold"
              placeholder="e.g. I'M ROHIT BORANA"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Sub-heading / Profession</label>
            <textarea
              rows={3}
              value={settings?.heroSubheading || ""}
              onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FD853A] focus:border-transparent outline-none transition-all resize-none"
              placeholder="e.g. PHOTOGRAPHER | VIDEOGRAPHER"
            />
          </div>
        </div>

        {/* Visual Settings */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-[#1D2939] border-b pb-4">Hero Visual</h2>
          
          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Main Banner Image</label>
            <div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group">
              {settings?.heroImage ? (
                <>
                  <Image src={settings.heroImage} alt="Hero" fill className="object-contain p-4" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                      <Upload size={18} />
                      Change Image
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload size={32} className="text-gray-400" />
                  <span className="text-gray-500 font-medium">Click to upload banner</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              )}
            </div>
            {uploading && <p className="text-[#FD853A] text-sm animate-pulse font-medium">Uploading image...</p>}
            
            {/* Scale Slider */}
            <div className="flex flex-col gap-3 mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Photo Scale</label>
                <span className="text-[#FD853A] font-bold">{settings?.heroImageScale || 100}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="200" 
                step="5"
                value={settings?.heroImageScale || 100}
                onChange={(e) => setSettings({ ...settings, heroImageScale: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FD853A]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1">
                <span>SMALLER (20%)</span>
                <span>DEFAULT (100%)</span>
                <span>LARGER (200%)</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">Recommended: Transparent PNG (min 1000px height)</p>
          </div>
        </div>
      </div>

      {/* Image Crop Modal */}
      {tempImageSrc && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          imageSrc={tempImageSrc}
          onClose={() => {
            setIsCropModalOpen(false);
            setTempImageSrc(null);
          }}
          onCropComplete={handleCropSave}
        />
      )}
    </div>
  );
}
