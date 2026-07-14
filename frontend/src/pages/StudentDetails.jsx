import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Button, cn } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Table } from '../components/ui/Table';
import studentsData from '../data/students.json';
import { 
  MdArrowBack, MdChevronLeft, MdChevronRight, MdFileDownload, 
  MdPrint, MdCheckCircle, MdCancel, MdOutlineRemoveCircleOutline,
  MdGpsFixed, MdAccessTime, MdVerified, MdInfoOutline, MdWarningAmber
} from 'react-icons/md';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';

const CircularProgress = ({ value, size = 120, strokeWidth = 10, colorClass = "text-primary" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle 
          cx={size / 2} cy={size / 2} r={radius} 
          stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" 
          className="text-gray-100" 
        />
        <circle 
          cx={size / 2} cy={size / 2} r={radius} 
          stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" 
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
          className={cn("transition-all duration-1000 ease-out", colorClass)} 
          strokeLinecap="round" 
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="shadow-sm border border-gray-100">
    <CardContent className="p-4 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${colorClass.replace('bg-', 'bg-opacity-15 text-')}`}>
        <Icon className={`text-2xl ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('correct');

  // Fallback to STU001 if id not found (since we only have dummy data for STU001)
  const student = studentsData[id] || studentsData['STU001'];

  if (!student) {
    return <div className="p-10 text-center">Student not found</div>;
  }

  const { profile, analytics, charts, correctAnswers, incorrectAnswers, weakAreas, scanDetails, summary } = student;

  const correctColumns = [
    { header: 'Question', accessor: 'question', className: 'font-semibold' },
    { header: 'Selected Option', accessor: 'selected', cellClassName: 'font-medium' },
    { header: 'Correct Option', accessor: 'correct', cellClassName: 'text-green-600 font-bold' },
    { header: 'Marks Awarded', accessor: 'marks', cellClassName: 'text-green-600 font-bold' }
  ];

  const incorrectColumns = [
    { header: 'Question', accessor: 'question', className: 'font-semibold' },
    { header: 'Selected Answer', accessor: 'selected', cellClassName: 'text-red-500 font-bold' },
    { header: 'Correct Answer', accessor: 'correct', cellClassName: 'text-green-600 font-bold' },
    { header: 'Negative Marks', accessor: 'negativeMarks', cellClassName: 'text-red-500 font-bold' }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-6">
      
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="p-2 bg-white shadow-sm border border-border" onClick={() => navigate(ROUTES.RESULTS)}>
            <MdArrowBack className="text-lg" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Performance Report</h1>
            <p className="text-sm text-gray-500">Detailed OMR evaluation, performance analysis, and weak area insights.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" className="bg-white"><MdChevronLeft className="mr-1" /> Prev</Button>
          <Button variant="secondary" className="bg-white">Next <MdChevronRight className="ml-1" /></Button>
          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>
          <Button variant="secondary" className="bg-white"><MdFileDownload className="mr-2 text-primary" /> PDF</Button>
          <Button variant="secondary" className="bg-white"><MdPrint className="mr-2 text-gray-600" /> Print</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Student Profile */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <Card className="shadow-sm border-t-4 border-t-primary flex-1">
            <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
              
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full border-4 border-white shadow-md flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">{profile.name.charAt(0)}</span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full mt-2 mb-6">{profile.rollNumber}</p>
              
              <div className="w-full text-left space-y-3 mb-8 pb-6 border-b border-gray-100">
                <div className="flex justify-between"><span className="text-sm text-gray-500">Exam</span><span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{profile.examName}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Type</span><span className="text-sm font-semibold text-gray-900">{profile.examType}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Date</span><span className="text-sm font-semibold text-gray-900">{profile.date}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-500">Status</span><Badge variant={profile.pass ? 'success' : 'danger'}>{profile.pass ? 'Pass' : 'Fail'}</Badge></div>
              </div>

              <div className="flex justify-center mb-6">
                <CircularProgress value={profile.percentage} colorClass={profile.pass ? 'text-green-500' : 'text-red-500'} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Score</p>
                  <p className="text-xl font-bold text-primary">{profile.overallScore} <span className="text-sm text-gray-400 font-normal">/ {profile.maxScore}</span></p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
                  <p className="text-xs text-yellow-600 uppercase tracking-wider mb-1">Rank</p>
                  <p className="text-xl font-bold text-yellow-700">#{profile.rank}</p>
                </div>
              </div>
              
            </CardContent>
          </Card>

          {/* Performance Summary Insight */}
          <Card className="shadow-sm border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><MdInfoOutline className="text-6xl text-primary" /></div>
            <CardContent className="p-6 relative z-10">
              <h3 className="font-bold text-primary mb-4 flex items-center">Performance Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Insight</p>
                  <p className="text-sm font-medium text-gray-900">{summary.insight}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Strongest</p>
                    <p className="text-sm font-medium text-green-700">{summary.strongest}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Weakest</p>
                    <p className="text-sm font-medium text-red-600">{summary.weakest}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-100">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Recommendation</p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{summary.recommendation}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: Analytics */}
        <div className="lg:col-span-8 flex flex-col space-y-6 min-h-0">
          
          {/* Top Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard title="Correct Answers" value={analytics.correct} icon={MdCheckCircle} colorClass="bg-green-500" />
            <StatCard title="Incorrect Answers" value={analytics.incorrect} icon={MdCancel} colorClass="bg-red-500" />
            <StatCard title="Unattempted" value={analytics.unattempted} icon={MdOutlineRemoveCircleOutline} colorClass="bg-gray-500" />
            <StatCard title="Accuracy" value={`${analytics.accuracy}%`} icon={MdGpsFixed} colorClass="bg-blue-500" />
            <StatCard title="Time Taken" value={analytics.timeTaken} icon={MdAccessTime} colorClass="bg-orange-500" />
            <StatCard title="Evaluation Status" value={analytics.evaluationStatus} icon={MdVerified} colorClass="bg-teal-500" />
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text text-sm">Subject-wise Performance</h3></div>
              <CardContent className="p-4 h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={charts.radar}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text text-sm">Correct vs Incorrect</h3></div>
              <CardContent className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.bar} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="correct" name="Correct" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={30} />
                    <Bar dataKey="incorrect" name="Incorrect" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text text-sm">Question Attempt Ratio</h3></div>
              <CardContent className="p-4 h-56 flex flex-col items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={charts.donut} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {charts.donut.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-2xl font-bold text-gray-900">{analytics.correct + analytics.incorrect}</span>
                  <span className="text-xs text-gray-500">Attempted</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <div className="p-4 border-b border-border bg-white"><h3 className="font-semibold text-text text-sm">Performance Trend</h3></div>
              <CardContent className="p-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.line} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="exam" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Modern Tabs Section */}
          <Card className="shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="border-b border-border bg-gray-50/50 flex overflow-x-auto custom-scrollbar shrink-0">
              {[
                { id: 'correct', label: 'Correct Answers', count: analytics.correct },
                { id: 'incorrect', label: 'Incorrect Answers', count: analytics.incorrect },
                { id: 'weak', label: 'Weak Areas', count: weakAreas.length },
                { id: 'scan', label: 'Scan Details', count: null }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center",
                    activeTab === tab.id 
                      ? "border-primary text-primary bg-white" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={cn(
                      "ml-2 py-0.5 px-2 rounded-full text-[10px]",
                      activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"
                    )}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
            
            <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar bg-white">
              {activeTab === 'correct' && (
                <Table columns={correctColumns} data={correctAnswers} className="border-0 rounded-none shadow-none" rowKey="id" />
              )}
              
              {activeTab === 'incorrect' && (
                <Table columns={incorrectColumns} data={incorrectAnswers} className="border-0 rounded-none shadow-none" rowKey="id" />
              )}

              {activeTab === 'weak' && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weakAreas.map((area, i) => (
                    <div key={i} className="border border-red-100 bg-red-50/30 rounded-xl p-5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge className="bg-red-100 text-red-800 mb-2">{area.subject}</Badge>
                          <h4 className="font-bold text-gray-900">{area.topic}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 uppercase font-medium">Accuracy</span>
                          <p className="text-lg font-bold text-red-600">{area.accuracy}%</p>
                        </div>
                      </div>
                      <ProgressBar value={area.accuracy} className="h-2 bg-red-100 mb-4" />
                      <div className="flex items-start bg-white p-3 rounded-lg border border-red-100">
                        <MdWarningAmber className="text-red-500 mt-0.5 mr-2 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-0.5">Suggestions</p>
                          <p className="text-xs text-gray-600">{area.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'scan' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(scanDetails).map(([key, value]) => (
                      <div key={key} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-md h-48 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-col">
                      <MdPictureAsPdf className="text-4xl text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-500">View Scanned OMR Sheet</p>
                      <Button variant="secondary" size="sm" className="mt-3">Open Image</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
