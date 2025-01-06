export interface Player {
  name: string;
  points: number;
  games: number[];
  tiebreakPoints: number;
}

export interface GameSettings {
  setType: 'normal' | 'running';
  deuceType: 'advantage' | 'goldenPoint';
  maxSets: number;
  sponsorName: string;
  showScoreboard: boolean;
  gameCode: string;
}