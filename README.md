# 🎒 AdVenture — Fullstack App for Discovering Things to Do in Your Free Time

> There are things we know exist, but never truly consider doing ourselves.
> 
> 
> **AdVenture** is a curated collection of activities and experiences — from the well-known to the wonderfully obscure.
> 
> From DNA testing to polishing mud into shiny spheres (a real hobby in Japan), AdVenture helps you discover new ways to spend your free time — organized, accessible, and tailored to your interests.
> 

---

## 📦 Repositories & Demo

- 🔙 **Backend:** [adventure-backend](https://github.com/zjedzonyy/adventure-backend) 
- 🎨 **Frontend:** [adventure-frontend](https://github.com/zjedzonyy/adventure-frontend) ← *you are here*
- 🔗 **Live Demo:** [at-adventure.netlify.app](https://at-adventure.netlify.app/)
  
> ⚠️ Most API endpoints require authentication. Example credentials are available in the demo app.
> 

---
## ✨ Core Features
- **User Authentication** — register, login, session management
- **Activity Discovery** — browse curated ideas and activities
- **Search & Filtering** — find activities by categories, duration, etc.
- **User Interactions** — like, comment, and rate activities
- **Social Features** — follow other users, see their activity
- **Content Management** — users can submit their own activity ideas
- **Pagination** — efficient browsing through large content sets
- **Image Uploads** — attach photos to activities and profiles

---
## 🧠 Project Overview

After completing the backend and API testing, I moved on to the frontend using **React + Vite**. I refined the backend where needed while building UI logic.

- Used **Netlify** for fast static deployment.
- Encountered real-world **race conditions** and **latency issues** in production — led to major refactors.
- Implemented **state handling**, **feedback components**, and **error recovery** logic to make the app feel more reliable and smooth.
---

## ⚛️ Frontend Tech Stack

- **React 19** — modern UI library
- **Vite** — fast frontend build tool
- **Tailwind CSS** — utility-first styling
- **React Router v7** — client-side routing
- **Lucide React** — clean icons
- **Supabase JS** — image uploads to Supabase Storage
- **Quill** — rich text editor for activity descriptions
- **React Hot Toast** — notifications
- **PrimeReact** — reusable components
- **React Loading Indicators** — UX feedback
- **ESLint + Prettier** — code formatting
- **Jest + React Testing Library** — unit/integration tests
---

## 🚀 Deployment Notes

Frontend is deployed via **Netlify**, connected to the main branch with auto-deploy.

> ⚠️ In production, latency exposed async UX issues (e.g., slow feedback, no loading indicators).
> 
> 
> Refactors were made to improve robustness, responsiveness, and state syncing.
>

---

## 📁 Project Structure

```
frontend/
├── config/              # External service configs (e.g. Supabase)
├── public/              # Static assets
├── src/
│   ├── assets/          # Images & logos
│   ├── components/
│   │   ├── auth/        # Login, register, session logic
│   │   ├── common/      # Shared reusable components
│   │   ├── errors/      # 404, error boundaries
│   │   ├── ideas/       # Activity cards, CRUD UI
│   │   ├── layout/      # Navbar, footer, containers
│   │   ├── pages/       # Route-level views
│   │   ├── profile/     # User profile logic & UI
│   │   ├── socials/     # Follow, like, social feed
│   │   └── ui/          # Buttons, inputs, loaders, modals
│   ├── utils/           # API calls, helpers, filter logic
│   ├── index.css        # Tailwind entry
│   └── main.jsx         # App entry point
├── tailwind.config.js   # Tailwind setup
├── vite.config.js       # Vite config
└── eslint.config.mjs    # ESLint setup
```
---

## 📬 Contact

Made by [@zjedzonyy](https://github.com/zjedzonyy)

