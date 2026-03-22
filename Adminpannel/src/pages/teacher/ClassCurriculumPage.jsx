import { useContext, useEffect, useMemo, useState } from 'react';
import { TeacherContext } from '../../context/teacher';
import Pagination from '../../components/common/Pagination';

const initialSubjectForm = { subjectName: '', description: '' };
const initialChapterForm = { chapterTitle: '', description: '' };
const surfaceClass = 'admin-surface p-4';
const tableSurfaceClass = 'admin-surface overflow-x-auto p-4';
const fieldClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none';
const modalPanelClass = 'w-full rounded-xl border border-slate-200 bg-white p-5 shadow-xl';

const ClassCurriculumPage = () => {
  const {
    teacherClasses,
    teacherClassCurriculum,
    handleGetTeacherClasses,
    handleGetStudentsList,
    handleGetClassCurriculum,
    handleAddClassSubject,
    handleAddClassChapter,
    handleMarkClassChapterTaught,
    handleGetAvailableClassStudents,
    handleAssignStudentsToClass
  } = useContext(TeacherContext);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [classTab, setClassTab] = useState('subjects');
  const [subjectForm, setSubjectForm] = useState(initialSubjectForm);
  const [chapterForm, setChapterForm] = useState(initialChapterForm);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectQuery, setSubjectQuery] = useState({
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    filterBy: 'all',
    page: 1,
    limit: 10
  });
  const [chapterQuery, setChapterQuery] = useState({
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    filterBy: 'all'
  });
  const [isStudentAssignModalOpen, setIsStudentAssignModalOpen] = useState(false);
  const [studentAssignQuery, setStudentAssignQuery] = useState({
    search: '',
    page: 1,
    limit: 10,
    includeMapped: false
  });
  const [availableStudentsData, setAvailableStudentsData] = useState({
    records: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
  });
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [classStudentQuery, setClassStudentQuery] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const [classStudentsData, setClassStudentsData] = useState({
    records: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const availableAssignRows = useMemo(() => {
    const rows = availableStudentsData?.records || [];
    if (studentAssignQuery.includeMapped) return rows;
    return rows.filter((student) => {
      const mappedClassId = student?.classId?._id || student?.classId || null;
      return !mappedClassId;
    });
  }, [availableStudentsData, studentAssignQuery.includeMapped]);

  const sortedClasses = useMemo(() => {
    return [...(teacherClasses || [])].sort((a, b) => {
      const aLabel = `${a?.name || ''} ${a?.grade || ''} ${a?.section || ''}`.trim();
      const bLabel = `${b?.name || ''} ${b?.grade || ''} ${b?.section || ''}`.trim();
      return aLabel.localeCompare(bLabel, undefined, { numeric: true });
    });
  }, [teacherClasses]);

  useEffect(() => {
    handleGetTeacherClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId && sortedClasses.length) {
      setSelectedClassId(String(sortedClasses[0]._id));
    }
  }, [sortedClasses, selectedClassId]);

  const loadCurriculum = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      await handleGetClassCurriculum(classId);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedClassId) return;
    setSelectedSubjectId('');
    setClassTab('subjects');
    setSubjectQuery((prev) => ({ ...prev, page: 1 }));
    setClassStudentQuery({
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
    setClassStudentsData({
      records: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
    });
    setChapterQuery({ search: '', sortBy: 'updatedAt', sortOrder: 'desc', filterBy: 'all' });
    setChapterForm(initialChapterForm);
    setSubjectForm(initialSubjectForm);
    setIsSubjectModalOpen(false);
    loadCurriculum(selectedClassId);
  }, [selectedClassId]);

  const loadClassStudents = async (overrides = {}) => {
    if (!selectedClassId) return;
    const nextQuery = {
      ...classStudentQuery,
      ...overrides,
      classId: selectedClassId
    };
    setSaving(true);
    const data = await handleGetStudentsList(nextQuery);
    setSaving(false);
    if (data) {
      setClassStudentsData(data);
      if (Object.keys(overrides).length) {
        setClassStudentQuery((prev) => ({ ...prev, ...overrides }));
      }
    }
  };

  useEffect(() => {
    if (classTab !== 'students' || !selectedClassId) return;
    loadClassStudents({ page: 1 });
  }, [classTab, selectedClassId]);

  const normalizedSubjects = useMemo(() => {
    return (teacherClassCurriculum?.subjects || []).map((subject) => {
      const chapters = subject?.chapters || [];
      const taughtCount = chapters.filter((chapter) => chapter?.isTaught).length;
      return {
        ...subject,
        chapterCount: chapters.length,
        taughtCount,
        pendingCount: Math.max(chapters.length - taughtCount, 0)
      };
    });
  }, [teacherClassCurriculum]);

  const filteredSubjects = useMemo(() => {
    let rows = [...normalizedSubjects];

    if (subjectQuery.search.trim()) {
      const q = subjectQuery.search.trim().toLowerCase();
      rows = rows.filter((subject) =>
        String(subject?.name || '').toLowerCase().includes(q)
        || String(subject?.description || '').toLowerCase().includes(q)
      );
    }

    if (subjectQuery.filterBy === 'has_chapters') {
      rows = rows.filter((subject) => subject.chapterCount > 0);
    } else if (subjectQuery.filterBy === 'no_chapters') {
      rows = rows.filter((subject) => subject.chapterCount === 0);
    } else if (subjectQuery.filterBy === 'pending') {
      rows = rows.filter((subject) => subject.chapterCount > 0 && subject.pendingCount > 0);
    } else if (subjectQuery.filterBy === 'completed') {
      rows = rows.filter((subject) => subject.chapterCount > 0 && subject.pendingCount === 0);
    }

    const dir = subjectQuery.sortOrder === 'asc' ? 1 : -1;
    const sortBy = subjectQuery.sortBy;
    rows.sort((a, b) => {
      if (sortBy === 'chapterCount' || sortBy === 'taughtCount' || sortBy === 'pendingCount') {
        return ((a?.[sortBy] || 0) - (b?.[sortBy] || 0)) * dir;
      }
      const aValue = String(a?.[sortBy] || '');
      const bValue = String(b?.[sortBy] || '');
      return aValue.localeCompare(bValue, undefined, { numeric: true }) * dir;
    });

    return rows;
  }, [normalizedSubjects, subjectQuery]);

  const subjectPagination = useMemo(() => {
    const total = filteredSubjects.length;
    const limit = Number(subjectQuery.limit) || 10;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const page = Math.min(subjectQuery.page, totalPages);
    const rows = filteredSubjects.slice((page - 1) * limit, (page - 1) * limit + limit);
    return { rows, total, page, limit, totalPages };
  }, [filteredSubjects, subjectQuery.page, subjectQuery.limit]);

  const selectedSubject = useMemo(
    () => normalizedSubjects.find((subject) => String(subject._id) === String(selectedSubjectId)) || null,
    [normalizedSubjects, selectedSubjectId]
  );

  const filteredChapters = useMemo(() => {
    const chapters = selectedSubject?.chapters || [];
    let rows = [...chapters];

    if (chapterQuery.search.trim()) {
      const q = chapterQuery.search.trim().toLowerCase();
      rows = rows.filter((chapter) =>
        String(chapter?.title || '').toLowerCase().includes(q)
        || String(chapter?.description || '').toLowerCase().includes(q)
      );
    }

    if (chapterQuery.filterBy === 'taught') {
      rows = rows.filter((chapter) => chapter?.isTaught);
    } else if (chapterQuery.filterBy === 'pending') {
      rows = rows.filter((chapter) => !chapter?.isTaught);
    }

    const dir = chapterQuery.sortOrder === 'asc' ? 1 : -1;
    const sortBy = chapterQuery.sortBy;
    rows.sort((a, b) => {
      if (sortBy === 'status') {
        return ((a?.isTaught ? 1 : 0) - (b?.isTaught ? 1 : 0)) * dir;
      }
      const aValue = String(a?.[sortBy] || '');
      const bValue = String(b?.[sortBy] || '');
      return aValue.localeCompare(bValue, undefined, { numeric: true }) * dir;
    });

    return rows;
  }, [selectedSubject, chapterQuery]);

  const onSubmitSubject = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !subjectForm.subjectName.trim()) return;

    setSaving(true);
    const data = await handleAddClassSubject(selectedClassId, {
      subjectName: subjectForm.subjectName.trim(),
      description: subjectForm.description.trim()
    });
    setSaving(false);

    if (data) {
      setSubjectForm(initialSubjectForm);
      setIsSubjectModalOpen(false);
    }
  };

  const onSubmitChapter = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSubjectId || !chapterForm.chapterTitle.trim()) return;

    setSaving(true);
    const data = await handleAddClassChapter(selectedClassId, selectedSubjectId, {
      chapterTitle: chapterForm.chapterTitle.trim(),
      description: chapterForm.description.trim()
    });
    setSaving(false);

    if (data) {
      setChapterForm(initialChapterForm);
    }
  };

  const onToggleTaught = async (subjectId, chapter) => {
    if (!selectedClassId || !subjectId || !chapter?._id) return;

    setSaving(true);
    await handleMarkClassChapterTaught(selectedClassId, subjectId, chapter._id, {
      isTaught: !chapter.isTaught,
      taughtAt: new Date().toISOString()
    });
    setSaving(false);
  };

  const loadAvailableStudents = async (classId, query = studentAssignQuery) => {
    if (!classId) return;
    setSaving(true);
    const data = await handleGetAvailableClassStudents(classId, query);
    setSaving(false);
    if (data) {
      setAvailableStudentsData(data);
    }
    return data;
  };

  const openStudentAssignModal = async () => {
    if (!selectedClassId) return;
    const initialQuery = { search: '', page: 1, limit: 10, includeMapped: false };
    setStudentAssignQuery(initialQuery);
    setSelectedStudentIds([]);
    setIsStudentAssignModalOpen(true);

    const data = await loadAvailableStudents(selectedClassId, initialQuery);
    const hasUnassigned = Boolean(data?.records?.some((student) => !(student?.classId?._id || student?.classId)));

    if (!hasUnassigned) {
      const fallbackQuery = { ...initialQuery, includeMapped: true };
      setStudentAssignQuery(fallbackQuery);
      await loadAvailableStudents(selectedClassId, fallbackQuery);
    }
  };

  const onSubmitStudentAssignment = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedStudentIds.length) return;

    setSaving(true);
    const data = await handleAssignStudentsToClass(selectedClassId, {
      studentIds: selectedStudentIds
    });
    setSaving(false);

    if (data) {
      setSelectedStudentIds([]);
      await loadAvailableStudents(selectedClassId, studentAssignQuery);
    }
  };

  return (
    <div className="space-y-4">
      <div className={surfaceClass}>
        <h2 className="text-xl font-semibold">Class Management</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage class subjects and chapter progress with dedicated navigation.
        </p>
      </div>

      <div className={`${surfaceClass} grid gap-2 md:grid-cols-4`}>
        <select
          className={fieldClass}
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          disabled={!sortedClasses.length || loading || saving}
        >
          {!sortedClasses.length && <option value="">No classes found</option>}
          {sortedClasses.map((cls) => (
            <option key={cls._id} value={cls._id}>{`${cls.name} - ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`}</option>
          ))}
        </select>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => selectedClassId && loadCurriculum(selectedClassId)}
          disabled={!selectedClassId || loading || saving}
        >
          Refresh Curriculum
        </button>
      </div>

      <div className="admin-surface p-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded px-4 py-2 text-sm font-semibold ${classTab === 'subjects' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setClassTab('subjects')}
          >
            Subject Listing
          </button>
          <button
            type="button"
            className={`rounded px-4 py-2 text-sm font-semibold ${classTab === 'students' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setClassTab('students')}
          >
            Student Listing
          </button>
        </div>
      </div>

      {classTab === 'subjects' && !selectedSubject && (
        <div className={surfaceClass}>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={!selectedClassId || loading || saving}
            onClick={() => setIsSubjectModalOpen(true)}
          >
            Add Subject
          </button>
        </div>
      )}

      {classTab === 'subjects' && (loading ? (
        <div className="admin-surface p-8 text-center text-sm text-slate-500">Loading curriculum...</div>
      ) : selectedSubject ? (
        <div className="space-y-4">
          <div className="admin-surface border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary mb-2"
                  onClick={() => {
                    setSelectedSubjectId('');
                    setChapterQuery({ search: '', sortBy: 'updatedAt', sortOrder: 'desc', filterBy: 'all' });
                    setChapterForm(initialChapterForm);
                  }}
                >
                  Back to Subjects
                </button>
                <h3 className="text-lg font-semibold text-slate-900">{selectedSubject.name}</h3>
                <p className="text-xs text-slate-500">{selectedSubject.description || 'No description'}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {`${selectedSubject.taughtCount}/${selectedSubject.chapterCount} taught`}
              </span>
            </div>

            <form className="mt-3 grid gap-2 md:grid-cols-4" onSubmit={onSubmitChapter}>
              <input
                className={`md:col-span-2 ${fieldClass}`}
                placeholder="Chapter title"
                value={chapterForm.chapterTitle}
                onChange={(e) => setChapterForm((prev) => ({ ...prev, chapterTitle: e.target.value }))}
                disabled={loading || saving}
                required
              />
              <input
                className={fieldClass}
                placeholder="Chapter description"
                value={chapterForm.description}
                onChange={(e) => setChapterForm((prev) => ({ ...prev, description: e.target.value }))}
                disabled={loading || saving}
              />
              <button className="admin-btn admin-btn-secondary" type="submit" disabled={loading || saving}>
                Add Chapter
              </button>
            </form>
          </div>

          <div className={`${surfaceClass} grid gap-2 md:grid-cols-4`}>
            <input
              className={fieldClass}
              placeholder="Search chapter"
              value={chapterQuery.search}
              onChange={(e) => setChapterQuery((prev) => ({ ...prev, search: e.target.value }))}
            />
            <select className={fieldClass} value={chapterQuery.filterBy} onChange={(e) => setChapterQuery((prev) => ({ ...prev, filterBy: e.target.value }))}>
              <option value="all">All Status</option>
              <option value="taught">Taught</option>
              <option value="pending">Pending</option>
            </select>
            <select className={fieldClass} value={chapterQuery.sortBy} onChange={(e) => setChapterQuery((prev) => ({ ...prev, sortBy: e.target.value }))}>
              <option value="updatedAt">Sort: Last Updated</option>
              <option value="title">Sort: Chapter Name</option>
              <option value="taughtAt">Sort: Last Taught</option>
              <option value="status">Sort: Status</option>
            </select>
            <select className={fieldClass} value={chapterQuery.sortOrder} onChange={(e) => setChapterQuery((prev) => ({ ...prev, sortOrder: e.target.value }))}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className={tableSurfaceClass}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-4 py-2 font-bold">Chapter</th>
                  <th className="px-4 py-2 font-bold">Description</th>
                  <th className="px-4 py-2 font-bold">Status</th>
                  <th className="px-4 py-2 font-bold">Last Taught</th>
                  <th className="px-4 py-2 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChapters.map((chapter) => (
                  <tr key={chapter._id} className="border-t border-slate-100">
                    <td className="px-4 py-2 text-slate-800">{chapter.title}</td>
                    <td className="px-4 py-2 text-slate-600">{chapter.description || '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${chapter.isTaught ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                        {chapter.isTaught ? 'Taught' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {chapter.taughtAt ? new Date(chapter.taughtAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className={`rounded px-3 py-1.5 text-xs font-semibold text-white ${chapter.isTaught ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                        disabled={loading || saving}
                        onClick={() => onToggleTaught(selectedSubject._id, chapter)}
                      >
                        {chapter.isTaught ? 'Mark Untaught' : 'Mark Taught'}
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredChapters.length && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>No chapters found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`${surfaceClass} grid gap-2 md:grid-cols-6`}>
            <input
              className={`md:col-span-2 ${fieldClass}`}
              placeholder="Search subject"
              value={subjectQuery.search}
              onChange={(e) => setSubjectQuery((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            />
            <select className={fieldClass} value={subjectQuery.filterBy} onChange={(e) => setSubjectQuery((prev) => ({ ...prev, filterBy: e.target.value, page: 1 }))}>
              <option value="all">All Subjects</option>
              <option value="has_chapters">Has Chapters</option>
              <option value="no_chapters">No Chapters</option>
              <option value="pending">Has Pending Chapters</option>
              <option value="completed">Fully Taught</option>
            </select>
            <select className={fieldClass} value={subjectQuery.sortBy} onChange={(e) => setSubjectQuery((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }))}>
              <option value="updatedAt">Sort: Last Updated</option>
              <option value="name">Sort: Name</option>
              <option value="chapterCount">Sort: Chapter Count</option>
              <option value="taughtCount">Sort: Taught Count</option>
              <option value="pendingCount">Sort: Pending Count</option>
            </select>
            <select className={fieldClass} value={subjectQuery.sortOrder} onChange={(e) => setSubjectQuery((prev) => ({ ...prev, sortOrder: e.target.value, page: 1 }))}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <select className={fieldClass} value={subjectQuery.limit} onChange={(e) => setSubjectQuery((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          <div className={tableSurfaceClass}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-4 py-3 font-bold">Subject</th>
                  <th className="px-4 py-3 font-bold">Description</th>
                  <th className="px-4 py-3 font-bold">Total Chapters</th>
                  <th className="px-4 py-3 font-bold">Taught</th>
                  <th className="px-4 py-3 font-bold">Pending</th>
                  <th className="px-4 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {subjectPagination.rows.map((subject) => (
                  <tr key={subject._id} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-slate-800">{subject.name}</td>
                    <td className="px-4 py-3 text-slate-700">{subject.description || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{subject.chapterCount}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">{subject.taughtCount}</td>
                    <td className="px-4 py-3 text-amber-700 font-semibold">{subject.pendingCount}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => {
                          setSelectedSubjectId(subject._id);
                          setChapterQuery({ search: '', sortBy: 'updatedAt', sortOrder: 'desc', filterBy: 'all' });
                        }}
                      >
                        View Chapters
                      </button>
                    </td>
                  </tr>
                ))}
                {!subjectPagination.rows.length && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>No subjects found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <p className="text-xs font-medium text-slate-500">
                Page {subjectPagination.page} of {subjectPagination.totalPages} | Total {subjectPagination.total}
              </p>
              <Pagination
                page={subjectPagination.page}
                pageSize={subjectPagination.limit}
                totalItems={subjectPagination.total}
                onChange={(nextPage) => setSubjectQuery((prev) => ({ ...prev, page: nextPage }))}
              />
            </div>
          </div>
        </div>
      ))}

      {classTab === 'students' && (
        <div className="space-y-4">
          <div className={`${surfaceClass} grid gap-2 md:grid-cols-7`}>
            <input
              className={`md:col-span-2 ${fieldClass}`}
              placeholder="Search name, username, email, roll"
              value={classStudentQuery.search}
              onChange={(e) => setClassStudentQuery((prev) => ({ ...prev, search: e.target.value }))}
            />
            <select
              className={fieldClass}
              value={classStudentQuery.sortBy}
              onChange={(e) => setClassStudentQuery((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }))}
            >
              <option value="createdAt">Sort: Created Time</option>
              <option value="name">Sort: Name</option>
              <option value="username">Sort: Username</option>
              <option value="email">Sort: Email</option>
              <option value="rollNumber">Sort: Roll Number</option>
            </select>
            <select
              className={fieldClass}
              value={classStudentQuery.sortOrder}
              onChange={(e) => setClassStudentQuery((prev) => ({ ...prev, sortOrder: e.target.value, page: 1 }))}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <select
              className={fieldClass}
              value={classStudentQuery.limit}
              onChange={(e) => setClassStudentQuery((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => loadClassStudents({ page: 1 })}
              disabled={saving}
            >
              Apply
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={!selectedClassId || saving}
              onClick={openStudentAssignModal}
            >
              Assign Students
            </button>
          </div>

          <div className={tableSurfaceClass}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Username</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Roll/Reg</th>
                  <th className="px-4 py-3 font-bold">Class</th>
                  <th className="px-4 py-3 font-bold">Session</th>
                </tr>
              </thead>
              <tbody>
                {(classStudentsData.records || []).map((row) => (
                  <tr key={row._id} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="px-4 py-3 text-slate-700">{row.name || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{row.username || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{row.email || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{row.rollNumber || row.registrationNumber || '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{row.classId ? `${row.classId.name || ''} ${row.classId.section || ''}`.trim() : '-'}</td>
                    <td className="px-4 py-3 text-slate-700">{row.sessionId?.name || '-'}</td>
                  </tr>
                ))}
                {!classStudentsData.records?.length && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>No students found in this class.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <p className="text-xs font-medium text-slate-500">
                Page {classStudentsData?.pagination?.page || 1} of {classStudentsData?.pagination?.totalPages || 1} | Total {classStudentsData?.pagination?.total || 0}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                    className="admin-btn admin-btn-secondary"
                  disabled={(classStudentsData?.pagination?.page || 1) <= 1 || saving}
                  onClick={() => {
                    const next = Math.max((classStudentsData?.pagination?.page || 1) - 1, 1);
                    loadClassStudents({ page: next });
                  }}
                >
                  Prev
                </button>
                <button
                  type="button"
                    className="admin-btn admin-btn-secondary"
                  disabled={(classStudentsData?.pagination?.page || 1) >= (classStudentsData?.pagination?.totalPages || 1) || saving}
                  onClick={() => {
                    const next = Math.min(
                      (classStudentsData?.pagination?.page || 1) + 1,
                      classStudentsData?.pagination?.totalPages || 1
                    );
                    loadClassStudents({ page: next });
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {classTab === 'subjects' && !selectedSubject && isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className={`${modalPanelClass} max-w-xl`}>
            <h3 className="mb-3 text-lg font-semibold">Add Subject In Selected Class</h3>
            <form className="space-y-3" onSubmit={onSubmitSubject}>
              <input
                className={fieldClass}
                placeholder="Subject name (e.g. Mathematics)"
                value={subjectForm.subjectName}
                onChange={(e) => setSubjectForm((prev) => ({ ...prev, subjectName: e.target.value }))}
                disabled={!selectedClassId || loading || saving}
                required
              />
              <input
                className={fieldClass}
                placeholder="Subject description (optional)"
                value={subjectForm.description}
                onChange={(e) => setSubjectForm((prev) => ({ ...prev, description: e.target.value }))}
                disabled={!selectedClassId || loading || saving}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setIsSubjectModalOpen(false);
                    setSubjectForm(initialSubjectForm);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="admin-btn admin-btn-primary"
                  type="submit"
                  disabled={!selectedClassId || loading || saving}
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStudentAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className={`${modalPanelClass} max-w-4xl`}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Assign Students To Class</h3>
                <p className="text-xs text-slate-500">
                  By default, only unassigned students are shown. Enable transfer mode to include students from other classes in the same session.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  setIsStudentAssignModalOpen(false);
                  setSelectedStudentIds([]);
                }}
              >
                Close
              </button>
            </div>

            <div className="mb-3 grid gap-2 sm:grid-cols-4">
              <input
                className={`sm:col-span-2 ${fieldClass}`}
                placeholder="Search name, username, email"
                value={studentAssignQuery.search}
                onChange={(e) => setStudentAssignQuery((prev) => ({ ...prev, search: e.target.value }))}
              />
              <select
                className={fieldClass}
                value={studentAssignQuery.limit}
                onChange={(e) => setStudentAssignQuery((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => loadAvailableStudents(selectedClassId, { ...studentAssignQuery, page: 1 })}
                disabled={saving}
              >
                Search
              </button>
            </div>

            <label className="mb-3 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(studentAssignQuery.includeMapped)}
                onChange={(e) => {
                  const nextQuery = {
                    ...studentAssignQuery,
                    includeMapped: e.target.checked,
                    page: 1
                  };
                  setStudentAssignQuery(nextQuery);
                  setSelectedStudentIds([]);
                  loadAvailableStudents(selectedClassId, nextQuery);
                }}
              />
              Include students already mapped in other classes (transfer mode)
            </label>

            <form onSubmit={onSubmitStudentAssignment}>
              <div className="max-h-[420px] overflow-x-auto rounded border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                      <th className="px-3 py-2 font-bold">Select</th>
                      <th className="px-3 py-2 font-bold">Name</th>
                      <th className="px-3 py-2 font-bold">Username</th>
                      <th className="px-3 py-2 font-bold">Email</th>
                      <th className="px-3 py-2 font-bold">Current Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableAssignRows.map((student) => {
                      const checked = selectedStudentIds.includes(String(student._id));
                      return (
                        <tr key={student._id} className="border-t border-slate-100">
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const sid = String(student._id);
                                setSelectedStudentIds((prev) => {
                                  if (e.target.checked) return [...new Set([...prev, sid])];
                                  return prev.filter((id) => id !== sid);
                                });
                              }}
                            />
                          </td>
                          <td className="px-3 py-2 text-slate-800">{student.name || '-'}</td>
                          <td className="px-3 py-2 text-slate-700">{student.username || '-'}</td>
                          <td className="px-3 py-2 text-slate-700">{student.email || '-'}</td>
                          <td className="px-3 py-2 text-slate-700">
                            {student.classId
                              ? `${student.classId.name || ''} ${student.classId.grade || ''}${student.classId.section ? ` ${student.classId.section}` : ''}`.trim()
                              : 'Unassigned'}
                          </td>
                        </tr>
                      );
                    })}
                    {!availableAssignRows.length && (
                      <tr>
                        <td className="px-3 py-8 text-center text-slate-500" colSpan={5}>No available students found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-500">
                  Page {availableStudentsData.pagination?.page || 1} of {availableStudentsData.pagination?.totalPages || 1} | Total {availableStudentsData.pagination?.total || 0}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    disabled={(availableStudentsData.pagination?.page || 1) <= 1 || saving}
                    onClick={() => {
                      const nextPage = Math.max((availableStudentsData.pagination?.page || 1) - 1, 1);
                      const nextQuery = { ...studentAssignQuery, page: nextPage };
                      setStudentAssignQuery(nextQuery);
                      loadAvailableStudents(selectedClassId, nextQuery);
                    }}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    disabled={(availableStudentsData.pagination?.page || 1) >= (availableStudentsData.pagination?.totalPages || 1) || saving}
                    onClick={() => {
                      const nextPage = Math.min((availableStudentsData.pagination?.page || 1) + 1, availableStudentsData.pagination?.totalPages || 1);
                      const nextQuery = { ...studentAssignQuery, page: nextPage };
                      setStudentAssignQuery(nextQuery);
                      loadAvailableStudents(selectedClassId, nextQuery);
                    }}
                  >
                    Next
                  </button>
                  <button
                    className="admin-btn admin-btn-primary disabled:opacity-60"
                    type="submit"
                    disabled={!selectedStudentIds.length || saving}
                  >
                    Assign Selected ({selectedStudentIds.length})
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassCurriculumPage;
