import { createContext, useState } from "react";
import {
  addTeacherClassChapter,
  addTeacherClassSubject,
  assignTeacherStudentsToClass,
  addTeacherStudent,
  getTeacherClassCurriculum,
  getTeacherAvailableClassStudents,
  addTeacherTestSeries,
  getDailyTeachingLogs,
  getTeacherClassOptions,
  getTeacherProfile,
  getTeacherStudents,
  getTeacherStudentsList,
  getTeacherStudentPerformance,
  getStudentAttendanceList,
  getTeacherTestSeries,
  getTeacherSelfAttendance,
  markStudentAttendance,
  markTeacherSelfAttendance,
  recoverStudentCredentials,
  recoverTeacherCredentials,
  saveDailyTeachingLog,
  updateTeacherClassChapterTaught,
  updateTeacherPassword,
  updateTeacherProfile
} from "../utilities/teacher/testAndAttendance";

export const TeacherContext = createContext(1);

const TeacherContextProvider = (props) => {
  const [teaToken, setTeaToken] = useState(localStorage.getItem('teaToken') || false);
  const [teacherTests, setTeacherTests] = useState([]);
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [teacherDailyLogs, setTeacherDailyLogs] = useState([]);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [teacherStudentsListing, setTeacherStudentsListing] = useState({
    records: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
  });
  const [teacherSelfAttendances, setTeacherSelfAttendances] = useState([]);
  const [teacherStudentAttendanceListing, setTeacherStudentAttendanceListing] = useState({
    records: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
  });
  const [selectedStudentPerformance, setSelectedStudentPerformance] = useState(null);
  const [teacherClassCurriculum, setTeacherClassCurriculum] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleAddTestSeries = async (payload) => {
    const created = await addTeacherTestSeries(backendURL, teaToken, payload);
    if (created) {
      await handleGetTestSeries();
    }
  };

  const handleGetTestSeries = async () => {
    const data = await getTeacherTestSeries(backendURL, teaToken);
    setTeacherTests(data);
  };

  const handleGetStudents = async (classId = '') => {
    const data = await getTeacherStudents(backendURL, teaToken, classId);
    setTeacherStudents(data);
    return data;
  };

  const handleGetStudentsList = async (query = {}) => {
    const data = await getTeacherStudentsList(backendURL, teaToken, query);
    setTeacherStudentsListing(data);
    return data;
  };

  const handleGetTeacherClasses = async () => {
    const data = await getTeacherClassOptions(backendURL, teaToken);
    setTeacherClasses(data);
    return data;
  };

  const handleGetTeacherProfile = async () => {
    const data = await getTeacherProfile(backendURL, teaToken);
    setTeacherProfile(data);
    return data;
  };

  const handleUpdateTeacherProfile = async (payload) => {
    const data = await updateTeacherProfile(backendURL, teaToken, payload);
    if (data) {
      setTeacherProfile(data);
    }
    return data;
  };

  const handleUpdateTeacherPassword = async (payload) => {
    return await updateTeacherPassword(backendURL, teaToken, payload);
  };

  const handleMarkSelfAttendance = async (payload) => {
    return await markTeacherSelfAttendance(backendURL, teaToken, payload);
  };

  const handleGetTeacherSelfAttendance = async (query = {}) => {
    const data = await getTeacherSelfAttendance(backendURL, teaToken, query);
    setTeacherSelfAttendances(data);
    return data;
  };

  const handleMarkStudentAttendance = async (payload) => {
    return await markStudentAttendance(backendURL, teaToken, payload);
  };

  const handleGetStudentAttendanceList = async (query = {}) => {
    const data = await getStudentAttendanceList(backendURL, teaToken, query);
    setTeacherStudentAttendanceListing(data);
    return data;
  };

  const handleGetStudentPerformance = async (studentId) => {
    const data = await getTeacherStudentPerformance(backendURL, teaToken, studentId);
    setSelectedStudentPerformance(data);
    return data;
  };

  const handleAddStudent = async (payload) => {
    const created = await addTeacherStudent(backendURL, teaToken, payload);
    if (created) {
      await handleGetStudents();
      await handleGetStudentsList();
    }
    return created;
  };

  const handleRecoverTeacherCredentials = async (email) => {
    return await recoverTeacherCredentials(backendURL, email);
  };

  const handleRecoverStudentCredentials = async (payload) => {
    return await recoverStudentCredentials(backendURL, payload);
  };

  const handleSaveDailyTeachingLog = async (payload) => {
    const data = await saveDailyTeachingLog(backendURL, teaToken, payload);
    if (data) {
      await handleGetDailyTeachingLogs();
    }
    return data;
  };

  const handleGetDailyTeachingLogs = async (query = {}) => {
    const data = await getDailyTeachingLogs(backendURL, teaToken, query);
    setTeacherDailyLogs(data);
    return data;
  };

  const handleGetClassCurriculum = async (classId) => {
    const data = await getTeacherClassCurriculum(backendURL, teaToken, classId);
    setTeacherClassCurriculum(data);
    return data;
  };

  const handleAddClassSubject = async (classId, payload) => {
    const data = await addTeacherClassSubject(backendURL, teaToken, classId, payload);
    if (data) {
      setTeacherClassCurriculum(data);
    }
    return data;
  };

  const handleAddClassChapter = async (classId, subjectId, payload) => {
    const data = await addTeacherClassChapter(backendURL, teaToken, classId, subjectId, payload);
    if (data) {
      setTeacherClassCurriculum(data);
    }
    return data;
  };

  const handleMarkClassChapterTaught = async (classId, subjectId, chapterId, payload = {}) => {
    const data = await updateTeacherClassChapterTaught(backendURL, teaToken, classId, subjectId, chapterId, payload);
    if (data) {
      setTeacherClassCurriculum(data);
    }
    return data;
  };

  const handleGetAvailableClassStudents = async (classId, query = {}) => {
    return await getTeacherAvailableClassStudents(backendURL, teaToken, classId, query);
  };

  const handleAssignStudentsToClass = async (classId, payload = {}) => {
    return await assignTeacherStudentsToClass(backendURL, teaToken, classId, payload);
  };

  const value = {
    teaToken,
    setTeaToken,
    teacherTests,
    teacherStudents,
    teacherDailyLogs,
    teacherClasses,
    teacherProfile,
    teacherStudentsListing,
    teacherSelfAttendances,
    teacherStudentAttendanceListing,
    selectedStudentPerformance,
    teacherClassCurriculum,
    handleAddTestSeries,
    handleGetTestSeries,
    handleGetStudents,
    handleGetStudentsList,
    handleGetTeacherClasses,
    handleGetTeacherProfile,
    handleUpdateTeacherProfile,
    handleUpdateTeacherPassword,
    handleMarkSelfAttendance,
    handleGetTeacherSelfAttendance,
    handleMarkStudentAttendance,
    handleGetStudentAttendanceList,
    handleGetStudentPerformance,
    handleAddStudent,
    handleRecoverTeacherCredentials,
    handleRecoverStudentCredentials,
    handleSaveDailyTeachingLog,
    handleGetDailyTeachingLogs,
    handleGetClassCurriculum,
    handleAddClassSubject,
    handleAddClassChapter,
    handleMarkClassChapterTaught,
    handleGetAvailableClassStudents,
    handleAssignStudentsToClass
  };

  return (
    <TeacherContext.Provider value={value}>
      {props.children}
    </TeacherContext.Provider>
  );
};

export default TeacherContextProvider;
