import { useContext, useEffect, useMemo, useState } from 'react';
import { CocirculerContext } from '../../../context/cocirculer';

const AcademicTeacherAttendance = () => {
  const {
    teacherDailyQr,
    teacherDailyAttendance,
    academicSessions,
    academicClasses,
    handleGetTeacherAttendanceDailyQr,
    handleGetTeacherDailyAttendance,
    handleGetAcademicSessions,
    handleGetAcademicClasses
  } = useContext(CocirculerContext);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionId, setSessionId] = useState('');
  const [classId, setClassId] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [shareMessage, setShareMessage] = useState('');

  const filteredClasses = useMemo(() => {
    if (!sessionId) return academicClasses || [];
    return (academicClasses || []).filter((cls) => {
      const clsSessionId = String(cls?.sessionId?._id || cls?.sessionId || '');
      return clsSessionId === String(sessionId);
    });
  }, [academicClasses, sessionId]);

  const qrImageUrl = teacherDailyQr?.token
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(teacherDailyQr.token)}`
    : '';

  const loadAttendanceListing = async (nextPage = page) => {
    const query = {
      date: selectedDate,
      page: nextPage,
      limit,
      sortBy,
      sortOrder
    };
    if (sessionId) query.sessionId = sessionId;
    if (classId) query.classId = classId;
    if (status) query.status = status;
    if (search.trim()) query.search = search.trim();

    await handleGetTeacherDailyAttendance(query);
  };

  const loadDailyData = async (date) => {
    await Promise.all([handleGetTeacherAttendanceDailyQr(date), loadAttendanceListing(1)]);
    setPage(1);
  };

  useEffect(() => {
    handleGetAcademicSessions();
    handleGetAcademicClasses();
    loadDailyData(selectedDate);
  }, []);

  useEffect(() => {
    handleGetAcademicClasses(sessionId || undefined);
    setClassId('');
    setPage(1);
  }, [sessionId]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const copyToken = async () => {
    if (!teacherDailyQr?.token || !navigator.clipboard) return;
    await navigator.clipboard.writeText(teacherDailyQr.token);
    setShareMessage('Token copied to clipboard.');
  };

  const shareQr = async () => {
    if (!teacherDailyQr?.token) return;
    const shareText = `Teacher attendance token for ${teacherDailyQr.date}: ${teacherDailyQr.token}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Teacher Attendance Token',
          text: shareText,
          url: qrImageUrl || undefined
        });
        setShareMessage('Token shared successfully.');
        return;
      } catch {
        // Ignore cancellation and fall back.
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}${qrImageUrl ? `\n${qrImageUrl}` : ''}`);
      setShareMessage('Share text copied to clipboard.');
    }
  };

  const downloadQr = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `teacher-attendance-${teacherDailyQr?.date || 'token'}.png`;
    link.click();
    setShareMessage('QR download started.');
  };

  const totalPages = teacherDailyAttendance?.pagination?.totalPages || 1;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 shadow md:p-6">
        <h2 className="text-xl font-semibold">Academic Teacher Self-Attendance</h2>
        <p className="text-sm text-slate-600">Daily token and attendance listing for academic operations.</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Teacher Self-Attendance Token</h3>
            <p className="text-xs text-slate-500">Share this token only for selected day.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="rounded border border-slate-300 px-2 py-1 text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button onClick={() => loadDailyData(selectedDate)} className="rounded border px-3 py-1.5 text-sm">Load</button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Date</p>
          <p className="text-sm font-semibold text-slate-800">{teacherDailyQr?.date || '-'}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">Token</p>
          <p className="break-all text-base font-bold text-slate-900">{teacherDailyQr?.token || 'No token available'}</p>
          {teacherDailyQr?.token && (
            <div className="mt-4 inline-block rounded-lg border border-slate-200 bg-white p-2">
              <img
                src={qrImageUrl}
                alt="Teacher attendance QR"
                className="h-[220px] w-[220px]"
              />
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={copyToken} disabled={!teacherDailyQr?.token}>Copy Token</button>
            <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={shareQr} disabled={!teacherDailyQr?.token}>Share QR</button>
            <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={downloadQr} disabled={!teacherDailyQr?.token}>Download QR</button>
          </div>
          {shareMessage && <p className="mt-2 text-xs text-slate-600">{shareMessage}</p>}
          <p className={`mt-2 text-xs font-semibold ${teacherDailyQr?.workingDay ? 'text-emerald-700' : 'text-amber-700'}`}>
            {teacherDailyQr?.workingDay ? 'Working day token is active.' : 'Non-working day. Attendance marking is restricted.'}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow md:p-6">
        <h3 className="text-lg font-semibold text-slate-900">Teacher Attendance Listing</h3>
        <p className="text-xs text-slate-500">Academic-session based listing with filters, searching, sorting and pagination.</p>

        <div className="mt-3 grid gap-2 md:grid-cols-6">
          <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
            <option value="">All Sessions</option>
            {(academicSessions || []).map((session) => (
              <option key={session._id} value={session._id}>{session.name}</option>
            ))}
          </select>
          <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">All Classes</option>
            {filteredClasses.map((cls) => (
              <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
            ))}
          </select>
          <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
          <input
            className="rounded border border-slate-300 px-2 py-2 text-sm"
            placeholder="Search teacher, class, status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="rounded border border-slate-300 px-2 py-2 text-sm" value={limit} onChange={(e) => setLimit(Number(e.target.value) || 10)}>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm"
            onClick={async () => {
              setPage(1);
              await loadAttendanceListing(1);
            }}
          >
            Apply Filters
          </button>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm"><span className="font-semibold">Total:</span> {teacherDailyAttendance?.summary?.total || 0}</div>
          <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm"><span className="font-semibold">Present:</span> {teacherDailyAttendance?.summary?.present || 0}</div>
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm"><span className="font-semibold">Late:</span> {teacherDailyAttendance?.summary?.late || 0}</div>
          <div className="rounded border border-rose-200 bg-rose-50 p-3 text-sm"><span className="font-semibold">Absent:</span> {teacherDailyAttendance?.summary?.absent || 0}</div>
        </div>

        <div className="mt-4 overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2 text-left"><button type="button" className="font-semibold" onClick={() => handleSort('teacher')}>Teacher</button></th>
                <th className="px-3 py-2 text-left"><button type="button" className="font-semibold" onClick={() => handleSort('className')}>Class</button></th>
                <th className="px-3 py-2 text-left"><button type="button" className="font-semibold" onClick={() => handleSort('status')}>Status</button></th>
                <th className="px-3 py-2 text-left"><button type="button" className="font-semibold" onClick={() => handleSort('createdAt')}>Time</button></th>
                <th className="px-3 py-2 text-left"><button type="button" className="font-semibold" onClick={() => handleSort('date')}>Date</button></th>
              </tr>
            </thead>
            <tbody>
              {(teacherDailyAttendance?.attendance || []).map((item) => (
                <tr key={item._id} className="border-t border-slate-200">
                  <td className="px-3 py-2">{item.teacherId?.name || item.teacherId?.username || '-'}</td>
                  <td className="px-3 py-2">{item.classId ? `${item.classId.name || ''} ${item.classId.section || ''}`.trim() : '-'}</td>
                  <td className="px-3 py-2">{item.status || '-'}</td>
                  <td className="px-3 py-2">{item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : '-'}</td>
                  <td className="px-3 py-2">{item.date || '-'}</td>
                </tr>
              ))}
              {!teacherDailyAttendance?.attendance?.length && (
                <tr>
                  <td colSpan={5} className="px-3 py-3 text-center text-slate-500">No attendance records for selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
          <p>
            Page {teacherDailyAttendance?.pagination?.page || page} of {totalPages} | Total {teacherDailyAttendance?.pagination?.total || 0}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(teacherDailyAttendance?.pagination?.page || page) <= 1}
              onClick={async () => {
                const next = Math.max((teacherDailyAttendance?.pagination?.page || page) - 1, 1);
                setPage(next);
                await loadAttendanceListing(next);
              }}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(teacherDailyAttendance?.pagination?.page || page) >= totalPages}
              onClick={async () => {
                const next = Math.min((teacherDailyAttendance?.pagination?.page || page) + 1, totalPages);
                setPage(next);
                await loadAttendanceListing(next);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicTeacherAttendance;