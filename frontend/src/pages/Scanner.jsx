import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Table } from '../components/ui/Table';
import scannerData from '../data/scanner.json';
import { 
  MdOutlineVideocam, MdPlayArrow, MdPause, MdStop, MdRefresh,
  MdCheckCircle, MdInfoOutline, MdCheckCircleOutline,
  MdOutlineLibraryBooks, MdPeopleOutline, MdAssessment
} from 'react-icons/md';
import { cn } from '../components/ui/Button';

const Scanner = () => {
  // Scanner States: 'waiting' | 'scanning' | 'paused' | 'completed' | 'stopped'
  const [scannerState, setScannerState] = useState('waiting');
  
  // Progress State
  const [scannedCount, setScannedCount] = useState(0);
  const [currentStudent, setCurrentStudent] = useState(null);
  
  // Logs & Activity
  const [logs, setLogs] = useState(scannerData.logs);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const totalStudents = scannerData.examInfo.totalStudents;
  const progressPercentage = Math.round((scannedCount / totalStudents) * 100);
  
  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulation Logic
  useEffect(() => {
    let interval;
    if (scannerState === 'scanning' && scannedCount < totalStudents) {
      interval = setInterval(() => {
        setScannedCount(prev => {
          const nextCount = prev + 1;
          
          // Add a dummy student evaluation every few scans
          if (nextCount <= scannerData.students.length) {
            const student = scannerData.students[nextCount - 1];
            setCurrentStudent(student);
            
            setRecentActivity(curr => [
              { ...student, time: new Date().toLocaleTimeString(), evalStatus: 'Success' },
              ...curr
            ].slice(0, 10)); // Keep last 10
            
            addLog(`Student ${student.rollNumber} (${student.name}) Evaluated.`);
          } else {
             // Generate random student after dummy data is exhausted
             const randomRoll = `RN-${String(nextCount).padStart(3, '0')}`;
             setCurrentStudent({ name: `Student ${nextCount}`, rollNumber: randomRoll, status: 'Scanning...' });
             addLog(`Sheet #${nextCount} Evaluated.`);
          }

          if (nextCount >= totalStudents) {
            setScannerState('completed');
            addLog('Scanning Completed. All sheets evaluated.');
          }
          
          return nextCount;
        });
      }, 1500); // 1.5s per sheet
    }
    
    return () => clearInterval(interval);
  }, [scannerState, scannedCount, totalStudents]);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, event: message }, ...prev]); // Prepend for terminal style (newest top)
  };

  // Actions
  const handleStart = () => {
    setScannerState('scanning');
    if (scannedCount === 0) addLog('Scanner Started. Capturing...');
    else addLog('Scanner Resumed.');
  };

  const handlePause = () => {
    setScannerState('paused');
    addLog('Scanner Paused.');
  };

  const handleStop = () => {
    setScannerState('stopped');
    addLog('Scanner Stopped by user.');
  };

  const handleReset = () => {
    setScannerState('waiting');
    setScannedCount(0);
    setCurrentStudent(null);
    setRecentActivity([]);
    setLogs(scannerData.logs);
    addLog('Scanner Reset. Waiting for Camera...');
  };

  // Status Badge Helper
  const getStatusBadge = () => {
    switch (scannerState) {
      case 'scanning': return <Badge className="bg-green-100 text-green-800 animate-pulse border border-green-200"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 inline-block"></span> Scanning</Badge>;
      case 'paused': return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Paused</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Completed</Badge>;
      case 'stopped': return <Badge className="bg-red-100 text-red-800 border border-red-200">Stopped</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Waiting</Badge>;
    }
  };

  const tableColumns = [
    { header: 'Student', accessor: 'name', className: 'w-1/3' },
    { header: 'Roll Number', accessor: 'rollNumber' },
    { header: 'Score', accessor: 'score', render: (row) => row.score ? <span className="font-semibold text-gray-900">{row.score}</span> : '-' },
    { header: 'Result', accessor: 'result', render: (row) => (
      row.result ? <Badge variant={row.result === 'Pass' ? 'success' : 'danger'}>{row.result}</Badge> : <span className="text-gray-400">Processing...</span>
    )},
    { header: 'Time', accessor: 'time', className: 'text-right', cellClassName: 'text-right text-gray-500' },
  ];

  const { examInfo, config } = scannerData;

  return (
    <div className="max-w-7xl mx-auto pb-10 flex flex-col h-[calc(100vh-64px)]">
      
      <div className="flex justify-between items-end mb-4 shrink-0">
        <PageHeader 
          title="Live OMR Scanner" 
          description="Monitor and evaluate OMR sheets in real time." 
          className="mb-0"
        />
        <div className="hidden sm:flex items-center space-x-4">
          <p className="text-sm font-medium text-gray-500">{new Date().toLocaleString()}</p>
          {getStatusBadge()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Panel: Info & Config (3 cols) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
          <Card className="shadow-sm">
            <div className="p-4 border-b border-border bg-gray-50/50">
              <h3 className="font-semibold text-text flex items-center">
                <MdOutlineLibraryBooks className="mr-2 text-primary" /> Exam Information
              </h3>
            </div>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Exam Name</span><span className="font-semibold text-gray-900 truncate max-w-[120px]">{examInfo.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium text-gray-900">{examInfo.type}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Students</span><span className="font-medium text-gray-900">{examInfo.totalStudents}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Questions</span><span className="font-medium text-gray-900">{examInfo.questions}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Mode</span><span className="font-medium text-gray-900">{examInfo.scannerMode}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Started</span><span className="font-medium text-gray-900">{examInfo.startedTime}</span></div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <div className="p-4 border-b border-border bg-gray-50/50">
              <h3 className="font-semibold text-text flex items-center">
                <MdCheckCircleOutline className="mr-2 text-primary" /> Configuration
              </h3>
            </div>
            <CardContent className="p-4 space-y-3">
              {Object.entries(config).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <MdCheckCircle className="text-green-500 text-lg" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Panel: Camera & Progress (6 cols) */}
        <div className="lg:col-span-6 flex flex-col min-h-0 space-y-4">
          
          {/* Camera Preview */}
          <div className={cn(
            "relative w-full aspect-video bg-gray-900 rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center transition-all duration-300",
            scannerState === 'scanning' ? "ring-4 ring-primary/50 shadow-blue-900/20 shadow-xl" : ""
          )}>
            {scannerState === 'waiting' || scannerState === 'stopped' ? (
              <div className="text-center p-6 animate-in fade-in duration-500">
                <div className="mx-auto h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
                  <MdOutlineVideocam className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Waiting for Camera</h3>
                <p className="text-sm text-gray-400 mb-6">Start the scanner to connect to the webcam and begin evaluation.</p>
                {scannerState === 'waiting' && (
                  <Button onClick={handleStart} variant="primary" className="bg-blue-600 hover:bg-blue-700 border-none">
                    <MdOutlineVideocam className="mr-2" /> Open Camera
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Simulated Camera Feed Overlay */}
                <div className="absolute inset-0 border-2 border-primary/30 m-8 rounded-lg pointer-events-none flex items-center justify-center">
                  <div className="w-[100px] h-[100px] border-t-2 border-l-2 border-primary absolute top-0 left-0"></div>
                  <div className="w-[100px] h-[100px] border-t-2 border-r-2 border-primary absolute top-0 right-0"></div>
                  <div className="w-[100px] h-[100px] border-b-2 border-l-2 border-primary absolute bottom-0 left-0"></div>
                  <div className="w-[100px] h-[100px] border-b-2 border-r-2 border-primary absolute bottom-0 right-0"></div>
                  
                  {/* Scanning Line Animation */}
                  {scannerState === 'scanning' && (
                    <div className="w-full h-0.5 bg-primary/80 absolute shadow-[0_0_8px_2px_rgba(37,99,235,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                  )}
                </div>
                
                <div className="absolute top-4 left-4 flex space-x-2">
                  <div className="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs font-semibold text-white flex items-center">
                    <span className={cn("w-2 h-2 rounded-full mr-2", scannerState === 'scanning' ? "bg-red-500 animate-pulse" : "bg-yellow-500")}></span>
                    {scannerState === 'scanning' ? 'LIVE' : 'PAUSED'}
                  </div>
                  <div className="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs font-semibold text-white">
                    1080p • 60fps
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-4">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h4 className="text-sm font-semibold text-text">Scanning Progress</h4>
                <p className="text-xs text-gray-500">{scannedCount} / {totalStudents} Sheets Evaluated</p>
              </div>
              <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
            </div>
            <ProgressBar value={progressPercentage} className="h-3 bg-gray-100" />
            
            {/* Current Student Mini Card */}
            {currentStudent && scannerState !== 'waiting' && scannerState !== 'stopped' && (
              <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between animate-in slide-in-from-bottom-2">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white rounded-md shadow-sm flex items-center justify-center border border-gray-100">
                    <MdPeopleOutline className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Currently Evaluating</p>
                    <p className="text-sm font-semibold text-gray-900">{currentStudent.name} <span className="text-gray-400 font-normal">({currentStudent.rollNumber})</span></p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 animate-pulse">Processing...</Badge>
              </div>
            )}
          </div>

          {/* Recent Activity Table */}
          <div className="flex-1 min-h-0 flex flex-col bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-gray-50/50 shrink-0">
              <h3 className="font-semibold text-sm text-text">Recent Scan Activity</h3>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-2">
               <Table columns={tableColumns} data={recentActivity} className="border-0 shadow-none" rowKey="rollNumber" />
            </div>
          </div>

        </div>

        {/* Right Panel: Stats & Logs (3 cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-6 min-h-0">
          
          {/* Live Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white p-3 rounded-xl border border-border shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Scanned</p>
              <p className="text-xl font-bold text-gray-900">{scannedCount}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Remaining</p>
              <p className="text-xl font-bold text-gray-900">{totalStudents - scannedCount}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Avg Speed</p>
              <p className="text-xl font-bold text-gray-900">1.5<span className="text-xs font-normal text-gray-500 ml-1">s/sheet</span></p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-border shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Accuracy</p>
              <p className="text-xl font-bold text-green-600">99.8%</p>
            </div>
          </div>

          {/* Live Event Log Terminal */}
          <div className="flex-1 min-h-0 flex flex-col bg-[#0f172a] rounded-xl shadow-md overflow-hidden border border-gray-800">
            <div className="p-3 border-b border-gray-800 bg-[#1e293b] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <MdInfoOutline className="text-gray-400" />
                <h3 className="font-semibold text-xs text-gray-300 uppercase tracking-wider">Live Event Log</h3>
              </div>
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs flex flex-col-reverse custom-scrollbar">
              <div ref={logsEndRef} />
              {logs.map((log, i) => (
                <div key={i} className="mb-2 last:mb-0 leading-relaxed text-gray-300 break-words hover:bg-white/5 p-1 rounded transition-colors">
                  <span className="text-blue-400 font-semibold mr-3 shrink-0">[{log.time}]</span>
                  <span className={log.event.includes('Completed') ? 'text-green-400' : log.event.includes('Error') ? 'text-red-400' : ''}>
                    {log.event}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="mt-4 shrink-0 bg-white border border-border rounded-xl p-4 shadow-sm flex items-center justify-between lg:justify-center lg:space-x-4 overflow-x-auto">
        <Button 
          variant="primary" 
          onClick={handleStart} 
          disabled={scannerState === 'scanning' || scannerState === 'completed'}
          className={cn("w-32", scannerState === 'scanning' ? 'opacity-50' : '')}
        >
          <MdPlayArrow className="mr-2 text-lg" /> 
          {scannerState === 'paused' ? 'Resume' : 'Start'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={handlePause} 
          disabled={scannerState !== 'scanning'}
          className="w-32"
        >
          <MdPause className="mr-2 text-lg" /> Pause
        </Button>
        <Button 
          variant="danger" 
          onClick={handleStop} 
          disabled={scannerState === 'waiting' || scannerState === 'completed' || scannerState === 'stopped'}
          className="w-32"
        >
          <MdStop className="mr-2 text-lg" /> Stop
        </Button>
        <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>
        <Button 
          variant="ghost" 
          onClick={handleReset} 
          disabled={scannerState === 'waiting'}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-32"
        >
          <MdRefresh className="mr-2 text-lg" /> Reset
        </Button>
      </div>

    </div>
  );
};

export default Scanner;
