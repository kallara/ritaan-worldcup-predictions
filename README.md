# 🏆 RITAAN FIFA World Cup 2026 Prediction Contest

A premium, mobile-responsive web application custom-built for the **RIT Kottayam Alumni Network (RITAAN) Trivandrum Chapter**. The application provides an interactive platform for alumni members to predict match outcomes and compete on a live leaderboards leaderboard.

Live Url: [https://lovely-sherbet-c23468.netlify.app/](https://lovely-sherbet-c23468.netlify.app/)

---

## ⚡ Key Features

- **⚽ Immersive Football Aesthetics**: Features mowed-lawn vertical turf stripe backgrounds, glowing radial spotlights, and goalpost net meshes for score inputs.
- **📋 Profile & Registration**: Customized fields for alumni registration, including Batch, Branch (includes MCA), Contact Number, current Company/Organization, and current Location.
- **🎯 Prediction Center**: 
  - Segmented tab design separating **Active / Upcoming** matches from **Completed Results**.
  - Automatic prediction lock exactly at match kickoff time.
  - Point system: **+3 points** for exact scores, **+1 point** for correct outcome (win/draw/loss).
- **🥇 Interactive Leaderboard**: Displays real-time standings with visual gold, silver, and bronze podium cards for the top three ranks.
- **🔑 Password-Protected Admin Dashboard**: 
  - Access via a hidden gear icon in the footer (default password: `ritaantvm2026`).
  - Delete fake/banned users.
  - Update actual match scores to instantly recalculate leaderboard points.
  - Add custom knockout stage matches.
- **📊 CSV Export**: Single-click export of complete player statistics (Rank, Name, Batch, Branch, Mobile, Company, Place, Points) directly into Excel-friendly CSV format.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Vanilla CSS, Lucide React (Icons), Canvas Confetti (celebrations).
- **Backend / Database**: Supabase (PostgreSQL) with custom Row-Level Security (RLS) policies.
- **Deployment**: Netlify / Vercel.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-api-key-here
VITE_ADMIN_PASSWORD=your-admin-password-here
```

---

## 💾 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kallara/ritaan-worldcup-predictions.git
   cd ritaan-worldcup-predictions
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🗄️ Database Setup

Create the following tables in your Supabase SQL Editor using the [supabase_schema.sql](supabase_schema.sql) file:
1. `profiles`: Stores alumni member information.
2. `matches`: Stores the list of matches, kickoff times, stages, and actual scores.
3. `predictions`: Connects profiles to matches with predicted scores and points earned.
4. `leaderboard` (View): Aggregates user prediction scores and ranks in descending order.

---

## 🎨 Credits & Contact

Designed & Developed with ❤️ by **Kallara**.
- **Email**: [sujithbkallara@gmail.com](mailto:sujithbkallara@gmail.com)
- **WhatsApp**: [+91 99958 56425](https://wa.me/919995856425)
