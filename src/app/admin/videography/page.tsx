"use client";

import { useState, useEffect } from "react";
import { 
  Film, 
  Save, 
  Upload, 
  Play, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  AlertTriangle,
  Layout
} from "lucide-react";
import Image from "next/image";
import { useData } from "@/frontend/context/DataContext";

export default function VideographyManager() {
  const { settings, mutate } = useData();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [dbError, setDbError] = useState(false);
  
  // States for the Hero Video (part of Settings)
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);

  // States for the Videography Collection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    videoUrl: "",
    youtubeUrl: "",
    thumbnailUrl: "",
    category: "Cinematic",
    subCategory: "", // New field
    isFeatured: true,
    type: "featured" as "featured" | "gallery",
  });
  const [itemUploading, setItemUploading] = useState(false);

  useEffect(() => {
    fetchVideos();
    if (settings) {
      setHeroVideoUrl(settings.heroVideoUrl || "");
    }
  }, [settings]);

  const fetchVideos = async () => {
    try {
      setDbError(false);
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : []);
      if (data && data.error) setDbError(true);
    } catch (err) {
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setHeroUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setHeroVideoUrl(result.url);
      }
    } catch (err) { alert("Upload failed"); }
    finally { setHeroUploading(false); }
  };

  const handleItemUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setItemUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setFormData({ ...formData, videoUrl: result.url });
      }
    } catch (err) { alert("Upload failed"); }
    finally { setItemUploading(false); }
  };

  const saveHeroSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, heroVideoUrl }),
      });
      if (res.ok) {
        alert("Hero Video background updated!");
        mutate();
      }
    } catch (err) { alert("Failed to save settings"); }
    finally { setSavingSettings(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = formData._id ? `/api/admin/videos/${formData._id}` : "/api/admin/videos";
      const method = formData._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchVideos();
        mutate();
      }
    } catch (err) { alert("Failed to save video"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video entry?")) return;
    await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    fetchVideos();
    mutate();
  };

  const openModal = (video?: any) => {
    if (video) {
      setFormData({
        _id: video._id,
        title: video.title || "",
        videoUrl: video.videoUrl || "",
        youtubeUrl: video.youtubeUrl || "",
        thumbnailUrl: video.thumbnailUrl || "",
        category: video.category || "Cinematic",
        subCategory: video.subCategory || "",
        isFeatured: video.isFeatured ?? true,
        type: video.type || "featured"
      });
    } else {
      setFormData({ 
        _id: "", 
        title: "", 
        videoUrl: "", 
        youtubeUrl: "",
        thumbnailUrl: "", 
        category: "Cinematic", 
        subCategory: "",
        isFeatured: true,
        type: "featured"
      });
    }
    setIsModalOpen(true);
  };

  const VideoCard = ({ video, openModal, handleDelete }: { video: any, openModal: any, handleDelete: any }) => (
    <div className={`bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm relative group overflow-hidden ${video.isFeatured ? 'ring-2 ring-[#FD853A]' : ''}`}>
      <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 bg-[#FD853A] rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
        {video.thumbnailUrl || video.youtubeUrl ? (
          <img 
            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeUrl?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || ''}/maxresdefault.jpg`} 
            className="w-full h-full object-cover opacity-50" 
            alt=""
          />
        ) : video.videoUrl && (
          <video src={video.videoUrl} className="w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {video.isFeatured && (
            <div className="bg-[#FD853A] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
              Featured
            </div>
          )}
          <div className="bg-neutral-800 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
            {video.type || 'featured'}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-[#1D2939] truncate">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">
          {video.category} {video.subCategory ? `• ${video.subCategory}` : ''}
        </p>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
        <button onClick={() => openModal(video)} className="w-9 h-9 bg-white shadow-lg rounded-xl flex items-center justify-center text-gray-700 hover:text-[#FD853A] transition-colors"><Edit size={16}/></button>
        <button onClick={() => handleDelete(video._id)} className="w-9 h-9 bg-white shadow-lg rounded-xl flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1D2939]">Videography Manager</h1>
          <p className="text-gray-500">Manage your cinematic video content and hero background.</p>
        </div>
      </div>

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-center text-amber-800">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">Database connection issues. Changes might not sync immediately.</p>
        </div>
      )}

      {/* Hero Video Management */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="w-10 h-10 bg-[#FD853A]/10 rounded-xl flex items-center justify-center text-[#FD853A]">
            <Film size={20} />
          </div>
          <h2 className="text-xl font-bold text-[#1D2939]">Hero Background Video</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              This video will play as a cinematic full-width strip behind the Hero section elements. 
              Recommended: A silent, high-quality .mp4 loop.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Video URL / Path</label>
              <input 
                type="text" 
                value={heroVideoUrl} 
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]" 
                placeholder="/uploads/my-cinematic-video.mp4"
              />
            </div>
            <div className="flex gap-3">
              <label className="cursor-pointer bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                <Upload size={18} />
                {heroUploading ? "Uploading..." : "Upload Video"}
                <input type="file" className="hidden" onChange={handleHeroUpload} accept="video/*" />
              </label>
              <button 
                onClick={saveHeroSettings}
                disabled={savingSettings || !heroVideoUrl}
                className="bg-[#FD853A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e67a2e] transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                <Save size={18} />
                {savingSettings ? "Saving..." : "Apply Video"}
              </button>
            </div>
          </div>

          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-4 border-white shadow-xl">
            {heroVideoUrl ? (
              <video 
                key={heroVideoUrl}
                src={heroVideoUrl} 
                className="w-full h-full object-cover opacity-60" 
                autoPlay muted loop playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 italic text-sm">
                No hero video set
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold">Preview Mode</div>
            </div>
          </div>
        </div>
      </div>

      {/* Videography Section Management */}
      <div className="flex flex-col gap-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-[#1D2939]">All Videography Assets</h2>
            <p className="text-gray-500">Manage both your large featured showcase and the 4x2 video gallery.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-[#1D2939] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} /> Add New Video
          </button>
        </div>

        {/* Featured Showcase Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-[#FD853A]" />
            <h3 className="text-lg font-bold text-[#1D2939]">Featured Showcase (Top Section)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.filter(v => v.type === "featured" || !v.type).map((video) => (
              <VideoCard key={video._id} video={video} openModal={openModal} handleDelete={handleDelete} />
            ))}
            {videos.filter(v => v.type === "featured" || !v.type).length === 0 && (
              <div className="col-span-full border-2 border-dashed border-gray-100 rounded-[2rem] p-12 text-center text-gray-400 text-sm">
                No featured showcase videos yet.
              </div>
            )}
          </div>
        </div>

        {/* Video Gallery Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Film size={18} className="text-[#FD853A]" />
            <h3 className="text-lg font-bold text-[#1D2939]">Video Gallery (4x2 Grid)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.filter(v => v.type === "gallery").map((video) => (
              <VideoCard key={video._id} video={video} openModal={openModal} handleDelete={handleDelete} />
            ))}
            {videos.filter(v => v.type === "gallery").length === 0 && (
              <div className="col-span-full border-2 border-dashed border-gray-100 rounded-[2rem] p-12 text-center text-gray-400 text-sm">
                No gallery videos yet. Paste YouTube links to populate the 4x2 grid.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-8">{formData._id ? "Edit Video" : "Add Video"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Asset Type</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                  >
                    <option value="featured">Featured Showcase (Large Player)</option>
                    <option value="gallery">Video Gallery (4x2 Grid)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="e.g. Wedding" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sub-category / Tag</label>
                <input type="text" value={formData.subCategory} onChange={(e) => setFormData({...formData, subCategory: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A] shadow-sm" placeholder="e.g. Cinematic, Documentary, Candid" />
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">This will be used for filtering on the public site.</p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">YouTube URL (Recommended)</label>
                <input 
                  type="text" 
                  value={formData.youtubeUrl} 
                  onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} 
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none border-l-4 border-l-red-500" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Direct Video File (Optional Backup)</label>
                <div className="flex gap-4 items-center">
                  <input type="text" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="/uploads/video.mp4" />
                  <label className="cursor-pointer bg-[#1D2939] text-white px-5 py-3.5 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2">
                    <Upload size={16} />
                    {itemUploading ? "Wait..." : "Upload"}
                    <input type="file" className="hidden" onChange={handleItemUpload} accept="video/*" />
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1D2939]">Featured Status</span>
                  <span className="text-xs text-gray-500">Enable to highlight this prominently on the home page.</span>
                </div>
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-6 h-6 accent-[#FD853A]" />
              </div>

              <button type="submit" className="w-full bg-[#FD853A] text-white py-5 rounded-[2rem] font-bold mt-4 hover:bg-[#e67a2e] transition-all shadow-xl shadow-orange-500/20 text-lg">
                {formData._id ? "Update Video Entry" : "Save Video Entry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
