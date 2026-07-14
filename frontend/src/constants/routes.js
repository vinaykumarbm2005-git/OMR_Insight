export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CREATE_EXAM: '/exam',
  SCANNER: '/scanner',
  RESULTS: '/results',
  STUDENT_DETAILS: (id = ':id') => `/student/${id}`,
};
