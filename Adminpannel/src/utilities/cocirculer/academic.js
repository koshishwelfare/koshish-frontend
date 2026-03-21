import axios from 'axios';
import { toast } from 'react-toastify';

const headers = (cirToken) => {
  const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
  return {
    withCredentials: true,
    headers: hasJwt ? { authCociculertoken: cirToken } : {}
  };
};

const createAcademicSession = async (backendURL, cirToken, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/cocirculer/academic/session/add`, payload, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Session created');
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const listAcademicSessions = async (backendURL, cirToken) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/academic/sessions`, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return [];
    }
    return data.data || [];
  } catch (error) {
    toast.error(error.message);
    return [];
  }
};

const getAcademicSessionById = async (backendURL, cirToken, id) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/academic/session/${id}`, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const updateAcademicSessionById = async (backendURL, cirToken, id, payload) => {
  try {
    const { data } = await axios.patch(`${backendURL}/api/cocirculer/academic/session/update/${id}`, payload, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Session updated');
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const listAcademicMentors = async (backendURL, cirToken, sessionId) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/academic/mentors`, {
      ...headers(cirToken),
      params: sessionId ? { sessionId } : {}
    });
    if (!data.success) {
      toast.error(data.message);
      return [];
    }
    return data.data || [];
  } catch (error) {
    toast.error(error.message);
    return [];
  }
};

const createAcademicClass = async (backendURL, cirToken, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/cocirculer/academic/class/add`, payload, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Class created');
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const listAcademicClasses = async (backendURL, cirToken, sessionId) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/academic/classes`, {
      ...headers(cirToken),
      params: sessionId ? { sessionId } : {}
    });
    if (!data.success) {
      toast.error(data.message);
      return [];
    }
    return data.data || [];
  } catch (error) {
    toast.error(error.message);
    return [];
  }
};

const getAcademicClassById = async (backendURL, cirToken, id) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/academic/class/${id}`, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const updateAcademicClassById = async (backendURL, cirToken, id, payload) => {
  try {
    const { data } = await axios.patch(`${backendURL}/api/cocirculer/academic/class/update/${id}`, payload, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Class updated');
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getTeacherAttendanceDailyQr = async (backendURL, cirToken, date) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/attendance/teacher-qr`, {
      ...headers(cirToken),
      params: date ? { date } : {}
    });
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getTeacherAttendanceByDailyToken = async (backendURL, cirToken, query = {}) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/attendance/teacher-daily`, {
      ...headers(cirToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export {
  createAcademicSession,
  listAcademicSessions,
  getAcademicSessionById,
  updateAcademicSessionById,
  listAcademicMentors,
  createAcademicClass,
  listAcademicClasses,
  getAcademicClassById,
  updateAcademicClassById,
  getTeacherAttendanceDailyQr,
  getTeacherAttendanceByDailyToken
};
