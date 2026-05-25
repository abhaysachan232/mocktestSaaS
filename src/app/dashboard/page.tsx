"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  LogOut,
  Trophy,
  BookOpen,
  Target,
  AlertTriangle,
} from "lucide-react";

interface DashboardData {
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

interface Test {
  _id: string;

  title: string;

  description: string;

  totalQuestions: number;

  duration: number;

  isPremium: boolean;
}

interface ResultItem {
  _id: string;

  score: number;

  rank: number;

  totalMarks: number;

  test: {
    title: string;
  };
}

interface LeaderboardItem {
  _id: string;

  score: number;

  student: {
    name: string;
  };
}

interface Leaderboard {
  totalStudents: number;

  studentRank: number;

  topStudents:
    LeaderboardItem[];

  nearbyStudents:
    LeaderboardItem[];
}

interface Profile {
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

export default function DashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [dashboard,
    setDashboard] =
    useState<DashboardData | null>(
      null
    );

  const [tests, setTests] =
    useState<Test[]>([]);

  const [results, setResults] =
    useState<ResultItem[]>(
      []
    );

  const [leaderboard,
    setLeaderboard] =
    useState<Leaderboard | null>(
      null
    );

  const [profile, setProfile] =
    useState<Profile | null>(
      null
    );

  // Dashboard
  const fetchDashboard =
    async () => {
      try {
        const res = await fetch(
          "/api/dashboard",
          {
            credentials:
              "include",
          }
        );

        const result =
          await res.json();

        setDashboard(
          result.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  // Tests
  const fetchTests =
    async () => {
      try {
        const res =
          await fetch(
            "/api/student/tests",
            {
              credentials:
                "include",
            }
          );

        const result =
          await res.json();

        setTests(
          result.tests || []
        );
      } catch (error) {
        console.log(error);
      }
    };

  // Results
  const fetchResults =
    async () => {
      try {
        const res =
          await fetch(
            "/api/student/results",
            {
              credentials:
                "include",
              }
          );

        const result =
          await res.json();

        setResults(
          result.results || []
        );
      } catch (error) {
        console.log(error);
      }
    };

  // Leaderboard
  const fetchLeaderboard =
    async () => {
      try {
        const res =
          await fetch(
            "/api/student/leaderboard",
            {
              credentials:
                "include",
            }
          );

        const result =
          await res.json();

        setLeaderboard(
          result
        );
      } catch (error) {
        console.log(error);
      }
    };

  // Profile
  const fetchProfile =
    async () => {
      try {
        const res =
          await fetch(
            "/api/student/profile",
            {
              credentials:
                "include",
            }
          );

        const result =
          await res.json();

        setProfile(
          result.profile
        );
      } catch (error) {
        console.log(error);
      }
    };

  // Initial Load
  useEffect(() => {
    const loadData =
      async () => {
        await Promise.all([
          fetchDashboard(),
          fetchTests(),
          fetchResults(),
          fetchLeaderboard(),
          fetchProfile(),
        ]);

        setLoading(false);
      };

    void loadData();
  }, []);

  // Logout
  const handleLogout =
    async () => {
      try {
        await fetch(
          "/api/logout",
          {
            method: "POST",

            credentials:
              "include",
          }
        );

        window.location.href =
          "/";
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  const stats = [
    {
      title:
        "Tests Attempted",

      value:
        dashboard?.student
          .totalTests || 0,

      icon: BookOpen,

      color:
        "text-blue-600",
    },

    {
      title:
        "Average Score",

      value: `${
        dashboard?.student
          .averageScore || 0
      }%`,

      icon: Target,

      color:
        "text-green-600",
    },

    {
      title: "Best Rank",

      value: `#${
        dashboard?.student
          .bestRank || 0
      }`,

      icon: Trophy,

      color:
        "text-purple-600",
    },

    {
      title:
        "Weak Subjects",

      value:
        dashboard?.student
          .weakSubjectsCount ||
        0,

      icon:
        AlertTriangle,

      color:
        "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-72 bg-white h-screen border-r p-6 sticky top-0 hidden lg:block">

          <h1 className="text-3xl font-bold text-blue-600 mb-10">
            MockTest Portal
          </h1>

          {/* Coaching */}
          {dashboard?.coaching && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center gap-3 mb-8">

              <Image
                src={
                  dashboard
                    .coaching
                    .logo
                }
                alt="logo"
                width={60}
                height={60}
                className="rounded-2xl border object-cover"
              />

              <div>
                <p className="text-sm text-gray-500">
                  Joined Via
                </p>

                <h3 className="font-bold text-lg">
                  {
                    dashboard
                      .coaching
                      .name
                  }
                </h3>
              </div>
            </div>
          )}

          {/* Sidebar Menu */}
          <nav className="space-y-3">

            {[
              "dashboard",
              "tests",
              "results",
              "leaderboard",
              "profile",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab
                  )
                }
                className={`block w-full text-left px-5 py-4 rounded-2xl font-semibold transition capitalize ${
                  activeTab ===
                  tab
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-10">

            <div>
              <h2 className="text-4xl font-bold">
                Welcome,
                {" "}
                {
                  dashboard
                    ?.student
                    ?.name
                }
                👋
              </h2>

              <p className="text-gray-500 mt-2">
                Track your
                performance
                and improve
                daily
              </p>
            </div>

            <button
              onClick={
                handleLogout
              }
              className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 h-fit"
            >
              <LogOut
                size={18}
              />

              Logout
            </button>
          </div>

          {/* Dashboard */}
          {activeTab ===
            "dashboard" && (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

              {stats.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <div
                      key={
                        item.title
                      }
                      className="bg-white rounded-3xl p-6 shadow-sm"
                    >
                      <div className="flex justify-between">

                        <div>
                          <p className="text-gray-500 text-sm">
                            {
                              item.title
                            }
                          </p>

                          <h3
                            className={`text-4xl font-bold mt-3 ${item.color}`}
                          >
                            {
                              item.value
                            }
                          </h3>
                        </div>

                        <div className="bg-blue-100 h-fit p-4 rounded-2xl">
                          <Icon className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Tests */}
          {activeTab ===
            "tests" && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {tests.map(
                (test) => (
                  <div
                    key={
                      test._id
                    }
                    className="bg-white rounded-3xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-5">

                      <h2 className="text-2xl font-bold">
                        {
                          test.title
                        }
                      </h2>

                      {test.isPremium && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Premium
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 mb-6">
                      {
                        test.description
                      }
                    </p>

                    <div className="space-y-3 mb-6">

                      <div className="flex justify-between">
                        <span>
                          Questions
                        </span>

                        <span className="font-semibold">
                          {
                            test.totalQuestions
                          }
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>
                          Duration
                        </span>

                        <span className="font-semibold">
                          {
                            test.duration
                          }{" "}
                          mins
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition">
                      Start Test
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {/* Results */}
          {activeTab ===
            "results" && (
            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <h2 className="text-3xl font-bold mb-8">
                Recent Results
              </h2>

              <div className="space-y-5">

                {results.map(
                  (
                    item
                  ) => (
                    <div
                      key={
                        item._id
                      }
                      className="border rounded-2xl p-5 bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-bold text-lg">
                          {
                            item.test
                              ?.title
                          }
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          Total Marks:
                          {" "}
                          {
                            item.totalMarks
                          }
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {
                            item.score
                          }%
                        </p>

                        <p className="text-sm text-gray-500">
                          Rank #
                          {
                            item.rank
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {activeTab ===
            "leaderboard" &&
            leaderboard && (
              <div className="space-y-8">

                <div className="bg-white rounded-3xl p-8 shadow-sm">

                  <h2 className="text-4xl font-bold mb-3">
                    Leaderboard
                  </h2>

                  <p className="text-gray-500">
                    Total Students:
                    {" "}
                    {
                      leaderboard.totalStudents
                    }
                  </p>

                  <div className="mt-5 bg-blue-50 rounded-2xl p-5">

                    <p className="text-gray-500">
                      Your Rank
                    </p>

                    <h3 className="text-5xl font-bold text-blue-600 mt-2">
                      #
                      {
                        leaderboard.studentRank
                      }
                    </h3>
                  </div>
                </div>
              </div>
            )}

          {/* Profile */}
          {activeTab ===
            "profile" &&
            profile && (
              <div className="space-y-8">

                <div className="bg-white rounded-3xl p-8 shadow-sm">

                  <div className="flex flex-col md:flex-row items-center gap-8">

                    <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600">

                      {profile.name?.charAt(
                        0
                      )}
                    </div>

                    <div className="flex-1">

                      <h2 className="text-4xl font-bold">
                        {
                          profile.name
                        }
                      </h2>

                      <p className="text-gray-500 mt-2">
                        {
                          profile.email
                        }
                      </p>

                      <div className="grid md:grid-cols-2 gap-5 mt-8">

                        <div className="bg-gray-50 rounded-2xl p-5">

                          <p className="text-gray-500 text-sm">
                            Mobile
                          </p>

                          <h3 className="text-2xl font-bold mt-2">
                            {
                              profile.mobile
                            }
                          </h3>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-5">

                          <p className="text-gray-500 text-sm">
                            Course
                          </p>

                          <h3 className="text-2xl font-bold mt-2 capitalize">
                            {
                              profile.course
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}