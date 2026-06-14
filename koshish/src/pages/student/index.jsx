import React from 'react'
import { NavLink, Routes, Route } from 'react-router-dom';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import StudentDashboard from '../../component/student/StudentDashboard';
import StudentProfile from '../../component/student/StudentProfile';
import StudentTests from '../../component/student/StudentTests';
import StudentTestAttempt from '../../component/student/StudentTestAttempt';
import StudentAnswers from '../../component/student/StudentAnswers';
import StudentLeaderboard from '../../component/student/StudentLeaderboard';
import StudentAttendance from '../../component/student/StudentAttendance';

const studentNavItems = [
  { to: '/student', label: 'Dashboard' },
  { to: '/student/profile', label: 'Profile' },
  { to: '/student/tests', label: 'Tests' },
  { to: '/student/attendance', label: 'Attendance' }
];

const IndexStudent = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-green-50 px-4 pb-16 pt-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row">
          <aside className="h-fit w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:sticky md:top-[92px] md:w-64">
            <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Student Menu</p>
            <nav className="space-y-1">
              {studentNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/student'}
                  className={({ isActive }) =>
                    `block w-full rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <section className="w-full">
            <Routes>
              <Route path='/' element={<StudentDashboard/>} />
              <Route path='/student/profile' element={<StudentProfile/>} />
              <Route path='/student/tests' element={<StudentTests/>} />
              <Route path='/student/tests/:testId' element={<StudentTestAttempt/>} />
              <Route path='/student/tests/:testId/answers' element={<StudentAnswers/>} />
              <Route path='/student/leaderboard/:testId' element={<StudentLeaderboard/>} />
              <Route path='/student/attendance' element={<StudentAttendance/>} />
            </Routes>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default IndexStudent