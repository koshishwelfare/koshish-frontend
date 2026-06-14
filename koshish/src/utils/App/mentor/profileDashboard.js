import axios from 'axios';

const getCommonHeaders = ({ studentToken, teacherToken }) => {
  const headers = {};

  if (studentToken) {
    headers.Authorization = `Bearer ${studentToken}`;
    headers.authstudenttoken = studentToken;
  }

  if (teacherToken) {
    headers.authteachertoken = teacherToken;
  }

  return headers;
};

const getMemberProfileDashboard = async (backendURL, memberId, options = {}, tokens = {}) => {
  const query = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 10,
    activityTab: options.activityTab || 'all',
    q: options.q || '',
    filterBy: options.filterBy || 'all',
    sortBy: options.sortBy || 'date',
    sortOrder: options.sortOrder || 'desc'
  }).toString();

  const { data } = await axios.get(
    `${backendURL}/api/app/member/profile/${memberId}?${query}`,
    {
      withCredentials: true,
      headers: getCommonHeaders(tokens)
    }
  );

  return data;
};

const followTeacherProfile = async (backendURL, actorType, teacherId, token) => {
  const endpoint = actorType === 'teacher'
    ? `${backendURL}/api/teacher/follow/${teacherId}`
    : `${backendURL}/api/user/student/follow/${teacherId}`;

  const headers = {};
  if (actorType === 'teacher' && token) headers.authteachertoken = token;
  if (actorType === 'student' && token) {
    headers.Authorization = `Bearer ${token}`;
    headers.authstudenttoken = token;
  }

  const { data } = await axios.post(endpoint, {}, { withCredentials: true, headers });
  return data;
};

const unfollowTeacherProfile = async (backendURL, actorType, teacherId, token) => {
  const endpoint = actorType === 'teacher'
    ? `${backendURL}/api/teacher/follow/${teacherId}`
    : `${backendURL}/api/user/student/follow/${teacherId}`;

  const headers = {};
  if (actorType === 'teacher' && token) headers.authteachertoken = token;
  if (actorType === 'student' && token) {
    headers.Authorization = `Bearer ${token}`;
    headers.authstudenttoken = token;
  }

  const { data } = await axios.delete(endpoint, { withCredentials: true, headers });
  return data;
};

export {
  getMemberProfileDashboard,
  followTeacherProfile,
  unfollowTeacherProfile
};
