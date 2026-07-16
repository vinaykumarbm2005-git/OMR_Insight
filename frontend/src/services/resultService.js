import api from './api';

export const resultService = {
  getExamResults: async (examId) => {
    const response = await api.get(`/results/exam/${examId}`);
    return response.data;
  },

  getExamById: async (examId) => {
    const response = await api.get(`/exams/${examId}`);
    return response.data;
  },
  
  getStudentDetails: async (studentId) => {
    const response = await api.get(`/students/${studentId}/report`);
    return response.data;
  }
};

