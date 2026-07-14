import api from './api';

export const resultService = {
  getExamResults: async (examId, params = {}) => {
    // Example: return await api.get(`/exams/${examId}/results`, { params });
    console.log(`Fetching results for ${examId} with`, params);
    return new Promise(resolve => setTimeout(resolve, 500));
  },
  
  getStudentDetails: async (studentId) => {
    // Example: return await api.get(`/students/${studentId}/report`);
    console.log(`Fetching details for student ${studentId}`);
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};
