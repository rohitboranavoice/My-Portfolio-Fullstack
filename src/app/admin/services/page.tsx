"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, ArrowUp, ArrowDown, AlertTriangle, Link, Upload } from "lucide-react";
import Image from "next/image";

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: "",
    serviceId: "",
    title: "",
    description: "",
    icon: "Camera",
    image: "",
    subcategories: [] as {id: string, title: string}[],
  });
  
  const [newSubcat, setNewSubcat] = useState({ id: "", title: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setDbError(false);
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        console.error("Invalid data received", data);
        setServices([]);
        if (data && data.error) setDbError(true);
      }
    } catch (err) {
      console.error("Fetch services failed:", err);
      setDbError(true);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newServices: any[]) => {
    setSavingOrder(true);
    try {
      const items = newServices.map((s, index) => ({ id: s._id, order: index }));
      const res = await fetch("/api/admin/services/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Reorder failed");
      setServices(newServices);
    } catch (err) {
      alert("Failed to save new order");
      fetchServices();
    } finally {
      setSavingOrder(false);
    }
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    const newServices = [...services];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= services.length) return;
    
    [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];
    handleReorder(newServices);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataObj,
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload a cover image or provide a link first");
      return;
    }

    try {
      const url = formData._id ? `/api/admin/services/${formData._id}` : "/api/admin/services";
      const method = formData._id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        const error = await res.json();
        alert(error.error || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service category? This will also remove it from the Portfolio category list.")) return;
    
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addSubcategory = () => {
    if (!newSubcat.title || !newSubcat.id) return;
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, newSubcat]
    });
    setNewSubcat({ id: "", title: "" });
  };

  const removeSubcategory = (index: number) => {
    const newArr = [...formData.subcategories];
    newArr.splice(index, 1);
    setFormData({ ...formData, subcategories: newArr });
  };

  const openModal = (service?: any) => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({ _id: "", serviceId: "", title: "", description: "", icon: "Camera", image: "", subcategories: [] });
    }
    setNewSubcat({ id: "", title: "" });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#1D2939]">Services Manager</h1>
        <div className="flex items-center gap-3">
          {dbError && (
             <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium border border-red-100">
               <AlertTriangle size={16} />
               Database Connection Issue
             </div>
          )}
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#1D2939] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#FD853A] transition-colors"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
           <p className="text-sm font-medium text-orange-800">
             <strong>Note:</strong> These services act as categories for your portfolio. Manage them here to see updates in the Portfolio Manager.
           </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-gray-500">Loading services...</p>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <p className="text-gray-500">No services found. Add your first service to begin!</p>
          </div>
        ) : (
          services.map((service, idx) => (
            <div key={service._id} className="flex flex-col lg:flex-row gap-6 p-5 border border-gray-100 rounded-2xl items-start hover:border-orange-200 transition-colors bg-white hover:shadow-md">
              <div className="w-full lg:w-56 aspect-video relative rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                {service.image && (
                  <div className="relative w-full h-full">
                    <Image src={service.image} alt={service.title} fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2939]">{service.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">URL Slug: {service.serviceId}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => moveService(idx, 'up')}
                      disabled={idx === 0 || savingOrder}
                      className="p-2 bg-gray-50 rounded-lg hover:text-[#FD853A] disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp size={16}/>
                    </button>
                    <button 
                      onClick={() => moveService(idx, 'down')}
                      disabled={idx === services.length - 1 || savingOrder}
                      className="p-2 bg-gray-50 rounded-lg hover:text-[#FD853A] disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={16}/>
                    </button>
                    <button onClick={() => openModal(service)} className="p-2 bg-gray-50 rounded-lg hover:text-[#FD853A] transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(service._id)} className="p-2 bg-gray-50 rounded-lg hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm max-w-2xl line-clamp-2">{service.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.subcategories.map((sub: any, i: number) => (
                    <span key={i} className="text-[10px] bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-tight border border-orange-100">
                      {sub.title}
                    </span>
                  ))}
                  {service.subcategories.length === 0 && <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tight">No subcategories</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-800">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-8">{formData._id ? "Edit Service" : "Add Service"}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Service Name</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#FD853A]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">URL Slug (e.g. wedding)</label>
                  <input type="text" required placeholder="wedding-photography" value={formData.serviceId} onChange={(e) => setFormData({...formData, serviceId: e.target.value.toLowerCase().replace(/\s+/g,'-')})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Service Description</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none resize-none" />
              </div>

              <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cover Image (Link or Upload)</label>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                      <Link size={16} className="text-[#FD853A]" />
                      <input 
                        type="text" 
                        placeholder="Paste Google Drive or external image link..." 
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
                   
                   {formData.image && (formData.image.startsWith("/") || formData.image.includes("cloudinary")) ? (
                      <div className="relative aspect-video w-48 rounded-xl overflow-hidden border border-white shadow-sm">
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => setFormData({...formData, image: ""})} className="absolute top-2 right-2 bg-white/90 rounded-lg p-1.5 text-red-500 shadow-md">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 transition-all group">
                         <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                         <Upload className="text-gray-300 group-hover:text-[#FD853A] mb-2 transition-colors" size={28} />
                         <p className="text-[10px] text-gray-500 font-bold uppercase">{uploading ? "Uploading..." : "Upload Cover to Cloudinary"}</p>
                      </label>
                    )}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t pt-6 mt-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subcategories</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.subcategories.map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                      <span className="flex-1 text-[11px] font-bold text-[#1D2939] uppercase tracking-tight">{sub.title}</span>
                      <button type="button" onClick={() => removeSubcategory(i)} className="text-red-400 p-1 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-start mt-2">
                   <input 
                      type="text" 
                      placeholder="Title (e.g. Pre-Wedding)" 
                      value={newSubcat.title} 
                      onChange={(e) => {
                        const title = e.target.value;
                        const suggestedId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        setNewSubcat({ title, id: newSubcat.id || suggestedId });
                      }} 
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm" 
                   />
                   <button type="button" onClick={addSubcategory} className="bg-[#1D2939] text-white px-5 py-2.5 text-sm font-bold rounded-xl hover:bg-[#FD853A] transition-all">Add</button>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#FD853A] text-white py-4 rounded-[2rem] font-bold mt-4 hover:shadow-xl hover:shadow-orange-500/20 transition-all text-lg">
                {formData._id ? "Update Service & Sync" : "Create Service Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
