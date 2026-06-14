import { useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';

const metricCardClass = 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm';

const StudentDashboard = () => {
  const {
    studentDashboard,
    studentAssignments,
    studentTests,
    studentFetchDashboard,
    studentFetchAssignments,
    studentFetchTests,
    studentLoading
  } = useContext(StudentContext);

  useEffect(() => {
    studentFetchDashboard();
    studentFetchAssignments();
    studentFetchTests({ page: 1, limit: 5 });
  }, []);

  const counts = studentDashboard?.counts || {};

  const recentAssignments = useMemo(() => {
    return [...(studentAssignments || [])]
      .sort((a, b) => new Date(a?.deadline || 0).getTime() - new Date(b?.deadline || 0).getTime())
      .slice(0, 5);
  }, [studentAssignments]);

  const recentTests = useMemo(() => {
    return [...(studentTests || [])]
      .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
      .slice(0, 5);
  }, [studentTests]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-blue10">Student Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Your academic snapshot, assignments, and quick actions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className={metricCardClass}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attendance Rate</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{counts.attendanceRate ?? 0}%</p>
          <p className="mt-1 text-sm text-slate-600">{counts.presentCount ?? 0} present of {counts.attendanceCount ?? 0} records</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tests</p>
          <p className="mt-2 text-3xl font-bold text-blue10">{counts.attemptedTests ?? 0}/{counts.totalTests ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">Attempted / Total available</p>
        </div>

        <div className={metricCardClass}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assignments</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{counts.pendingAssignments ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">Pending of {counts.totalAssignments ?? 0} active</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Recent Assignments</h3>
            <span className="text-xs text-slate-500">Next deadlines</span>
          </div>

          <div className="space-y-2">
            {recentAssignments.map((assignment) => (
              <div key={assignment._id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="font-semibold text-slate-800">{assignment.title || 'Assignment'}</p>
                <p className="text-sm text-slate-600">{assignment.description || '-'}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleString() : '-'}
                </p>
              </div>
            ))}
            {!recentAssignments.length && (
              <p className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                No active assignments found.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
          <div className="mt-3 space-y-2">
            <Link to="/student/tests" className="block rounded-lg bg-blue10 px-3 py-2 text-center text-sm font-semibold text-white">
              Go To Tests
            </Link>
            <Link to="/student/attendance" className="block rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white">
              Go To Attendance
            </Link>
            <Link to="/student/profile" className="block rounded-lg bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white">
              Go To Profile
            </Link>
          </div>

          <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Test Activity</h4>
          <div className="mt-2 space-y-2">
            {recentTests.map((test) => (
              <div key={test._id} className="rounded-lg border border-slate-100 p-2">
                <p className="text-sm font-semibold text-slate-800">{test.title}</p>
                <p className="text-xs text-slate-500">{test.subject || '-'} | {test.className || '-'}</p>
              </div>
            ))}
            {!recentTests.length && (
              <p className="text-xs text-slate-500">No recent tests available.</p>
            )}
          </div>
        </div>
      </div>

      {studentLoading && (
        <p className="text-sm font-medium text-slate-500">Loading student dashboard data...</p>
      )}
    </div>
  );
};

export default StudentDashboard;
