import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  ListOrdered, 
  FileText, 
  Settings, 
  LogOut, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Database, 
  Lock, 
  PlusCircle, 
  Check, 
  RefreshCw,
  Info,
  MapPin,
  Flame,
  Activity,
  Users,
  Download,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbService, calculatePoints } from './dbService';
import { STADIUMS, PLAYER_STATS, GROUPS_DATA } from './worldcupData';
import ritaanLogo from './assets/ritaan_logo.jpg';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [allPredictions, setAllPredictions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [place, setPlace] = useState('');

  // Prediction input buffer
  const [predBuffer, setPredBuffer] = useState({});

  // World Cup Info state
  const [wcSubTab, setWcSubTab] = useState('overview');
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [syncApiKey, setSyncApiKey] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Admin add match state
  const [isAdminModeUnlocked, setIsAdminModeUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Predictions Sub-tab filter state
  const [predSubTab, setPredSubTab] = useState('upcoming');
  const [adminTeamA, setAdminTeamA] = useState('');
  const [adminTeamB, setAdminTeamB] = useState('');
  const [adminTeamACode, setAdminTeamACode] = useState('');
  const [adminTeamBCode, setAdminTeamBCode] = useState('');
  const [adminKickoff, setAdminKickoff] = useState('');
  const [adminStage, setAdminStage] = useState('Round of 32');

  // Admin update score state
  const [adminScores, setAdminScores] = useState({});

  // Flag URL getter
  const getFlagUrl = (code) => {
    if (!code) return '';
    return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
  };

  // Match Predictor Winners getter
  const getMatchWinners = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match || !match.is_completed) return null;

    const matchPreds = allPredictions.filter(p => p.match_id === matchId);
    if (matchPreds.length === 0) return null;

    // Find max points earned
    const maxPoints = Math.max(...matchPreds.map(p => p.points_earned || 0));
    if (maxPoints <= 0) return null; // No one predicted outcome correctly

    const winners = matchPreds.filter(p => p.points_earned === maxPoints && p.profiles);
    if (winners.length === 0) return null;

    return {
      points: maxPoints,
      users: winners.map(w => `${w.profiles.name} (${w.profiles.branch} '${w.profiles.batch.slice(-2)})`)
    };
  };

  // Check current session on mount
  useEffect(() => {
    checkUserSession();
  }, []);

  // Fetch match and leaderboard data when user changes or tab changes, with background polling
  useEffect(() => {
    if (user) {
      fetchData();
      
      // Auto-refresh match data & standings every 30 seconds
      const pollInterval = setInterval(() => {
        fetchData();
      }, 30000);
      
      return () => clearInterval(pollInterval);
    }
  }, [user, activeTab]);

  const checkUserSession = async () => {
    try {
      const currentUser = await dbService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (err) {
      console.error("Session fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [matchesRes, predsRes, leaderboardRes, allPredsRes] = await Promise.all([
        dbService.getMatches(),
        user ? dbService.getPredictions(user.id) : { data: [] },
        dbService.getLeaderboard(),
        dbService.getAllPredictions()
      ]);

      if (matchesRes.error) throw matchesRes.error;
      if (predsRes.error) throw predsRes.error;
      if (leaderboardRes.error) throw leaderboardRes.error;
      if (allPredsRes.error) throw allPredsRes.error;

      setMatches(matchesRes.data || []);
      setPredictions(predsRes.data || []);
      setLeaderboard(leaderboardRes.data || []);
      setAllPredictions(allPredsRes.data || []);

      // Populate input buffer with existing predictions
      const buffer = {};
      predsRes.data?.forEach(p => {
        buffer[p.match_id] = {
          scoreA: p.pred_score_a,
          scoreB: p.pred_score_b
        };
      });
      setPredBuffer(buffer);

      // Populate admin scores input buffer
      const scores = {};
      matchesRes.data?.forEach(m => {
        scores[m.id] = {
          scoreA: m.actual_score_a !== null ? m.actual_score_a : '',
          scoreB: m.actual_score_b !== null ? m.actual_score_b : ''
        };
      });
      setAdminScores(scores);

    } catch (err) {
      setError(err.message || 'Failed to fetch match database');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (authMode === 'login') {
        const { data, error: err } = await dbService.signIn(email, password);
        if (err) throw err;
        setUser(data.user);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        if (!name || !batch || !branch || !mobile || !company || !place) {
          throw new Error('Please fill in all profile fields');
        }
        const { data, error: err } = await dbService.signUp(email, password, name, batch, branch, mobile, company, place);
        if (err) throw err;
        setUser(data.user);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await dbService.signOut();
      setUser(null);
      setActiveTab('dashboard');
      // Clear forms
      setEmail('');
      setPassword('');
      setName('');
      setBatch('');
      setMobile('');
      setCompany('');
      setPlace('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictionSubmit = async (matchId) => {
    setError(null);
    setSuccessMessage(null);
    const scoreA = predBuffer[matchId]?.scoreA;
    const scoreB = predBuffer[matchId]?.scoreB;

    if (scoreA === undefined || scoreB === undefined || scoreA === '' || scoreB === '') {
      setError('Please enter scores for both teams.');
      return;
    }

    try {
      const { error: submitErr } = await dbService.submitPrediction(user.id, matchId, scoreA, scoreB);
      if (submitErr) throw submitErr;
      
      setSuccessMessage('Prediction submitted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Update local predictions state
      fetchData();
      confetti({ particleCount: 30, spread: 40, colors: ['#10b981', '#06b6d4'] });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleScoreChange = (matchId, team, val) => {
    // Sanitise to digits
    const cleanVal = val.replace(/\D/g, '');
    setPredBuffer(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: cleanVal
      }
    }));
  };

  // Admin Handlers
  const handleAdminScoreChange = (matchId, team, val) => {
    const cleanVal = val.replace(/\D/g, '');
    setAdminScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: cleanVal
      }
    }));
  };

  const handleAdminSaveScore = async (matchId) => {
    setError(null);
    setSuccessMessage(null);
    const scoreA = adminScores[matchId]?.scoreA;
    const scoreB = adminScores[matchId]?.scoreB;

    try {
      const { error: err } = await dbService.updateMatchScore(matchId, scoreA, scoreB, true);
      if (err) throw err;
      
      setSuccessMessage(`Match ${matchId} score updated and points re-calculated!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchData();
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAutoSyncTournament = async () => {
    setSyncing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await dbService.syncLiveTournamentData(syncApiKey);
      if (res.error) throw res.error;

      if (res.data.simulated) {
        setSuccessMessage('Demo Sync Complete! Jordan vs Argentina (1-3) & South Africa vs Canada (1-2) completed. Standings and scores recalculated.');
      } else {
        setSuccessMessage(`Sync Complete! ${res.data.syncedMatches.length} matches and scorers synced with live API.`);
      }
      
      setTimeout(() => setSuccessMessage(null), 5000);
      confetti({ particleCount: 80, spread: 60 });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleVerifyAdminPassword = () => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'ritaantvm2026';
    if (adminPasswordInput === correctPassword) {
      setIsAdminModeUnlocked(true);
      setShowPasswordModal(false);
      setAdminPasswordInput('');
      setError(null);
      setActiveTab('admin');
      confetti({ particleCount: 60, spread: 50 });
    } else {
      setError('Invalid admin credentials. Access denied.');
    }
  };

  const handleRemoveParticipant = async (userId, participantName) => {
    if (userId === user.id) {
      alert("You cannot remove your own admin account!");
      return;
    }
    
    if (window.confirm(`Are you absolutely sure you want to remove ${participantName} from the prediction contest? This action is permanent and deletes all their prediction records.`)) {
      setError(null);
      setSuccessMessage(null);
      try {
        const res = await dbService.deleteUserProfile(userId);
        if (res.error) throw res.error;
        
        setSuccessMessage(`Participant ${participantName} was successfully removed.`);
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Rank',
      'Name',
      'Email',
      'Branch',
      'Batch',
      'Mobile Number',
      'Company',
      'Place',
      'Predictions Made',
      'Exact Scores (3 pts)',
      'Correct Outcomes (1 pt)',
      'Total Points'
    ];

    const rows = leaderboard.map((row, index) => [
      index + 1,
      `"${(row.name || '').replace(/"/g, '""')}"`,
      `"${(row.email || '').replace(/"/g, '""')}"`,
      `"${(row.branch || '').replace(/"/g, '""')}"`,
      `"${(row.batch || '').replace(/"/g, '""')}"`,
      `"${(row.mobile || '').replace(/"/g, '""')}"`,
      `"${(row.company || '').replace(/"/g, '""')}"`,
      `"${(row.place || '').replace(/"/g, '""')}"`,
      row.total_predictions,
      row.exact_scores,
      row.correct_outcomes,
      row.total_points
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ritaan_contest_participants_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminAddMatch = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!adminTeamA || !adminTeamB || !adminTeamACode || !adminTeamBCode || !adminKickoff) {
      setError('Please fill in all match fields');
      return;
    }

    try {
      const { error: err } = await dbService.addMatch(
        adminTeamA,
        adminTeamB,
        adminTeamACode,
        adminTeamBCode,
        adminKickoff,
        adminStage
      );
      if (err) throw err;

      setSuccessMessage('New match added successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reset inputs
      setAdminTeamA('');
      setAdminTeamB('');
      setAdminTeamACode('');
      setAdminTeamBCode('');
      setAdminKickoff('');
      
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getMatchTimeRemaining = (kickoffTime) => {
    const diff = new Date(kickoffTime) - new Date();
    if (diff <= 0) return 'LOCKED';
    
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hrs >= 24) {
      const days = Math.floor(hrs / 24);
      return `Starts in ${days}d ${hrs % 24}h`;
    }
    return `Locks in ${hrs}h ${mins}m`;
  };

  const formatMatchDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return '';
    }
  };

  // Check if admin tab is visible: unlocked secretly by admin password
  const showAdminTab = isAdminModeUnlocked;

  if (loading && !user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans' }}>Loading Prediction Arena...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 1. Header */}
      <header className="header">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img src={ritaanLogo} alt="RITAAN Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--secondary)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="logo-text">RITAAN TRIVANDRUM</span>
              <span className="logo-tagline" style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.6rem' }}>Alumni Only</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>FIFA World Cup 2026 Prediction Contest</span>
          </div>
        </div>

        {user && (
          <div className="user-widget">
            <div className="user-avatar">{user.name ? user.name[0] : 'U'}</div>
            <div className="user-details" style={{ display: 'none', md: 'flex' }}>
              <span className="user-name">{user.name}</span>
              <span className="user-meta">{user.branch} {user.batch} | Rank: #{leaderboard.findIndex(l => l.user_id === user.id) + 1 || '-'}</span>
            </div>
            <button className="nav-button btn-secondary" onClick={handleSignOut} style={{ padding: '0.4rem 0.8rem', height: 'fit-content' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Space spacer after header */}
      <div style={{ height: '1rem' }}></div>

      {/* Status Alerts */}
      {error && (
        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} style={{ color: '#ef4444' }} />
          <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{successMessage}</p>
        </div>
      )}

      {/* 3. Authentication Forms (if not logged in) */}
      {!user ? (
        <div className="auth-container">
          <div className="glass-card auth-card highlighted">
            <div className="auth-header">
              <img src={ritaanLogo} alt="RITAAN Logo" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem auto', display: 'block', border: '3px solid var(--secondary)', boxShadow: '0 0 20px rgba(0, 176, 255, 0.2)' }} />
              <h2>{authMode === 'login' ? 'Predict the Arena' : 'Join RITAAN Contest'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {authMode === 'login' 
                  ? 'Access your predictions and the RITAAN standings.' 
                  : 'Register as an alumnus to make your predictions.'
                }
              </p>
            </div>

            <form onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Rahul" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Graduation Batch (Year)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. 2018" 
                        value={batch} 
                        onChange={e => setBatch(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Branch / Department</label>
                      <select 
                        className="form-input" 
                        value={branch} 
                        onChange={e => setBranch(e.target.value)}
                        required
                      >
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="ME">ME</option>
                        <option value="CE">CE</option>
                        <option value="MCA">MCA</option>
                        <option value="PG/Other">PG/Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="e.g. +91 9999999999" 
                      value={mobile} 
                      onChange={e => setMobile(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Current Company / Organization</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. TCS / Self-Employed" 
                        value={company} 
                        onChange={e => setCompany(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Current Place (City / Location)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Trivandrum" 
                        value={place} 
                        onChange={e => setPlace(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. rahul@rit.ac.in" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Password (min. 6 characters)</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn" style={{ marginTop: '1.5rem' }}>
                {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                {authMode === 'login' ? 'Enter Prediction Arena' : 'Register for Contest'}
              </button>
            </form>

            <p className="auth-toggle-text">
              {authMode === 'login' ? "New to the contest? " : "Already registered? "}
              <span className="auth-toggle-link" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                {authMode === 'login' ? 'Create an account' : 'Sign in here'}
              </span>
            </p>
          </div>
        </div>
      ) : (
        /* 4. Logged In Panel Navigation and Dashboard */
        <>
          <nav className="nav-links" style={{ marginBottom: '1.5rem', width: 'fit-content', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            <button className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <Calendar size={16} /> Dashboard
            </button>
            <button className={`nav-button ${activeTab === 'predictions' ? 'active' : ''}`} onClick={() => setActiveTab('predictions')}>
              <Trophy size={16} /> Make Predictions
            </button>
            <button className={`nav-button ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
              <ListOrdered size={16} /> Leaderboard
            </button>
            <button className={`nav-button ${activeTab === 'worldcup' ? 'active' : ''}`} onClick={() => setActiveTab('worldcup')}>
              <Info size={16} /> World Cup Info
            </button>
            <button className={`nav-button ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
              <FileText size={16} /> Rules
            </button>
            {showAdminTab && (
              <button className={`nav-button ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
                <Settings size={16} /> Admin Panel
              </button>
            )}
          </nav>

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              {/* Main dashboard stats and next match */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card highlighted">
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back, {user.name}!</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Prediction Contest is in full swing. Check the upcoming knockout matches and submit your score before they lock!
                  </p>
                  
                  {/* Quick User Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Points</span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {leaderboard.find(l => l.user_id === user.id)?.total_points || 0}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rank</span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>
                        #{leaderboard.findIndex(l => l.user_id === user.id) + 1 || '-'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Predictions</span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>
                        {predictions.length} / {matches.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nearest Match focus */}
                <div>
                  <h3 style={{ marginBottom: '1rem', fontFamily: 'Plus Jakarta Sans' }}>Next Highlight Match</h3>
                  {matches.filter(m => !m.is_completed).slice(0, 1).map(match => {
                    const hasPredicted = predictions.some(p => p.match_id === match.id);
                    const isLocked = new Date() >= new Date(match.kickoff_time);
                    return (
                      <div className="glass-card match-card pitch-theme" key={match.id} style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <div className="team-container">
                          <img className="team-flag" src={getFlagUrl(match.team_a_code)} alt={match.team_a} />
                          <span className="team-name">{match.team_a}</span>
                        </div>

                        <div className="match-center-details">
                          <span className="match-meta-badge">{match.stage}</span>
                          <span className="match-countdown">{getMatchTimeRemaining(match.kickoff_time)}</span>
                          
                          {isLocked ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                              <Lock size={12} /> Closed
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                              <div className="match-prediction-row">
                                <input 
                                  type="text" 
                                  className="score-input"
                                  maxLength="2" 
                                  value={predBuffer[match.id]?.scoreA ?? ''} 
                                  onChange={e => handleScoreChange(match.id, 'scoreA', e.target.value)}
                                  placeholder="-" 
                                />
                                <span className="score-divider">:</span>
                                <input 
                                  type="text" 
                                  className="score-input" 
                                  maxLength="2"
                                  value={predBuffer[match.id]?.scoreB ?? ''} 
                                  onChange={e => handleScoreChange(match.id, 'scoreB', e.target.value)}
                                  placeholder="-" 
                                />
                              </div>
                              <button 
                                className="btn" 
                                onClick={() => handlePredictionSubmit(match.id)}
                                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}
                              >
                                {hasPredicted ? 'Update Prediction' : 'Save Prediction'}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="team-container">
                          <img className="team-flag" src={getFlagUrl(match.team_b_code)} alt={match.team_b} />
                          <span className="team-name">{match.team_b}</span>
                        </div>
                      </div>
                    );
                  })}
                  {matches.filter(m => !m.is_completed).length === 0 && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      All matches have completed! Ranks are settled. Check the Leaderboard to see the champions.
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Quick Leaderboard */}
              <div>
                <div className="glass-card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.15rem' }}>Top Standing</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveTab('leaderboard')}>View All</span>
                  </div>

                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Member</th>
                        <th style={{ textAlign: 'right' }}>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.slice(0, 5).map((row, idx) => (
                        <tr className={`leaderboard-row ${row.user_id === user.id ? 'current-user' : ''}`} key={row.user_id}>
                          <td className="rank-cell">
                            <span className={`rank-badge rank-${idx + 1}`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td>
                            <div className="profile-cell">
                              <span className="profile-name" style={{ fontSize: '0.85rem' }}>{row.name}</span>
                              <span className="profile-sub">{row.branch} {row.batch}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }} className="points-badge">
                            {row.total_points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div>
              <div className="match-section-header">
                <h2 style={{ fontFamily: 'Plus Jakarta Sans' }}>Match Prediction Center</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kickoff times are locked automatically</span>
              </div>

              {/* Predictions Sub-tabs */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setPredSubTab('upcoming')}
                  style={{ 
                    padding: '0.45rem 1.15rem', 
                    fontSize: '0.85rem',
                    background: predSubTab === 'upcoming' ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                    color: predSubTab === 'upcoming' ? '#030a06' : 'var(--text-muted)',
                    fontWeight: predSubTab === 'upcoming' ? 700 : 500,
                    borderRadius: '8px',
                    border: '1px solid ' + (predSubTab === 'upcoming' ? 'var(--primary)' : 'rgba(255,255,255,0.06)'),
                    cursor: 'pointer',
                    boxShadow: predSubTab === 'upcoming' ? '0 0 15px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s ease',
                    width: 'auto'
                  }}
                >
                  Active / Upcoming ({matches.filter(m => !m.is_completed).length})
                </button>
                <button 
                  onClick={() => setPredSubTab('completed')}
                  style={{ 
                    padding: '0.45rem 1.15rem', 
                    fontSize: '0.85rem',
                    background: predSubTab === 'completed' ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                    color: predSubTab === 'completed' ? '#030a06' : 'var(--text-muted)',
                    fontWeight: predSubTab === 'completed' ? 700 : 500,
                    borderRadius: '8px',
                    border: '1px solid ' + (predSubTab === 'completed' ? 'var(--primary)' : 'rgba(255,255,255,0.06)'),
                    cursor: 'pointer',
                    boxShadow: predSubTab === 'completed' ? '0 0 15px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s ease',
                    width: 'auto'
                  }}
                >
                  Completed Results ({matches.filter(m => m.is_completed).length})
                </button>
              </div>

              <div className="match-list">
                {(() => {
                  const filtered = matches.filter(m => predSubTab === 'upcoming' ? !m.is_completed : m.is_completed);
                  if (filtered.length === 0) {
                    return (
                      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', gridColumn: 'span 2' }}>
                        {predSubTab === 'upcoming' 
                          ? 'All matches have completed! Ranks are settled.' 
                          : 'No completed matches found yet.'
                        }
                      </div>
                    );
                  }
                  return filtered.map(match => {
                    const prediction = predictions.find(p => p.match_id === match.id);
                    const isLocked = new Date() >= new Date(match.kickoff_time);
                    
                    return (
                      <div className={`glass-card match-card pitch-theme ${isLocked ? '' : 'highlighted'}`} key={match.id}>
                      {/* Team A */}
                      <div className="team-container">
                        <img className="team-flag" src={getFlagUrl(match.team_a_code)} alt={match.team_a} />
                        <span className="team-name">{match.team_a}</span>
                      </div>

                      {/* Match Info & Inputs */}
                      <div className="match-center-details">
                        <span className="match-meta-badge">{match.stage}</span>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontWeight: 500 }} className="match-datetime">
                          {formatMatchDateTime(match.kickoff_time)}
                        </div>
                        
                        {match.is_completed ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                            <div className="match-vs-score">
                              {match.actual_score_a} - {match.actual_score_b}
                            </div>
                            {prediction ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  You predicted: {prediction.pred_score_a} - {prediction.pred_score_b}
                                </span>
                                <span className={`points-earned-pill ${prediction.points_earned > 0 ? 'points-positive' : 'points-zero'}`}>
                                  {prediction.points_earned > 0 ? `+${prediction.points_earned} Points` : '0 Points'}
                                </span>
                              </div>
                            ) : (
                              <span className="points-earned-pill points-zero" style={{ fontSize: '0.7rem' }}>No prediction submitted</span>
                            )}
                            
                            {/* Match Winners */}
                            {(() => {
                              const matchWinners = getMatchWinners(match.id);
                              if (!matchWinners) return null;
                              return (
                                <div style={{ marginTop: '0.6rem', padding: '0.3rem 0.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '6px', fontSize: '0.7rem', width: '100%', maxWidth: '220px', textAlign: 'center' }}>
                                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>🎯 Match Predictor {matchWinners.points === 3 ? 'Champ (Exact)' : 'Winner'}:</span>
                                  <div style={{ color: 'var(--text-main)', marginTop: '0.05rem', fontWeight: 500 }}>
                                    {matchWinners.users.join(', ')}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          // Uncompleted match
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                            <span className="match-countdown">{getMatchTimeRemaining(match.kickoff_time)}</span>
                            
                            <div className="match-prediction-row">
                              <input 
                                type="text" 
                                className="score-input"
                                maxLength="2" 
                                value={predBuffer[match.id]?.scoreA ?? ''} 
                                onChange={e => handleScoreChange(match.id, 'scoreA', e.target.value)}
                                disabled={isLocked}
                                placeholder="-" 
                              />
                              <span className="score-divider">:</span>
                              <input 
                                type="text" 
                                className="score-input" 
                                maxLength="2"
                                value={predBuffer[match.id]?.scoreB ?? ''} 
                                onChange={e => handleScoreChange(match.id, 'scoreB', e.target.value)}
                                disabled={isLocked}
                                placeholder="-" 
                              />
                            </div>

                            {!isLocked && (
                              <button 
                                className="btn" 
                                onClick={() => handlePredictionSubmit(match.id)}
                                style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', borderRadius: '6px' }}
                              >
                                {prediction ? 'Update Prediction' : 'Submit Prediction'}
                              </button>
                            )}

                            {isLocked && prediction && (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Lock size={10} /> Lock prediction: {prediction.pred_score_a} - {prediction.pred_score_b}
                                </span>
                                <span className="points-earned-pill points-pending">Match Pending</span>
                              </div>
                            )}

                            {isLocked && !prediction && (
                              <span className="points-earned-pill points-zero">Locked (No prediction)</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Team B */}
                      <div className="team-container">
                        <img className="team-flag" src={getFlagUrl(match.team_b_code)} alt={match.team_b} />
                        <span className="team-name">{match.team_b}</span>
                      </div>
                    </div>
                  );
                });
              })()}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'Plus Jakarta Sans' }}>RITAAN Standings</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rankings updated instantly upon final scores</p>
                </div>
                <button className="nav-button btn-secondary" onClick={fetchData} style={{ padding: '0.5rem 1rem' }}>
                  <RefreshCw size={14} /> Refresh Standings
                </button>
              </div>

              {/* Overall Winners Podium */}
              {leaderboard.length >= 3 && (
                <div className="podium-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: '1rem', alignItems: 'end', marginBottom: '2rem', marginTop: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                  {/* 2nd Place */}
                  {leaderboard[1] && (
                    <div className="podium-card glass-card" style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2,em', height: '90%', borderBottom: '4px solid #94a3b8' }}>
                      <span className="rank-badge rank-2" style={{ width: '28px', height: '28px', fontSize: '0.85rem', marginBottom: '0.25rem' }}>2</span>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }} className="profile-name">{leaderboard[1].name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{leaderboard[1].branch} {leaderboard[1].batch}</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>{leaderboard[1].total_points} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pts</span></span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600 }}>{leaderboard[1].exact_scores} exact scores</span>
                    </div>
                  )}
                  {/* 1st Place */}
                  {leaderboard[0] && (
                    <div className="podium-card glass-card highlighted" style={{ padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', borderBottom: '4px solid #f59e0b', transform: 'scale(1.05)', zIndex: 2 }}>
                      <span className="rank-badge rank-1" style={{ width: '36px', height: '36px', fontSize: '1rem', marginBottom: '0.25rem' }}>1</span>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem' }} className="profile-name">{leaderboard[0].name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leaderboard[0].branch} {leaderboard[0].batch}</span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.35rem' }}>{leaderboard[0].total_points} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pts</span></span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>{leaderboard[0].exact_scores} exact scores</span>
                    </div>
                  )}
                  {/* 3rd Place */}
                  {leaderboard[2] && (
                    <div className="podium-card glass-card" style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.22em', height: '80%', borderBottom: '4px solid #b45309' }}>
                      <span className="rank-badge rank-3" style={{ width: '26px', height: '26px', fontSize: '0.8rem', marginBottom: '0.25rem' }}>3</span>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }} className="profile-name">{leaderboard[2].name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{leaderboard[2].branch} {leaderboard[2].batch}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>{leaderboard[2].total_points} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pts</span></span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600 }}>{leaderboard[2].exact_scores} exact scores</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Participant Name</th>
                      <th>Batch / Dept</th>
                      <th style={{ textAlign: 'center' }}>Predictions</th>
                      <th style={{ textAlign: 'center' }}>Exact Scores (+3)</th>
                      <th style={{ textAlign: 'center' }}>Correct Outcomes (+1)</th>
                      <th style={{ textAlign: 'right' }}>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row, idx) => (
                      <tr className={`leaderboard-row ${row.user_id === user.id ? 'current-user' : ''}`} key={row.user_id}>
                        <td className="rank-cell">
                          <span className={`rank-badge rank-${idx + 1}`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span className="profile-name">{row.name}</span>
                              {row.user_id === user.id && <span style={{ marginLeft: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.6,rem', fontWeight: 700 }}>You</span>}
                            </div>
                            {row.company && row.place && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                {row.company} • {row.place}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{row.branch}</span>{' '}
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({row.batch})</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>{row.total_predictions}</td>
                        <td style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 600 }}>{row.exact_scores}</td>
                        <td style={{ textAlign: 'center', color: 'var(--secondary)', fontWeight: 600 }}>{row.correct_outcomes}</td>
                        <td style={{ textAlign: 'right' }} className="points-badge">
                          {row.total_points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'worldcup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* World Cup Sub Nav */}
              <nav className="nav-links" style={{ width: 'fit-content', background: 'rgba(255,255,255,0.02)', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                <button className={`nav-button ${wcSubTab === 'overview' ? 'active' : ''}`} onClick={() => setWcSubTab('overview')}>
                  Overview
                </button>
                <button className={`nav-button ${wcSubTab === 'standings' ? 'active' : ''}`} onClick={() => setWcSubTab('standings')}>
                  Group Standings
                </button>
                <button className={`nav-button ${wcSubTab === 'bracket' ? 'active' : ''}`} onClick={() => setWcSubTab('bracket')}>
                  Knockout Bracket
                </button>
                <button className={`nav-button ${wcSubTab === 'stats' ? 'active' : ''}`} onClick={() => setWcSubTab('stats')}>
                  Tournament Stats
                </button>
              </nav>

              {/* World Cup Overview Tab */}
              {wcSubTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass-card highlighted">
                    <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.5rem', marginBottom: '0.5rem' }}>FIFA World Cup 2026 Overview</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      The 23rd FIFA World Cup is the first-ever edition to feature <strong>48 national teams</strong> (expanded from 32) playing a total of <strong>104 matches</strong>. The tournament is jointly hosted by <strong>16 cities</strong> across three North American nations: Canada, Mexico, and the United States, running from <strong>June 11 to July 19, 2026</strong>.
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Host Nations</span>
                        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>USA, MX, CA</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Teams</span>
                        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>48 Teams</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Matches</span>
                        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>104 Games</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Final Venue</span>
                        <span style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.5rem' }}>MetLife Stadium</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} style={{ color: 'var(--primary)' }} /> Host Stadiums & Venues</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                      {STADIUMS.map((stadium, idx) => (
                        <div className="glass-card" key={idx} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{stadium.name}</h4>
                              <img src={getFlagUrl(stadium.code)} alt={stadium.country} style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>{stadium.city}, {stadium.country}</span>
                          </div>
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Capacity</span>
                              <span style={{ fontWeight: 700, color: '#fff' }}>{stadium.capacity}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Matches</span>
                              <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{stadium.games}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* World Cup Standings Tab */}
              {wcSubTab === 'standings' && (
                <div className="glass-card">
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1rem' }}>Group Stage Standings</h3>
                  
                  {/* Group Selector Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {Object.keys(GROUPS_DATA).map(g => (
                      <button
                        key={g}
                        className={`nav-button ${selectedGroup === g ? 'active' : ''}`}
                        onClick={() => setSelectedGroup(g)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                      >
                        Group {g}
                      </button>
                    ))}
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="leaderboard-table">
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>Pos</th>
                          <th>Team</th>
                          <th style={{ textAlign: 'center' }}>PL</th>
                          <th style={{ textAlign: 'center' }}>W</th>
                          <th style={{ textAlign: 'center' }}>D</th>
                          <th style={{ textAlign: 'center' }}>L</th>
                          <th style={{ textAlign: 'center' }}>GF</th>
                          <th style={{ textAlign: 'center' }}>GA</th>
                          <th style={{ textAlign: 'center' }}>GD</th>
                          <th style={{ textAlign: 'right' }}>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {GROUPS_DATA[selectedGroup].map((team, idx) => (
                          <tr className="leaderboard-row" key={team.name} style={{ background: idx < 2 ? 'rgba(16, 185, 129, 0.02)' : idx === 2 ? 'rgba(6, 182, 212, 0.01)' : 'transparent' }}>
                            <td style={{ fontWeight: 800, color: idx < 2 ? 'var(--primary)' : idx === 2 ? 'var(--secondary)' : 'var(--text-muted)' }}>
                              {idx + 1}
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src={getFlagUrl(team.code)} alt={team.name} style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
                                <span style={{ fontWeight: 600 }}>{team.name}</span>
                                {idx < 2 && <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.1)', color: 'var(--primary)', padding: '0.05rem 0.2rem', borderRadius: '3px' }}>Q</span>}
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>{team.played}</td>
                            <td style={{ textAlign: 'center' }}>{team.won}</td>
                            <td style={{ textAlign: 'center' }}>{team.drawn}</td>
                            <td style={{ textAlign: 'center' }}>{team.lost}</td>
                            <td style={{ textAlign: 'center' }}>{team.gf}</td>
                            <td style={{ textAlign: 'center' }}>{team.ga}</td>
                            <td style={{ textAlign: 'center', color: team.gf - team.ga > 0 ? 'var(--primary)' : team.gf - team.ga < 0 ? '#ef4444' : 'var(--text-muted)' }}>
                              {team.gf - team.ga > 0 ? `+${team.gf - team.ga}` : team.gf - team.ga}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: idx < 2 ? 'var(--primary)' : '#fff' }}>{team.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                    <span>🟢 Green row = Qualified for Round of 32 (Top 2)</span>
                    <span>🔵 Blue row = Potential best 3rd place advancement</span>
                  </div>
                </div>
              )}

              {/* World Cup Bracket Tab */}
              {wcSubTab === 'bracket' && (
                <div className="glass-card" style={{ overflowX: 'auto', padding: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1.5rem' }}>Knockout Stage Bracket</h3>
                  
                  <div className="bracket-scroll-wrapper" style={{ display: 'flex', gap: '2rem', minWidth: '850px', paddingBottom: '1rem' }}>
                    
                    {/* Column 1: Round of 32 Representative */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '1rem', width: '220px' }}>
                      <span className="bracket-col-header" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>Round of 32</span>
                      
                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', opacity: 0.9 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 600 }}>🇿🇦 South Africa</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600 }}>🇨🇦 Canada</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>June 28 • Los Angeles</div>
                      </div>

                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', opacity: 0.9 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 600 }}>🇧🇷 Brazil</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600 }}>🇯🇵 Japan</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>June 29 • Houston</div>
                      </div>

                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', opacity: 0.9 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 600 }}>🇩🇪 Germany</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600 }}>🇵🇾 Paraguay</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>June 29 • Boston</div>
                      </div>

                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', opacity: 0.9 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 600 }}>🇳🇱 Netherlands</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600 }}>🇲🇦 Morocco</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>June 30 • Monterrey</div>
                      </div>
                    </div>

                    {/* Column 2: Round of 16 */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '2rem', width: '220px' }}>
                      <span className="bracket-col-header" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>Round of 16</span>
                      
                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>SA / Canada Winner</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>Brazil / Japan Winner</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>July 4 • Seattle</div>
                      </div>

                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>Germany / Paraguay Winner</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>Netherlands / Morocco Winner</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>July 5 • Atlanta</div>
                      </div>
                    </div>

                    {/* Column 3: Quarter-Finals */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '4rem', width: '220px' }}>
                      <span className="bracket-col-header" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>Quarter-Finals</span>
                      
                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>Quarter-Finalist 1</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>Quarter-Finalist 2</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>July 9 • Boston</div>
                      </div>
                    </div>

                    {/* Column 4: Semi-Finals & Final */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3rem', width: '220px' }}>
                      <span className="bracket-col-header" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem' }}>Semi-Finals</span>
                      
                      <div className="bracket-match-node glass-card" style={{ padding: '0.6rem', fontSize: '0.8rem', borderLeft: '3px solid rgba(255,255,255,0.15)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>Semi-Finalist 1</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                          <span>Semi-Finalist 2</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem', paddingTop: '0.2rem' }}>July 14 • Dallas</div>
                      </div>
                      
                      <span className="bracket-col-header" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', textAlign: 'center', marginTop: '2rem', marginBottom: '0.5rem' }}>Final</span>
                      <div className="bracket-match-node glass-card highlighted" style={{ padding: '0.8rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontWeight: 700 }}>
                          <span>Finalist 1</span><span>-</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontWeight: 700 }}>
                          <span>Finalist 2</span><span>-</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.4rem', paddingTop: '0.3rem', fontWeight: 700 }}>July 19 • New York NJ</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* World Cup Stats Tab */}
              {wcSubTab === 'stats' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                  
                  {/* Top Scorers Card */}
                  <div className="glass-card">
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Flame size={18} style={{ color: 'var(--accent)' }} /> Golden Boot Standings (Goals)</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table className="leaderboard-table">
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>Rank</th>
                            <th>Player</th>
                            <th>Team</th>
                            <th style={{ textAlign: 'center' }}>Matches</th>
                            <th style={{ textAlign: 'center' }}>Assists</th>
                            <th style={{ textAlign: 'right' }}>Goals</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(JSON.parse(localStorage.getItem('ritaan_synced_scorers')) || PLAYER_STATS.scorers).map((scorer, idx) => (
                            <tr className="leaderboard-row" key={scorer.name}>
                              <td style={{ fontWeight: 800, color: 'var(--text-muted)' }}>{scorer.rank}</td>
                              <td><span style={{ fontWeight: 600 }}>{scorer.name}</span></td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <img src={getFlagUrl(scorer.code)} alt={scorer.team} style={{ width: '18px', height: '12px', borderRadius: '1px', objectFit: 'cover' }} />
                                  <span style={{ fontSize: '0.85rem' }}>{scorer.team}</span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>{scorer.matches}</td>
                              <td style={{ textAlign: 'center' }}>{scorer.assists}</td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--accent)', fontSize: '1.05rem' }}>{scorer.goals}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sidebar Stats (Assists & Clean Sheets) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Playmakers */}
                    <div className="glass-card">
                      <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={16} style={{ color: 'var(--secondary)' }} /> Playmakers (Assists)</h3>
                      <table className="leaderboard-table">
                        <thead>
                          <tr>
                            <th>Player</th>
                            <th style={{ textAlign: 'right' }}>Assists</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PLAYER_STATS.assists.map(item => (
                            <tr key={item.name}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <img src={getFlagUrl(item.code)} alt={item.team} style={{ width: '18px', height: '12px', objectFit: 'cover' }} />
                                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--secondary)' }}>{item.assists}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Goalkeepers */}
                    <div className="glass-card">
                      <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} style={{ color: 'var(--primary)' }} /> Goalkeepers (Clean Sheets)</h3>
                      <table className="leaderboard-table">
                        <thead>
                          <tr>
                            <th>Player</th>
                            <th style={{ textAlign: 'right' }}>Clean Sheets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PLAYER_STATS.cleanSheets.map(item => (
                            <tr key={item.name}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <img src={getFlagUrl(item.code)} alt={item.team} style={{ width: '18px', height: '12px', objectFit: 'cover' }} />
                                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>{item.cleanSheets}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {activeTab === 'rules' && (
            <div className="glass-card">
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1.25rem' }}>Scoring & Rules</h2>
              <div className="rules-container">
                <div className="rule-card">
                  <div className="rule-pts gold">3</div>
                  <div className="rule-desc">
                    <h4>Exact Score Match</h4>
                    <p>You predicted the exact final score of the match. For example, your prediction was 2-1 and the actual match score was 2-1.</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-pts green">1</div>
                  <div className="rule-desc">
                    <h4>Correct Outcome, Incorrect Score</h4>
                    <p>You predicted the correct winning team or draw, but not the exact scores. For example, you predicted a 3-1 Brazil win, but the actual score was 2-0 Brazil.</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-pts">0</div>
                  <div className="rule-desc">
                    <h4>Incorrect Outcome</h4>
                    <p>You predicted the wrong winner or predicted a draw and a team won. No points are awarded.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-light)', borderRadius: '10px' }}>
                <h4 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '0.5rem' }}>Tie-Breaker Rule</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  If two or more RITAAN members have the same total points at the end of the tournament, the tie will be broken in the following order:
                  <br />1. Most **Exact Score Match (3 points)** predictions.
                  <br />2. Most **Correct Outcome (1 point)** predictions.
                  <br />3. Alphabetical order of the member's name.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'admin' && showAdminTab && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Auto-Sync Card */}
              <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><RefreshCw size={18} style={{ color: 'var(--secondary)' }} /> Auto-Sync Live Tournament Data</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Automatically sync live World Cup scores, fixture resolutions, group standings, and Golden Boot stats with the global API.
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '240px', marginBottom: 0 }}>
                    <label style={{ margin: 0 }}>Football-Data.org API Key (Optional)</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Enter API Token to sync live data" 
                      value={syncApiKey}
                      onChange={e => setSyncApiKey(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleAutoSyncTournament}
                    style={{ height: '44px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--secondary)' }}
                    disabled={syncing}
                  >
                    {syncing ? <div className="spinner" style={{ width: '16px', height: '16px' }}></div> : <RefreshCw size={16} />}
                    {syncing ? 'Syncing...' : 'Sync Live Data'}
                  </button>
                </div>
                
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                  💡 Leave the API Token blank to run a <strong>Simulated Live Sync</strong>. This completes pending games (Jordan vs Argentina) and re-evaluates all predictions to show you how the automatic updates and leaderboards settle.
                </span>
              </div>

              <div className="admin-grid">
              {/* Match Score Updates */}
              <div className="glass-card">
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1.25rem' }}>Update Completed Match Scores</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Enter final scores to lock matches, settle points, and update rankings.
                </p>

                <div>
                  {matches.map(match => (
                    <div className="admin-match-row" key={match.id}>
                      <div className="admin-match-info">
                        <span style={{ fontWeight: 600 }}>{match.team_a} vs {match.team_b}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{match.stage} | {new Date(match.kickoff_time).toLocaleDateString()}</span>
                      </div>

                      <div className="admin-match-scores">
                        <input 
                          type="text" 
                          className="score-input"
                          maxLength="2" 
                          placeholder="A"
                          value={adminScores[match.id]?.scoreA ?? ''}
                          onChange={e => handleAdminScoreChange(match.id, 'scoreA', e.target.value)}
                        />
                        <span className="score-divider">:</span>
                        <input 
                          type="text" 
                          className="score-input" 
                          maxLength="2"
                          placeholder="B"
                          value={adminScores[match.id]?.scoreB ?? ''}
                          onChange={e => handleAdminScoreChange(match.id, 'scoreB', e.target.value)}
                        />
                      </div>

                      <div>
                        <button 
                          className="btn" 
                          onClick={() => handleAdminSaveScore(match.id)}
                          style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', borderRadius: '6px' }}
                        >
                          Settle Score
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custom Match */}
              <div className="glass-card">
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1.25rem' }}>Add New Knockout Match</h3>
                
                <form onSubmit={handleAdminAddMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Team A Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Argentina" 
                        value={adminTeamA}
                        onChange={e => setAdminTeamA(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Team A Country Code (2 letters)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. ar" 
                        maxLength="2"
                        value={adminTeamACode}
                        onChange={e => setAdminTeamACode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Team B Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. France" 
                        value={adminTeamB}
                        onChange={e => setAdminTeamB(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Team B Country Code (2 letters)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. fr" 
                        maxLength="2"
                        value={adminTeamBCode}
                        onChange={e => setAdminTeamBCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Kickoff Time (Local Device Time)</label>
                      <input 
                        type="datetime-local" 
                        className="form-input" 
                        value={adminKickoff}
                        onChange={e => setAdminKickoff(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tournament Stage</label>
                      <select 
                        className="form-input"
                        value={adminStage}
                        onChange={e => setAdminStage(e.target.value)}
                      >
                        <option value="Round of 32">Round of 32</option>
                        <option value="Round of 16">Round of 16</option>
                        <option value="Quarter-Finals">Quarter-Finals</option>
                        <option value="Semi-Finals">Semi-Finals</option>
                        <option value="Final">Final</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn" style={{ width: 'fit-content', alignSelf: 'flex-end', marginTop: '0.5rem' }}>
                    <PlusCircle size={18} /> Add Match
                  </button>
                </form>
              </div>

              {/* Participant Management Card */}
              <div className="glass-card" style={{ gridColumn: 'span 2', borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} style={{ color: '#ef4444' }} /> Manage Contest Participants</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Purge fake registrations, duplicate profiles, or test accounts from the standings leaderboard.
                    </p>
                  </div>
                  <button 
                    className="btn" 
                    onClick={handleDownloadCSV} 
                    style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    <Download size={16} /> Export to CSV
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Participant Name</th>
                        <th>Branch / Batch</th>
                        <th>Contact / Org / City</th>
                        <th style={{ textAlign: 'center' }}>Predictions</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map(participant => (
                        <tr key={participant.user_id} className="leaderboard-row">
                          <td style={{ fontWeight: 700 }}>
                            {participant.name} 
                            {participant.user_id === user.id && <span style={{ fontSize: '0.65rem', background: 'rgba(0, 230, 118, 0.12)', color: 'var(--primary)', padding: '0.1rem 0.35rem', borderRadius: '4px', marginLeft: '0.5rem' }}>You</span>}
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{participant.branch} ({participant.batch})</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {participant.mobile ? participant.mobile : '-'}<br/>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.85 }}>{participant.company || '-'} • {participant.place || '-'}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>{participant.total_predictions}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => handleRemoveParticipant(participant.user_id, participant.name)}
                              style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.75rem', 
                                border: '1px solid rgba(239, 68, 68, 0.2)', 
                                color: '#f87171', 
                                borderRadius: '6px',
                                width: 'auto'
                              }}
                              disabled={participant.user_id === user.id}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 'auto', paddingTop: '2.5rem', paddingBottom: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', position: 'relative' }}>
        <p>© 2026 RITAAN Trivandrum Chapter. All Rights Reserved.</p>
        <p style={{ marginTop: '0.25rem' }}>Made with ❤️ by RIT Kottayam Alumni Network Trivandrum Chapter.</p>
        <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', opacity: 0.85, flexWrap: 'wrap' }}>
          <span>Designed & Developed by <a href="mailto:sujithbkallara@gmail.com" style={{ color: 'var(--secondary)', fontWeight: 700, textDecoration: 'none' }} className="designer-link">Kallara</a></span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
          <a href="https://wa.me/919995856425" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="contact-icon-link" title="Contact on WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.618-1.01-5.078-2.855-6.927-1.844-1.848-4.296-2.865-6.916-2.866-5.41 0-9.813 4.398-9.815 9.801-.001 1.548.413 3.062 1.2 4.407l-.999 3.648 3.734-.975zm10.741-6.953c-.346-.173-2.046-1.01-2.358-1.124-.313-.115-.542-.173-.77.173-.228.346-.885 1.124-1.085 1.355-.2.23-.4.259-.746.086-1.928-.962-3.14-1.603-4.398-3.76-.329-.567-.099-.873.173-1.144.246-.243.542-.634.812-.952.19-.228.257-.39.385-.649.128-.26.064-.487-.032-.66-.096-.173-.77-1.854-1.055-2.546-.277-.667-.56-.576-.77-.587-.199-.01-.427-.01-.655-.01-.228 0-.6.086-.913.433-.313.346-1.197 1.171-1.197 2.855 0 1.684 1.228 3.313 1.4 3.542.173.228 2.417 3.693 5.855 5.177.818.353 1.456.564 1.956.723.822.26 1.57.223 2.161.135.66-.099 2.046-.836 2.331-1.644.285-.808.285-1.5.2-1.644-.085-.145-.313-.23-.659-.404z"/>
            </svg>
          </a>
          <a href="mailto:sujithbkallara@gmail.com" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="contact-icon-link" title="Send Email">
            <Mail size={14} />
          </a>
        </div>
        
        {/* Subtle Admin Trigger Gear */}
        <button 
          onClick={() => setShowPasswordModal(true)} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'rgba(255,255,255,0.06)', 
            cursor: 'pointer', 
            position: 'absolute', 
            bottom: '10px', 
            right: '10px', 
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="admin-gear-trigger"
          title="Admin Panel Access"
        >
          <Settings size={14} />
        </button>
      </footer>

      {/* Admin Password verification Modal Overlay */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-card highlighted" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={28} style={{ color: 'var(--secondary)' }} />
              Admin Authorization
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Enter the secret chapter password to unlock administrator settings.
            </p>
            
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={adminPasswordInput}
              onChange={e => setAdminPasswordInput(e.target.value)}
              style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.15rem', marginBottom: '1.5rem' }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleVerifyAdminPassword();
              }}
              autoFocus
            />
            
            {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '1.25rem', fontWeight: 600 }}>{error}</p>}
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => { setShowPasswordModal(false); setAdminPasswordInput(''); setError(null); }} 
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="btn" 
                onClick={handleVerifyAdminPassword} 
                style={{ flex: 1 }}
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
