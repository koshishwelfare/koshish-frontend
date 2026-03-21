import React from 'react'
import { Routes, Route} from 'react-router-dom';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import StudentProfile from '../../component/student/StudentProfile';
import { Link } from 'react-router-dom';
import StudentTests from '../../component/student/StudentTests';
import StudentTestAttempt from '../../component/student/StudentTestAttempt';
import StudentAnswers from '../../component/student/StudentAnswers';
import StudentLeaderboard from '../../component/student/StudentLeaderboard';
import StudentAttendance from '../../component/student/StudentAttendance';
const IndexStudent = () => {
  return (
    <div>
          <Navbar />
            <div className='flex justify-start min-h-screen bg-green-50 pt-24 pb-16 px-4'>
             <div  className='w-full max-w-7xl mx-auto' > 
              <div className='mb-4 flex flex-wrap gap-2'>
                <Link to='/' className='px-3 py-2 rounded bg-white border'>Profile</Link>
                <Link to='/student/tests' className='px-3 py-2 rounded bg-white border'>Tests</Link>
                <Link to='/student/attendance' className='px-3 py-2 rounded bg-white border'>Attendance</Link>
              </div>
              <Routes>
                <Route path='/' element={<StudentProfile/>} />
                <Route path='/student/tests' element={<StudentTests/>} />
                <Route path='/student/tests/:testId' element={<StudentTestAttempt/>} />
                <Route path='/student/tests/:testId/answers' element={<StudentAnswers/>} />
                <Route path='/student/leaderboard/:testId' element={<StudentLeaderboard/>} />
                <Route path='/student/attendance' element={<StudentAttendance/>} />
              </Routes>
             </div>
            </div>
            <Footer />


    </div>
  )
}

export default IndexStudent