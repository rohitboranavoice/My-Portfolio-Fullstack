"use client";

import { useState, useEffect } from "react";
import { Save, AlertTriangle, FileText, Upload, ExternalLink } from "lucide-react";

export default function ResumeManager() {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await fetch("/api/admin/resume");
      const data = await res.json();
      if (!data.error) {
        setResume(data);
      } else {
        setDbError(true);
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
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        const updatedResume = { ...resume, pdfUrl: data.url };
        setResume(updatedResume);
        
        // Auto-save resume after successful upload
        await fetch("/api/admin/resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedResume),
        });
        alert("Resume uploaded and saved!");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8">Loading Resume settings...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FD853A]/10 rounded-2xl flex items-center justify-center text-[#FD853A]">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1D2939]">Resume Management</h1>
            <p className="text-gray-500">Upload and update your professional CV.</p>
          </div>
        </div>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex gap-3 items-center text-red-700">
          <AlertTriangle size={20} />
          <p className="font-medium">Database connection failed. Please check your configuration.</p>
        </div>
      )}

      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-8 min-h-[400px]">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-[#FD853A] border border-gray-100">
          <FileText size={40} />
        </div>

        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-[#1D2939] mb-2">Current Resume</h2>
          {resume?.pdfUrl ? (
            <div className="flex flex-col items-center gap-4">
              <a 
                href={resume.pdfUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-[#FD853A] font-bold hover:underline"
              >
                View Current PDF <ExternalLink size={16} />
              </a>
              <p className="text-xs text-gray-400 break-all">{resume.pdfUrl}</p>
            </div>
          ) : (
            <p className="text-gray-400 italic">No resume uploaded yet.</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <label className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all cursor-pointer ${uploading ? "bg-gray-100 text-gray-400" : "bg-[#FD853A] text-white hover:bg-[#e67a2e] shadow-lg shadow-orange-500/20"}`}>
            <Upload size={20} />
            {uploading ? "Uploading..." : "Upload New Resume (PDF)"}
            {!uploading && <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} />}
          </label>
          <p className="text-xs text-gray-400">Only PDF files are allowed. Maximum size 5MB.</p>
        </div>
      </div>
    </div>
  );
}
