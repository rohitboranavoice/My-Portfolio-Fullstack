"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dbError, setDbError] = useState(false);
  
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
      }
    } catch (err) {
      alert("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload a cover image first");
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
        alert("Operation failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service category?")) return;
    
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
               Database Offline
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

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-start">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div className="flex flex-col gap-1">
            <p className="text-amber-800 font-bold text-sm">Action Required: MongoDB Disconnected</p>
            <p className="text-amber-700 text-sm">
              The services manager could not connect to your MongoDB instance. Please ensure MongoDB is running or check your <code>MONGODB_URI</code>.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No services found. Add one above!</p>
        ) : (
          services.map((service, idx) => (
            <div key={service._id} className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 rounded-2xl items-start">
              <div className="w-full md:w-48 aspect-video relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {service.image && <Image src={service.image} alt={service.title} fill className="object-cover" />}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2939]">{service.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">ID: {service.serviceId}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => moveService(idx, 'up')}
                      disabled={idx === 0 || savingOrder}
                      className="p-2 bg-gray-50 rounded-lg hover:text-[#FD853A] disabled:opacity-30"
                    >
                      <ArrowUp size={16}/>
                    </button>
                    <button 
                      onClick={() => moveService(idx, 'down')}
                      disabled={idx === services.length - 1 || savingOrder}
                      className="p-2 bg-gray-50 rounded-lg hover:text-[#FD853A] disabled:opacity-30"
                    >
                      <ArrowDown size={16}/>
                    </button>
                    <button onClick={() => openModal(service)} className="p-2 bg-gray-50 rounded-lg hover:text-[#FD853A]"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(service._id)} className="p-2 bg-gray-50 rounded-lg hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm max-w-2xl">{service.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {service.subcategories.map((sub: any, i: number) => (
                    <span key={i} className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">
                      {sub.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">{formData._id ? "Edit Service" : "Add Service"}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Service Name</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Service URL ID (no spaces)</label>
                  <input type="text" required placeholder="e.g. wedding-photography" value={formData.serviceId} onChange={(e) => setFormData({...formData, serviceId: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Description</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl resize-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Cover Image</label>
                {formData.image ? (
                  <div className="relative aspect-video w-48 rounded-xl overflow-hidden border">
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, image: ""})} className="absolute top-1 right-1 bg-white rounded-md p-1">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <input type="file" onChange={handleFileUpload} accept="image/*" className="w-full" />
                )}
              </div>

              <div className="flex flex-col gap-3 border-t pt-4">
                <label className="text-sm font-medium">Subcategories</label>
                <div className="flex flex-col gap-2">
                  {formData.subcategories.map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                      <span className="flex-1 text-sm font-medium">{sub.title} <span className="text-gray-400 font-normal">({sub.id})</span></span>
                      <button type="button" onClick={() => removeSubcategory(i)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-start mt-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="Title (e.g. Pre-Wedding)" 
                      value={newSubcat.title} 
                      onChange={(e) => {
                        const title = e.target.value;
                        const suggestedId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        setNewSubcat({
                          title,
                          id: newSubcat.id || suggestedId // suggestions only if empty
                        });
                      }} 
                      className="w-full px-3 py-2 border rounded-lg text-sm" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="ID (e.g. pre-wedding)" 
                      value={newSubcat.id} 
                      onChange={(e) => setNewSubcat({...newSubcat, id: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g, '')})} 
                      className="w-full px-3 py-2 border rounded-lg text-sm" 
                    />
                  </div>
                  <button type="button" onClick={addSubcategory} className="bg-gray-100 text-[#1D2939] px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-200">Add</button>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#1D2939] text-white py-3 rounded-xl font-bold mt-2 hover:bg-[#FD853A] transition-colors">
                {formData._id ? "Update Service" : "Save Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
