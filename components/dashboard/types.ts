export interface DashboardData {
  student: {
    name: string;
    totalTests: number;
    averageScore: number;
    bestRank: number;
    weakSubjectsCount: number;
  };

  coaching?: {
    name: string;
    logo: string;
  };
}

export interface Test {
  _id: string;
  title: string;
  description: string;
  totalQuestions: number;
  duration: number;
  isPremium: boolean;
}

export interface ResultItem {
  _id: string;
  score: number;
  rank: number;
  totalMarks: number;
  test: {
    title: string;
  };
}

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

export interface Profile {
  name: string;
  email: string;
  mobile: string;
  course: string;
  role: string;

  coaching?: {
    name: string;
    logo: string;
    couponCode: string;
  };
}