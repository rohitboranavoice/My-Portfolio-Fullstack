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
  Layout,
  Link as LinkIcon
} from "lucide-react";
import Image from "next/image";
import { useData } from "@/frontend/context/DataContext";

export default function VideographyManager() {
  const { settings, mutate } = useData();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [uploading, setUploading] = useState(false);

  // States for the Videography Collection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    videoUrl: "",
    youtubeUrl: "",
    thumbnailUrl: "",
    category: "Cinematic",
    subCategory: "", 
    isFeatured: true,
    type: "featured" as "featured" | "gallery",
  });

  useEffect(() => {
    fetchVideos();
  }, []);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    
    if (file.size > 10 * 1024 * 1024 && !confirm("Large video files may take a while to upload. Proceed?")) {
      setUploading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setFormData({ ...formData, videoUrl: result.url });
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (err) { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.youtubeUrl && !formData.videoUrl) {
      alert("Please provide either a YouTube link or a direct video URL/File");
      return;
    }

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
        if (mutate) mutate();
      } else {
        alert("Operation failed");
      }
    } catch (err) { alert("Failed to save video"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video entry?")) return;
    await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    fetchVideos();
    if (mutate) mutate();
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

  const VideoCard = ({ video }: { video: any }) => (
    <div className={`bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm relative group overflow-hidden hover:border-orange-200 transition-all ${video.isFeatured ? 'ring-1 ring-[#FD853A]/20' : ''}`}>
      <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-12 h-12 bg-[#FD853A] rounded-full flex items-center justify-center text-white shadow-lg opacity-80">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
        {video.thumbnailUrl || video.youtubeUrl ? (
          <img 
            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeUrl?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1] || ''}/maxresdefault.jpg`} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
            alt=""
          />
        ) : video.videoUrl && video.videoUrl.includes("cloudinary") && (
          <video src={video.videoUrl} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {video.isFeatured && (
            <div className="bg-[#FD853A] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-white/20">
              Featured
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-gray-100">
            {video.type || 'featured'}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-[#1D2939] truncate" title={video.title}>{video.title}</h3>
        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
          {video.category} {video.subCategory ? `• ${video.subCategory}` : ''}
        </p>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 translate-x-14 group-hover:translate-x-0 transition-all duration-300">
        <button onClick={() => openModal(video)} className="w-9 h-9 bg-white shadow-xl rounded-xl flex items-center justify-center text-gray-700 hover:bg-[#FD853A] hover:text-white transition-colors border border-gray-100"><Edit size={16}/></button>
        <button onClick={() => handleDelete(video._id)} className="w-9 h-9 bg-white shadow-xl rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-gray-100"><Trash2 size={16}/></button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1D2939]">Videography Manager</h1>
          <p className="text-gray-500">Manage your cinematic gallery and video assets here.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#1D2939] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#FD853A] transition-all flex items-center gap-2 shadow-lg hover:shadow-orange-500/20"
        >
          <Plus size={18} /> Add New Video
        </button>
      </div>

      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
        <div className="bg-white p-2 rounded-lg shadow-sm">
           <AlertTriangle size={20} className="text-[#FD853A]" />
        </div>
        <p className="text-sm font-medium text-orange-800">
          <strong>Tip:</strong> YouTube & Vimeo links are highly recommended for performance. You can also use Cloudinary for direct video uploads.
        </p>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3 items-center text-red-700">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">Database connection issues. Check your Atlas status.</p>
        </div>
      )}

      {/* Videography Section Management */}
      <div className="flex flex-col gap-14">
        
        {/* Featured Showcase Section */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-white px-6 py-3 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Layout size={18} className="text-[#FD853A]" />
              <h3 className="font-bold text-[#1D2939]">Featured Showcase (Top Player)</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{videos.filter(v => v.type === "featured" || !v.type).length} Items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.filter(v => v.type === "featured" || !v.type).map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
            {videos.filter(v => v.type === "featured" || !v.type).length === 0 && !loading && (
              <div className="col-span-full py-16 text-center text-gray-400 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                No featured showcase videos yet.
              </div>
            )}
          </div>
        </div>

        {/* Video Gallery Section */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-white px-6 py-3 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Film size={18} className="text-[#FD853A]" />
              <h3 className="font-bold text-[#1D2939]">Video Gallery (4x2 Grid Area)</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{videos.filter(v => v.type === "gallery").length} Items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.filter(v => v.type === "gallery").map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
            {videos.filter(v => v.type === "gallery").length === 0 && !loading && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                No gallery items found.
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <p className="text-center py-20 text-gray-400 font-medium animate-pulse">Synchronizing with Cloud Database...</p>}

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-800 focus:outline-none"><X size={24} /></button>
            <h2 className="text-3xl font-bold mb-8 text-[#1D2939]">{formData._id ? "Edit Video Asset" : "Add Video Asset"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Asset Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#FD853A] font-medium" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Display Section</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium"
                  >
                    <option value="featured">Featured (Top Showcase)</option>
                    <option value="gallery">Gallery (4x2 Grid)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Category / Tag</label>
                  <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-orange-600" placeholder="e.g. Cinematic" />
                </div>
              </div>

              <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">YouTube / Vimeo Link</label>
                  <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-gray-100 shadow-sm">
                    <LinkIcon size={18} className="text-[#FD853A]" />
                    <input 
                      type="text" 
                      value={formData.youtubeUrl} 
                      onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})} 
                      className="flex-1 bg-transparent border-none outline-none text-sm font-medium" 
                      placeholder="https://www.youtube.com/watch?v=..." 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">OR USE CLOUD</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Direct Cloud Link / Upload</label>
                  <div className="flex gap-3 items-center">
                    <div className="flex-1 flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-gray-100 shadow-sm">
                      <Film size={18} className="text-blue-500" />
                      <input 
                        type="text" 
                        value={formData.videoUrl} 
                        onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} 
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium" 
                        placeholder="Paste direct .mp4 or Cloudinary link..." 
                      />
                    </div>
                    <label className="cursor-pointer bg-[#1D2939] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shrink-0 shadow-lg">
                      <Upload size={18} />
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="video/*" />
                    </label>
                  </div>
                </div>
              </div>

              {uploading && <p className="text-center text-[#FD853A] font-bold animate-pulse text-xs uppercase tracking-widest">Pushing to Cloudinary...</p>}

              <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between mt-2 border border-blue-50">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1D2939]">Promote to Featured</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Show this prominently on your homepage.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.isFeatured} 
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} 
                  className="w-6 h-6 accent-[#FD853A]" 
                />
              </div>

              <button type="submit" className="w-full bg-[#FD853A] text-white py-5 rounded-[2rem] font-bold mt-4 hover:shadow-2xl hover:shadow-orange-500/30 transition-all text-xl uppercase tracking-tighter">
                {formData._id ? "Update Video Entry" : "Launch New Video Asset"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
