-- Supabase Database Schema for RITAAN World Cup Prediction Contest
-- Copy and paste this into the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create Profiles Table (extends Supabase auth.users or functions as a standalone profiles/users table)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    batch TEXT NOT NULL, -- e.g., '2018', '2022'
    branch TEXT NOT NULL, -- e.g., 'CSE', 'ECE', 'ME'
    mobile TEXT,
    company TEXT,
    place TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Create Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id SERIAL PRIMARY KEY,
    team_a TEXT NOT NULL,
    team_b TEXT NOT NULL,
    team_a_code TEXT NOT NULL, -- e.g., 'BR', 'DE', 'ZA'
    team_b_code TEXT NOT NULL, -- e.g., 'JP', 'PY', 'CA'
    kickoff_time TIMESTAMP WITH TIME ZONE NOT NULL,
    stage TEXT NOT NULL, -- e.g., 'Group Stage', 'Round of 32', 'Quarter-Finals', 'Semi-Finals', 'Final'
    actual_score_a INTEGER,
    actual_score_b INTEGER,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to matches" 
    ON public.matches FOR SELECT USING (true);

CREATE POLICY "Allow admin to insert matches" 
    ON public.matches FOR INSERT USING (
        -- Simple check: you can restrict this to admin users if you set up admin roles.
        -- For simplicity, we allow authenticated users to view, and database admin bypasses RLS.
        -- In a production environment, you would restrict write access.
        (SELECT auth.jwt() ->> 'email') LIKE '%admin%' OR (SELECT auth.role()) = 'service_role'
    );

CREATE POLICY "Allow admin to update matches" 
    ON public.matches FOR UPDATE USING (true);


-- 3. Create Predictions Table
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_id INTEGER NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    pred_score_a INTEGER NOT NULL,
    pred_score_b INTEGER NOT NULL,
    points_earned INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_match UNIQUE (user_id, match_id)
);

-- Enable RLS for Predictions
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to predictions" 
    ON public.predictions FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own predictions" 
    ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own predictions" 
    ON public.predictions FOR UPDATE USING (auth.uid() = user_id);


-- 4. Create Leaderboard View (Optional but very useful)
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    p.id as user_id,
    p.name,
    p.email,
    p.batch,
    p.branch,
    p.mobile,
    p.company,
    p.place,
    COALESCE(SUM(pr.points_earned), 0) as total_points,
    COUNT(pr.id) as total_predictions,
    COUNT(CASE WHEN pr.points_earned = 3 THEN 1 END) as exact_scores,
    COUNT(CASE WHEN pr.points_earned = 1 THEN 1 END) as correct_outcomes
FROM public.profiles p
LEFT JOIN public.predictions pr ON p.id = pr.user_id
GROUP BY p.id, p.name, p.email, p.batch, p.branch, p.mobile, p.company, p.place
ORDER BY total_points DESC, exact_scores DESC, name ASC;


-- 5. Seed some initial 2026 World Cup Group and Round of 32 Matches
-- Use UTC kickoff times. Note that June 28, 2026 matches are near.
INSERT INTO public.matches (id, team_a, team_b, team_a_code, team_b_code, kickoff_time, stage, actual_score_a, actual_score_b, is_completed) VALUES
(1, 'Panama', 'England', 'pa', 'gb', '2026-06-27 17:00:00+00', 'Group Stage', 0, 3, true),
(2, 'Croatia', 'Ghana', 'hr', 'gh', '2026-06-27 17:00:00+00', 'Group Stage', 1, 1, true),
(3, 'Colombia', 'Portugal', 'co', 'pt', '2026-06-27 19:30:00+00', 'Group Stage', 2, 1, true),
(4, 'DR Congo', 'Uzbekistan', 'cd', 'uz', '2026-06-27 19:30:00+00', 'Group Stage', 0, 2, true),
(5, 'Spain', 'Senegal', 'es', 'sn', '2026-06-26 18:00:00+00', 'Group Stage', 3, 1, true),
(6, 'Italy', 'Mexico', 'it', 'mx', '2026-06-26 20:30:00+00', 'Group Stage', 1, 2, true),
(7, 'Jordan', 'Argentina', 'jo', 'ar', '2026-06-27 22:00:00+00', 'Group Stage', null, null, false),
(8, 'South Africa', 'Canada', 'za', 'ca', '2026-06-28 18:00:00-07', 'Round of 32', null, null, false),
(9, 'Brazil', 'Japan', 'br', 'jp', '2026-06-29 19:00:00-05', 'Round of 32', null, null, false),
(10, 'Germany', 'Paraguay', 'de', 'py', '2026-06-29 17:00:00-04', 'Round of 32', null, null, false),
(11, 'Netherlands', 'Morocco', 'nl', 'ma', '2026-06-30 20:00:00-06', 'Round of 32', null, null, false),
(12, 'Côte d''Ivoire', 'Norway', 'ci', 'no', '2026-06-30 18:00:00+00', 'Round of 32', null, null, false),
(13, 'France', 'Sweden', 'fr', 'se', '2026-06-30 22:00:00+00', 'Round of 32', null, null, false),
(14, 'USA', 'Bosnia & Herz.', 'us', 'ba', '2026-07-02 20:00:00+00', 'Round of 32', null, null, false),
(15, 'Australia', 'Egypt', 'au', 'eg', '2026-07-03 18:00:00+00', 'Round of 32', null, null, false),
(16, 'Argentina', 'Cabo Verde', 'ar', 'cv', '2026-07-03 22:00:00+00', 'Round of 32', null, null, false)
ON CONFLICT (id) DO UPDATE SET
  actual_score_a = EXCLUDED.actual_score_a,
  actual_score_b = EXCLUDED.actual_score_b,
  is_completed = EXCLUDED.is_completed;

