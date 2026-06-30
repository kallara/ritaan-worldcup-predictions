// FIFA World Cup 2026 Static Data Center

export const STADIUMS = [
  { name: 'MetLife Stadium', city: 'East Rutherford (NY/NJ)', country: 'USA', capacity: '82,500', games: '8 (including Final)', code: 'us' },
  { name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: '87,523', games: '5 (including Opening Match)', code: 'mx' },
  { name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: '70,240', games: '8', code: 'us' },
  { name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: '54,500', games: '7', code: 'ca' },
  { name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: '71,000', games: '8 (including Semi-final)', code: 'us' },
  { name: 'Hard Rock Stadium', city: 'Miami', country: 'USA', capacity: '64,767', games: '7 (including Third-place)', code: 'us' },
  { name: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: '80,000', games: '9 (including Semi-final)', code: 'us' },
  { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: '76,416', games: '6', code: 'us' },
  { name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: '72,220', games: '7', code: 'us' },
  { name: 'Gillette Stadium', city: 'Boston', country: 'USA', capacity: '65,878', games: '7', code: 'us' },
  { name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: '69,796', games: '6', code: 'us' },
  { name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: '69,000', games: '6', code: 'us' },
  { name: 'Levi\'s Stadium', city: 'San Francisco Bay Area', country: 'USA', capacity: '68,500', games: '6', code: 'us' },
  { name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: '53,500', games: '4', code: 'mx' },
  { name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: '48,071', games: '4', code: 'mx' },
  { name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: '30,000', games: '6', code: 'ca' }
];

export const PLAYER_STATS = {
  scorers: [
    { rank: 1, name: 'Lionel Messi', team: 'Argentina', code: 'ar', goals: 5, assists: 3, matches: 3 },
    { rank: 2, name: 'Kylian Mbappé', team: 'France', code: 'fr', goals: 4, assists: 2, matches: 3 },
    { rank: 3, name: 'Erling Haaland', team: 'Norway', code: 'no', goals: 4, assists: 1, matches: 3 },
    { rank: 4, name: 'Vinícius Júnior', team: 'Brazil', code: 'br', goals: 4, assists: 0, matches: 3 },
    { rank: 5, name: 'Ousmane Dembélé', team: 'France', code: 'fr', goals: 4, assists: 0, matches: 3 },
    { rank: 6, name: 'Jude Bellingham', team: 'England', code: 'gb', goals: 3, assists: 2, matches: 3 },
    { rank: 7, name: 'Harry Kane', team: 'England', code: 'gb', goals: 3, assists: 1, matches: 3 },
    { rank: 8, name: 'Jamal Musiala', team: 'Germany', code: 'de', goals: 3, assists: 1, matches: 3 },
    { rank: 9, name: 'Darwin Núñez', team: 'Uruguay', code: 'uy', goals: 2, assists: 1, matches: 3 },
    { rank: 10, name: 'Alvaro Morata', team: 'Spain', code: 'es', goals: 2, assists: 0, matches: 3 }
  ],
  assists: [
    { rank: 1, name: 'Lionel Messi', team: 'Argentina', code: 'ar', assists: 3 },
    { rank: 2, name: 'Antoine Griezmann', team: 'France', code: 'fr', assists: 3 },
    { rank: 3, name: 'Kevin De Bruyne', team: 'Belgium', code: 'be', assists: 2 },
    { rank: 4, name: 'Jude Bellingham', team: 'England', code: 'gb', assists: 2 },
    { rank: 5, name: 'Kylian Mbappé', team: 'France', code: 'fr', assists: 2 }
  ],
  cleanSheets: [
    { rank: 1, name: 'Jordan Pickford', team: 'England', code: 'gb', cleanSheets: 3 },
    { rank: 2, name: 'Alisson Becker', team: 'Brazil', code: 'br', cleanSheets: 2 },
    { rank: 3, name: 'Emiliano Martínez', team: 'Argentina', code: 'ar', cleanSheets: 2 },
    { rank: 4, name: 'Manuel Neuer', team: 'Germany', code: 'de', cleanSheets: 2 },
    { rank: 5, name: 'Unai Simón', team: 'Spain', code: 'es', cleanSheets: 2 }
  ]
};

