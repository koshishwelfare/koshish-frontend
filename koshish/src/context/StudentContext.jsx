
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
    studentGetAssignments,
    studentGetAnswers,
    studentGetAttendance,
    studentGetDashboard,
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
        const [studentDashboard, setStudentDashboard] = useState(null)
        const [studentAssignments, setStudentAssignments] = useState([])
        const backendURL= import.meta.env.VITE_BACKEND_URL

        const getErrorMessage = (error) =>
            error?.response?.data?.message || error?.message || "Something went wrong"

        const runStudentRequest = async (request, options = {}) => {
            const {
                setLoading = false,
                successToast = false,
                onSuccess,
                fallback = null
            } = options

            try {
                if (setLoading) setStudentLoading(true)

                const data = await request()
                if (!data?.success) {
                    toast.error(data?.message || "Request failed")
                    return fallback
                }

                if (typeof onSuccess === "function") onSuccess(data)
                if (successToast && data.message) toast.success(data.message)
                return data
            } catch (error) {
                toast.error(getErrorMessage(error))
                return fallback
            } finally {
                if (setLoading) setStudentLoading(false)
            }
        }

        useEffect(() => {
            if (stuToken) {
                localStorage.setItem("stuToken", stuToken)
            } else {
                localStorage.removeItem("stuToken")
            }
        }, [stuToken])

        const studentRegister = async (payload) => {
            const data = await runStudentRequest(
                () => registerStudent(backendURL, payload),
                {
                    setLoading: true,
                    successToast: true,
                    fallback: false,
                    onSuccess: ({ token, student }) => {
                        setStuToken(token)
                        setStudentProfile(student)
                    }
                }
            )

            return Boolean(data)
        }

        const studentLogin = async (payload) => {
            const data = await runStudentRequest(
                () => loginStudent(backendURL, payload),
                {
                    setLoading: true,
                    successToast: true,
                    fallback: false,
                    onSuccess: ({ token, student }) => {
                        setStuToken(token)
                        setStudentProfile(student)
                    }
                }
            )

            return Boolean(data)
        }

        const studentFetchProfile = async () => {
            if (!stuToken) return;
            await runStudentRequest(
                () => getStudentProfile(backendURL, stuToken),
                {
                    setLoading: true,
                    onSuccess: ({ student }) => setStudentProfile(student)
                }
            )
        }

        const studentUpdateProfile = async (payload) => {
            if (!stuToken) return false;
            const data = await runStudentRequest(
                () => updateStudentProfile(backendURL, stuToken, payload),
                {
                    setLoading: true,
                    successToast: true,
                    fallback: false,
                    onSuccess: ({ student }) => setStudentProfile(student)
                }
            )

            return Boolean(data)
        }

        const studentLogout = () => {
            logoutStudent(backendURL, stuToken).catch(() => {});
            setStuToken(false)
            setStudentProfile(null)
            toast.success("Logged out successfully")
        }

        const studentRecoverCredentials = async (payload) => {
            return runStudentRequest(
                () => recoverStudentCredentials(backendURL, payload),
                {
                    setLoading: true,
                    successToast: true,
                    fallback: null
                }
            )
        }

        const studentFetchTests = async (options = {}) => {
            if (!stuToken) return;
            await runStudentRequest(
                () => studentListTests(backendURL, stuToken, options),
                {
                    onSuccess: ({ data }) => setStudentTests(data || [])
                }
            )
        }

        const studentFetchTestById = async (testId) => {
            if (!stuToken || !testId) return;
            await runStudentRequest(
                () => studentGetTestById(backendURL, stuToken, testId),
                {
                    onSuccess: ({ data }) => setStudentCurrentTest(data)
                }
            )
        }

        const studentSubmitCurrentTest = async (testId, answers) => {
            if (!stuToken || !testId) return false;
            const data = await runStudentRequest(
                () => studentSubmitTest(backendURL, stuToken, testId, answers),
                {
                    successToast: true,
                    fallback: false
                }
            )

            return Boolean(data)
        }

        const studentFetchAnswers = async (testId) => {
            if (!stuToken || !testId) return;
            await runStudentRequest(
                () => studentGetAnswers(backendURL, stuToken, testId),
                {
                    onSuccess: ({ data }) => setStudentAnswerSheet(data)
                }
            )
        }

        const studentFetchLeaderboard = async (testId) => {
            if (!stuToken || !testId) return;
            await runStudentRequest(
                () => studentGetLeaderboard(backendURL, stuToken, testId),
                {
                    onSuccess: ({ data }) => setStudentLeaderboard(data || [])
                }
            )
        }

        const studentFetchAttendance = async () => {
            if (!stuToken) return;
            await runStudentRequest(
                () => studentGetAttendance(backendURL, stuToken),
                {
                    onSuccess: ({ data }) => setStudentAttendance(data || [])
                }
            )
        }

        const studentFetchDashboard = async () => {
            if (!stuToken) return;
            await runStudentRequest(
                () => studentGetDashboard(backendURL, stuToken),
                {
                    onSuccess: ({ data }) => setStudentDashboard(data || null)
                }
            )
        }

        const studentFetchAssignments = async () => {
            if (!stuToken) return;
            await runStudentRequest(
                () => studentGetAssignments(backendURL, stuToken),
                {
                    onSuccess: ({ data }) => setStudentAssignments(data || [])
                }
            )
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
        studentDashboard,
        studentAssignments,
        studentFetchTests,
        studentFetchTestById,
        studentSubmitCurrentTest,
        studentFetchAnswers,
        studentFetchLeaderboard,
        studentFetchAttendance,
        studentFetchDashboard,
        studentFetchAssignments
 }
return (
   
      <StudentContext.Provider value={value}>
            {props.children}
      </StudentContext.Provider>
    
  );
}
export default StudentContextProvider