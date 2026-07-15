import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { analyticsService } from '../services/analyticsService';
import { 
  MdCreate, MdDocumentScanner, MdAssessment, 
  MdTrendingUp, MdOutlineLibraryBooks, MdPeopleOutline,
  MdFactCheck, MdTimeline, MdCheckCircleOutline
} from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Map icon strings from JSON to actual React Icons
const iconMap = {
  MdCreate,
  MdDocumentScanner,
  MdFactCheck,
  MdAssessment
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className={`h-1 w-full ${colorClass}`}></div>
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClass.replace('bg-', 'bg-opacity-10 text-')}`}>
          <Icon className={`text-2xl ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <MdTrendingUp className={`mr-1 ${trendUp ? 'text-green-500' : 'text-red-500 transform rotate-180'}`} />
        <span className={trendUp ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{trend}</span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentExams, setRecentExams] = useState([]);
  const [recentExamsLoading, setRecentExamsLoading] = useState(true);
  const [recentExamsError, setRecentExamsError] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [examSummary, setExamSummary] = useState(null);
  const [examSummaryLoading, setExamSummaryLoading] = useState(true);
  const [examSummaryError, setExamSummaryError] = useState('');
  
  // Date formatting
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(undefined, dateOptions);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await analyticsService.getDashboard();

        if (isMounted) {
          setDashboardData(response?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load dashboard data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRecentExams = async () => {
      try {
        setRecentExamsLoading(true);
        setRecentExamsError('');
        const response = await analyticsService.getExams();

        if (isMounted) {
          const exams = Array.isArray(response) ? response : response?.data || [];
          const sortedExams = [...exams].sort((a, b) => b.id - a.id);
          setRecentExams(sortedExams);

          if (sortedExams.length > 0) {
            setSelectedExamId((current) => current || sortedExams[0].id);
          } else {
            setSelectedExamId(null);
            setExamSummary(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setRecentExamsError('Unable to load recent examinations.');
        }
      } finally {
        if (isMounted) {
          setRecentExamsLoading(false);
        }
      }
    };

    fetchRecentExams();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchExamSummary = async () => {
      if (!selectedExamId) {
        setExamSummary(null);
        setExamSummaryLoading(false);
        setExamSummaryError('');
        return;
      }

      try {
        setExamSummaryLoading(true);
        setExamSummaryError('');
        const response = await analyticsService.getExamSummary(selectedExamId);

        if (isMounted) {
          setExamSummary(response?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setExamSummaryError('Unable to load exam summary.');
        }
      } finally {
        if (isMounted) {
          setExamSummaryLoading(false);
        }
      }
    };

    fetchExamSummary();

    return () => {
      isMounted = false;
    };
  }, [selectedExamId]);

  const stats = dashboardData || {
    total_exams: 0,
    total_students: 0,
    total_results: 0,
    average_score: 0,
    highest_score: 0,
    lowest_score: 0,
  };

  const scoreDistData = [];
  const passFailData = [];
  const avgScoreTrendData = [];
  const recentActivity = [];
  const hasChartData = scoreDistData.length > 0 || passFailData.length > 0 || avgScoreTrendData.length > 0;

  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-6">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-800 rounded-xl shadow-sm p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Welcome back, Admin 👋</h1>
          <p className="text-blue-100 text-sm sm:text-base">
            {formattedDate} • System is running smoothly. {loading ? 'Fetching latest dashboard numbers…' : `Highest Score: ${stats.highest_score} • Lowest Score: ${stats.lowest_score}.`}
          </p>
        </div>
        <div className="mt-6 sm:mt-0 relative z-10 flex space-x-3">
          <Button variant="secondary" className="border-0 shadow-sm text-primary hover:bg-gray-50" onClick={() => navigate(ROUTES.CREATE_EXAM)}>
            <MdCreate className="mr-2" /> New Exam
          </Button>
        </div>
      </div>

      {/* 3. Statistics Cards */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white px-6 py-10 shadow-sm">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-gray-600">Loading dashboard data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Exams" value={stats.total_exams} icon={MdOutlineLibraryBooks} trend="Live data" trendUp={true} colorClass="bg-blue-500" />
          <StatCard title="Total Students" value={stats.total_students} icon={MdPeopleOutline} trend="Live data" trendUp={true} colorClass="bg-purple-500" />
          <StatCard title="Total Results" value={stats.total_results} icon={MdFactCheck} trend="Live data" trendUp={true} colorClass="bg-green-500" />
          <StatCard title="Average Score" value={stats.average_score} icon={MdAssessment} trend="Live data" trendUp={false} colorClass="bg-orange-500" />
        </div>
      )}

      {/* 2. Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="secondary" className="h-16 justify-start px-6 hover:border-primary hover:text-primary transition-colors shadow-sm" onClick={() => navigate(ROUTES.CREATE_EXAM)}>
            <div className="bg-blue-100 p-2 rounded-lg mr-4"><MdCreate className="text-primary text-xl" /></div>
            <span className="font-medium">Create Examination</span>
          </Button>
          <Button variant="secondary" className="h-16 justify-start px-6 hover:border-purple-600 hover:text-purple-600 transition-colors shadow-sm" onClick={() => navigate(ROUTES.SCANNER)}>
            <div className="bg-purple-100 p-2 rounded-lg mr-4"><MdDocumentScanner className="text-purple-600 text-xl" /></div>
            <span className="font-medium">Start Live Scanner</span>
          </Button>
          <Button variant="secondary" className="h-16 justify-start px-6 hover:border-green-600 hover:text-green-600 transition-colors shadow-sm" onClick={() => navigate(ROUTES.RESULTS)}>
            <div className="bg-green-100 p-2 rounded-lg mr-4"><MdAssessment className="text-green-600 text-xl" /></div>
            <span className="font-medium">View Results & Analytics</span>
          </Button>
        </div>
      </div>

      {/* 4. Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Score Distribution (Bar) */}
        <Card className="shadow-sm">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-text">Score Distribution (Latest Exam)</h3>
          </div>
          <CardContent className="p-5 h-72">
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="students" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">No score distribution data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Pass vs Fail (Pie) & Average Trend (Line) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="shadow-sm flex flex-col">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-text">Pass vs Fail</h3>
            </div>
            <CardContent className="p-5 flex-1 flex flex-col items-center justify-center relative">
              {passFailData.length > 0 ? (
                <>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={passFailData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                          {passFailData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-4">
                    <span className="text-2xl font-bold text-gray-900">78%</span>
                  </div>
                  <div className="flex justify-center space-x-4 mt-2">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div><span className="text-xs text-gray-600">Pass</span></div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div><span className="text-xs text-gray-600">Fail</span></div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">No pass/fail data available.</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm flex flex-col">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-text">Average Trend</h3>
            </div>
            <CardContent className="p-5 flex-1 h-48">
              {avgScoreTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={avgScoreTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">No score trend data available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Recent Activity & 6. Recent Exams */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Activity Timeline */}
        <Card className="xl:col-span-1 shadow-sm flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-text">Recent Activity</h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          <CardContent className="p-5 flex-1">
            {recentActivity.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {recentActivity.map((activity, index) => {
                  const Icon = iconMap[activity.icon];
                  return (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white ${activity.bg} ${activity.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                        {Icon && <Icon className="text-lg" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-md">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-900 text-sm">{activity.title}</div>
                          <time className="font-medium text-xs text-primary">{activity.time}</time>
                        </div>
                        <div className="text-slate-500 text-sm">{activity.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">No recent activity available.</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Exams Table */}
        <Card className="xl:col-span-2 shadow-sm">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-text">Recent Examinations</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-blue-50" onClick={() => navigate(ROUTES.CREATE_EXAM)}>
              View All
            </Button>
          </div>
          <div className="p-4 border-b border-border bg-gray-50/50">
            {recentExamsError ? (
              <div className="text-sm text-red-600">{recentExamsError}</div>
            ) : examSummaryLoading ? (
              <div className="text-sm text-gray-600">Loading exam summary...</div>
            ) : examSummaryError ? (
              <div className="text-sm text-red-600">{examSummaryError}</div>
            ) : examSummary ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Exam Title</span><div className="font-medium text-gray-900">{examSummary.exam_title}</div></div>
                <div><span className="text-gray-500">Students Appeared</span><div className="font-medium text-gray-900">{examSummary.students_appeared}</div></div>
                <div><span className="text-gray-500">Average Score</span><div className="font-medium text-gray-900">{examSummary.average_score}</div></div>
                <div><span className="text-gray-500">Highest Score</span><div className="font-medium text-gray-900">{examSummary.highest_score}</div></div>
                <div><span className="text-gray-500">Lowest Score</span><div className="font-medium text-gray-900">{examSummary.lowest_score}</div></div>
                <div><span className="text-gray-500">Pass Percentage</span><div className="font-medium text-gray-900">{examSummary.pass_percentage}%</div></div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">Select an exam to view the summary.</div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Exam Name</th>
                  <th scope="col" className="px-6 py-4 font-medium">Type</th>
                  <th scope="col" className="px-6 py-4 font-medium">Questions</th>
                  <th scope="col" className="px-6 py-4 font-medium">Marks</th>
                  <th scope="col" className="px-6 py-4 font-medium">Set</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentExamsLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">Loading recent examinations...</td>
                  </tr>
                ) : recentExams.length > 0 ? (
                  recentExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{exam.title}</td>
                      <td className="px-6 py-4"><Badge variant="default">{exam.exam_type}</Badge></td>
                      <td className="px-6 py-4 text-gray-600">{exam.total_questions}</td>
                      <td className="px-6 py-4 text-gray-600">{exam.total_marks}</td>
                      <td className="px-6 py-4 text-gray-600">{exam.exam_set}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:text-blue-700 font-medium transition-colors" onClick={() => setSelectedExamId(exam.id)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">No recent examinations available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
