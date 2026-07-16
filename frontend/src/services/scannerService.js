import api from './api';

export const startScanner = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const getExamById = async (examId) => {
  const response = await api.get(`/exams/${examId}`);
  return response.data;
};

export const startScan = async (imageFile, examType) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('exam_type', examType);

  const response = await api.post('/scanner/start', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

