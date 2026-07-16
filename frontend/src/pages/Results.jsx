import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { PageHeader } from '../components/common/PageHeader';
import { SectionHeader } from '../components/common/SectionHeader';
import { Pagination } from '../components/common/Pagination';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table } from '../components/ui/Table';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import resultsData from '../data/results.json';
import { resultService } from '../services/resultService';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { 
  MdPeopleOutline, MdFactCheck, MdTrendingUp, MdTrendingDown, 
  MdAssessment, MdCheckCircleOutline, MdOutlineCancel, MdGpsFixed,
  MdDownload, MdPictureAsPdf, MdFilterList
} from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass, loading }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className={`h-1 w-full ${colorClass}`}></div>
    <CardContent className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{title}</p>
          {loading ? (
            <SkeletonLoader className="w-16 h-8" />
          ) : (
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{value}</h3>
          )}
        </div>
        <div className={`p-2.5 sm:p-3 rounded-lg ${colorClass.replace('bg-', 'bg-opacity-10 text-')}`}>
          <Icon className={`text-xl sm:text-2xl ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs sm:text-sm text-gray-500">
        {loading ? (
          <SkeletonLoader className="w-24 h-4" />
        ) : (
          <>
            <span className="font-semibold text-primary">Live Data</span>
            <span className="mx-1.5">•</span>
            <span>No comparative data available</span>
          </>
        )}
      </div>
    </CardContent>
  </Card>
);

const Results = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [students, setStudents] = useState([]);
  const [examDetails, setExamDetails] = useState(null);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    evaluated: 0,
    highestScore: 0,
    lowestScore: 0,
    averageScore: 0,
    passPercentage: 0,
    failedStudents: 0,
    accuracy: 99.9
  });
  const [leaderboards, setLeaderboards] = useState({
    top: [],
    bottom: []
  });
  const [error, setError] = useState('');

  const examId = localStorage.getItem('currentExamId');

  useEffect(() => {
    let isMounted = true;

    if (!examId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [resultsResponse, examResponse] = await Promise.all([
          resultService.getExamResults(examId),
          resultService.getExamById(examId)
        ]);

        if (!isMounted) return;

        const rawResults = resultsResponse?.success && Array.isArray(resultsResponse?.data)
          ? resultsResponse.data
          : (Array.isArray(resultsResponse) ? resultsResponse : (resultsResponse?.data || []));

        const totalQuestions = examResponse?.total_questions || 1;

        const sortedStudents = [...rawResults].sort((a, b) => b.score - a.score);

        const mappedStudents = sortedStudents.map((s, index) => {
          const percentage = Math.max(0, Math.round((s.score / totalQuestions) * 100));

          let status = 'Needs Improvement';
          if (percentage >= 90) status = 'Excellent';
          else if (percentage >= 60) status = 'Good';
          else if (percentage >= 50) status = 'Average';

          return {
            id: s.student_id,
            name: s.student_name,
            rollNumber: s.roll_number,
            score: s.score,
            percentage,
            correct: s.correct_answers,
            incorrect: s.incorrect_answers,
            unattempted: s.unattempted_questions,
            weakAreas: [],
            status,
            rank: index + 1
          };
        });

        const totalCount = mappedStudents.length;

        let highestRaw = 0;
        let lowestRaw = 0;
        let avgScorePct = 0;
        let passCount = 0;
        let failCount = 0;

        if (totalCount > 0) {
          const scores = mappedStudents.map(s => s.score);
          highestRaw = Math.max(...scores);
          lowestRaw = Math.min(...scores);

          const sumPercentages = mappedStudents.reduce((sum, s) => sum + s.percentage, 0);
          avgScorePct = parseFloat((sumPercentages / totalCount).toFixed(1));

          passCount = mappedStudents.filter(s => s.percentage >= 50).length;
          failCount = totalCount - passCount;
        }

        const calculatedPassPercent = totalCount > 0
          ? Math.round((passCount / totalCount) * 100)
          : 0;

        setStudents(mappedStudents);

        setExamDetails({
          name: examResponse?.title || 'Examination Results',
          type: examResponse?.exam_type || 'OMR Exam',
          date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
        });

        setSummary({
          totalStudents: totalCount,
          evaluated: totalCount,
          highestScore: highestRaw,
          lowestScore: lowestRaw,
          averageScore: avgScorePct,
          passPercentage: calculatedPassPercent,
          failedStudents: failCount,
          accuracy: 99.9
        });

        const leaderTop = mappedStudents.slice(0, 3).map((s, index) => ({
          rank: index + 1,
          name: s.name,
          score: s.score
        }));

        const leaderBottom = [...mappedStudents]
          .reverse()
          .slice(0, 3)
          .map((s, index) => ({
            rank: totalCount - index,
            name: s.name,
            score: s.score
          }));

        setLeaderboards({
          top: leaderTop,
          bottom: leaderBottom
        });

      } catch (err) {
        console.error('Error fetching exam results:', err);
        if (isMounted) {
          setError('Unable to load exam results. Please ensure the backend server is running and try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [examId]);

  const { charts, recentExams } = resultsData;

  // Filter logic
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Excellent': return <Badge variant="success">{status}</Badge>;
      case 'Good': return <Badge variant="primary" className="bg-blue-100 text-blue-800">{status}</Badge>;
      case 'Average': return <Badge variant="warning">{status}</Badge>;
      case 'Needs Improvement': return <Badge variant="danger">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const tableColumns = [
    { header: 'Rank', accessor: 'rank', className: 'w-16 text-center', cellClassName: 'text-center font-bold text-gray-900' },
    { header: 'Student Name', accessor: 'name', className: 'font-semibold' },
    { header: 'Roll Number', accessor: 'rollNumber', cellClassName: 'text-gray-500 text-xs' },
    { header: 'Score', accessor: 'score', cellClassName: 'font-semibold text-primary' },
    { header: '%', accessor: 'percentage', render: (row) => `${row.percentage}%` },
    { header: 'Correct', accessor: 'correct', cellClassName: 'text-green-600' },
    { header: 'Incorrect', accessor: 'incorrect', cellClassName: 'text-red-500' },
    { header: 'Unattempted', accessor: 'unattempted', cellClassName: 'text-gray-400' },
    { header: 'Weak Areas', accessor: 'weakAreas', render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.weakAreas.map((area, i) => <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{area}</span>)}
      </div>
    )},
    { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
    { header: 'Actions', accessor: 'actions', className: 'text-right', cellClassName: 'text-right', render: (row) => (
      <Button variant="ghost" size="sm" className="text-primary hover:bg-blue-50" onClick={() => navigate(`/student/${row.id}`)}>
        View Report
      </Button>
    )}
  ];

  if (!examId || (!loading && students.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto pb-10 space-y-6">
        <PageHeader 
          title="Results Dashboard" 
          description="Analyze examination performance and OMR evaluation statistics." 
        />
        <EmptyState 
          title={!examId ? "No Exam Selected" : "No Results Evaluated"}
          description={!examId 
            ? "Please create or select an exam first to inspect result statistics."
            : "No student evaluation results are available for this exam yet. Use the Scanner to start evaluating OMR sheets."
          }
          action={
            <Button onClick={() => navigate(!examId ? ROUTES.CREATE_EXAM : '/scanner')}>
              {!examId ? "Create Exam" : "Go to Scanner"}
            </Button>
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto pb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <PageHeader 
              title="Results Dashboard" 
              description="Analyze examination performance and OMR evaluation statistics." 
              className="mb-0"
            />
          </div>
        </div>
        <ErrorState 
          title="Failed to Load Results" 
          description={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeader 
            title="Results Dashboard" 
            description="Analyze examination performance and OMR evaluation statistics." 
            className="mb-0"
          />
          {!loading && examDetails && (
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{examDetails.name}</span>
              <span className="text-gray-300">•</span>
              <Badge variant="default">{examDetails.type}</Badge>
              <span className="text-gray-300">•</span>
              <span>{examDetails.date}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="bg-white"><MdPictureAsPdf className="mr-2 text-red-500" /> Export PDF</Button>
          <Button variant="secondary" className="bg-white"><MdDownload className="mr-2 text-green-600" /> Export CSV</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Students" value={summary.totalStudents} icon={MdPeopleOutline} trend="+2%" trendUp={true} colorClass="bg-blue-500" loading={loading} />
        <StatCard title="Evaluated" value={summary.evaluated} icon={MdFactCheck} trend="100%" trendUp={true} colorClass="bg-purple-500" loading={loading} />
        <StatCard title="Average Score" value={`${summary.averageScore}%`} icon={MdAssessment} trend="+4.2%" trendUp={true} colorClass="bg-indigo-500" loading={loading} />
        <StatCard title="Pass Percentage" value={`${summary.passPercentage}%`} icon={MdCheckCircleOutline} trend="+5%" trendUp={true} colorClass="bg-green-500" loading={loading} />
        <StatCard title="Highest Score" value={summary.highestScore} icon={MdTrendingUp} trend="+2 pts" trendUp={true} colorClass="bg-teal-500" loading={loading} />
        <StatCard title="Lowest Score" value={summary.lowestScore} icon={MdTrendingDown} trend="-5 pts" trendUp={false} colorClass="bg-orange-500" loading={loading} />
        <StatCard title="Failed Students" value={summary.failedStudents} icon={MdOutlineCancel} trend="-12%" trendUp={true} colorClass="bg-red-500" loading={loading} />
        <StatCard title="Accuracy" value={`${summary.accuracy}%`} icon={MdGpsFixed} trend="0%" trendUp={true} colorClass="bg-slate-700" loading={loading} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Distribution */}
        <Card className="lg:col-span-2 shadow-sm">
          <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Score Distribution</h3></div>
          <CardContent className="p-4 h-72">
            {loading ? <SkeletonLoader className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="range" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pass vs Fail (Donut/Pie) */}
        <Card className="shadow-sm">
          <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Pass vs Fail</h3></div>
          <CardContent className="p-4 h-72 flex flex-col items-center justify-center relative">
            {loading ? <SkeletonLoader className="w-48 h-48 rounded-full" /> : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={charts.passFail} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {charts.passFail.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-2xl font-bold text-gray-900">{summary.passPercentage}%</span>
                  <span className="text-xs text-gray-500">Passed</span>
                </div>
                <div className="flex justify-center space-x-4 mt-2">
                  {charts.passFail.map(item => (
                    <div key={item.name} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Average Score Trend (Line) */}
        <Card className="shadow-sm lg:col-span-1">
          <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Average Score Trend</h3></div>
          <CardContent className="p-4 h-64">
            {loading ? <SkeletonLoader className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="exam" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Subject-wise Performance (Area/Donut) -> Using Donut for Subject */}
        <Card className="shadow-sm lg:col-span-1">
          <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Subject Performance</h3></div>
          <CardContent className="p-4 h-64">
            {loading ? <SkeletonLoader className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.subjectPerformance} innerRadius={0} outerRadius={70} dataKey="score" nameKey="subject" stroke="#fff" strokeWidth={2}>
                    {charts.subjectPerformance.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Evaluation Progress (Area) */}
        <Card className="shadow-sm lg:col-span-1">
          <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Evaluation Progress</h3></div>
          <CardContent className="p-4 h-64">
            {loading ? <SkeletonLoader className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.progress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEval" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="evaluated" stroke="#10b981" fillOpacity={1} fill="url(#colorEval)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Result Table Area */}
        <div className="xl:col-span-3 space-y-4">
          <Card className="shadow-sm">
            <div className="p-4 border-b border-border bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-semibold text-text">Student Results</h3>
              
              {/* Quick Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Input 
                  placeholder="Search student or roll no..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full sm:w-64 h-9 bg-gray-50" 
                />
                <Button variant="secondary" className="h-9 whitespace-nowrap"><MdFilterList className="mr-2" /> Filters</Button>
              </div>
            </div>
            
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1,2,3,4,5].map(i => <SkeletonLoader key={i} className="w-full h-12" />)}
                </div>
              ) : paginatedStudents.length > 0 ? (
                <>
                  <Table columns={tableColumns} data={paginatedStudents} className="border-0 rounded-none shadow-none" rowKey="id" />
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    className="border-t border-gray-100"
                  />
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MdFactCheck className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-sm text-gray-500">We couldn't find any students matching your search criteria.</p>
                  <Button variant="ghost" className="mt-4 text-primary" onClick={() => setSearchTerm('')}>Clear Search</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Cards */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Top Performers */}
          <Card className="shadow-sm">
            <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Top Performers</h3></div>
            <CardContent className="p-0">
              {loading ? (
                 <div className="p-4 space-y-3">{[1,2,3].map(i => <SkeletonLoader key={i} className="w-full h-10" />)}</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {leaderboards.top.map((student) => (
                    <li key={student.rank} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold mr-3">
                          {student.rank}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.name}</span>
                      </div>
                      <span className="font-bold text-primary">{student.score}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Lowest Performers */}
          <Card className="shadow-sm">
            <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Needs Attention</h3></div>
            <CardContent className="p-0">
              {loading ? (
                 <div className="p-4 space-y-3">{[1,2,3].map(i => <SkeletonLoader key={i} className="w-full h-10" />)}</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {leaderboards.bottom.map((student) => (
                    <li key={student.rank} className="flex items-center justify-between p-4 hover:bg-red-50/30 transition-colors">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold mr-3">
                          {student.rank}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.name}</span>
                      </div>
                      <span className="font-bold text-red-500">{student.score}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent Exams */}
          <Card className="shadow-sm">
            <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text">Recent Exams</h3></div>
            <CardContent className="p-0">
              {loading ? (
                 <div className="p-4 space-y-3">{[1,2,3].map(i => <SkeletonLoader key={i} className="w-full h-12" />)}</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentExams.map((exam, i) => (
                    <li key={i} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold text-gray-900">{exam.name}</span>
                        <Badge variant="default" className="text-[10px]">{exam.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{exam.students} Students</span>
                        <span>Avg: <span className="font-semibold text-gray-900">{exam.average}</span></span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
};

export default Results;
