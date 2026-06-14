import axios from 'axios';
import { toast } from 'react-toastify';

const teacherHeaders = (token) => {
  const hasJwt = Boolean(token && token !== '__COOKIE_AUTH__');
  return {
    withCredentials: true,
    headers: hasJwt ? { authteachertoken: token } : {}
  };
};

const addTeacherTestSeries = async (backendURL, teaToken, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/test-series`, payload, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Test series added');
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getTeacherTestSeries = async (backendURL, teaToken) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/test-series`, teacherHeaders(teaToken));
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

const getTeacherStudents = async (backendURL, teaToken, classId = '') => {
  try {
    const safeClassId = typeof classId === 'string' ? classId.trim() : String(classId || '').trim();
    const { data } = await axios.get(`${backendURL}/api/teacher/students`, {
      ...teacherHeaders(teaToken),
      params: safeClassId ? { classId: safeClassId } : {}
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

const getTeacherStudentsList = async (backendURL, teaToken, query = {}) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/students/list`, {
      ...teacherHeaders(teaToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message);
      return {
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      };
    }
    return data.data || {
      records: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
    };
  }
};

const getTeacherStudentPerformance = async (backendURL, teaToken, studentId) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/students/performance/${studentId}`, teacherHeaders(teaToken));
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

const getTeacherClassOptions = async (backendURL, teaToken) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/classes/me`, teacherHeaders(teaToken));
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

const getTeacherProfile = async (backendURL, teaToken) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/profile`, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    return data.teacher || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const updateTeacherProfile = async (backendURL, teaToken, payload) => {
  try {
    const hasFile = payload?.image instanceof File;
    let body = payload;
    let config = teacherHeaders(teaToken);

    if (hasFile) {
      const formData = new FormData();
      Object.keys(payload || {}).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
          formData.append(key, payload[key]);
        }
      });
      body = formData;
      config = {
        ...config,
        headers: {
          ...(config.headers || {}),
          'Content-Type': 'multipart/form-data'
        }
      };
    }

    const { data } = await axios.patch(`${backendURL}/api/teacher/profile`, body, config);
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Profile updated successfully');
    return data.teacher || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const updateTeacherPassword = async (backendURL, teaToken, payload) => {
  try {
    const { data } = await axios.patch(`${backendURL}/api/teacher/profile/password`, payload, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return false;
    }
    toast.success(data.message || 'Password updated successfully');
    return true;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const markTeacherSelfAttendance = async (backendURL, teaToken, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/attendance/teacher/self-mark`, payload, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return false;
    }
    toast.success(data.message || 'Self attendance marked');
    return true;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const getTeacherSelfAttendance = async (backendURL, teaToken, query = {}) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/attendance/teacher`, {
      ...teacherHeaders(teaToken),
      params: query
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

const markStudentAttendance = async (backendURL, teaToken, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/attendance/mark`, payload, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return false;
    }
    return true;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const getStudentAttendanceList = async (backendURL, teaToken, query = {}) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/attendance/student`, {
      ...teacherHeaders(teaToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message);
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return data.data || {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

const saveDailyTeachingLog = async (backendURL, teaToken, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/daily-log`, payload, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Daily teaching log saved');
    return data.data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getDailyTeachingLogs = async (backendURL, teaToken, query = {}) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/daily-log`, {
      ...teacherHeaders(teaToken),
      params: query
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

const addTeacherStudent = async (backendURL, teaToken, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/students/add`, payload, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Student added');
    return data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const recoverTeacherCredentials = async (backendURL, email) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/credentials/recover/teacher`, { email }, { withCredentials: true });
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Credentials recovered');
    return data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const recoverStudentCredentials = async (backendURL, payload) => {
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/credentials/recover/student`, payload, { withCredentials: true });
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Credentials recovered');
    return data;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getTeacherClassCurriculum = async (backendURL, teaToken, classId) => {
  if (!classId) return null;
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/classes/${classId}/curriculum`, teacherHeaders(teaToken));
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

const addTeacherClassSubject = async (backendURL, teaToken, classId, payload) => {
  if (!classId) return null;
  try {
    const { data } = await axios.post(`${backendURL}/api/teacher/classes/${classId}/subjects`, payload, teacherHeaders(teaToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Subject added');
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const addTeacherClassChapter = async (backendURL, teaToken, classId, subjectId, payload) => {
  if (!classId || !subjectId) return null;
  try {
    const { data } = await axios.post(
      `${backendURL}/api/teacher/classes/${classId}/subjects/${subjectId}/chapters`,
      payload,
      teacherHeaders(teaToken)
    );
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Chapter added');
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const updateTeacherClassChapterTaught = async (backendURL, teaToken, classId, subjectId, chapterId, payload = {}) => {
  if (!classId || !subjectId || !chapterId) return null;
  try {
    const { data } = await axios.patch(
      `${backendURL}/api/teacher/classes/${classId}/subjects/${subjectId}/chapters/${chapterId}/taught`,
      payload,
      teacherHeaders(teaToken)
    );
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Chapter status updated');
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const getTeacherAvailableClassStudents = async (backendURL, teaToken, classId, query = {}) => {
  if (!classId) {
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
  try {
    const { data } = await axios.get(`${backendURL}/api/teacher/classes/${classId}/students/available`, {
      ...teacherHeaders(teaToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message);
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return data.data || {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

const assignTeacherStudentsToClass = async (backendURL, teaToken, classId, payload = {}) => {
  if (!classId) return null;
  try {
    const { data } = await axios.post(
      `${backendURL}/api/teacher/classes/${classId}/students/assign`,
      payload,
      teacherHeaders(teaToken)
    );
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    toast.success(data.message || 'Students assigned successfully');
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export {
  addTeacherTestSeries,
  getTeacherTestSeries,
  getTeacherClassOptions,
  getTeacherProfile,
  updateTeacherProfile,
  updateTeacherPassword,
  getTeacherStudents,
  getTeacherStudentsList,
  getTeacherStudentPerformance,
  markTeacherSelfAttendance,
  getTeacherSelfAttendance,
  markStudentAttendance,
  getStudentAttendanceList,
  saveDailyTeachingLog,
  getDailyTeachingLogs,
  addTeacherStudent,
  recoverTeacherCredentials,
  recoverStudentCredentials,
  getTeacherClassCurriculum,
  addTeacherClassSubject,
  addTeacherClassChapter,
  updateTeacherClassChapterTaught,
  getTeacherAvailableClassStudents,
  assignTeacherStudentsToClass
};
