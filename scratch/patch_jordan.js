const url = "https://ktsgdonhtmbllazjsesz.supabase.co/rest/v1/matches?id=eq.7";
const headers = {
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0c2dkb25odG1ibGxhempzZXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjA2NjEsImV4cCI6MjA5ODM5NjY2MX0.k4wVRQfzDw6rJIwYCmWQdYFB0jQRv4DScgMi8XqaySI",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0c2dkb25odG1ibGxhempzZXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjA2NjEsImV4cCI6MjA5ODM5NjY2MX0.k4wVRQfzDw6rJIwYCmWQdYFB0jQRv4DScgMi8XqaySI",
  "Content-Type": "application/json"
};
const body = {
  "actual_score_a": 1,
  "actual_score_b": 3,
  "is_completed": true
};

fetch(url, {
  method: "PATCH",
  headers,
  body: JSON.stringify(body)
})
  .then(res => {
    if (res.ok) {
      console.log("Jordan vs Argentina updated successfully to 1-3 in Supabase!");
    } else {
      res.text().then(t => console.error("Update failed:", res.status, t));
    }
  })
  .catch(err => console.error("Error:", err));
