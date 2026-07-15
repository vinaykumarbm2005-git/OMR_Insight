import api from './api';

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (typeof error?.response?.data === 'string') {
    return error.response.data;
  }

  return error?.message || 'Unknown error';
};

export const createExam = async (examType, totalQuestions) => {
  const url = '/exams/';
  const payload = {
    exam_type: examType,
    total_questions: totalQuestions,
  };

  console.log('[CreateExam] Request URL:', `${api.defaults.baseURL}${url}`);
  console.log('[CreateExam] Request payload:', payload);

  try {
    const response = await api.post(url, payload);
    console.log('[CreateExam] Backend response body:', response.data);
    console.log('[CreateExam] Response status:', response.status);
    return response.data;
  } catch (error) {
    const status = error?.response?.status ?? 'n/a';
    const message = getErrorMessage(error);
    console.error('[CreateExam] Backend error message:', message);
    console.error('[CreateExam] Backend response body:', error?.response?.data ?? error);
    console.error('[CreateExam] Response status:', status);
    throw error;
  }
};

export const uploadAnswerKey = async (examId, file) => {
  const url = `/exams/${examId}/answer-key/upload`;
  const formData = new FormData();
  formData.append('answer_key', file);

  console.log('[UploadAnswerKey] Request URL:', `${api.defaults.baseURL}${url}`);
  console.log('[UploadAnswerKey] Received file object:', file);
  console.log('[UploadAnswerKey] Received file name:', file?.name);
  console.log('[UploadAnswerKey] Received file size:', file?.size);
  console.log('[UploadAnswerKey] Received file type:', file?.type);
  console.log('[UploadAnswerKey] File is File instance:', file instanceof File);
  console.log('[UploadAnswerKey] FormData entries before request:');
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await api.post(url, formData);
    console.log('[UploadAnswerKey] Backend response body:', response.data);
    console.log('[UploadAnswerKey] Response status:', response.status);
    return response.data;
  } catch (error) {
    const status = error?.response?.status ?? 'n/a';
    const message = getErrorMessage(error);
    console.error('[UploadAnswerKey] Backend error message:', message);
    console.error('[UploadAnswerKey] Backend response body:', error?.response?.data ?? error);
    console.error('[UploadAnswerKey] Response status:', status);
    throw error;
  }
};
