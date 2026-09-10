export interface LeaderboardItem {
  _id: string;
  score: number;

  student: {
    name: string;
  };
}

export interface Leaderboard {
  totalStudents: number;
  studentRank: number;
  topStudents: LeaderboardItem[];
  nearbyStudents: LeaderboardItem[];
}
