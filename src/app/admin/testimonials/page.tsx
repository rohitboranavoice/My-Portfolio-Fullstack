"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, MessageSquare, Star, ArrowUp, ArrowDown } from "lucide-react";

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    role: "",
    rating: 5,
    text: "",
    signature: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newList: any[]) => {
    setSavingOrder(true);
    try {
      // Create a reorder API or just update individually. 
      // For now, let's assume we have a bulk reorder API similar to projects.
      const items = newList.map((t, index) => ({ id: t._id, order: index }));
      await fetch("/api/admin/testimonials/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      setTestimonials(newList);
    } catch (err) {
      alert("Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newList = [...testimonials];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= testimonials.length) return;
    
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    handleReorder(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = formData._id ? `/api/admin/testimonials/${formData._id}` : "/api/admin/testimonials";
      const method = formData._id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      } else {
        alert("Operation failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ _id: "", name: "", role: "", rating: 5, text: "", signature: "" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FD853A]/10 rounded-2xl flex items-center justify-center text-[#FD853A]">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1D2939]">Testimonials</h1>
            <p className="text-gray-500">Manage customer reviews and feedback.</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#1D2939] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#FD853A] transition-colors"
        >
          <Plus size={18} />
          Add Review
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD853A]"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-4">
            <Star size={48} className="opacity-20" />
            <p>No testimonials added yet. Click &apos;Add Review&apos; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={t._id} className="group relative bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100 hover:border-[#FD853A]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < t.rating ? "text-[#FD853A] fill-[#FD853A]" : "text-gray-300"} />
                    ))}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="p-1.5 bg-white rounded-lg text-gray-400 hover:text-[#FD853A] disabled:opacity-20"><ArrowUp size={14}/></button>
                    <button onClick={() => moveItem(idx, 'down')} disabled={idx === testimonials.length - 1} className="p-1.5 bg-white rounded-lg text-gray-400 hover:text-[#FD853A] disabled:opacity-20"><ArrowDown size={14}/></button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm italic mb-6 line-clamp-4">&quot;{t.text}&quot;</p>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1D2939]">{t.name}</span>
                    <span className="text-xs text-gray-400">{t.role}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(t)} className="p-2 bg-white rounded-lg text-gray-400 hover:text-[#FD853A] transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(t._id)} className="p-2 bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-8">{formData._id ? "Edit Review" : "Add New Review"}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Client Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FD853A] outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Client Role</label>
                  <input type="text" placeholder="e.g. Web Designer" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FD853A] outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Rating (1-5)</label>
                <div className="flex gap-3">
                  {[1,2,3,4,5].map(num => (
                    <button key={num} type="button" onClick={() => setFormData({...formData, rating: num})} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${formData.rating >= num ? "bg-[#FD853A] text-white" : "bg-gray-100 text-gray-400"}`}>
                      <Star size={18} className={formData.rating >= num ? "fill-white" : ""} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Review Text</label>
                <textarea rows={4} required value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FD853A] outline-none resize-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Signature / Short Name</label>
                <input type="text" placeholder="e.g. Pokale M." value={formData.signature} onChange={(e) => setFormData({...formData, signature: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FD853A] outline-none" />
              </div>

              <button type="submit" className="w-full bg-[#FD853A] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#e67a2e] transition-all shadow-lg shadow-orange-500/20">
                {formData._id ? "Update Review" : "Save Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
