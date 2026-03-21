import { useContext, useEffect, useMemo, useState } from 'react';
import { TeacherContext } from '../../context/teacher';

const StudentAttendancePage = () => {
  const {
    teacherStudents,
    teacherClasses,
    teacherStudentAttendanceListing,
    handleGetStudents,
    handleMarkStudentAttendance,
    handleGetStudentAttendanceList,
    handleGetTeacherClasses
  } = useContext(TeacherContext);

  const [studentAttendanceFilter, setStudentAttendanceFilter] = useState({
    classId: '',
    date: new Date().toISOString().slice(0, 10)
  });
  const [seatStatuses, setSeatStatuses] = useState({});
  const [isStudentAttendanceModalOpen, setIsStudentAttendanceModalOpen] = useState(false);
  const [studentAttendanceListFilters, setStudentAttendanceListFilters] = useState({
    search: '',
    classId: '',
    date: '',
    status: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const seatCards = useMemo(() => {
    return teacherStudents.map((student, index) => ({
      seatNumber: index + 1,
      ...student,
      status: seatStatuses[student._id] || 'Present'
    }));
  }, [teacherStudents, seatStatuses]);

  const loadStudentAttendanceListing = async (overrides = {}) => {
    const nextQuery = { ...studentAttendanceListFilters, ...overrides };
    await handleGetStudentAttendanceList(nextQuery);
    if (Object.keys(overrides).length) {
      setStudentAttendanceListFilters(nextQuery);
    }
  };

  const loadStudentsForSeatAttendance = async () => {
    if (!studentAttendanceFilter.classId) return;
    await handleGetStudents(studentAttendanceFilter.classId);
    setSeatStatuses({});
  };

  const cycleSeatStatus = (studentId) => {
    const current = seatStatuses[studentId] || 'Present';
    const next = current === 'Present' ? 'Absent' : current === 'Absent' ? 'Late' : 'Present';
    setSeatStatuses((prev) => ({ ...prev, [studentId]: next }));
  };

  const submitSeatAttendance = async (e) => {
    e.preventDefault();
    if (!studentAttendanceFilter.classId || !studentAttendanceFilter.date || !teacherStudents.length) {
      return;
    }

    let markedCount = 0;
    for (const student of teacherStudents) {
      const status = seatStatuses[student._id] || 'Present';
      const ok = await handleMarkStudentAttendance({
        studentId: student._id,
        classId: studentAttendanceFilter.classId,
        date: studentAttendanceFilter.date,
        status,
        remarks: ''
      });
      if (ok) {
        markedCount += 1;
      }
    }

    if (markedCount > 0) {
      setIsStudentAttendanceModalOpen(false);
      setSeatStatuses({});
      await loadStudentAttendanceListing({
        page: 1,
        classId: studentAttendanceFilter.classId,
        date: studentAttendanceFilter.date
      });
    }
  };

  useEffect(() => {
    handleGetTeacherClasses();
    loadStudentAttendanceListing();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">Student Attendance Listing</h2>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setIsStudentAttendanceModalOpen(true)}>
          Mark Student Attendance
        </button>
      </div>

      <div className="grid gap-2 rounded-lg bg-white p-4 shadow md:grid-cols-8">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Search student/date/status/remarks"
          value={studentAttendanceListFilters.search}
          onChange={(e) => setStudentAttendanceListFilters((p) => ({ ...p, search: e.target.value }))}
        />
        <select className="w-full border rounded px-3 py-2" value={studentAttendanceListFilters.classId} onChange={(e) => setStudentAttendanceListFilters((p) => ({ ...p, classId: e.target.value, page: 1 }))}>
          <option value="">All Classes</option>
          {teacherClasses.map((cls) => (
            <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
          ))}
        </select>
        <input className="w-full border rounded px-3 py-2" type="date" value={studentAttendanceListFilters.date} onChange={(e) => setStudentAttendanceListFilters((p) => ({ ...p, date: e.target.value, page: 1 }))} />
        <select className="w-full border rounded px-3 py-2" value={studentAttendanceListFilters.status} onChange={(e) => setStudentAttendanceListFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}>
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={studentAttendanceListFilters.sortBy} onChange={(e) => setStudentAttendanceListFilters((p) => ({ ...p, sortBy: e.target.value, page: 1 }))}>
          <option value="date">Sort: Date</option>
          <option value="status">Sort: Status</option>
          <option value="createdAt">Sort: Marked Time</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={studentAttendanceListFilters.sortOrder} onChange={(e) => setStudentAttendanceListFilters((p) => ({ ...p, sortOrder: e.target.value, page: 1 }))}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={studentAttendanceListFilters.limit} onChange={(e) => setStudentAttendanceListFilters((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))}>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => loadStudentAttendanceListing({ page: 1 })}>
          Apply
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Student</th>
              <th className="px-4 py-3 font-bold">Roll/Reg</th>
              <th className="px-4 py-3 font-bold">Class</th>
              <th className="px-4 py-3 font-bold">Total Students</th>
              <th className="px-4 py-3 font-bold">Present</th>
              <th className="px-4 py-3 font-bold">Present %</th>
              <th className="px-4 py-3 font-bold">Subject Taught</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Remarks</th>
              <th className="px-4 py-3 font-bold">Marked At</th>
            </tr>
          </thead>
          <tbody>
            {(teacherStudentAttendanceListing?.records || []).map((row) => (
              <tr key={row._id} className="border-t border-slate-100 hover:bg-slate-50/70">
                <td className="px-4 py-3 text-slate-700">{row.date || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.studentId?.name || row.studentId?.username || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.studentId?.rollNumber || row.studentId?.registrationNumber || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.studentId?.classId ? `${row.studentId.classId.name || ''} ${row.studentId.classId.section || ''}`.trim() : '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.classSummary?.totalStudents ?? 0}</td>
                <td className="px-4 py-3 text-slate-700">{row.classSummary?.presentStudents ?? 0}</td>
                <td className="px-4 py-3 text-slate-700">{row.classSummary?.presentPercentage ?? 0}%</td>
                <td className="px-4 py-3 text-slate-700">{row.classSummary?.subjectTaught || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.status || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.remarks || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {!teacherStudentAttendanceListing?.records?.length && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={11}>No student attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs font-medium text-slate-500">
            Page {teacherStudentAttendanceListing?.pagination?.page || 1} of {teacherStudentAttendanceListing?.pagination?.totalPages || 1} | Total {teacherStudentAttendanceListing?.pagination?.total || 0}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(teacherStudentAttendanceListing?.pagination?.page || 1) <= 1}
              onClick={() => {
                const next = Math.max((teacherStudentAttendanceListing?.pagination?.page || 1) - 1, 1);
                loadStudentAttendanceListing({ page: next });
              }}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(teacherStudentAttendanceListing?.pagination?.page || 1) >= (teacherStudentAttendanceListing?.pagination?.totalPages || 1)}
              onClick={() => {
                const next = Math.min(
                  (teacherStudentAttendanceListing?.pagination?.page || 1) + 1,
                  teacherStudentAttendanceListing?.pagination?.totalPages || 1
                );
                loadStudentAttendanceListing({ page: next });
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isStudentAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-5xl rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Mark Student Attendance (Seat Layout)</h3>
            <form className="space-y-4" onSubmit={submitSeatAttendance}>
              <div className="grid gap-2 md:grid-cols-3">
                <select className="w-full border rounded px-3 py-2" value={studentAttendanceFilter.classId} onChange={(e) => setStudentAttendanceFilter((p) => ({ ...p, classId: e.target.value }))} required>
                  <option value="">Select Class</option>
                  {teacherClasses.map((cls) => (
                    <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
                  ))}
                </select>
                <input className="w-full border rounded px-3 py-2" type="date" value={studentAttendanceFilter.date} onChange={(e) => setStudentAttendanceFilter((p) => ({ ...p, date: e.target.value }))} required />
                <button type="button" className="admin-btn admin-btn-secondary" onClick={loadStudentsForSeatAttendance}>Load Students</button>
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {seatCards.map((student) => (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() => cycleSeatStatus(student._id)}
                      className={`rounded-lg border p-3 text-left ${student.status === 'Present' ? 'border-emerald-300 bg-emerald-50' : student.status === 'Absent' ? 'border-rose-300 bg-rose-50' : 'border-amber-300 bg-amber-50'}`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Seat {student.seatNumber}</p>
                      <p className="mt-1 font-semibold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-600">{student.rollNumber || student.registrationNumber || '-'}</p>
                      <p className="mt-2 text-xs font-bold">Status: {student.status}</p>
                    </button>
                  ))}
                </div>
                {!seatCards.length && <p className="text-sm text-slate-500">Load class students to mark attendance.</p>}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={() => setIsStudentAttendanceModalOpen(false)}>
                  Cancel
                </button>
                <button className="rounded bg-blue-700 px-3 py-1.5 text-sm text-white" type="submit" disabled={!seatCards.length}>
                  Submit Seat Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendancePage;
