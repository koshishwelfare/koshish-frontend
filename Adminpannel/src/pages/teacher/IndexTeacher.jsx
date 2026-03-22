import { useContext, useEffect, useMemo, useState } from 'react';
import { TeacherContext } from '../../context/teacher';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StudentAttendancePage from './StudentAttendancePage';
import SelfAttendancePage from './SelfAttendancePage';
import TestListingPage from './TestListingPage';
import CreateTestPage from './CreateTestPage';
import ClassCurriculumPage from './ClassCurriculumPage';
import { toast } from 'react-toastify';

const initialStudentFormState = {
  name: '',
  username: '',
  email: '',
  phoneNumber: '',
  classId: '',
  sessionId: ''
};

const IndexTeacher = () => {
  const {
    teacherStudentsListing,
    selectedStudentPerformance,
    teacherDailyLogs,
    teacherClasses,
    teacherProfile,
    handleGetStudentsList,
    handleGetStudentPerformance,
    handleGetTeacherClasses,
    handleGetTeacherProfile,
    handleUpdateTeacherProfile,
    handleUpdateTeacherPassword,
    handleAddStudent,
    handleRecoverTeacherCredentials,
    handleRecoverStudentCredentials,
    handleSaveDailyTeachingLog,
    handleGetDailyTeachingLogs
  } = useContext(TeacherContext);
  const [activeView, setActiveView] = useState('tests-list');
  const [profileMode, setProfileMode] = useState('view');
  const [studentForm, setStudentForm] = useState(initialStudentFormState);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isStudentProfileModalOpen, setIsStudentProfileModalOpen] = useState(false);
  const [studentProfileLoading, setStudentProfileLoading] = useState(false);
  const [studentListFilters, setStudentListFilters] = useState({
    search: '',
    sessionId: '',
    classId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const [dailyLogForm, setDailyLogForm] = useState({
    classId: '',
    date: new Date().toISOString().slice(0, 10),
    topic: '',
    summary: '',
    homework: '',
    nextPlan: '',
    durationMinutes: 40
  });
  const [recoveryForm, setRecoveryForm] = useState({
    teacherEmail: '',
    studentEmail: '',
    studentUsername: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    bio: '',
    linkedinUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
    websiteUrl: '',
    subject: '',
    classTeacher: '',
    speciality: '',
    quote: '',
    aboutHead: '',
    yog: '',
    about: ''
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isDailyLogModalOpen, setIsDailyLogModalOpen] = useState(false);
  const [dailyLogListFilters, setDailyLogListFilters] = useState({
    search: '',
    classId: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    handleGetDailyTeachingLogs();
    handleGetTeacherClasses();
    handleGetTeacherProfile();
  }, []);

  useEffect(() => {
    if (!teacherProfile) return;
    setProfileForm({
      name: teacherProfile.name || '',
      username: teacherProfile.username || '',
      email: teacherProfile.email || '',
      phoneNumber: teacherProfile.phoneNumber || '',
      profileImage: teacherProfile.profileImage || '',
      bio: teacherProfile.bio || '',
      linkedinUrl: teacherProfile.linkedinUrl || '',
      instagramUrl: teacherProfile.instagramUrl || '',
      facebookUrl: teacherProfile.facebookUrl || '',
      youtubeUrl: teacherProfile.youtubeUrl || '',
      websiteUrl: teacherProfile.websiteUrl || '',
      subject: teacherProfile.subject || '',
      classTeacher: teacherProfile.classTeacher || '',
      speciality: teacherProfile.speciality || '',
      quote: teacherProfile.quote || '',
      aboutHead: teacherProfile.aboutHead || '',
      yog: teacherProfile.yog || '',
      about: teacherProfile.about || ''
    });
  }, [teacherProfile]);

  const teacherSessionOptions = useMemo(() => {
    const map = new Map();
    for (const cls of teacherClasses) {
      const rawSession = cls?.sessionId;
      const sessionObj = rawSession && typeof rawSession === 'object' ? rawSession : null;
      const sessionId = String(sessionObj?._id || rawSession || '');
      if (!sessionId || map.has(sessionId)) continue;
      map.set(sessionId, {
        id: sessionId,
        name: sessionObj?.name || 'Session',
        startYear: sessionObj?.startYear,
        endYear: sessionObj?.endYear
      });
    }
    return Array.from(map.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [teacherClasses]);

  const filteredClassesForStudent = useMemo(() => {
    if (!studentForm.sessionId) return [];
    return teacherClasses.filter((cls) => {
      const clsSession = cls?.sessionId;
      const clsSessionId = String((clsSession && typeof clsSession === 'object' ? clsSession._id : clsSession) || '');
      return clsSessionId === String(studentForm.sessionId);
    });
  }, [teacherClasses, studentForm.sessionId]);

  const filteredClassesForStudentList = useMemo(() => {
    if (!studentListFilters.sessionId) return teacherClasses;
    return teacherClasses.filter((cls) => {
      const clsSession = cls?.sessionId;
      const clsSessionId = String((clsSession && typeof clsSession === 'object' ? clsSession._id : clsSession) || '');
      return clsSessionId === String(studentListFilters.sessionId);
    });
  }, [teacherClasses, studentListFilters.sessionId]);

  const dailyLogListing = useMemo(() => {
    let rows = [...(teacherDailyLogs || [])];

    if (dailyLogListFilters.classId) {
      rows = rows.filter((row) => String(row?.classId?._id || row?.classId || '') === String(dailyLogListFilters.classId));
    }
    if (dailyLogListFilters.search.trim()) {
      const q = dailyLogListFilters.search.trim().toLowerCase();
      rows = rows.filter((row) => {
        const className = `${row?.classId?.name || ''} ${row?.classId?.section || ''}`.toLowerCase();
        return (
          String(row?.date || '').toLowerCase().includes(q) ||
          String(row?.topic || '').toLowerCase().includes(q) ||
          String(row?.summary || '').toLowerCase().includes(q) ||
          String(row?.homework || '').toLowerCase().includes(q) ||
          String(row?.nextPlan || '').toLowerCase().includes(q) ||
          className.includes(q)
        );
      });
    }

    const sortKey = dailyLogListFilters.sortBy;
    const dir = dailyLogListFilters.sortOrder === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const getValue = (row) => {
        if (sortKey === 'className') return `${row?.classId?.name || ''} ${row?.classId?.section || ''}`;
        if (sortKey === 'createdAt') return row?.createdAt || '';
        return row?.[sortKey] || '';
      };
      return String(getValue(a)).localeCompare(String(getValue(b)), undefined, { numeric: true }) * dir;
    });

    const total = rows.length;
    const limit = Number(dailyLogListFilters.limit) || 10;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const page = Math.min(dailyLogListFilters.page, totalPages);
    const pagedRows = rows.slice((page - 1) * limit, (page - 1) * limit + limit);

    return { rows: pagedRows, total, page, totalPages, limit };
  }, [teacherDailyLogs, dailyLogListFilters]);

  const loadStudentListing = async (overrides = {}) => {
    const nextQuery = { ...studentListFilters, ...overrides };
    await handleGetStudentsList(nextQuery);
    if (Object.keys(overrides).length) {
      setStudentListFilters(nextQuery);
    }
  };

  const resetStudentForm = () => {
    setStudentForm(initialStudentFormState);
  };

  const openStudentModal = () => {
    resetStudentForm();
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    resetStudentForm();
  };

  const submitStudent = async (e) => {
    e.preventDefault();
    const payload = {
      name: String(studentForm.name || '').trim(),
      username: String(studentForm.username || '').trim().toLowerCase(),
      email: String(studentForm.email || '').trim().toLowerCase(),
      phoneNumber: String(studentForm.phoneNumber || '').trim(),
      classId: String(studentForm.classId || '').trim(),
      sessionId: String(studentForm.sessionId || '').trim()
    };

    if (!payload.name || !payload.email || !payload.phoneNumber || !payload.classId || !payload.sessionId) {
      toast.error('Please fill all required fields before creating the student.');
      return;
    }

    const selectedClass = filteredClassesForStudent.find((cls) => String(cls?._id || '') === payload.classId);
    if (!selectedClass) {
      toast.error('Selected class is not available for the chosen session. Please select again.');
      setStudentForm((prev) => ({ ...prev, classId: '' }));
      return;
    }

    const created = await handleAddStudent(payload);
    if (created) {
      closeStudentModal();
      await loadStudentListing({ page: 1 });
    }
  };

  const openStudentPerformance = async (studentId) => {
    setStudentProfileLoading(true);
    setIsStudentProfileModalOpen(true);
    await handleGetStudentPerformance(studentId);
    setStudentProfileLoading(false);
  };

  useEffect(() => {
    if (activeView !== 'student-add') return;
    loadStudentListing();
  }, [activeView]);

  useEffect(() => {
    if (activeView !== 'daily-log') return;
    handleGetDailyTeachingLogs();
  }, [activeView]);

  const submitTeacherRecovery = async (e) => {
    e.preventDefault();
    await handleRecoverTeacherCredentials(recoveryForm.teacherEmail);
  };

  const submitStudentRecovery = async (e) => {
    e.preventDefault();
    await handleRecoverStudentCredentials({
      email: recoveryForm.studentEmail,
      username: recoveryForm.studentUsername
    });
  };

  const submitDailyLog = async (e) => {
    e.preventDefault();
    const data = await handleSaveDailyTeachingLog(dailyLogForm);
    if (data) {
      setDailyLogForm((prev) => ({
        ...prev,
        topic: '',
        summary: '',
        homework: '',
        nextPlan: ''
      }));
      setIsDailyLogModalOpen(false);
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    await handleUpdateTeacherProfile({
      name: profileForm.name,
      phoneNumber: profileForm.phoneNumber,
      profileImage: profileImageFile ? undefined : profileForm.profileImage,
      image: profileImageFile || undefined,
      bio: profileForm.bio,
      linkedinUrl: profileForm.linkedinUrl,
      instagramUrl: profileForm.instagramUrl,
      facebookUrl: profileForm.facebookUrl,
      youtubeUrl: profileForm.youtubeUrl,
      websiteUrl: profileForm.websiteUrl,
      subject: profileForm.subject,
      classTeacher: profileForm.classTeacher,
      speciality: profileForm.speciality,
      quote: profileForm.quote,
      aboutHead: profileForm.aboutHead,
      yog: profileForm.yog ? Number(profileForm.yog) : undefined,
      about: profileForm.about
    });
    setProfileImageFile(null);
  };

  const submitPasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }
    const ok = await handleUpdateTeacherPassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    if (ok) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const menuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'curriculum', label: 'Class Management' },
    { key: 'tests-list', label: 'Test Listing' },
    { key: 'tests-create', label: 'Create Test' },
    { key: 'self-attendance', label: 'Self Attendance' },
    { key: 'student-attendance', label: 'Student Attendance' },
    { key: 'daily-log', label: 'Daily Teaching Log' },
    { key: 'student-add', label: 'Add Student' },
    { key: 'recovery', label: 'Recovery' }
  ];

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content mt-5 flex flex-col gap-4 md:flex-row">
        <aside className="admin-surface h-fit w-full p-3 md:sticky md:top-[84px] md:w-72">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Teacher Menu</p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveView(item.key)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${activeView === item.key ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="admin-surface w-full p-4 sm:p-6">
        {activeView === 'profile' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded px-4 py-2 text-sm font-semibold ${profileMode === 'view' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                onClick={() => setProfileMode('view')}
              >
                View Profile
              </button>
              <button
                type="button"
                className={`rounded px-4 py-2 text-sm font-semibold ${profileMode === 'edit' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                onClick={() => setProfileMode('edit')}
              >
                Edit Profile
              </button>
            </div>

            {profileMode === 'view' ? (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      {profileForm.profileImage ? (
                        <img src={profileForm.profileImage} alt="Teacher profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-500">
                          {(profileForm.name || 'M').slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-[220px] flex-1">
                      <h2 className="text-2xl font-bold text-slate-900">{profileForm.name || 'Mentor'}</h2>
                      <p className="mt-1 text-sm text-slate-600">{profileForm.email || '-'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                          {teacherProfile?.role || 'mentor'}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {profileForm.subject || 'No Subject'}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {profileForm.classTeacher || 'No Class Assigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Username</p>
                      <p className="text-sm font-medium text-slate-800">{profileForm.username || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-slate-800">{profileForm.phoneNumber || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Speciality</p>
                      <p className="text-sm font-medium text-slate-800">{profileForm.speciality || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">YOG</p>
                      <p className="text-sm font-medium text-slate-800">{profileForm.yog || '-'}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</p>
                      <p className="mt-1 text-sm text-slate-700">{profileForm.bio || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">About</p>
                      <p className="mt-1 text-sm text-slate-700">{profileForm.aboutHead || '-'}</p>
                      <p className="mt-1 text-sm text-slate-700">{profileForm.about || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quote</p>
                      <p className="mt-1 text-sm italic text-slate-700">{profileForm.quote || '-'}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">Username and email are locked and cannot be changed.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Social & Public Links</h2>
                  <div className="space-y-2 text-sm text-slate-700 break-words">
                    <p><strong>LinkedIn:</strong> {profileForm.linkedinUrl || '-'}</p>
                    <p><strong>Instagram:</strong> {profileForm.instagramUrl || '-'}</p>
                    <p><strong>Facebook:</strong> {profileForm.facebookUrl || '-'}</p>
                    <p><strong>YouTube:</strong> {profileForm.youtubeUrl || '-'}</p>
                    <p><strong>Website:</strong> {profileForm.websiteUrl || '-'}</p>
                  </div>

                  <form className="mt-5 space-y-2 border-t pt-4" onSubmit={submitPasswordUpdate}>
                    <h3 className="text-base font-semibold text-slate-900">Change Password</h3>
                    <input
                      className="w-full border rounded px-3 py-2"
                      type="password"
                      placeholder="Current Password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      required
                    />
                    <input
                      className="w-full border rounded px-3 py-2"
                      type="password"
                      placeholder="New Password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                    />
                    <input
                      className="w-full border rounded px-3 py-2"
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                    {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <p className="text-xs text-rose-700">Confirm password does not match new password.</p>
                    )}
                    <button
                      className="w-full py-2 bg-slate-900 text-white rounded disabled:opacity-60"
                      type="submit"
                      disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={submitProfile}>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-semibold">Edit Mentor Profile</h2>
                  <p className="mt-1 text-sm text-slate-500">Update your public profile and teaching details.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Basic Information</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Full Name" value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500" placeholder="Username" value={profileForm.username} readOnly />
                    <input className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500" placeholder="Email" value={profileForm.email} readOnly />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Phone Number" value={profileForm.phoneNumber} onChange={(e) => setProfileForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Teaching Details</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Subject" value={profileForm.subject} onChange={(e) => setProfileForm((p) => ({ ...p, subject: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Class Teacher" value={profileForm.classTeacher} onChange={(e) => setProfileForm((p) => ({ ...p, classTeacher: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Speciality" value={profileForm.speciality} onChange={(e) => setProfileForm((p) => ({ ...p, speciality: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" type="number" placeholder="YOG" value={profileForm.yog} onChange={(e) => setProfileForm((p) => ({ ...p, yog: e.target.value }))} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">About & Bio</h3>
                  <div className="mt-3 space-y-3">
                    <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2" rows={3} placeholder="Bio" value={profileForm.bio} onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="About Heading" value={profileForm.aboutHead} onChange={(e) => setProfileForm((p) => ({ ...p, aboutHead: e.target.value }))} />
                    <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2" rows={4} placeholder="About" value={profileForm.about} onChange={(e) => setProfileForm((p) => ({ ...p, about: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Quote" value={profileForm.quote} onChange={(e) => setProfileForm((p) => ({ ...p, quote: e.target.value }))} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Social Links</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="LinkedIn URL" value={profileForm.linkedinUrl} onChange={(e) => setProfileForm((p) => ({ ...p, linkedinUrl: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Instagram URL" value={profileForm.instagramUrl} onChange={(e) => setProfileForm((p) => ({ ...p, instagramUrl: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Facebook URL" value={profileForm.facebookUrl} onChange={(e) => setProfileForm((p) => ({ ...p, facebookUrl: e.target.value }))} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="YouTube URL" value={profileForm.youtubeUrl} onChange={(e) => setProfileForm((p) => ({ ...p, youtubeUrl: e.target.value }))} />
                    <input className="sm:col-span-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Website URL" value={profileForm.websiteUrl} onChange={(e) => setProfileForm((p) => ({ ...p, websiteUrl: e.target.value }))} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Profile Image</h3>
                  <div className="mt-3 space-y-3">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" type="file" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)} />
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Profile Image URL (optional fallback)" value={profileForm.profileImage} onChange={(e) => setProfileForm((p) => ({ ...p, profileImage: e.target.value }))} />
                  </div>
                </div>

                <button className="w-full rounded-lg bg-blue-700 py-2.5 font-semibold text-white" type="submit">Save Profile</button>
              </form>
            )}
          </div>
        ) : activeView === 'tests-list' ? (
          <TestListingPage />
        ) : activeView === 'curriculum' ? (
          <ClassCurriculumPage />
        ) : activeView === 'tests-create' ? (
          <CreateTestPage onCreated={() => setActiveView('tests-list')} />
        ) : activeView === 'self-attendance' ? (
          <SelfAttendancePage />
        ) : activeView === 'student-attendance' ? (
          <StudentAttendancePage />
        ) : activeView === 'daily-log' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-4 shadow">
              <h2 className="text-xl font-semibold">Daily Teaching Log Listing</h2>
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => setIsDailyLogModalOpen(true)}>
                Add Daily Log
              </button>
            </div>

            <div className="grid gap-2 rounded-lg bg-white p-4 shadow md:grid-cols-6">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Search topic, summary, homework"
                value={dailyLogListFilters.search}
                onChange={(e) => setDailyLogListFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
              />
              <select className="w-full border rounded px-3 py-2" value={dailyLogListFilters.classId} onChange={(e) => setDailyLogListFilters((p) => ({ ...p, classId: e.target.value, page: 1 }))}>
                <option value="">All Classes</option>
                {teacherClasses.map((cls) => (
                  <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
                ))}
              </select>
              <select className="w-full border rounded px-3 py-2" value={dailyLogListFilters.sortBy} onChange={(e) => setDailyLogListFilters((p) => ({ ...p, sortBy: e.target.value, page: 1 }))}>
                <option value="date">Sort: Date</option>
                <option value="topic">Sort: Topic</option>
                <option value="className">Sort: Class</option>
                <option value="createdAt">Sort: Created Time</option>
              </select>
              <select className="w-full border rounded px-3 py-2" value={dailyLogListFilters.sortOrder} onChange={(e) => setDailyLogListFilters((p) => ({ ...p, sortOrder: e.target.value, page: 1 }))}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
              <select className="w-full border rounded px-3 py-2" value={dailyLogListFilters.limit} onChange={(e) => setDailyLogListFilters((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))}>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => handleGetDailyTeachingLogs()}>
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Class</th>
                    <th className="px-4 py-3 font-bold">Topic</th>
                    <th className="px-4 py-3 font-bold">Summary</th>
                    <th className="px-4 py-3 font-bold">Homework</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyLogListing.rows.map((row) => (
                    <tr key={row._id} className="border-t border-slate-100 hover:bg-slate-50/70">
                      <td className="px-4 py-3 text-slate-700">{row.date || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.classId ? `${row.classId.name || ''} ${row.classId.section || ''}`.trim() : '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.topic || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.summary || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.homework || '-'}</td>
                    </tr>
                  ))}
                  {!dailyLogListing.rows.length && (
                    <tr>
                      <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>No daily logs found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <p className="text-xs font-medium text-slate-500">
                  Page {dailyLogListing.page} of {dailyLogListing.totalPages} | Total {dailyLogListing.total}
                </p>
                <div className="flex gap-2">
                  <button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={dailyLogListing.page <= 1} onClick={() => setDailyLogListFilters((p) => ({ ...p, page: p.page - 1 }))}>Prev</button>
                  <button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={dailyLogListing.page >= dailyLogListing.totalPages} onClick={() => setDailyLogListFilters((p) => ({ ...p, page: p.page + 1 }))}>Next</button>
                </div>
              </div>
            </div>

            {isDailyLogModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
                  <h3 className="mb-3 text-lg font-semibold">Add Daily Teaching Log</h3>
                  <form className="space-y-3" onSubmit={submitDailyLog}>
                    <select className="w-full border rounded px-3 py-2" value={dailyLogForm.classId} onChange={(e) => setDailyLogForm((p) => ({ ...p, classId: e.target.value }))} required>
                      <option value="">Select Class</option>
                      {teacherClasses.map((cls) => (
                        <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
                      ))}
                    </select>
                    <input className="w-full border rounded px-3 py-2" type="date" value={dailyLogForm.date} onChange={(e) => setDailyLogForm((p) => ({ ...p, date: e.target.value }))} required />
                    <input className="w-full border rounded px-3 py-2" placeholder="Topic taught" value={dailyLogForm.topic} onChange={(e) => setDailyLogForm((p) => ({ ...p, topic: e.target.value }))} required />
                    <textarea className="w-full border rounded px-3 py-2" placeholder="Class summary" value={dailyLogForm.summary} onChange={(e) => setDailyLogForm((p) => ({ ...p, summary: e.target.value }))} />
                    <textarea className="w-full border rounded px-3 py-2" placeholder="Homework" value={dailyLogForm.homework} onChange={(e) => setDailyLogForm((p) => ({ ...p, homework: e.target.value }))} />
                    <textarea className="w-full border rounded px-3 py-2" placeholder="Next plan" value={dailyLogForm.nextPlan} onChange={(e) => setDailyLogForm((p) => ({ ...p, nextPlan: e.target.value }))} />
                    <input className="w-full border rounded px-3 py-2" type="number" min={0} placeholder="Duration in minutes" value={dailyLogForm.durationMinutes} onChange={(e) => setDailyLogForm((p) => ({ ...p, durationMinutes: e.target.value }))} />
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={() => setIsDailyLogModalOpen(false)}>Cancel</button>
                      <button className="rounded bg-blue-700 px-3 py-1.5 text-sm text-white" type="submit">Save Daily Log</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : activeView === 'student-add' ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-4 shadow">
              <h2 className="text-xl font-semibold">Student Listing</h2>
              <button type="button" className="admin-btn admin-btn-primary" onClick={openStudentModal}>
                Add Student
              </button>
            </div>

            <div className="grid gap-2 rounded-lg bg-white p-4 shadow md:grid-cols-7">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Search name, username, email, roll"
                value={studentListFilters.search}
                onChange={(e) => setStudentListFilters((p) => ({ ...p, search: e.target.value }))}
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={studentListFilters.sessionId}
                onChange={(e) => setStudentListFilters((p) => ({ ...p, sessionId: e.target.value, classId: '', page: 1 }))}
              >
                <option value="">All Sessions</option>
                {teacherSessionOptions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {`${session.name}${session.startYear ? ` (${session.startYear}${session.endYear ? `-${session.endYear}` : ''})` : ''}`}
                  </option>
                ))}
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={studentListFilters.classId}
                onChange={(e) => setStudentListFilters((p) => ({ ...p, classId: e.target.value, page: 1 }))}
              >
                <option value="">All Classes</option>
                {filteredClassesForStudentList.map((cls) => (
                  <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
                ))}
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={studentListFilters.sortBy}
                onChange={(e) => setStudentListFilters((p) => ({ ...p, sortBy: e.target.value, page: 1 }))}
              >
                <option value="createdAt">Sort: Created Time</option>
                <option value="name">Sort: Name</option>
                <option value="username">Sort: Username</option>
                <option value="email">Sort: Email</option>
                <option value="rollNumber">Sort: Roll Number</option>
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={studentListFilters.sortOrder}
                onChange={(e) => setStudentListFilters((p) => ({ ...p, sortOrder: e.target.value, page: 1 }))}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={studentListFilters.limit}
                onChange={(e) => setStudentListFilters((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))}
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => loadStudentListing({ page: 1 })}>
                Apply
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                    <th className="px-4 py-3 font-bold">Name</th>
                    <th className="px-4 py-3 font-bold">Username</th>
                    <th className="px-4 py-3 font-bold">Email</th>
                    <th className="px-4 py-3 font-bold">Roll/Reg</th>
                    <th className="px-4 py-3 font-bold">Class</th>
                    <th className="px-4 py-3 font-bold">Session</th>
                    <th className="px-4 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(teacherStudentsListing?.records || []).map((row) => (
                    <tr key={row._id} className="border-t border-slate-100 hover:bg-slate-50/70">
                      <td className="px-4 py-3 text-slate-700">{row.name || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.username || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.email || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.rollNumber || row.registrationNumber || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.classId ? `${row.classId.name || ''} ${row.classId.section || ''}`.trim() : '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{row.sessionId?.name || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">
                        <button
                          type="button"
                          className="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          onClick={() => openStudentPerformance(row._id)}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!teacherStudentsListing?.records?.length && (
                    <tr>
                      <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>No students found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <p className="text-xs font-medium text-slate-500">
                  Page {teacherStudentsListing?.pagination?.page || 1} of {teacherStudentsListing?.pagination?.totalPages || 1} | Total {teacherStudentsListing?.pagination?.total || 0}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded border px-3 py-1.5 text-sm"
                    disabled={(teacherStudentsListing?.pagination?.page || 1) <= 1}
                    onClick={() => {
                      const next = Math.max((teacherStudentsListing?.pagination?.page || 1) - 1, 1);
                      loadStudentListing({ page: next });
                    }}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="rounded border px-3 py-1.5 text-sm"
                    disabled={(teacherStudentsListing?.pagination?.page || 1) >= (teacherStudentsListing?.pagination?.totalPages || 1)}
                    onClick={() => {
                      const next = Math.min(
                        (teacherStudentsListing?.pagination?.page || 1) + 1,
                        teacherStudentsListing?.pagination?.totalPages || 1
                      );
                      loadStudentListing({ page: next });
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {isStudentModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
                  <h3 className="mb-3 text-lg font-semibold">Add Student</h3>
                  <form className="space-y-3" onSubmit={submitStudent}>
                    <input className="w-full border rounded px-3 py-2" placeholder="Student Name" value={studentForm.name} onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} required />
                    <input className="w-full border rounded px-3 py-2" placeholder="Username (optional: auto-generated if empty)" value={studentForm.username} onChange={(e) => setStudentForm((p) => ({ ...p, username: e.target.value }))} />
                    <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm((p) => ({ ...p, email: e.target.value }))} required />
                    <input className="w-full border rounded px-3 py-2" placeholder="Phone Number" value={studentForm.phoneNumber} onChange={(e) => setStudentForm((p) => ({ ...p, phoneNumber: e.target.value }))} required />
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={studentForm.sessionId}
                      onChange={(e) => setStudentForm((p) => ({ ...p, sessionId: e.target.value, classId: '' }))}
                      required
                    >
                      <option value="">Select Session</option>
                      {teacherSessionOptions.map((session) => (
                        <option key={session.id} value={session.id}>
                          {`${session.name}${session.startYear ? ` (${session.startYear}${session.endYear ? `-${session.endYear}` : ''})` : ''}`}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={studentForm.classId}
                      onChange={(e) => {
                        setStudentForm((p) => ({ ...p, classId: e.target.value }));
                      }}
                      required
                      disabled={!studentForm.sessionId}
                    >
                      <option value="">{studentForm.sessionId ? 'Select Class' : 'Select Session First'}</option>
                      {filteredClassesForStudent.map((cls) => (
                        <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
                      ))}
                    </select>
                    {!studentForm.sessionId && (
                      <p className="text-xs text-slate-500">Choose a session to load available classes.</p>
                    )}
                    {studentForm.sessionId && !filteredClassesForStudent.length && (
                      <p className="text-xs text-amber-700">No classes found for selected session.</p>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={closeStudentModal}>
                        Cancel
                      </button>
                      <button
                        className="rounded bg-blue-700 px-3 py-1.5 text-sm text-white disabled:opacity-60"
                        type="submit"
                        disabled={!studentForm.sessionId || !studentForm.classId}
                      >
                        Create Student
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isStudentProfileModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-4xl rounded-lg bg-white p-5 shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Student Profile & Performance</h3>
                    <button type="button" className="rounded border px-3 py-1.5 text-sm" onClick={() => setIsStudentProfileModalOpen(false)}>Close</button>
                  </div>

                  {studentProfileLoading ? (
                    <p className="py-10 text-center text-slate-500">Loading student performance...</p>
                  ) : !selectedStudentPerformance ? (
                    <p className="py-10 text-center text-slate-500">No performance data found.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">Student</p>
                          <p className="text-sm font-semibold text-slate-800">{selectedStudentPerformance.student?.name || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">Roll/Reg</p>
                          <p className="text-sm font-semibold text-slate-800">{selectedStudentPerformance.student?.rollNumber || selectedStudentPerformance.student?.registrationNumber || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">Class</p>
                          <p className="text-sm font-semibold text-slate-800">{selectedStudentPerformance.student?.classId ? `${selectedStudentPerformance.student.classId.name || ''} ${selectedStudentPerformance.student.classId.section || ''}`.trim() : '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">Session</p>
                          <p className="text-sm font-semibold text-slate-800">{selectedStudentPerformance.student?.sessionId?.name || '-'}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 p-4">
                          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Attendance Performance</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                            <p>Total Records: <strong>{selectedStudentPerformance.attendance?.totalRecords || 0}</strong></p>
                            <p>Present: <strong>{selectedStudentPerformance.attendance?.present || 0}</strong></p>
                            <p>Absent: <strong>{selectedStudentPerformance.attendance?.absent || 0}</strong></p>
                            <p>Late: <strong>{selectedStudentPerformance.attendance?.late || 0}</strong></p>
                          </div>
                          <p className="mt-3 text-sm">Attendance %: <strong>{selectedStudentPerformance.attendance?.attendancePercentage || 0}%</strong></p>
                        </div>

                        <div className="rounded-lg border border-slate-200 p-4">
                          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Test Performance</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                            <p>Tests Attempted: <strong>{selectedStudentPerformance.tests?.attempted || 0}</strong></p>
                            <p>Best Score %: <strong>{selectedStudentPerformance.tests?.bestScorePercentage || 0}%</strong></p>
                            <p>Total Score: <strong>{selectedStudentPerformance.tests?.totalScore || 0}</strong></p>
                            <p>Total Marks: <strong>{selectedStudentPerformance.tests?.totalMarks || 0}</strong></p>
                          </div>
                          <p className="mt-3 text-sm">Average Score %: <strong>{selectedStudentPerformance.tests?.averageScorePercentage || 0}%</strong></p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 p-4">
                          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Recent Attendance</h4>
                          <div className="max-h-48 overflow-auto text-sm">
                            {(selectedStudentPerformance.attendance?.recent || []).map((item, idx) => (
                              <div key={`${item.date}-${idx}`} className="flex items-center justify-between border-b border-slate-100 py-1.5">
                                <span>{item.date || '-'}</span>
                                <span className="font-semibold">{item.status || '-'}</span>
                              </div>
                            ))}
                            {!selectedStudentPerformance.attendance?.recent?.length && <p className="text-slate-500">No attendance records.</p>}
                          </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 p-4">
                          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Recent Test Submissions</h4>
                          <div className="max-h-48 overflow-auto text-sm">
                            {(selectedStudentPerformance.tests?.recent || []).map((item, idx) => (
                              <div key={`${item._id || idx}`} className="border-b border-slate-100 py-1.5">
                                <p className="font-medium text-slate-800">{item.testId?.title || 'Test'}</p>
                                <p className="text-xs text-slate-500">{item.testId?.subject || '-'} | {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : '-'}</p>
                                <p className="text-xs text-slate-700">Score: {item.score || 0}/{item.totalMarks || 0}</p>
                              </div>
                            ))}
                            {!selectedStudentPerformance.tests?.recent?.length && <p className="text-slate-500">No test submissions.</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <form className="bg-white rounded-lg shadow p-5 space-y-3" onSubmit={submitTeacherRecovery}>
              <h2 className="text-xl font-semibold">Recover Teacher Credentials</h2>
              <input className="w-full border rounded px-3 py-2" type="email" placeholder="Teacher Email" value={recoveryForm.teacherEmail} onChange={(e) => setRecoveryForm((p) => ({ ...p, teacherEmail: e.target.value }))} required />
              <button className="w-full py-2 bg-blue-700 text-white rounded" type="submit">Recover Teacher</button>
            </form>

            <form className="bg-white rounded-lg shadow p-5 space-y-3" onSubmit={submitStudentRecovery}>
              <h2 className="text-xl font-semibold">Recover Student Credentials</h2>
              <input className="w-full border rounded px-3 py-2" type="text" placeholder="Student Username (recommended)" value={recoveryForm.studentUsername} onChange={(e) => setRecoveryForm((p) => ({ ...p, studentUsername: e.target.value }))} />
              <input className="w-full border rounded px-3 py-2" type="email" placeholder="Student Email (optional)" value={recoveryForm.studentEmail} onChange={(e) => setRecoveryForm((p) => ({ ...p, studentEmail: e.target.value }))} />
              <button className="w-full py-2 bg-green-700 text-white rounded" type="submit" disabled={!recoveryForm.studentUsername && !recoveryForm.studentEmail}>Recover Student</button>
            </form>
          </div>
        )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IndexTeacher;