export const GROUPS_DATA = {
  A: [
    { name: 'Mexico', code: 'mx', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, pts: 7 },
    { name: 'South Africa', code: 'za', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, pts: 4 },
    { name: 'Korea Republic', code: 'kr', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, pts: 3 },
    { name: 'Czechia', code: 'cz', played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 5, pts: 3 }
  ],
  B: [
    { name: 'Switzerland', code: 'ch', played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 2, pts: 7 },
    { name: 'Canada', code: 'ca', played: 3, won: 2, drawn: 0, lost: 1, gf: 6, ga: 3, pts: 6 },
    { name: 'Bosnia & Herz.', code: 'ba', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, pts: 3 },
    { name: 'Qatar', code: 'qa', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, pts: 1 }
  ],
  C: [
    { name: 'Brazil', code: 'br', played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, pts: 9 },
    { name: 'Morocco', code: 'ma', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, pts: 6 },
    { name: 'Scotland', code: 'gb', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, pts: 3 },
    { name: 'Haiti', code: 'ht', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 8, pts: 0 }
  ],
  D: [
    { name: 'United States', code: 'us', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, pts: 7 },
    { name: 'Paraguay', code: 'py', played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 3, pts: 5 },
    { name: 'Australia', code: 'au', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, pts: 3 },
    { name: 'Türkiye', code: 'tr', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 5, pts: 1 }
  ],
  E: [
    { name: 'Germany', code: 'de', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 2, pts: 7 },
    { name: 'Côte d\'Ivoire', code: 'ci', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, pts: 6 },
    { name: 'Ecuador', code: 'ec', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 6, pts: 3 },
    { name: 'Curaçao', code: 'cw', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 6, pts: 1 }
  ],
  F: [
    { name: 'Netherlands', code: 'nl', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, pts: 7 },
    { name: 'Japan', code: 'jp', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, pts: 6 },
    { name: 'Sweden', code: 'se', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, pts: 4 },
    { name: 'Tunisia', code: 'tn', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, pts: 0 }
  ],
  G: [
    { name: 'Belgium', code: 'be', played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 2, pts: 7 },
    { name: 'Egypt', code: 'eg', played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 3, pts: 5 },
    { name: 'New Zealand', code: 'nz', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, pts: 3 },
    { name: 'Iran', code: 'ir', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 4, pts: 1 }
  ],
  H: [
    { name: 'Spain', code: 'es', played: 3, won: 3, drawn: 0, lost: 0, gf: 9, ga: 2, pts: 9 },
    { name: 'Cabo Verde', code: 'cv', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 5, pts: 4 },
    { name: 'Uruguay', code: 'uy', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, pts: 3 },
    { name: 'Saudi Arabia', code: 'sa', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 6, pts: 1 }
  ],
  I: [
    { name: 'France', code: 'fr', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 3, pts: 7 },
    { name: 'Senegal', code: 'sn', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 4, pts: 6 },
    { name: 'Norway', code: 'no', played: 3, won: 1, drawn: 1, lost: 1, gf: 5, ga: 4, pts: 4 },
    { name: 'Iraq', code: 'iq', played: 3, won: 0, drawn: 0, lost: 3, gf: 2, ga: 8, pts: 0 }
  ],
  J: [
    { name: 'Argentina', code: 'ar', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 1, pts: 7 },
    { name: 'Algeria', code: 'dz', played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, pts: 6 },
    { name: 'Austria', code: 'at', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, pts: 3 },
    { name: 'Jordan', code: 'jo', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 6, pts: 1 }
  ],
  K: [
    { name: 'Portugal', code: 'pt', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 3, pts: 7 },
    { name: 'Uzbekistan', code: 'uz', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, pts: 6 },
    { name: 'Colombia', code: 'co', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, pts: 4 },
    { name: 'Congo DR', code: 'cd', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, pts: 0 }
  ],
  L: [
    { name: 'England', code: 'gb', played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, pts: 9 },
    { name: 'Croatia', code: 'hr', played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 3, pts: 5 },
    { name: 'Ghana', code: 'gh', played: 3, won: 0, drawn: 2, lost: 1, gf: 3, ga: 5, pts: 2 },
    { name: 'Panama', code: 'pa', played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 8, pts: 0 }
  ]
};
