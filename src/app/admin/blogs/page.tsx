"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Upload, Calendar, Clock, User, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    excerpt: "",
    content: "",
    author: "Rohit Borana",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    image: "",
    category: "Photography",
    readTime: "5 min read",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setDbError(false);
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        if (data.error) setDbError(true);
      }
    } catch (err) {
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
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) { alert("Please upload a cover image"); return; }

    try {
      const url = formData._id ? `/api/admin/blogs/${formData._id}` : "/api/admin/blogs";
      const method = formData._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
      }
    } catch (err) { alert("Operation failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  const openModal = (blog?: any) => {
    if (blog) {
      setFormData(blog);
    } else {
      setFormData({
        _id: "",
        title: "",
        excerpt: "",
        content: "",
        author: "Rohit Borana",
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        image: "",
        category: "Photography",
        readTime: "5 min read",
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center text-center sm:text-left">
        <div>
          <h1 className="text-3xl font-bold text-[#1D2939]">Blog Manager</h1>
          <p className="text-gray-500">Create and manage your creative insights.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#FD853A] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#e67a2e] transition-colors shadow-lg"
        >
          <Plus size={18} />
          New Post
        </button>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex gap-3 items-center text-red-700">
          <AlertTriangle size={20} />
          <p className="font-medium">Database connection issue.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500 italic">No blog posts found.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group">
              <div className="aspect-[16/10] relative">
                {blog.image && <Image src={blog.image} alt={blog.title} fill className="object-cover" />}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openModal(blog)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(blog._id)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500"><Trash2 size={18}/></button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase">{blog.category}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{blog.date}</span>
                </div>
                <h3 className="font-bold text-[#1D2939] line-clamp-2 text-lg">{blog.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{blog.excerpt}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-3xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-8">{formData._id ? "Edit Blog Post" : "Create New Post"}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]">
                    <option>Photography</option>
                    <option>Cinematography</option>
                    <option>Editing</option>
                    <option>Directing</option>
                    <option>Business</option>
                    <option>Gear</option>
                    <option>AI</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Excerpt (Brief Summary)</label>
                <textarea rows={2} required value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A] resize-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Content (Markdown or Plain Text)</label>
                <textarea rows={6} required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A] resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Author</label>
                  <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Read Time</label>
                  <input type="text" value={formData.readTime} onChange={(e) => setFormData({...formData, readTime: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</label>
                  <input type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cover Image</label>
                {formData.image ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border">
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, image: ""})} className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-red-500 shadow-sm"><Trash2 size={18}/></button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group">
                    <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                    <Upload className="text-gray-300 group-hover:text-[#FD853A] mb-2 transition-colors" size={32} />
                    <p className="text-sm text-gray-500 font-bold">{uploading ? "Uploading..." : "Click to upload blog cover"}</p>
                  </label>
                )}
              </div>

              <button type="submit" className="w-full bg-[#FD853A] text-white py-5 rounded-[2rem] font-bold mt-4 hover:bg-[#e67a2e] transition-all shadow-xl shadow-orange-500/20 text-lg">
                {formData._id ? "Update Blog Post" : "Publish Blog Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
