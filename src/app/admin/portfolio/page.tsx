"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, Upload, X, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function PortfolioManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dbError, setDbError] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    category: "",
    subCategory: "", // New field
    image: "",
    aspectRatio: "aspect-square",
    featured: false,
  });

  const [catFormData, setCatFormData] = useState({
    _id: "",
    title: "",
    slug: "",
    subCategories: [] as string[], // New field
    subCategoriesInput: "", // Temporary input string
  });
  
  const [uploading, setUploading] = useState(false);

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
      const formattedCats = servData.map((s: any) => ({
        _id: s._id,
        title: s.title,
        slug: s.serviceId,
        subCategories: s.subcategories.map((sub: any) => sub.title)
      }));
      
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
    } catch (err) { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) { alert("Please upload an image"); return; }
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
      }
    } catch (err) { alert("Operation failed"); }
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = catFormData._id ? `/api/admin/portfolio-categories/${catFormData._id}` : "/api/admin/portfolio-categories";
      const method = catFormData._id ? "PUT" : "POST";
      const subCategories = catFormData.subCategoriesInput
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");
      
      const payload = {
        ...catFormData,
        subCategories
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsCatModalOpen(false);
        fetchData();
      }
    } catch (err) { alert("Failed to save category"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleCatDelete = async (id: string) => {
    if (!confirm("Delete category? projects in this category will remain but filter will be gone.")) return;
    await fetch(`/api/admin/portfolio-categories/${id}`, { method: "DELETE" });
    fetchData();
  };

  const openModal = (project?: any) => {
    if (project) {
      setFormData({
        ...project,
        subCategory: project.subCategory || ""
      });
    } else {
      setFormData({ _id: "", title: "", category: categories[0]?.slug || "", subCategory: "", image: "", aspectRatio: "aspect-square", featured: false });
    }
    setIsModalOpen(true);
  };

  const openCatModal = (cat?: any) => {
    if (cat) {
      setCatFormData({
        ...cat,
        subCategories: cat.subCategories || [],
        subCategoriesInput: (cat.subCategories || []).join(", ")
      });
    } else {
      setCatFormData({ _id: "", title: "", slug: "", subCategories: [], subCategoriesInput: "" });
    }
    setIsCatModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1D2939]">Portfolio Manager</h1>
          <p className="text-gray-500">Manage your projects and filter categories.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#FD853A] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#e67a2e] transition-colors shadow-lg shadow-orange-500/20">
            <Plus size={18} /> Add Project
          </button>
        </div>
      </div>

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-center text-amber-800">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">Database connection issue. Check your MongoDB status.</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 italic">No projects found.</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group relative">
              <div className={`${project.aspectRatio} relative bg-gray-50`}>
                {project.image && <Image src={project.image} alt={project.title} fill className="object-cover" />}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openModal(project)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(project._id)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500"><Trash2 size={18}/></button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase">{project.category}</span>
                    <h3 className="font-bold text-[#1D2939] mt-2">{project.title}</h3>
                  </div>
                  {project.featured && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Categories Info Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-[#1D2939] mb-4">Integrated Management</h2>
        <p className="text-gray-500 text-sm">
          Your portfolio categories are synced with the <span className="text-[#FD853A] font-bold">Services</span> section. 
          To add or rename categories, please use the Services Manager.
        </p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]">
                    {categories.map(c => <option key={c._id} value={c.slug}>{c.title}</option>)}
                    {categories.length === 0 && <option value="">Create a category first</option>}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sub-category</label>
                  <select 
                    value={formData.subCategory} 
                    onChange={(e) => setFormData({...formData, subCategory: e.target.value})} 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]"
                  >
                    <option value="">None</option>
                    {categories.find(c => c.slug === formData.category)?.subCategories?.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aspect Ratio</label>
                  <select value={formData.aspectRatio} onChange={(e) => setFormData({...formData, aspectRatio: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none">
                    <option value="aspect-square">Square (1:1)</option>
                    <option value="aspect-[3/4]">Portrait (3:4)</option>
                    <option value="aspect-[4/3]">Landscape (4:3)</option>
                    <option value="aspect-video">Video (16:9)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image</label>
                {formData.image ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border">
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, image: ""})} className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-red-500 shadow-sm"><Trash2 size={18}/></button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group">
                    <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                    <Upload className="text-gray-300 group-hover:text-[#FD853A] mb-2 transition-colors" size={32} />
                    <p className="text-sm text-gray-500 font-bold">{uploading ? "Uploading..." : "Click to upload project cover"}</p>
                  </label>
                )}
              </div>
               <button type="submit" className="w-full bg-[#FD853A] text-white py-5 rounded-[2rem] font-bold mt-4 hover:bg-[#e67a2e] transition-all shadow-xl shadow-orange-500/20 text-lg">
                {formData._id ? "Update Project" : "Save Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative">
            <button onClick={() => setIsCatModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-8">{catFormData._id ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleCatSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                <input type="text" required value={catFormData.title} onChange={(e) => {
                  const title = e.target.value;
                  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  setCatFormData({...catFormData, title, slug: catFormData.slug || slug});
                }} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slug</label>
                <input type="text" required value={catFormData.slug} onChange={(e) => setCatFormData({...catFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sub-categories (Comma separated)</label>
                <input 
                  type="text" 
                  value={catFormData.subCategoriesInput} 
                  onChange={(e) => setCatFormData({...catFormData, subCategoriesInput: e.target.value})} 
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none border-l-4 border-l-[#FD853A]" 
                  placeholder="e.g. Pre-wedding, Candid, Documentary" 
                />
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Enter sub-categories separated by commas</p>
              </div>
              <button type="submit" className="w-full bg-[#1D2939] text-white py-4 rounded-2xl font-bold mt-4 hover:bg-[#FD853A] transition-all">
                {catFormData._id ? "Update Category" : "Save Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
