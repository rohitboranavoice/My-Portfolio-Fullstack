"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface DataContextType {
  settings: any;
  services: any[];
  projects: any[];
  testimonials: any[];
  portfolioCategories: any[];
  blogs: any[];
  resumeUrl: string;
  videos: any[];
  loading: boolean;
  mutate: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  settings: null,
  services: [],
  projects: [],
  testimonials: [],
  portfolioCategories: [],
  blogs: [],
  resumeUrl: "",
  videos: [],
  loading: true,
  mutate: async () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [portfolioCategories, setPortfolioCategories] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const safeFetch = React.useCallback(async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Failed to fetch ${url}:`, err);
      return { error: true };
    }
  }, []);

  const fetchData = React.useCallback(async () => {
    try {
      const [settingsRes, servicesRes, projectsRes, testimonialsRes, catRes, resumeRes, blogsRes, videosRes] = await Promise.all([
        safeFetch("/api/admin/settings"),
        safeFetch("/api/admin/services"),
        safeFetch("/api/admin/projects"),
        safeFetch("/api/admin/testimonials"),
        safeFetch("/api/admin/portfolio-categories"),
        safeFetch("/api/admin/resume"),
        safeFetch("/api/admin/blogs"),
        safeFetch("/api/admin/videos"),
      ]);

      setSettings(!settingsRes.error ? settingsRes : null);
      setServices(Array.isArray(servicesRes) ? servicesRes : []);
      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      setTestimonials(Array.isArray(testimonialsRes) ? testimonialsRes : []);
      setPortfolioCategories(Array.isArray(catRes) ? catRes : []);
      setBlogs(Array.isArray(blogsRes) ? blogsRes : []);
      setVideos(Array.isArray(videosRes) ? videosRes : []);
      setResumeUrl(resumeRes?.url || resumeRes?.pdfUrl || "");
    } catch (err) {
      console.error("Critical failure in CMS data loading", err);
    } finally {
      setLoading(false);
    }
  }, [safeFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ 
      settings, 
      services, 
      projects, 
      testimonials, 
      portfolioCategories, 
      blogs, 
      resumeUrl, 
      videos,
      loading,
      mutate: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
