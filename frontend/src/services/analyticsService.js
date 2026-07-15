import api from './api';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getExams: async () => {
    const response = await api.get('/exams/');
    return response.data;
  },

  getExamSummary: async (examId) => {
    const response = await api.get(`/analytics/exams/${examId}`);
    return response.data;
  },
};
