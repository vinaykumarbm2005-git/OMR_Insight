export const getStudent = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John Doe', rollNumber: '101' });
    }, 500);
  });
};

export const getStudents = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};
