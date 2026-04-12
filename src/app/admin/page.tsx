import { Activity, Clock, AlertTriangle } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import Service from "@/models/Service";

export default async function AdminDashboard() {
  let projectCount = 0;
  let serviceCount = 0;
  let dbError = false;

  try {
    await dbConnect();
    [projectCount, serviceCount] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
    ]);
  } catch (err) {
    console.error("Dashboard DB fetch failed:", err);
    dbError = true;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#1D2939]">Dashboard</h1>
        {dbError && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium border border-red-100">
            <AlertTriangle size={16} />
            Database Offline
          </div>
        )}
      </div>
      
      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-start">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div className="flex flex-col gap-1">
            <p className="text-amber-800 font-bold text-sm">Action Required: MongoDB Disconnected</p>
            <p className="text-amber-700 text-sm">
              The admin panel could not connect to your MongoDB instance. Please ensure MongoDB is running or check your <code>MONGODB_URI</code> in <code>.env.local</code>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
          <div className="w-12 h-12 bg-[#FD853A]/10 rounded-2xl flex items-center justify-center mb-2">
            <Activity className="text-[#FD853A]" />
          </div>
          <p className="text-gray-500 font-medium">Total Projects</p>
          <h3 className="text-4xl font-bold text-[#1D2939]">{dbError ? "--" : projectCount}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-2">
            <Clock className="text-blue-500" />
          </div>
          <p className="text-gray-500 font-medium">Services</p>
          <h3 className="text-4xl font-bold text-[#1D2939]">{dbError ? "--" : serviceCount}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-4">
        <h2 className="text-xl font-bold text-[#1D2939] mb-4">Welcome to your CMS</h2>
        <p className="text-gray-500 leading-relaxed max-w-3xl">
          From this admin portal, you can manage your portfolio categories, upload new image galleries, and configure global website text and contact information. Use the sidebar to navigate to specific sections.
        </p>
      </div>
    </div>
  );
}
