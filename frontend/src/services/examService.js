export const getExams = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};

export const createExam = async (examData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: examData });
    }, 500);
  });
};
