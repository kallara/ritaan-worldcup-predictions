import { createClient } from '@supabase/supabase-js';

// 1. Check if Supabase env variables are valid config or placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('your-anon-public-api-key-here');

// Initialize Supabase if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// 2. Default Seed Matches (2026 World Cup Group and Round of 32)
const DEFAULT_MATCHES = [
  {
    id: 1,
    team_a: 'Panama',
    team_b: 'England',
    team_a_code: 'pa',
    team_b_code: 'gb',
    kickoff_time: '2026-06-27T17:00:00Z',
    stage: 'Group Stage',
    actual_score_a: 0,
    actual_score_b: 3,
    is_completed: true
  },
  {
    id: 2,
    team_a: 'Croatia',
    team_b: 'Ghana',
    team_a_code: 'hr',
    team_b_code: 'gh',
    kickoff_time: '2026-06-27T17:00:00Z',
    stage: 'Group Stage',
    actual_score_a: 1,
    actual_score_b: 1,
    is_completed: true
  },
  {
    id: 3,
    team_a: 'Colombia',
    team_b: 'Portugal',
    team_a_code: 'co',
    team_b_code: 'pt',
    kickoff_time: '2026-06-27T19:30:00Z',
    stage: 'Group Stage',
    actual_score_a: 2,
    actual_score_b: 1,
    is_completed: true
  },
  {
    id: 4,
    team_a: 'DR Congo',
    team_b: 'Uzbekistan',
    team_a_code: 'cd',
    team_b_code: 'uz',
    kickoff_time: '2026-06-27T19:30:00Z',
    stage: 'Group Stage',
    actual_score_a: 0,
    actual_score_b: 2,
    is_completed: true
  },
  {
    id: 5,
    team_a: 'Spain',
    team_b: 'Senegal',
    team_a_code: 'es',
    team_b_code: 'sn',
    kickoff_time: '2026-06-26T18:00:00Z',
    stage: 'Group Stage',
    actual_score_a: 3,
    actual_score_b: 1,
    is_completed: true
  },
  {
    id: 6,
    team_a: 'Italy',
    team_b: 'Mexico',
    team_a_code: 'it',
    team_b_code: 'mx',
    kickoff_time: '2026-06-26T20:30:00Z',
    stage: 'Group Stage',
    actual_score_a: 1,
    actual_score_b: 2,
    is_completed: true
  },
  {
    id: 7,
    team_a: 'Jordan',
    team_b: 'Argentina',
    team_a_code: 'jo',
    team_b_code: 'ar',
    kickoff_time: '2026-06-27T22:00:00Z',
    stage: 'Group Stage',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 8,
    team_a: 'South Africa',
    team_b: 'Canada',
    team_a_code: 'za',
    team_b_code: 'ca',
    kickoff_time: '2026-06-28T18:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 9,
    team_a: 'Brazil',
    team_b: 'Japan',
    team_a_code: 'br',
    team_b_code: 'jp',
    kickoff_time: '2026-06-29T19:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 10,
    team_a: 'Germany',
    team_b: 'Paraguay',
    team_a_code: 'de',
    team_b_code: 'py',
    kickoff_time: '2026-06-29T17:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 11,
    team_a: 'Netherlands',
    team_b: 'Morocco',
    team_a_code: 'nl',
    team_b_code: 'ma',
    kickoff_time: '2026-06-30T20:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 12,
    team_a: 'Côte d\'Ivoire',
    team_b: 'Norway',
    team_a_code: 'ci',
    team_b_code: 'no',
    kickoff_time: '2026-06-30T18:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 13,
    team_a: 'France',
    team_b: 'Sweden',
    team_a_code: 'fr',
    team_b_code: 'se',
    kickoff_time: '2026-06-30T22:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 14,
    team_a: 'USA',
    team_b: 'Bosnia & Herz.',
    team_a_code: 'us',
    team_b_code: 'ba',
    kickoff_time: '2026-07-02T20:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 15,
    team_a: 'Australia',
    team_b: 'Egypt',
    team_a_code: 'au',
    team_b_code: 'eg',
    kickoff_time: '2026-07-03T18:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  },
  {
    id: 16,
    team_a: 'Argentina',
    team_b: 'Cabo Verde',
    team_a_code: 'ar',
    team_b_code: 'cv',
    kickoff_time: '2026-07-03T22:00:00Z',
    stage: 'Round of 32',
    actual_score_a: null,
    actual_score_b: null,
    is_completed: false
  }
];

// Helper to calculate points for a prediction
export function calculatePoints(predA, predB, actualA, actualB) {
  if (actualA === null || actualB === null || actualA === undefined || actualB === undefined) {
    return null;
  }
  // Exact Score Match = 3 Points
  if (parseInt(predA) === parseInt(actualA) && parseInt(predB) === parseInt(actualB)) {
    return 3;
  }
  // Correct Outcome (Win/Draw) but wrong score = 1 Point
  const predOutcome = Math.sign(parseInt(predA) - parseInt(predB));
  const actualOutcome = Math.sign(parseInt(actualA) - parseInt(actualB));
  if (predOutcome === actualOutcome) {
    return 1;
  }
  // Incorrect outcome = 0 Points
  return 0;
}

// 3. Local Database Mocking Logic
class LocalDB {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('ritaan_matches')) {
      localStorage.setItem('ritaan_matches', JSON.stringify(DEFAULT_MATCHES));
    }
    if (!localStorage.getItem('ritaan_users')) {
      // Seed some mock users to make leaderboard look active
      const mockUsers = {
        'rahul@rit.ac.in': { id: 'u1', email: 'rahul@rit.ac.in', name: 'Rahul K. S.', batch: '2015', branch: 'CSE', mobile: '+91 9999999999', company: 'Google India', place: 'Bangalore' },
        'anupama@rit.ac.in': { id: 'u2', email: 'anupama@rit.ac.in', name: 'Anupama Nair', batch: '2018', branch: 'ECE', mobile: '+91 9999999999', company: 'Intel Corporation', place: 'Trivandrum' },
        'george@rit.ac.in': { id: 'u3', email: 'george@rit.ac.in', name: 'George Varghese', batch: '2012', branch: 'ME', mobile: '+91 9999999999', company: 'BMW Group', place: 'Munich' }
      };
      localStorage.setItem('ritaan_users', JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem('ritaan_predictions')) {
      // Seed some predictions for completed matches
      const mockPredictions = [
        // Rahul: Match 1: 0-3 (Exact match -> 3 pts), Match 2: 2-1 (Wrong outcome -> 0 pts), Match 3: 2-1 (Exact match -> 3 pts), Match 4: 1-1 (Wrong outcome -> 0 pts), Match 5: 3-1 (Exact match -> 3 pts), Match 6: 2-2 (Wrong outcome -> 0 pts)
        { id: 'p1', user_id: 'u1', match_id: 1, pred_score_a: 0, pred_score_b: 3, points_earned: 3 },
        { id: 'p2', user_id: 'u1', match_id: 2, pred_score_a: 2, pred_score_b: 1, points_earned: 0 },
        { id: 'p3', user_id: 'u1', match_id: 3, pred_score_a: 2, pred_score_b: 1, points_earned: 3 },
        { id: 'p4', user_id: 'u1', match_id: 4, pred_score_a: 1, pred_score_b: 1, points_earned: 0 },
        { id: 'p21', user_id: 'u1', match_id: 5, pred_score_a: 3, pred_score_b: 1, points_earned: 3 },
        { id: 'p22', user_id: 'u1', match_id: 6, pred_score_a: 2, pred_score_b: 2, points_earned: 0 },

        // Anupama: Match 1: 1-2 (Correct outcome -> 1 pt), Match 2: 1-1 (Exact match -> 3 pts), Match 3: 1-0 (Correct outcome -> 1 pt), Match 4: 0-2 (Exact match -> 3 pts), Match 5: 2-0 (Correct outcome -> 1 pt), Match 6: 1-2 (Exact match -> 3 pts)
        { id: 'p5', user_id: 'u2', match_id: 1, pred_score_a: 1, pred_score_b: 2, points_earned: 1 },
        { id: 'p6', user_id: 'u2', match_id: 2, pred_score_a: 1, pred_score_b: 1, points_earned: 3 },
        { id: 'p7', user_id: 'u2', match_id: 3, pred_score_a: 1, pred_score_b: 0, points_earned: 1 },
        { id: 'p8', user_id: 'u2', match_id: 4, pred_score_a: 0, pred_score_b: 2, points_earned: 3 },
        { id: 'p23', user_id: 'u2', match_id: 5, pred_score_a: 2, pred_score_b: 0, points_earned: 1 },
        { id: 'p24', user_id: 'u2', match_id: 6, pred_score_a: 1, pred_score_b: 2, points_earned: 3 },

        // George: Match 1: 0-2 (Correct outcome -> 1 pt), Match 2: 0-0 (Correct outcome -> 1 pt), Match 3: 1-2 (Wrong outcome -> 0 pts), Match 4: 0-1 (Correct outcome -> 1 pt), Match 5: 3-0 (Correct outcome -> 1 pt), Match 6: 0-2 (Correct outcome -> 1 pt)
        { id: 'p9', user_id: 'u3', match_id: 1, pred_score_a: 0, pred_score_b: 2, points_earned: 1 },
        { id: 'p10', user_id: 'u3', match_id: 2, pred_score_a: 0, pred_score_b: 0, points_earned: 1 },
        { id: 'p11', user_id: 'u3', match_id: 3, pred_score_a: 1, pred_score_b: 2, points_earned: 0 },
        { id: 'p12', user_id: 'u3', match_id: 4, pred_score_a: 0, pred_score_b: 1, points_earned: 1 },
        { id: 'p25', user_id: 'u3', match_id: 5, pred_score_a: 3, pred_score_b: 0, points_earned: 1 },
        { id: 'p26', user_id: 'u3', match_id: 6, pred_score_a: 0, pred_score_b: 2, points_earned: 1 }
      ];
      localStorage.setItem('ritaan_predictions', JSON.stringify(mockPredictions));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('ritaan_users') || '{}');
  }

  getMatches() {
    return JSON.parse(localStorage.getItem('ritaan_matches') || '[]');
  }

  getPredictions() {
    return JSON.parse(localStorage.getItem('ritaan_predictions') || '[]');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('ritaan_current_user') || 'null');
  }

  saveMatches(matches) {
    localStorage.setItem('ritaan_matches', JSON.stringify(matches));
  }

  savePredictions(preds) {
    localStorage.setItem('ritaan_predictions', JSON.stringify(preds));
  }

  saveCurrentUser(user) {
    localStorage.setItem('ritaan_current_user', JSON.stringify(user));
  }

  saveUsers(users) {
    localStorage.setItem('ritaan_users', JSON.stringify(users));
  }
}

