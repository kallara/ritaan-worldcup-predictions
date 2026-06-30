# RITAAN World Cup Prediction Contest Website - Walkthrough

This document guides you through launching, testing, and deploying the World Cup Football Prediction website created for the **RITAAN Trivandrum Chapter**.

---

## 🚀 How to Run Locally

Follow these quick commands to spin up the website on your local machine:

1. **Install Dependencies** (Already completed in this workspace):
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   You can run this command in your project directory:
   ```bash
   npm run dev
   ```
   *Vite will start a local server (typically at `http://localhost:5173`). Open this URL in your web browser.*

3. **Production Build** (Verifies compiler correctness):
   ```bash
   npm run build
   ```

---

## 🏆 Key Features Added

We've added a full suite of competitive and informational features to drive engagement among the alumni:

### 1. World Cup 2026 Info Center
- **Overview & Stadiums**: Fast-facts overview of the 48-team, 104-match format, alongside a grid of the 16 host stadiums in the USA, Mexico, and Canada (detailing city, capacity, and games scheduled).
- **Group Standings**: An interactive selector for **Groups A to L** showing complete tables (Played, Won, Drawn, Lost, Goals, Goal Difference, and Points) representing the end of the group stage.
- **Knockout Bracket**: A responsive visual diagram of the single-elimination bracket tracking progression from the Round of 32 down to the Final, with hover slide effects and highlight colors.
- **Tournament Stats**: Live Golden Boot standings (goals/assists) featuring leaders like Kylian Mbappé and Erling Haaland, plus clean sheets and playmaker rankings.

### 2. Match-Wise Prediction Winners
- Under every completed match on the site, a banner displays the **Match Predictor Champions** (e.g. *"🎯 Match Predictor Champ: Rahul K. S. (CSE '15), Anupama Nair (ECE '18)"*).
- Exact score correct = **Champ (Exact)** (3 points). Outcome correct = **Winner** (1 point).

### 3. Overall Prediction Winners Podium
- At the top of the **Leaderboard** tab, a visual podium highlights the **Top 3 Overall Leaders** with styled Gold, Silver, and Bronze cards. On mobile viewports, the grid collapsed order pushes the 1st place card to the top automatically.

### 4. Admin 1-Click Auto-Sync
- **Automated Score Updates**: Added an **"Auto-Sync Live Tournament Data"** card at the top of the Admin Panel.
- **Live API Mode**: Connects directly to the global database via [Football-Data.org](https://www.football-data.org/) (using a free API token in `.env` or input field), fetches finished scores, resolves standings, updates the Golden Boot, and recalculates everyone's prediction points instantly.
- **Simulated Mode**: Leaving the API token blank triggers a local simulation. It completes Match 7 (Jordan vs Argentina as 1-3) and Match 8 (South Africa vs Canada as 1-2), makes Messi score again (bringing him to 6 goals), and updates the RITAAN standings instantly.

### 5. Hidden, Password-Protected Admin Access
- **The Secret Entry**: General users cannot see any checkboxes or links to the Admin Panel.
  - To access it, **double-click** the circular **RITAAN Logo** in the top header, OR **double-click** the **Copyright symbol (`©`)** in the footer.
  - This opens a password modal overlay.
- **The Password**: Enter the secret password (defaults to `ritaantvm2026` or defined in `.env` under `VITE_ADMIN_PASSWORD`).
  - Entering the correct password unlocks the **Admin Panel** tab in navigation and automatically routes you directly to it.

### 6. Participant Management (Purge Fake Users)
- Inside the Admin Panel, a new **"Manage Contest Participants"** section lists all registered participants.
- Admin can click **"Remove"** next to any username to permanently purge their account and delete all prediction history from the database, instantly recalculating leaderboard standings.

---

## 🏟️ Understanding the "Hybrid" Architecture

To give you an immediate, hassle-free demonstration, the application features an automatic **Hybrid Data Access Layer**:
- **Local Demo Mode**: Since no Supabase project is connected yet, the app detects the placeholder variables in `.env` and defaults to saving data in your browser's `localStorage`.
  - It pre-populates **3 mock alumni accounts** (Rahul, Anupama, George).
  - It seeds default predictions so mock users have points.
  - **Admin Tools Trigger**: Double-click the header logo or footer copyright symbol to unlock Admin tools.
- **Supabase Cloud Mode**: Once you set up your Supabase credentials in `.env`, the exact same codebase switches to using the Supabase Cloud backend. Predictions and leaderboards will then sync in real-time across all devices of your RITAAN alumni members.

---

## 🛠️ Step-by-Step Supabase Database Setup

When you are ready to share the site with the RITAAN members, follow these steps to connect your cloud database for free:

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and sign up for a free account.
2. Click **New Project** and name it (e.g., `ritaan-worldcup`). Set a database password and select a region close to your users (e.g., Singapore or Mumbai).

### 2. Run the SQL Database Schema
1. Once the project is created, select **SQL Editor** from the left-hand navigation.
2. Click **New Query**.
3. Open the file [supabase_schema.sql](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/supabase_schema.sql) in this project root.
4. Copy the entire contents of `supabase_schema.sql` and paste them into the Supabase SQL editor.
5. Click **Run** (or `Cmd/Ctrl + Enter`).
   - *This will automatically create the `profiles`, `matches`, and `predictions` tables, set up security policies, create the leaderboard standings view, and seed the initial matches.*

### 3. Update Environment Credentials
1. Go to **Project Settings** -> **API** in the Supabase Dashboard.
2. Copy your **Project URL** and the **anon / public** API Key.
3. Open the file [.env](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/.env) in your project root and replace the placeholders:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
   VITE_FOOTBALL_API_KEY=your-api-key
   VITE_ADMIN_PASSWORD=ritaantvm2026
   ```
4. Restart your development server (`npm.cmd run dev`). The status banner will change to **"Connected to Supabase Cloud Database"**.

---

## 🌐 How to Deploy for Free

Since this is a static single-page React app, you can host it completely free on multiple platforms.

### Option A: Vercel / Netlify (Recommended)
1. Install the Vercel CLI or connect your GitHub repository directly to Vercel/Netlify.
2. Set the build command as `npm run build` and output directory as `dist`.
3. Add your production environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_FOOTBALL_API_KEY`, and `VITE_ADMIN_PASSWORD`) in the Vercel/Netlify dashboard under settings.

---

## 📁 Created Files Summary

We created the following files to support your application:
- [supabase_schema.sql](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/supabase_schema.sql) - Database tables, views, security policies, and seed matches.
- [.env](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/.env) - Local config file for database credentials.
- [src/worldcupData.js](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/src/worldcupData.js) - Static data containing stadiums, 12 groups standings, and Golden Boot stats.
- [src/dbService.js](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/src/dbService.js) - The database service handling both Local Storage and Supabase logic.
- [src/index.css](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/src/index.css) - Custom style sheet for responsive layouts, visual brackets, standings table, form inputs, and animations.
- [src/assets/logo.svg](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/src/assets/logo.svg) - The custom vector logo and favicon.
- [src/App.jsx](file:///c:/Users/Acer/Documents/AntiGravity/FWC_Prediction_RITAAN/src/App.jsx) - Main React controller managing navigation, forms, predictions, count-downs, and celebration effects.
