import axios from 'axios';

const authHeaders = (token) => ({
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
    authstudenttoken: token
  }
});

const studentListTests = async (backendURL, token, options = {}) => {
  const query = new URLSearchParams();
  if (options.q) query.set('q', options.q);
  if (options.page) query.set('page', String(options.page));
  if (options.limit) query.set('limit', String(options.limit));

  const { data } = await axios.get(`${backendURL}/api/user/student/test-series?${query.toString()}`, authHeaders(token));
  return data;
};

const studentGetTestById = async (backendURL, token, testId) => {
  const { data } = await axios.get(`${backendURL}/api/user/student/test-series/${testId}`, authHeaders(token));
  return data;
};

const studentSubmitTest = async (backendURL, token, testId, answers) => {
  const { data } = await axios.post(
    `${backendURL}/api/user/student/test-series/${testId}/submit`,
    { answers },
    authHeaders(token)
  );
  return data;
};

const studentGetAnswers = async (backendURL, token, testId) => {
  const { data } = await axios.get(`${backendURL}/api/user/student/test-series/${testId}/answers`, authHeaders(token));
  return data;
};

const studentGetLeaderboard = async (backendURL, token, testId) => {
  const { data } = await axios.get(`${backendURL}/api/user/student/test-series/${testId}/leaderboard`, authHeaders(token));
  return data;
};

const studentGetAttendance = async (backendURL, token) => {
  const { data } = await axios.get(`${backendURL}/api/user/student/attendance`, authHeaders(token));
  return data;
};

const studentGetDashboard = async (backendURL, token) => {
  const { data } = await axios.get(`${backendURL}/api/user/student/dashboard`, authHeaders(token));
  return data;
};

const studentGetAssignments = async (backendURL, token) => {
  const { data } = await axios.get(`${backendURL}/api/user/student/assignments`, authHeaders(token));
  return data;
};

export {
  studentListTests,
  studentGetTestById,
  studentSubmitTest,
  studentGetAnswers,
  studentGetLeaderboard,
  studentGetAttendance,
  studentGetDashboard,
  studentGetAssignments
};
