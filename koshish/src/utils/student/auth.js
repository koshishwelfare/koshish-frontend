import axios from 'axios';

const getAuthHeaders = (token) => ({
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
    authstudenttoken: token
  }
});

const registerStudent = async (backendURL, payload) => {
  const { data } = await axios.post(`${backendURL}/api/user/student/register`, payload, { withCredentials: true });
  return data;
};

const loginStudent = async (backendURL, payload) => {
  const { data } = await axios.post(`${backendURL}/api/user/student/login`, payload, { withCredentials: true });
  return data;
};

const recoverStudentCredentials = async (backendURL, payload) => {
  const { data } = await axios.post(`${backendURL}/api/user/student/recover-credentials`, payload, { withCredentials: true });
  return data;
};

const logoutStudent = async (backendURL, token) => {
  const { data } = await axios.post(`${backendURL}/api/user/student/logout`, {}, getAuthHeaders(token));
  return data;
};

const getStudentProfile = async (backendURL, token) => {
  const { data } = await axios.get(`${backendURL}/api/user/student/profile`, getAuthHeaders(token));
  return data;
};

const updateStudentProfile = async (backendURL, token, payload) => {
  const { data } = await axios.patch(
    `${backendURL}/api/user/student/profile`,
    payload,
    getAuthHeaders(token)
  );
  return data;
};

export {
  registerStudent,
  loginStudent,
  recoverStudentCredentials,
  logoutStudent,
  getStudentProfile,
  updateStudentProfile
};
