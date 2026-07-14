import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { 
  MdPeopleOutline, MdCheckCircle, MdCloudUpload, 
  MdFactCheck, MdOutlineLibraryBooks, MdOutlineCheck
} from 'react-icons/md';

const CreateExam = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    examType: '',
    numStudents: '',
  });

  const [answerKeyFile, setAnswerKeyFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation Logic
  useEffect(() => {
    const requiredFields = [
      formData.examType,
      formData.numStudents
    ];
    
    const hasEmptyRequired = requiredFields.some(field => String(field).trim() === '');
    const hasFile = answerKeyFile !== null;
    
    // Number validation
    const numbersAreValid = 
      !isNaN(Number(formData.numStudents)) && Number(formData.numStudents) > 0;

    setIsValid(!hasEmptyRequired && numbersAreValid && hasFile);
  }, [formData, answerKeyFile]);

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv')) {
      setIsUploading(true);
      // Simulate file upload delay
      setTimeout(() => {
        setAnswerKeyFile(file);
        setIsUploading(false);
      }, 800);
    } else {
      alert('Please upload a valid .csv file');
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setFormData({
      examType: '',
      numStudents: '',
    });
    setAnswerKeyFile(null);
  };

  const handleStartCamera = () => {
    if (isValid) {
      // Logic to save exam data can go here
      navigate(ROUTES.SCANNER);
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
                              <MdCheckCircle className="mr-1" /> Uploaded successfully
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-100 shrink-0 ml-2"
                          onClick={() => setAnswerKeyFile(null)}
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

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button variant="ghost" onClick={() => navigate(ROUTES.DASHBOARD)}>Cancel</Button>
            <Button variant="secondary" onClick={handleReset}>Reset</Button>
            <Button 
              variant="primary" 
              onClick={handleStartCamera} 
              disabled={!isValid}
              className="w-40 shadow-sm"
            >
              Start Camera
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
                  {isValid ? (
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
