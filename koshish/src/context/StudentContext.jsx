
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getStudentProfile,
    loginStudent,
    logoutStudent,
    recoverStudentCredentials,
    registerStudent,
    updateStudentProfile
} from "../utils/student/auth";
import {
    studentGetAnswers,
    studentGetAttendance,
    studentGetLeaderboard,
    studentGetTestById,
    studentListTests,
    studentSubmitTest
} from "../utils/student/testSeries";

export const StudentContext = createContext(null);
const  StudentContextProvider = (props) => {
        const [stuToken, setStuToken] = useState(localStorage.getItem("stuToken") || false)
        const [studentProfile, setStudentProfile] = useState(null)
        const [studentLoading, setStudentLoading] = useState(false)
        const [studentTests, setStudentTests] = useState([])
        const [studentCurrentTest, setStudentCurrentTest] = useState(null)
        const [studentAnswerSheet, setStudentAnswerSheet] = useState(null)
        const [studentLeaderboard, setStudentLeaderboard] = useState([])
        const [studentAttendance, setStudentAttendance] = useState([])
        const backendURL= import.meta.env.VITE_BACKEND_URL

        useEffect(() => {
            if (stuToken) {
                localStorage.setItem("stuToken", stuToken)
            } else {
                localStorage.removeItem("stuToken")
            }
        }, [stuToken])

        const studentRegister = async (payload) => {
            try {
                setStudentLoading(true)
                const data = await registerStudent(backendURL, payload)
                if (!data.success) {
                    toast.error(data.message)
                    return false
                }

                setStuToken(data.token)
                setStudentProfile(data.student)
                toast.success(data.message)
                return true
            } catch (error) {
                toast.error(error.message)
                return false
            } finally {
                setStudentLoading(false)
            }
        }

        const studentLogin = async (payload) => {
            try {
                setStudentLoading(true)
                const data = await loginStudent(backendURL, payload)
                if (!data.success) {
                    toast.error(data.message)
                    return false
                }

                setStuToken(data.token)
                setStudentProfile(data.student)
                toast.success(data.message)
                return true
            } catch (error) {
                toast.error(error.message)
                return false
            } finally {
                setStudentLoading(false)
            }
        }

        const studentFetchProfile = async () => {
            if (!stuToken) return;
            try {
                setStudentLoading(true)
                const data = await getStudentProfile(backendURL, stuToken)
                if (!data.success) {
                    toast.error(data.message)
                    return;
                }
                setStudentProfile(data.student)
            } catch (error) {
                toast.error(error.message)
            } finally {
                setStudentLoading(false)
            }
        }

        const studentUpdateProfile = async (payload) => {
            if (!stuToken) return false;
            try {
                setStudentLoading(true)
                const data = await updateStudentProfile(backendURL, stuToken, payload)
                if (!data.success) {
                    toast.error(data.message)
                    return false
                }
                setStudentProfile(data.student)
                toast.success(data.message)
                return true
            } catch (error) {
                toast.error(error.message)
                return false
            } finally {
                setStudentLoading(false)
            }
        }

        const studentLogout = () => {
            logoutStudent(backendURL, stuToken).catch(() => {});
            setStuToken(false)
            setStudentProfile(null)
            toast.success("Logged out successfully")
        }

        const studentRecoverCredentials = async (payload) => {
            try {
                setStudentLoading(true)
                const data = await recoverStudentCredentials(backendURL, payload)
                if (!data.success) {
                    toast.error(data.message)
                    return null
                }
                toast.success(data.message)
                return data
            } catch (error) {
                toast.error(error.message)
                return null
            } finally {
                setStudentLoading(false)
            }
        }

        const studentFetchTests = async (options = {}) => {
            if (!stuToken) return;
            try {
                const data = await studentListTests(backendURL, stuToken, options)
                if (!data.success) {
                    toast.error(data.message)
                    return
                }
                setStudentTests(data.data || [])
            } catch (error) {
                toast.error(error.message)
            }
        }

        const studentFetchTestById = async (testId) => {
            if (!stuToken || !testId) return;
            try {
                const data = await studentGetTestById(backendURL, stuToken, testId)
                if (!data.success) {
                    toast.error(data.message)
                    return
                }
                setStudentCurrentTest(data.data)
            } catch (error) {
                toast.error(error.message)
            }
        }

        const studentSubmitCurrentTest = async (testId, answers) => {
            if (!stuToken || !testId) return false;
            try {
                const data = await studentSubmitTest(backendURL, stuToken, testId, answers)
                if (!data.success) {
                    toast.error(data.message)
                    return false
                }
                toast.success(data.message)
                return true
            } catch (error) {
                toast.error(error.message)
                return false
            }
        }

        const studentFetchAnswers = async (testId) => {
            if (!stuToken || !testId) return;
            try {
                const data = await studentGetAnswers(backendURL, stuToken, testId)
                if (!data.success) {
                    toast.error(data.message)
                    return
                }
                setStudentAnswerSheet(data.data)
            } catch (error) {
                toast.error(error.message)
            }
        }

        const studentFetchLeaderboard = async (testId) => {
            if (!stuToken || !testId) return;
            try {
                const data = await studentGetLeaderboard(backendURL, stuToken, testId)
                if (!data.success) {
                    toast.error(data.message)
                    return
                }
                setStudentLeaderboard(data.data || [])
            } catch (error) {
                toast.error(error.message)
            }
        }

        const studentFetchAttendance = async () => {
            if (!stuToken) return;
            try {
                const data = await studentGetAttendance(backendURL, stuToken)
                if (!data.success) {
                    toast.error(data.message)
                    return
                }
                setStudentAttendance(data.data || [])
            } catch (error) {
                toast.error(error.message)
            }
        }

const value = {
        stuToken, setStuToken,
        studentProfile, setStudentProfile,
        studentLoading,
        studentRegister,
        studentLogin,
        studentFetchProfile,
        studentUpdateProfile,
        studentLogout,
        studentRecoverCredentials,
        studentTests,
        studentCurrentTest,
        studentAnswerSheet,
        studentLeaderboard,
        studentAttendance,
        studentFetchTests,
        studentFetchTestById,
        studentSubmitCurrentTest,
        studentFetchAnswers,
        studentFetchLeaderboard,
        studentFetchAttendance
 }
return (
   
      <StudentContext.Provider value={value}>
            {props.children}
      </StudentContext.Provider>
    
  );
}
export default StudentContextProvider