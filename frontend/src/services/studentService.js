import api from './api';

export const studentService = {
  createStudent: async (studentData) => {
    const response = await api.post('/students/', studentData);
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get('/students/');
    return response.data;
  },

  getStudentReport: async (studentId) => {
    const response = await api.get(`/students/${studentId}/report`);
    return response.data;
  },
};

