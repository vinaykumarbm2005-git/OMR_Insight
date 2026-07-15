import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { createExam, uploadAnswerKey } from '../services/examService';
import { studentService } from '../services/studentService';
import { 
  MdPeopleOutline, MdCheckCircle, MdCloudUpload, 
  MdFactCheck, MdOutlineLibraryBooks, MdOutlineCheck
} from 'react-icons/md';

const CreateExam = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    examType: '',
    numStudents: '',
  });

  const [answerKeyFile, setAnswerKeyFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [statusType, setStatusType] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [activeExamId, setActiveExamId] = useState('');
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');
  const [studentFormData, setStudentFormData] = useState({ name: '', roll_number: '' });
  const [studentFormError, setStudentFormError] = useState('');
  const [studentFormSuccess, setStudentFormSuccess] = useState('');
  const [submittingStudent, setSubmittingStudent] = useState(false);

  useEffect(() => {
    const storedExamId = localStorage.getItem('currentExamId');
    if (storedExamId) {
      setActiveExamId(String(storedExamId));
    }
  }, []);

  useEffect(() => {
    if (!activeExamId) {
      setStudents([]);
      return;
    }

    let isMounted = true;

    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        setStudentsError('');
        const response = await studentService.getStudents();

        if (isMounted) {
          const studentList = Array.isArray(response?.data) ? response.data : [];
          setStudents(studentList.filter(student => String(student.exam_id) === String(activeExamId)));
        }
      } catch (error) {
        if (isMounted) {
          setStudentsError('Unable to load students for this exam.');
        }
      } finally {
        if (isMounted) {
          setStudentsLoading(false);
        }
      }
    };

    fetchStudents();

    return () => {
      isMounted = false;
    };
  }, [activeExamId]);

  useEffect(() => {
    const requiredFields = [
      formData.examType,
      formData.numStudents
    ];

    const hasEmptyRequired = requiredFields.some(field => String(field).trim() === '');
    const hasFile = answerKeyFile !== null && totalQuestions > 0;
    const numbersAreValid = !isNaN(Number(formData.numStudents)) && Number(formData.numStudents) > 0;

    setIsValid(!hasEmptyRequired && numbersAreValid && hasFile);
  }, [formData, answerKeyFile, totalQuestions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const parseCsvRows = (text) => {
    const rows = [];
    let currentRow = [];
    let currentValue = '';
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];

      if (character === '"') {
        if (inQuotes && text[index + 1] === '"') {
          currentValue += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (character === ',' && !inQuotes) {
        currentRow.push(currentValue);
        currentValue = '';
      } else if ((character === '\n' || character === '\r') && !inQuotes) {
        if (character === '\r' && text[index + 1] === '\n') {
          index += 1;
        }

        currentRow.push(currentValue);
        if (currentRow.some(cell => cell.trim() !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentValue = '';
      } else {
        currentValue += character;
      }
    }

    if (currentValue.length > 0 || currentRow.length > 0) {
      currentRow.push(currentValue);
      if (currentRow.some(cell => cell.trim() !== '')) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  const readCsvQuestionCount = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const fileContent = event.target?.result;

          if (typeof fileContent !== 'string' || fileContent.trim() === '') {
            reject(new Error('The selected CSV file is empty.'));
            return;
          }

          const rows = parseCsvRows(fileContent);
          if (rows.length <= 1) {
            reject(new Error('The selected CSV file does not contain any question rows.'));
            return;
          }

          const header = rows[0].map(cell => cell.trim().toLowerCase());
          const requiredColumns = ['question_number', 'correct_answer', 'chapter', 'concept'];
          const missingColumns = requiredColumns.filter(column => !header.includes(column));

          if (missingColumns.length > 0) {
            reject(new Error('Invalid CSV format. Required columns: question_number, correct_answer, chapter, concept.'));
            return;
          }

          const questionRows = rows.slice(1).filter(row => row.some(cell => cell.trim() !== '')).length;

          if (questionRows <= 0) {
            reject(new Error('The selected CSV file does not contain any question rows.'));
            return;
          }

          resolve(questionRows);
        } catch (error) {
          reject(new Error('Unable to read the selected CSV file.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Unable to read the selected CSV file.'));
      };

      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const isCsvFile = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';

    if (!isCsvFile) {
      setAnswerKeyFile(null);
      setTotalQuestions(0);
      setStatusType('error');
      setStatusMessage('Please upload a valid CSV file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsUploading(true);
    setStatusType('idle');
    setStatusMessage('');

    try {
      const rowCount = await readCsvQuestionCount(file);
      setAnswerKeyFile(file);
      setTotalQuestions(rowCount);
      setStatusType('success');
      setStatusMessage(`Detected ${rowCount} question rows in the CSV.`);
    } catch (error) {
      setAnswerKeyFile(null);
      setTotalQuestions(0);
      setStatusType('error');
      setStatusMessage(error.message || 'Unable to read the selected CSV file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    setFormData({
      examType: '',
      numStudents: '',
    });
    setAnswerKeyFile(null);
    setTotalQuestions(0);
    setStatusType('idle');
    setStatusMessage('');
    setStudentFormData({ name: '', roll_number: '' });
    setStudentFormError('');
    setStudentFormSuccess('');
  };

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({ ...prev, [name]: value }));
    if (studentFormError) {
      setStudentFormError('');
    }
    if (studentFormSuccess) {
      setStudentFormSuccess('');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    if (!activeExamId) {
      setStudentFormError('Create or select an exam before adding students.');
      return;
    }

    const trimmedName = studentFormData.name.trim();
    const trimmedRollNumber = studentFormData.roll_number.trim();

    if (!trimmedName || !trimmedRollNumber) {
      setStudentFormError('Please enter both student name and roll number.');
      return;
    }

    try {
      setSubmittingStudent(true);
      setStudentFormError('');
      setStudentFormSuccess('');

      const response = await studentService.createStudent({
        name: trimmedName,
        roll_number: trimmedRollNumber,
        exam_id: Number(activeExamId),
      });

      if (response?.success) {
        setStudentFormSuccess('Student added successfully.');
        setStudentFormData({ name: '', roll_number: '' });

        const refreshed = await studentService.getStudents();
        const studentList = Array.isArray(refreshed?.data) ? refreshed.data : [];
        setStudents(studentList.filter(student => String(student.exam_id) === String(activeExamId)));
      } else {
        setStudentFormError(response?.message || 'Unable to add student.');
      }
    } catch (error) {
      const backendMessage = error?.response?.data?.message || 'Unable to add student.';
      setStudentFormError(backendMessage);
    } finally {
      setSubmittingStudent(false);
    }
  };

  const handleStartCamera = async () => {
    if (!isValid || !answerKeyFile) {
      return;
    }

    setIsSubmitting(true);
    setStatusType('loading');
    setStatusMessage('Creating exam and uploading answer key...');

    try {
      console.log('[CreateExamPage] answerKeyFile before upload:', answerKeyFile);
      console.log('[CreateExamPage] answerKeyFile.name:', answerKeyFile?.name);
      console.log('[CreateExamPage] answerKeyFile.size:', answerKeyFile?.size);
      console.log('[CreateExamPage] answerKeyFile is File instance:', answerKeyFile instanceof File);

      const questionCount = totalQuestions > 0 ? totalQuestions : await readCsvQuestionCount(answerKeyFile);
      setTotalQuestions(questionCount);

      const createResponse = await createExam(formData.examType, questionCount);
      if (!createResponse?.success) {
        throw new Error(createResponse?.message || 'Unable to create exam.');
      }

      const examId = createResponse.exam_id;
      console.log('[CreateExamPage] Create exam response:', createResponse);
      console.log('[CreateExamPage] examId received:', examId);

      if (!examId) {
        throw new Error('The server did not return an exam ID.');
      }

      localStorage.setItem('currentExamId', String(examId));
      setActiveExamId(String(examId));

      console.log('[CreateExamPage] Calling uploadAnswerKey with examId:', examId, 'file:', answerKeyFile);
      console.log('[CreateExamPage] uploadAnswerKey file is File instance:', answerKeyFile instanceof File);

      const uploadResponse = await uploadAnswerKey(examId, answerKeyFile);
      if (!uploadResponse?.success) {
        throw new Error(uploadResponse?.message || 'Answer key upload failed.');
      }

      setStatusType('success');
      setStatusMessage('Exam created and answer key uploaded successfully.');
      navigate(ROUTES.SCANNER, {
        state: {
          examId,
          title: createResponse?.title || `${formData.examType} Examination`,
          examType: formData.examType,
          totalQuestions: questionCount,
          totalStudents: Number(formData.numStudents),
        },
      });
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred.';
      console.error('[CreateExamPage] Upload failure response body:', error?.response?.data ?? error);
      setStatusType('error');
      setStatusMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const examTypeOptions = [
    { label: 'KCET', value: 'KCET' },
    { label: 'NEET', value: 'NEET' },
    { label: 'JEE', value: 'JEE' }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <PageHeader 
        title="Create Examination" 
        description="Configure examination details and upload the answer key." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center">
                <MdOutlineLibraryBooks className="mr-2 text-primary" /> Examination Configuration
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Exam Type <span className="text-red-500">*</span></label>
                  <Select 
                    name="examType" 
                    value={formData.examType} 
                    onChange={handleInputChange} 
                    options={examTypeOptions} 
                    placeholder="Select exam type" 
                    className="h-12 bg-gray-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Number of Students <span className="text-red-500">*</span></label>
                  <Input 
                    type="number" 
                    min="1" 
                    name="numStudents" 
                    value={formData.numStudents} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 100" 
                    className="h-12 bg-gray-50/50"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 mt-2">
                  <label className="text-sm font-semibold text-gray-900 block mb-2">Upload Answer Key <span className="text-red-500">*</span></label>
                  
                  <div className="w-full">
                    <input 
                      type="file" 
                      accept=".csv" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                    />
                    
                    {!answerKeyFile ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-colors group"
                      >
                        <div className="h-12 w-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <MdCloudUpload className="text-2xl" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">Click to upload answer key</p>
                        <p className="text-xs text-gray-500 mt-1">Only .csv files are supported</p>
                        
                        {isUploading && (
                          <div className="mt-4 flex items-center text-sm text-primary font-medium">
                            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></span>
                            Uploading...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full border border-green-200 bg-green-50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 shrink-0">
                            <MdFactCheck className="text-xl" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-baseline space-x-2">
                              <p className="text-sm font-semibold text-green-900 truncate max-w-[200px]">{answerKeyFile.name}</p>
                              <span className="text-xs text-green-600 font-medium">{formatFileSize(answerKeyFile.size)}</span>
                            </div>
                            <p className="text-xs text-green-700 mt-0.5 flex items-center">
                              <MdCheckCircle className="mr-1" /> {isSubmitting ? 'Creating exam...' : (statusType === 'error' ? 'Upload failed' : 'Uploaded successfully')}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-100 shrink-0 ml-2"
                          onClick={() => {
                            setAnswerKeyFile(null);
                            setTotalQuestions(0);
                            setStatusType('idle');
                            setStatusMessage('');
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {activeExamId && (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4 flex items-center">
                  <MdPeopleOutline className="mr-2 text-primary" /> Manage Students
                </h3>
                <p className="text-sm text-gray-600 mb-6">Add students for the current exam before starting the scanner.</p>

                <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                  <Input
                    name="name"
                    value={studentFormData.name}
                    onChange={handleStudentInputChange}
                    placeholder="Student Name"
                    className="h-12 bg-gray-50/50"
                  />
                  <Input
                    name="roll_number"
                    value={studentFormData.roll_number}
                    onChange={handleStudentInputChange}
                    placeholder="Roll Number"
                    className="h-12 bg-gray-50/50"
                  />
                  <Button type="submit" variant="primary" disabled={submittingStudent} className="h-12 whitespace-nowrap">
                    {submittingStudent ? 'Adding...' : 'Add Student'}
                  </Button>
                </form>

                {studentFormError && <p className="mt-3 text-sm text-red-600">{studentFormError}</p>}
                {studentFormSuccess && <p className="mt-3 text-sm text-green-600">{studentFormSuccess}</p>}

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Students for this exam</h4>
                  {studentsLoading ? (
                    <p className="text-sm text-gray-500">Loading students...</p>
                  ) : studentsError ? (
                    <p className="text-sm text-red-600">{studentsError}</p>
                  ) : students.length > 0 ? (
                    <ul className="space-y-2">
                      {students.map(student => (
                        <li key={student.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                          <span className="font-medium text-gray-900">{student.name}</span>
                          <span className="text-gray-500">{student.roll_number}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No students have been added for this exam yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button variant="ghost" onClick={() => navigate(ROUTES.DASHBOARD)}>Cancel</Button>
            <Button variant="secondary" onClick={handleReset}>Reset</Button>
            <Button 
              variant="primary" 
              onClick={handleStartCamera} 
              disabled={!isValid || isSubmitting}
              className="w-40 shadow-sm"
            >
              {isSubmitting ? 'Creating...' : 'Start Camera'}
            </Button>
          </div>

        </div>

        {/* Right Side: Sticky Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="bg-blue-50/50 border-blue-100 shadow-sm overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <MdFactCheck className="mr-2" /> Live Summary
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Exam Type</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formData.examType || <span className="text-gray-400 italic font-medium text-base">Not selected</span>}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    <MdPeopleOutline className="mr-1 text-sm" /> Number of Students
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formData.numStudents || <span className="text-gray-400 italic font-medium text-base">Not entered</span>}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Answer Key</p>
                  {answerKeyFile ? (
                    <div className="flex items-center text-green-700 font-semibold bg-green-100 px-3 py-2 rounded-lg text-sm w-max">
                      <MdOutlineCheck className="mr-1.5 text-lg" /> Uploaded
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 font-semibold bg-red-50 border border-red-100 px-3 py-2 rounded-lg text-sm w-max">
                      Missing CSV
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                  {isSubmitting ? (
                    <div className="flex items-center text-primary font-bold text-lg animate-in fade-in">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse mr-2"></div>
                      Creating Exam...
                    </div>
                  ) : statusType === 'success' ? (
                    <div className="flex items-center text-green-700 font-semibold bg-green-100 px-3 py-2 rounded-lg text-sm">
                      <MdOutlineCheck className="mr-1.5 text-lg" /> {statusMessage}
                    </div>
                  ) : statusType === 'error' ? (
                    <div className="flex items-center text-red-600 font-semibold bg-red-50 border border-red-100 px-3 py-2 rounded-lg text-sm">
                      {statusMessage}
                    </div>
                  ) : isValid ? (
                    <div className="flex items-center text-primary font-bold text-lg animate-in fade-in">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse mr-2"></div>
                      Ready for Scanning
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400 font-medium text-base">
                      Pending Configuration
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateExam;
