"use client";

import { useState, useEffect, useRef } from "react";
import { Save, AlertTriangle, Upload, Home, Scissors, Link, Film } from "lucide-react";
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
        if (mutate) mutate();
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVideo = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (isVideo) {
      if (file.size > 10 * 1024 * 1024 && !confirm("This video is over 10MB. Large uploads may fail on some networks. Proceed?")) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) setSettings({ ...settings, heroVideoUrl: data.url });
        else alert(data.error || "Upload failed");
      } catch (err) { alert("Upload failed"); }
      finally { setUploading(false); }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    
    if (e.target) e.target.value = "";
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    setIsCropModalOpen(false);
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", croppedBlob, "hero-crop.png");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        // No longer using heroImage
        alert("Upload successful, but Hero Banner Image is no longer used. Please use the Video Strip option below.");
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
            <p className="text-gray-500">Manage your home page&apos;s first impression and video strip.</p>
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
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6 h-fit">
          <h2 className="text-xl font-bold text-[#1D2939] border-b pb-4">Content Settings</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Heading</label>
            <input
              type="text"
              value={settings?.heroHeading || ""}
              onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FD853A] focus:border-transparent outline-none transition-all text-lg font-bold"
              placeholder="e.g. I'M ROHIT BORANA"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sub-heading / Profession</label>
            <textarea
              rows={3}
              value={settings?.heroSubheading || ""}
              onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FD853A] focus:border-transparent outline-none transition-all resize-none"
              placeholder="PHOTOGRAPHER | VIDEOGRAPHER"
            />
          </div>
        </div>

        {/* Visual Settings */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
          {/* Video Strip Setting */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#1D2939]">Video Strip Background</h2>
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <Film size={16} className="text-[#FD853A]" />
                  <input 
                    type="text" 
                    placeholder="Paste Video URL (YouTube / Cloudinary / Drive)..." 
                    value={settings?.heroVideoUrl || ""} 
                    onChange={(e) => setSettings({...settings, heroVideoUrl: e.target.value})} 
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                  />
               </div>
               
               <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-gray-100 flex flex-col items-center justify-center group">
                {settings?.heroVideoUrl ? (
                  <>
                    <video src={settings.heroVideoUrl} muted autoPlay loop className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-gray-900 p-2 rounded-full font-bold shadow-xl">
                        <Upload size={18} />
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, true)} accept="video/*" />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <Film size={24} className="text-neutral-700" />
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-tight">Upload Strip Video</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, true)} accept="video/*" />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-bold text-center">Note: Vercel limits direct video uploads. YouTube / Google Drive links work best.</p>
            </div>
          </div>
          {uploading && <p className="text-[#FD853A] text-sm animate-pulse font-bold text-center">Uploading to Cloudinary...</p>}
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
