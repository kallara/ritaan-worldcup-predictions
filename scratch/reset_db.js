const url = "https://ktsgdonhtmbllazjsesz.supabase.co/rest/v1/matches";
const headers = {
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0c2dkb25odG1ibGxhempzZXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjA2NjEsImV4cCI6MjA5ODM5NjY2MX0.k4wVRQfzDw6rJIwYCmWQdYFB0jQRv4DScgMi8XqaySI",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0c2dkb25odG1ibGxhempzZXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjA2NjEsImV4cCI6MjA5ODM5NjY2MX0.k4wVRQfzDw6rJIwYCmWQdYFB0jQRv4DScgMi8XqaySI",
  "Content-Type": "application/json",
  "Prefer": "resolution=merge-duplicates"
};

// Clean correct seed data to restore matches table
const matchesToReset = [
  { id: 1, team_a: "Panama", team_b: "England", actual_score_a: 0, actual_score_b: 3, is_completed: true },
  { id: 2, team_a: "Croatia", team_b: "Ghana", actual_score_a: 1, actual_score_b: 1, is_completed: true },
  { id: 3, team_a: "Colombia", team_b: "Portugal", actual_score_a: 2, actual_score_b: 1, is_completed: true },
  { id: 4, team_a: "DR Congo", team_b: "Uzbekistan", actual_score_a: 0, actual_score_b: 2, is_completed: true },
  { id: 5, team_a: "Spain", team_b: "Senegal", actual_score_a: 3, actual_score_b: 1, is_completed: true },
  { id: 6, team_a: "Italy", team_b: "Mexico", actual_score_a: 1, actual_score_b: 2, is_completed: true },
  { id: 7, team_a: "Jordan", team_b: "Argentina", actual_score_a: null, actual_score_b: null, is_completed: false },
  
  { id: 8, team_a: "South Africa", team_b: "Canada", actual_score_a: 0, actual_score_b: 1, is_completed: true },
  { id: 9, team_a: "Brazil", team_b: "Japan", actual_score_a: 2, actual_score_b: 1, is_completed: true },
  { id: 10, team_a: "Germany", team_b: "Paraguay", actual_score_a: 1, actual_score_b: 1, is_completed: true },
  { id: 11, team_a: "Netherlands", team_b: "Morocco", actual_score_a: 1, actual_score_b: 1, is_completed: true },
  { id: 12, team_a: "Côte d'Ivoire", team_b: "Norway", actual_score_a: 0, actual_score_b: 1, is_completed: true },
  
  { id: 13, team_a: "France", team_b: "Sweden", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 14, team_a: "USA", team_b: "Bosnia & Herz.", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 15, team_a: "Australia", team_b: "Egypt", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 16, team_a: "Argentina", team_b: "Cabo Verde", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 17, team_a: "Mexico", team_b: "Ecuador", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 18, team_a: "England", team_b: "DR Congo", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 19, team_a: "Belgium", team_b: "Senegal", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 20, team_a: "Spain", team_b: "Austria", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 21, team_a: "Portugal", team_b: "Croatia", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 22, team_a: "Switzerland", team_b: "Algeria", actual_score_a: null, actual_score_b: null, is_completed: false },
  { id: 23, team_a: "Colombia", team_b: "Ghana", actual_score_a: null, actual_score_b: null, is_completed: false }
];

// Perform bulk upsert/reset to Supabase
fetch(url, {
  method: "POST",
  headers,
  body: JSON.stringify(matchesToReset)
})
  .then(res => {
    if (res.ok) {
      console.log("Database reset successfully! Correct scores and uncompleted states restored.");
    } else {
      res.text().then(t => console.error("Reset failed:", res.status, t));
    }
  })
  .catch(err => console.error("Request error:", err));
