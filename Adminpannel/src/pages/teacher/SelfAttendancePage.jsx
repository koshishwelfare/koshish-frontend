import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TeacherContext } from '../../context/teacher';

const SelfAttendancePage = () => {
  const {
    teacherSelfAttendances,
    teacherClasses,
    teacherClassCurriculum,
    handleMarkSelfAttendance,
    handleGetTeacherSelfAttendance,
    handleGetTeacherClasses,
    handleGetClassCurriculum
  } = useContext(TeacherContext);

  const [selfAttendanceForm, setSelfAttendanceForm] = useState({
    classId: '',
    subjectId: '',
    chapterId: '',
    date: new Date().toISOString().slice(0, 10),
    qrToken: '',
    latitude: '',
    longitude: '',
    status: 'Present',
    remarks: ''
  });
  const [scannerSupported, setScannerSupported] = useState(false);
  const [scannerRunning, setScannerRunning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [isSelfAttendanceModalOpen, setIsSelfAttendanceModalOpen] = useState(false);
  const [selfAttendanceListFilters, setSelfAttendanceListFilters] = useState({
    search: '',
    classId: '',
    status: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const scanRafRef = useRef(null);
  const scannerRunningRef = useRef(false);

  useEffect(() => {
    handleGetTeacherClasses();
    handleGetTeacherSelfAttendance();
  }, []);

  useEffect(() => {
    if (!isSelfAttendanceModalOpen || !selfAttendanceForm.classId) return;
    handleGetClassCurriculum(selfAttendanceForm.classId);
  }, [isSelfAttendanceModalOpen, selfAttendanceForm.classId]);

  const classSubjects = useMemo(() => teacherClassCurriculum?.subjects || [], [teacherClassCurriculum]);

  const selectedSubject = useMemo(
    () => classSubjects.find((subject) => String(subject?._id || '') === String(selfAttendanceForm.subjectId || '')) || null,
    [classSubjects, selfAttendanceForm.subjectId]
  );

  const subjectChapters = useMemo(() => selectedSubject?.chapters || [], [selectedSubject]);

  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    setScannerSupported(supported);
    if (supported) {
      detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
    }

    return () => {
      scannerRunningRef.current = false;
      if (scanRafRef.current) {
        cancelAnimationFrame(scanRafRef.current);
        scanRafRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const selfAttendanceListing = useMemo(() => {
    let rows = [...(teacherSelfAttendances || [])];

    if (selfAttendanceListFilters.classId) {
      rows = rows.filter((row) => String(row?.classId?._id || row?.classId || '') === String(selfAttendanceListFilters.classId));
    }
    if (selfAttendanceListFilters.status) {
      rows = rows.filter((row) => String(row?.status || '') === String(selfAttendanceListFilters.status));
    }
    if (selfAttendanceListFilters.search.trim()) {
      const q = selfAttendanceListFilters.search.trim().toLowerCase();
      rows = rows.filter((row) => {
        const className = `${row?.classId?.name || ''} ${row?.classId?.section || ''}`.toLowerCase();
        return (
          String(row?.date || '').toLowerCase().includes(q) ||
          String(row?.status || '').toLowerCase().includes(q) ||
          String(row?.remarks || '').toLowerCase().includes(q) ||
          className.includes(q)
        );
      });
    }

    const sortKey = selfAttendanceListFilters.sortBy;
    const dir = selfAttendanceListFilters.sortOrder === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const getValue = (row) => {
        if (sortKey === 'className') return `${row?.classId?.name || ''} ${row?.classId?.section || ''}`;
        if (sortKey === 'createdAt') return row?.createdAt || '';
        return row?.[sortKey] || '';
      };
      return String(getValue(a)).localeCompare(String(getValue(b)), undefined, { numeric: true }) * dir;
    });

    const total = rows.length;
    const limit = Number(selfAttendanceListFilters.limit) || 10;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const page = Math.min(selfAttendanceListFilters.page, totalPages);
    const pagedRows = rows.slice((page - 1) * limit, (page - 1) * limit + limit);

    return { rows: pagedRows, total, page, totalPages, limit };
  }, [teacherSelfAttendances, selfAttendanceListFilters]);

  const fillCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setSelfAttendanceForm((prev) => ({
        ...prev,
        latitude: String(position.coords.latitude),
        longitude: String(position.coords.longitude)
      }));
    });
  };

  const stopQrScanner = () => {
    scannerRunningRef.current = false;
    setScannerRunning(false);
    if (scanRafRef.current) {
      cancelAnimationFrame(scanRafRef.current);
      scanRafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startQrScanner = async () => {
    if (!scannerSupported || !detectorRef.current) {
      setScannerError('QR scanner is not supported in this browser.');
      return;
    }

    try {
      setScannerError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      scannerRunningRef.current = true;
      setScannerRunning(true);

      const scanFrame = async () => {
        if (!scannerRunningRef.current || !videoRef.current || !detectorRef.current) {
          return;
        }

        try {
          const result = await detectorRef.current.detect(videoRef.current);
          if (result && result.length) {
            const token = String(result[0].rawValue || '').trim();
            if (token) {
              setSelfAttendanceForm((prev) => ({ ...prev, qrToken: token }));
              stopQrScanner();
              return;
            }
          }
        } catch {
          // Continue scanning if a frame cannot be decoded.
        }

        scanRafRef.current = requestAnimationFrame(scanFrame);
      };

      scanRafRef.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      setScannerError(error?.message || 'Unable to access camera for scanning.');
      stopQrScanner();
    }
  };

  const submitSelfAttendance = async (e) => {
    e.preventDefault();
    const ok = await handleMarkSelfAttendance(selfAttendanceForm);
    if (ok) {
      setIsSelfAttendanceModalOpen(false);
      await handleGetTeacherSelfAttendance();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">Teacher Self Attendance Listing</h2>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setIsSelfAttendanceModalOpen(true)}>
          Mark Self Attendance
        </button>
      </div>

      <div className="grid gap-2 rounded-lg bg-white p-4 shadow md:grid-cols-7">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Search date, status, remarks"
          value={selfAttendanceListFilters.search}
          onChange={(e) => setSelfAttendanceListFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
        />
        <select className="w-full border rounded px-3 py-2" value={selfAttendanceListFilters.classId} onChange={(e) => setSelfAttendanceListFilters((p) => ({ ...p, classId: e.target.value, page: 1 }))}>
          <option value="">All Classes</option>
          {teacherClasses.map((cls) => (
            <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
          ))}
        </select>
        <select className="w-full border rounded px-3 py-2" value={selfAttendanceListFilters.status} onChange={(e) => setSelfAttendanceListFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}>
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={selfAttendanceListFilters.sortBy} onChange={(e) => setSelfAttendanceListFilters((p) => ({ ...p, sortBy: e.target.value, page: 1 }))}>
          <option value="date">Sort: Date</option>
          <option value="status">Sort: Status</option>
          <option value="className">Sort: Class</option>
          <option value="createdAt">Sort: Created Time</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={selfAttendanceListFilters.sortOrder} onChange={(e) => setSelfAttendanceListFilters((p) => ({ ...p, sortOrder: e.target.value, page: 1 }))}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={selfAttendanceListFilters.limit} onChange={(e) => setSelfAttendanceListFilters((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))}>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => handleGetTeacherSelfAttendance()}>
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Class</th>
                  <th className="px-4 py-3 font-bold">Subject</th>
                  <th className="px-4 py-3 font-bold">Chapter</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Remarks</th>
              <th className="px-4 py-3 font-bold">Created</th>
            </tr>
          </thead>
          <tbody>
            {selfAttendanceListing.rows.map((row) => (
              <tr key={row._id} className="border-t border-slate-100 hover:bg-slate-50/70">
                <td className="px-4 py-3 text-slate-700">{row.date || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.classId ? `${row.classId.name || ''} ${row.classId.section || ''}`.trim() : '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.subjectName || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.chapterTitle || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.status || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.remarks || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {!selfAttendanceListing.rows.length && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>No self attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs font-medium text-slate-500">
            Page {selfAttendanceListing.page} of {selfAttendanceListing.totalPages} | Total {selfAttendanceListing.total}
          </p>
          <div className="flex gap-2">
            <button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={selfAttendanceListing.page <= 1} onClick={() => setSelfAttendanceListFilters((p) => ({ ...p, page: p.page - 1 }))}>Prev</button>
            <button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={selfAttendanceListing.page >= selfAttendanceListing.totalPages} onClick={() => setSelfAttendanceListFilters((p) => ({ ...p, page: p.page + 1 }))}>Next</button>
          </div>
        </div>
      </div>

      {isSelfAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Mark Self Attendance</h3>
            <form className="space-y-3" onSubmit={submitSelfAttendance}>
              <select className="w-full border rounded px-3 py-2" value={selfAttendanceForm.classId} onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, classId: e.target.value, subjectId: '', chapterId: '' }))} required>
                <option value="">Select Class</option>
                {teacherClasses.map((cls) => (
                  <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
                ))}
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={selfAttendanceForm.subjectId}
                onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, subjectId: e.target.value, chapterId: '' }))}
                disabled={!selfAttendanceForm.classId}
              >
                <option value="">Select Subject</option>
                {classSubjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={selfAttendanceForm.chapterId}
                onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, chapterId: e.target.value }))}
                disabled={!selfAttendanceForm.subjectId}
              >
                <option value="">Select Chapter</option>
                {subjectChapters.map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>{chapter.title}</option>
                ))}
              </select>
              <input className="w-full border rounded px-3 py-2" type="date" value={selfAttendanceForm.date} onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, date: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="QR Token" value={selfAttendanceForm.qrToken} onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, qrToken: e.target.value }))} required />
              <div className="rounded border border-slate-200 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={startQrScanner} className="admin-btn admin-btn-secondary text-sm" disabled={scannerRunning || !scannerSupported}>
                    {scannerRunning ? 'Scanning...' : 'Scan QR via Camera'}
                  </button>
                  <button type="button" onClick={stopQrScanner} className="admin-btn admin-btn-secondary text-sm" disabled={!scannerRunning}>
                    Stop Scan
                  </button>
                </div>
                {!scannerSupported && <p className="mt-2 text-xs text-amber-700">This browser does not support in-app QR scanning. Paste token manually.</p>}
                {scannerError && <p className="mt-2 text-xs text-rose-700">{scannerError}</p>}
                <video ref={videoRef} className={`mt-3 w-full rounded border border-slate-200 bg-black ${scannerRunning ? 'block' : 'hidden'}`} playsInline muted />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full border rounded px-3 py-2" placeholder="Latitude" value={selfAttendanceForm.latitude} onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, latitude: e.target.value }))} required />
                <input className="w-full border rounded px-3 py-2" placeholder="Longitude" value={selfAttendanceForm.longitude} onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, longitude: e.target.value }))} required />
              </div>
              <button type="button" onClick={fillCurrentLocation} className="admin-btn admin-btn-secondary text-sm">Use Current Location</button>
              <select className="w-full border rounded px-3 py-2" value={selfAttendanceForm.status} onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
              <input className="w-full border rounded px-3 py-2" placeholder="Remarks" value={selfAttendanceForm.remarks} onChange={(e) => setSelfAttendanceForm((p) => ({ ...p, remarks: e.target.value }))} />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={() => setIsSelfAttendanceModalOpen(false)}>Cancel</button>
                <button className="rounded bg-blue-700 px-3 py-1.5 text-sm text-white" type="submit">Submit Self Attendance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfAttendancePage;