const localDB = new LocalDB();

// 4. Unified Data Access Service Interface
export const dbService = {
  isLocalMode() {
    return !isSupabaseConfigured;
  },

  // Auth Operations
  async signUp(email, password, name, batch, branch, mobile, company, place) {
    if (this.isLocalMode()) {
      const users = localDB.getUsers();
      if (users[email]) {
        throw new Error('User with this email already exists.');
      }
      const userId = 'u_' + Math.random().toString(36).substr(2, 9);
      const newUser = { id: userId, email, name, batch, branch, mobile, company, place };
      users[email] = newUser;
      localDB.saveUsers(users);
      localDB.saveCurrentUser(newUser);
      return { data: { user: newUser }, error: null };
    } else {
      // Supabase Signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            batch,
            branch,
            mobile,
            company,
            place
          }
        }
      });
      if (error) return { data: null, error };
      
      if (data.user) {
        // Create user profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: name,
              batch: batch,
              branch: branch,
              mobile: mobile,
              company: company,
              place: place
            }
          ]);
        if (profileError) {
          console.error("Profile creation error: ", profileError);
        }
        
        const userProfile = { id: data.user.id, email, name, batch, branch };
        return { data: { user: userProfile }, error: null };
      }
      return { data, error: new Error('Registration initiated. Please check your email for verification.') };
    }
  },

  async signIn(email, password) {
    if (this.isLocalMode()) {
      const users = localDB.getUsers();
      const user = users[email];
      if (!user) {
        throw new Error('Invalid email or user does not exist.');
      }
      localDB.saveCurrentUser(user);
      return { data: { user }, error: null };
    } else {
      // Supabase Signin
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) return { data: null, error };

      if (data.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          // Fallback to metadata if profile doesn't exist
          const fallbackUser = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email.split('@')[0],
            batch: data.user.user_metadata?.batch || 'N/A',
            branch: data.user.user_metadata?.branch || 'N/A'
          };
          return { data: { user: fallbackUser }, error: null };
        }
        return { data: { user: profile }, error: null };
      }
      return { data: null, error: new Error('User account not found') };
    }
  },

  async signOut() {
    if (this.isLocalMode()) {
      localDB.saveCurrentUser(null);
      return { error: null };
    } else {
      const { error } = await supabase.auth.signOut();
      return { error };
    }
  },

  async getCurrentUser() {
    if (this.isLocalMode()) {
      return localDB.getCurrentUser();
    } else {
      if (!supabase) return null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return profile || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        batch: user.user_metadata?.batch,
        branch: user.user_metadata?.branch
      };
    }
  },

  // Matches Operations
  async getMatches() {
    if (this.isLocalMode()) {
      // Sort matches by kickoff time
      const matches = localDB.getMatches();
      return { 
        data: [...matches].sort((a, b) => new Date(a.kickoff_time) - new Date(b.kickoff_time)), 
        error: null 
      };
    } else {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('kickoff_time', { ascending: true });
      return { data, error };
    }
  },

  async updateMatchScore(matchId, scoreA, scoreB, isCompleted = true) {
    const parseScore = (s) => (s === '' || s === null || s === undefined) ? null : parseInt(s);
    const sA = parseScore(scoreA);
    const sB = parseScore(scoreB);

    if (this.isLocalMode()) {
      const matches = localDB.getMatches();
      const matchIndex = matches.findIndex(m => m.id === parseInt(matchId));
      if (matchIndex === -1) throw new Error('Match not found');

      matches[matchIndex].actual_score_a = sA;
      matches[matchIndex].actual_score_b = sB;
      matches[matchIndex].is_completed = isCompleted;
      localDB.saveMatches(matches);

      // Recompute points for all predictions for this match
      let predictions = localDB.getPredictions();
      predictions = predictions.map(p => {
        if (p.match_id === parseInt(matchId)) {
          return {
            ...p,
            points_earned: calculatePoints(p.pred_score_a, p.pred_score_b, sA, sB)
          };
        }
        return p;
      });
      localDB.savePredictions(predictions);
      return { data: matches[matchIndex], error: null };
    } else {
      // Update match
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .update({
          actual_score_a: sA,
          actual_score_b: sB,
          is_completed: isCompleted
        })
        .eq('id', matchId)
        .select()
        .single();
      if (matchError) return { data: null, error: matchError };

      // Update prediction points for all predictions of this match
      const { data: preds, error: getPredsError } = await supabase
        .from('predictions')
        .select('*')
        .eq('match_id', matchId);

      if (!getPredsError && preds) {
        for (const pred of preds) {
          const points = calculatePoints(pred.pred_score_a, pred.pred_score_b, sA, sB);
          await supabase
            .from('predictions')
            .update({ points_earned: points })
            .eq('id', pred.id);
        }
      }

      return { data: matchData, error: null };
    }
  },

  async addMatch(teamA, teamB, teamACode, teamBCode, kickoffTime, stage) {
    if (this.isLocalMode()) {
      const matches = localDB.getMatches();
      const newId = matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1;
      const newMatch = {
        id: newId,
        team_a: teamA,
        team_b: teamB,
        team_a_code: teamACode.toLowerCase(),
        team_b_code: teamBCode.toLowerCase(),
        kickoff_time: new Date(kickoffTime).toISOString(),
        stage,
        actual_score_a: null,
        actual_score_b: null,
        is_completed: false
      };
      matches.push(newMatch);
      localDB.saveMatches(matches);
      return { data: newMatch, error: null };
    } else {
      const { data, error } = await supabase
        .from('matches')
        .insert([
          {
            team_a: teamA,
            team_b: teamB,
            team_a_code: teamACode.toUpperCase(),
            team_b_code: teamBCode.toUpperCase(),
            kickoff_time: new Date(kickoffTime).toISOString(),
            stage,
            actual_score_a: null,
            actual_score_b: null,
            is_completed: false
          }
        ])
        .select()
        .single();
      return { data, error };
    }
  },

  // Predictions Operations
  async getPredictions(userId) {
    if (this.isLocalMode()) {
      const preds = localDB.getPredictions();
      const userPreds = preds.filter(p => p.user_id === userId);
      return { data: userPreds, error: null };
    } else {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId);
      return { data, error };
    }
  },

  async getAllPredictions() {
    if (this.isLocalMode()) {
      const preds = localDB.getPredictions();
      const users = localDB.getUsers();
      const mappedPreds = preds.map(p => {
        const user = Object.values(users).find(u => u.id === p.user_id);
        return {
          ...p,
          profiles: user ? { name: user.name, batch: user.batch, branch: user.branch } : null
        };
      });
      return { data: mappedPreds, error: null };
    } else {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          user_id,
          match_id,
          pred_score_a,
          pred_score_b,
          points_earned,
          profiles (
            name,
            batch,
            branch
          )
        `);
      return { data, error };
    }
  },

  async submitPrediction(userId, matchId, scoreA, scoreB) {
    const sA = parseInt(scoreA);
    const sB = parseInt(scoreB);
    if (isNaN(sA) || isNaN(sB)) {
      throw new Error('Invalid scores. Please input numbers.');
    }

    // 1. Fetch match to check kickoff time
    const { data: match } = await this.getMatchById(matchId);
    if (!match) throw new Error('Match not found');

    const kickoff = new Date(match.kickoff_time);
    if (new Date() >= kickoff) {
      throw new Error('Prediction locked! This match has already kicked off.');
    }

    if (this.isLocalMode()) {
      const preds = localDB.getPredictions();
      const existingIndex = preds.findIndex(p => p.user_id === userId && p.match_id === parseInt(matchId));
      
      const points = calculatePoints(sA, sB, match.actual_score_a, match.actual_score_b);

      if (existingIndex !== -1) {
        preds[existingIndex].pred_score_a = sA;
        preds[existingIndex].pred_score_b = sB;
        preds[existingIndex].points_earned = points;
        preds[existingIndex].updated_at = new Date().toISOString();
      } else {
        preds.push({
          id: 'p_' + Math.random().toString(36).substr(2, 9),
          user_id: userId,
          match_id: parseInt(matchId),
          pred_score_a: sA,
          pred_score_b: sB,
          points_earned: points,
          updated_at: new Date().toISOString()
        });
      }
      localDB.savePredictions(preds);
      return { error: null };
    } else {
      const points = calculatePoints(sA, sB, match.actual_score_a, match.actual_score_b);
      const { error } = await supabase
        .from('predictions')
        .upsert(
          {
            user_id: userId,
            match_id: parseInt(matchId),
            pred_score_a: sA,
            pred_score_b: sB,
            points_earned: points
          },
          { onConflict: 'user_id,match_id' }
        );
      return { error };
    }
  },

  async getMatchById(matchId) {
    if (this.isLocalMode()) {
      const matches = localDB.getMatches();
      const match = matches.find(m => m.id === parseInt(matchId));
      return { data: match, error: null };
    } else {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();
      return { data, error };
    }
  },

  // Leaderboard Calculation
  async getLeaderboard() {
    if (this.isLocalMode()) {
      const users = Object.values(localDB.getUsers());
      const matches = localDB.getMatches();
      const predictions = localDB.getPredictions();

      const leaderboard = users.map(user => {
        const userPreds = predictions.filter(p => p.user_id === user.id);
        
        let totalPoints = 0;
        let totalPredictions = userPreds.length;
        let exactScores = 0;
        let correctOutcomes = 0;

        userPreds.forEach(pred => {
          const match = matches.find(m => m.id === pred.match_id);
          if (match && match.is_completed) {
            const points = calculatePoints(
              pred.pred_score_a,
              pred.pred_score_b,
              match.actual_score_a,
              match.actual_score_b
            );
            totalPoints += points;
            if (points === 3) exactScores++;
            else if (points === 1) correctOutcomes++;
          }
        });

        return {
          user_id: user.id,
          name: user.name,
          email: user.email,
          batch: user.batch,
          branch: user.branch,
          mobile: user.mobile,
          company: user.company,
          place: user.place,
          total_points: totalPoints,
          total_predictions: totalPredictions,
          exact_scores: exactScores,
          correct_outcomes: correctOutcomes
        };
      });

      // Sort: 1. Total Points desc, 2. Exact Scores desc, 3. Name alphabetical asc
      leaderboard.sort((a, b) => {
        if (b.total_points !== a.total_points) {
          return b.total_points - a.total_points;
        }
        if (b.exact_scores !== a.exact_scores) {
          return b.exact_scores - a.exact_scores;
        }
        return a.name.localeCompare(b.name);
      });

      return { data: leaderboard, error: null };
    } else {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*');
      
      if (error) return { data: null, error };
      
      // Standings might need sorting if the view doesn't enforce it dynamically on client
      const sortedData = [...data].sort((a, b) => {
        if (b.total_points !== a.total_points) {
          return b.total_points - a.total_points;
        }
        if (b.exact_scores !== a.exact_scores) {
          return b.exact_scores - a.exact_scores;
        }
        return a.name.localeCompare(b.name);
      });

      return { data: sortedData, error: null };
    }
  },

  async syncLiveTournamentData(apiKey) {
    const token = apiKey || import.meta.env.VITE_FOOTBALL_API_KEY;
    
    // If no token is provided, run in simulated/demo sync mode
    if (!token || token.includes('your-api-key') || token === '') {
      return this.simulateWcSync();
    }

    try {
      // Bypassing browser CORS using AllOrigins proxy
      const proxyUrl = "https://api.allorigins.win/raw?url=";
      
      const matchesUrl = `${proxyUrl}${encodeURIComponent("https://api.football-data.org/v4/competitions/WC/matches")}`;
      const scorersUrl = `${proxyUrl}${encodeURIComponent("https://api.football-data.org/v4/competitions/WC/scorers")}`;

      const [matchesRes, scorersRes] = await Promise.all([
        fetch(matchesUrl, { headers: { "X-Auth-Token": token } }).then(r => {
          if (!r.ok) throw new Error(`Matches API error: ${r.status}`);
          return r.json();
        }),
        fetch(scorersUrl, { headers: { "X-Auth-Token": token } }).then(r => {
          if (!r.ok) throw new Error(`Scorers API error: ${r.status}`);
          return r.json();
        })
      ]);

      // 1. Process and Sync Matches
      const apiMatches = matchesRes.matches || [];
      const localMatches = this.isLocalMode() ? localDB.getMatches() : [];
      
      const syncedMatches = [];

      for (const apiMatch of apiMatches) {
        // Only map completed matches or matches in progress
        const isCompleted = apiMatch.status === "FINISHED";
        const scoreA = apiMatch.score?.fullTime?.home;
        const scoreB = apiMatch.score?.fullTime?.away;
        
        let dbMatch = null;
        if (this.isLocalMode()) {
          dbMatch = localMatches.find(m => 
            m.team_a.toLowerCase() === apiMatch.homeTeam.name.toLowerCase() ||
            m.team_b.toLowerCase() === apiMatch.awayTeam.name.toLowerCase()
          );
        } else {
          const { data } = await supabase
            .from('matches')
            .select('*')
            .or(`team_a.ilike.%${apiMatch.homeTeam.name}%,team_b.ilike.%${apiMatch.awayTeam.name}%`);
          dbMatch = data && data[0];
        }

        if (dbMatch && isCompleted && scoreA !== null && scoreB !== null) {
          await this.updateMatchScore(dbMatch.id, scoreA, scoreB, true);
          syncedMatches.push({ id: dbMatch.id, teams: `${dbMatch.team_a} vs ${dbMatch.team_b}`, score: `${scoreA}-${scoreB}` });
        }
      }

      // 2. Process and Sync Scorers/Stats
      const apiScorers = scorersRes.scorers || [];
      const updatedScorers = apiScorers.slice(0, 10).map((s, idx) => ({
        rank: idx + 1,
        name: s.player.name,
        team: s.team.name,
        code: s.team.tla ? s.team.tla.toLowerCase().slice(0, 2) : 'un',
        goals: s.goals,
        assists: s.assists || 0,
        matches: s.playedMatches || 3
      }));

      if (updatedScorers.length > 0) {
        localStorage.setItem('ritaan_synced_scorers', JSON.stringify(updatedScorers));
      }

      return { data: { syncedMatches, scorersSynced: updatedScorers.length }, error: null };

    } catch (err) {
      console.error("Auto-sync error", err);
      return { data: null, error: new Error(`Sync failed: ${err.message}. Double-check your API key or connection.`) };
    }
  },

  async simulateWcSync() {
    await new Promise(r => setTimeout(r, 1500));

    const completedMatches = [];

    // Complete Match 7 (Jordan vs Argentina) as Argentina 3 - 1 Jordan
    // Complete Match 8 (South Africa vs Canada) as South Africa 1 - 2 Canada
    if (this.isLocalMode()) {
      const matches = localDB.getMatches();
      const match7Index = matches.findIndex(m => m.id === 7);
      if (match7Index !== -1 && !matches[match7Index].is_completed) {
        await this.updateMatchScore(7, 1, 3, true);
        completedMatches.push("Jordan 1 - 3 Argentina");
      }
      
      const match8Index = matches.findIndex(m => m.id === 8);
      if (match8Index !== -1 && !matches[match8Index].is_completed) {
        await this.updateMatchScore(8, 1, 2, true);
        completedMatches.push("South Africa 1 - 2 Canada");
      }

      // Also simulate Lionel Messi scoring again, bringing him to 6 goals
      const baseScorers = [
        { rank: 1, name: 'Lionel Messi', team: 'Argentina', code: 'ar', goals: 6, assists: 3, matches: 3 },
        { rank: 2, name: 'Kylian Mbappé', team: 'France', code: 'fr', goals: 4, assists: 2, matches: 3 },
        { rank: 3, name: 'Erling Haaland', team: 'Norway', code: 'no', goals: 4, assists: 1, matches: 3 },
        { rank: 4, name: 'Vinícius Júnior', team: 'Brazil', code: 'br', goals: 4, assists: 0, matches: 3 },
        { rank: 5, name: 'Ousmane Dembélé', team: 'France', code: 'fr', goals: 4, assists: 0, matches: 3 },
        { rank: 6, name: 'Jude Bellingham', team: 'England', code: 'gb', goals: 3, assists: 2, matches: 3 },
        { rank: 7, name: 'Harry Kane', team: 'England', code: 'gb', goals: 3, assists: 1, matches: 3 },
        { rank: 8, name: 'Jamal Musiala', team: 'Germany', code: 'de', goals: 3, assists: 1, matches: 3 },
        { rank: 9, name: 'Darwin Núñez', team: 'Uruguay', code: 'uy', goals: 2, assists: 1, matches: 3 },
        { rank: 10, name: 'Alvaro Morata', team: 'Spain', code: 'es', goals: 2, assists: 0, matches: 3 }
      ];
      localStorage.setItem('ritaan_synced_scorers', JSON.stringify(baseScorers));
    } else {
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .in('id', [7, 8]);
        
      if (matches) {
        const m7 = matches.find(m => m.id === 7);
        if (m7 && !m7.is_completed) {
          await this.updateMatchScore(7, 1, 3, true);
          completedMatches.push("Jordan 1 - 3 Argentina");
        }
        const m8 = matches.find(m => m.id === 8);
        if (m8 && !m8.is_completed) {
          await this.updateMatchScore(8, 1, 2, true);
          completedMatches.push("South Africa 1 - 2 Canada");
        }
      }

      const baseScorers = [
        { rank: 1, name: 'Lionel Messi', team: 'Argentina', code: 'ar', goals: 6, assists: 3, matches: 3 },
        { rank: 2, name: 'Kylian Mbappé', team: 'France', code: 'fr', goals: 4, assists: 2, matches: 3 },
        { rank: 3, name: 'Erling Haaland', team: 'Norway', code: 'no', goals: 4, assists: 1, matches: 3 },
        { rank: 4, name: 'Vinícius Júnior', team: 'Brazil', code: 'br', goals: 4, assists: 0, matches: 3 },
        { rank: 5, name: 'Ousmane Dembélé', team: 'France', code: 'fr', goals: 4, assists: 0, matches: 3 },
        { rank: 6, name: 'Jude Bellingham', team: 'England', code: 'gb', goals: 3, assists: 2, matches: 3 },
        { rank: 7, name: 'Harry Kane', team: 'England', code: 'gb', goals: 3, assists: 1, matches: 3 },
        { rank: 8, name: 'Jamal Musiala', team: 'Germany', code: 'de', goals: 3, assists: 1, matches: 3 },
        { rank: 9, name: 'Darwin Núñez', team: 'Uruguay', code: 'uy', goals: 2, assists: 1, matches: 3 },
        { rank: 10, name: 'Alvaro Morata', team: 'Spain', code: 'es', goals: 2, assists: 0, matches: 3 }
      ];
      localStorage.setItem('ritaan_synced_scorers', JSON.stringify(baseScorers));
    }

    return { 
      data: { 
        syncedMatches: completedMatches.map((m, idx) => ({ id: idx + 7, teams: m })), 
        scorersSynced: 1,
        simulated: true 
      }, 
      error: null 
    };
  },

  async deleteUserProfile(userId) {
    if (this.isLocalMode()) {
      const profiles = localDB.getProfiles();
      const predictions = localDB.getPredictions();
      
      const updatedProfiles = profiles.filter(p => p.id !== userId);
      const updatedPredictions = predictions.filter(p => p.user_id !== userId);
      
      localDB.saveProfiles(updatedProfiles);
      localDB.savePredictions(updatedPredictions);
      
      return { error: null };
    } else {
      const { error: predError } = await supabase
        .from('predictions')
        .delete()
        .eq('user_id', userId);
        
      if (predError) return { error: predError };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      return { error: profileError };
    }
  }
};

