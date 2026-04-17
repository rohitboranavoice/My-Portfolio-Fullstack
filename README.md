# Rohit Borana - Premium Photography & Videography Portfolio

Welcome to the official source code for **Rohit Borana's Portfolio Website**! This is a modern, ultra-fast, Full-Stack web application built to showcase high-end photography and videography services.

## 🚀 Features
- **Cinematic Frontend UI**: A stunning, modern interface custom-designed to wow visitors.
- **Dynamic Content Management System (CMS)**: An entire private backend Admin Panel where you can control the website content without touching a single line of code!
- **100% Mobile Responsive**: Perfectly optimized for iPhones, Androids, and tablets with sliding sidebars and gesture-friendly layouts.
- **Glassmorphic Design**: Next-gen aesthetics featuring smooth gradients, glowing auras, and modern shadow effects.
- **Interactive Multimedia**: High-performance video background strips and categorized portfolio grids.
- **Built-in Contact & WhatsApp Modules**: Seamless integration for client inquiries.

---

## 💻 Tech Stack
- **Framework**: `Next.js 14` (App Router)
- **Frontend**: `React 18`, `Tailwind CSS`, `Framer Motion` (for silky smooth animations)
- **Backend/Database**: `MongoDB` with `Mongoose`
- **Icons & Graphics**: `Lucide React`

---

## 🛠️ How to Start the Website
There are two ways to start the website locally on your computer:

### Option 1 (The Easy Way)
Simply **double-click** the `start.bat` file located in this folder! It will automatically start the server and open the website in your browser.

### Option 2 (For Developers)
1. Open your terminal in this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Panel Access
You can manage all your website content (Hero Video, Services, Portfolio Photos, Contact details, etc.) through the Admin Dashboard.

- **Admin URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- *(Note: Ensure your MongoDB variables are correctly setup in the `.env.local` file for the dashboard to save your updates).*

---

### Important Notes for Deployment (Vercel/External Hosts)
If you are deploying this website to a live internet server (like Vercel), remember to securely add your `MONGODB_URI` to your host's Environment Variables panel.

---
*Created with ❤️ by Antigravity (Google DeepMind Agentic Assistant)*
