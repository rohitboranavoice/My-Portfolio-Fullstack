"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Upload, AlertTriangle, Link } from "lucide-react";
import Image from "next/image";

export default function PortfolioManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    category: "",
    subCategory: "",
    image: "",
    aspectRatio: "aspect-square",
    featured: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setDbError(false);
      const [projRes, servRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/services")
      ]);
      const projData = await projRes.json();
      const servData = await servRes.json();
      
      setProjects(Array.isArray(projData) ? projData : []);
      
      // Map services to category format: serviceId -> slug
      const formattedCats = Array.isArray(servData) ? servData.map((s: any) => ({
        _id: s._id,
        title: s.title,
        slug: s.serviceId,
        subCategories: s.subcategories.map((sub: any) => sub.title)
      })) : [];
      
      setCategories(formattedCats);

      if ((projData && projData.error) || (servData && servData.error)) setDbError(true);
    } catch (err) {
      console.error("Fetch data failed:", err);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formDataObj });
      const data = await res.json();
      if (data.url) setFormData({ ...formData, image: data.url });
      else alert(data.error || "Upload failed");
    } catch (err) { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) { alert("Please upload an image or provide a link"); return; }
    try {
      const url = formData._id ? `/api/admin/projects/${formData._id}` : "/api/admin/projects";
      const method = formData._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.message || "Operation failed");
      }
    } catch (err) { alert("Operation failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    fetchData();
  };

  const openModal = (project?: any) => {
    if (project) {
      setFormData({
        _id: project._id,
        title: project.title,
        category: project.category || categories[0]?.slug || "",
        subCategory: project.subCategory || "",
        image: project.image || "",
        aspectRatio: project.aspectRatio || "aspect-square",
        featured: project.featured || false,
      });
    } else {
      setFormData({ 
        _id: "", 
        title: "", 
        category: categories[0]?.slug || "", 
        subCategory: "", 
        image: "", 
        aspectRatio: "aspect-square", 
        featured: false 
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1D2939]">Portfolio Manager</h1>
          <p className="text-gray-500">Manage your projects using your synchronized Service categories.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#FD853A] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#e67a2e] transition-colors shadow-lg shadow-orange-500/20">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-center text-amber-800">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">Database connection issue or no services found. Please check your Services Manager.</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No projects found. Add your first masterpiece!</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group relative">
              <div className={`${project.aspectRatio} relative bg-gray-50`}>
                {project.image && (
                  <div className="relative w-full h-full">
                    <Image src={project.image} alt={project.title} fill className="object-cover" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openModal(project)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-[#FD853A] hover:text-white transition-colors"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(project._id)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{project.category}</span>
                    <h3 className="font-bold text-[#1D2939] mt-2 line-clamp-1">{project.title}</h3>
                    {project.subCategory && <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{project.subCategory}</p>}
                  </div>
                  {project.featured && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold text-[#1D2939] mb-4">Integrated Management</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your portfolio categories are now synchronized with the <span className="text-[#FD853A] font-bold">Services</span> section. 
            To add, rename, or manage categories and sub-categories, please use the Services Manager. 
            This ensures a consistent experience across your entire website.
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-4 border border-orange-100 min-w-[240px]">
           <div className="w-10 h-10 bg-[#FD853A] rounded-full flex items-center justify-center text-white shrink-0">
              {categories.length}
           </div>
           <p className="text-sm font-bold text-orange-800">Live Categories Available</p>
        </div>
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm shadow-2xl">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-8">{formData._id ? "Edit Project" : "Add Project"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category (From Services)</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ""})} 
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]"
                  >
                    <option value="">Select a service category</option>
                    {categories.map(c => <option key={c._id} value={c.slug}>{c.title}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sub-category</label>
                  <select 
                    value={formData.subCategory} 
                    onChange={(e) => setFormData({...formData, subCategory: e.target.value})} 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]"
                  >
                    <option value="">No sub-category</option>
                    {categories.find(c => c.slug === formData.category)?.subCategories?.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

                <div className="flex items-center gap-3 pt-6">
                  <input 
                    type="checkbox" 
                    id="featured"
                    checked={formData.featured} 
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})} 
                    className="w-5 h-5 accent-[#FD853A]"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-gray-600 cursor-pointer">Mark as Featured</label>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Media (Photo or Video Link)</label>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <Link size={16} className="text-[#FD853A]" />
                    <input 
                      type="text" 
                      placeholder="Paste Google Drive, YouTube, or Cloudinary link here..." 
                      value={formData.image} 
                      onChange={(e) => setFormData({...formData, image: e.target.value})} 
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">OR</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                  
                  {formData.image && formData.image.startsWith("/") || formData.image.includes("cloudinary") ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      <button type="button" onClick={() => setFormData({...formData, image: ""})} className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-red-500 shadow-sm"><Trash2 size={18}/></button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group">
                      <input type="file" onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
                      <Upload className="text-gray-300 group-hover:text-[#FD853A] mb-2 transition-colors" size={32} />
                      <p className="text-xs text-gray-500 font-bold">{uploading ? "Uploading to Cloudinary..." : "Click to upload to Cloudinary"}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase">Best for high-quality images</p>
                    </label>
                  )}
                </div>
              </div>

               <button type="submit" className="w-full bg-[#FD853A] text-white py-5 rounded-[2rem] font-bold mt-4 hover:bg-[#e67a2e] transition-all shadow-xl shadow-orange-500/20 text-lg">
                {formData._id ? "Update Project" : "Save Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
