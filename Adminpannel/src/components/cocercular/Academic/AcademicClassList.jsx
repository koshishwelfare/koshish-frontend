import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import DataTable from '../../common/DataTable';
import { formatDateTime } from '../../../utilities/dateFormatter';

const AcademicClassList = () => {
  const {
    academicClasses,
    academicSessions,
    academicMentors,
    handleGetAcademicClasses,
    handleGetAcademicSessions,
    handleGetAcademicMentors,
    handleAddAcademicClass
  } = useContext(CocirculerContext);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    grade: '',
    section: 'A',
    sessionId: '',
    mentorId: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name || form.name.trim() === '') {
      newErrors.name = 'Class name is required';
    }
    
    if (!form.grade || form.grade.trim() === '') {
      newErrors.grade = 'Grade is required';
    }
    
    if (!form.sessionId) {
      newErrors.sessionId = 'Session is required';
    }
    
    if (!form.mentorId) {
      newErrors.mentorId = 'Mentor is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    handleGetAcademicClasses();
    handleGetAcademicSessions();
    handleGetAcademicMentors();
  }, []);

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const created = await handleAddAcademicClass(form);
    if (created) {
      setForm({ name: '', grade: '', section: 'A', sessionId: '', mentorId: '' });
      setErrors({});
      setIsCreateOpen(false);
      await handleGetAcademicClasses();
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Class Listing</h2>
        <button type="button" onClick={() => setIsCreateOpen(true)} className="rounded border px-3 py-1.5 text-sm">Create Class</button>
      </div>

      <DataTable
        pageSize={8}
        rows={academicClasses}
        emptyText="No classes found"
        columns={[
          { key: 'name', label: 'Class' },
          { key: 'grade', label: 'Grade' },
          { key: 'section', label: 'Section' },
          {
            key: 'session',
            label: 'Session',
            render: (row) => row.sessionId?.name || '-'
          },
          {
            key: 'mentor',
            label: 'Mentor',
            render: (row) => row.mentorId?.name || '-'
          },
          {
            key: 'createdAt',
            label: 'Created',
            render: (row) => formatDateTime(row.createdAt)
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <Link to={`/academic/classes/view/${row._id}`} className="rounded bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">View</Link>
                <Link to={`/academic/classes/edit/${row._id}`} className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Edit</Link>
              </div>
            )
          }
        ]}
      />

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Create Class</h3>
            <form className="space-y-3" onSubmit={submitCreate}>
              <div>
                <input
                  className={`w-full rounded border px-3 py-2 ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder="Class Name"
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                  }}
                  required
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <input
                  className={`w-full rounded border px-3 py-2 ${errors.grade ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder="Grade"
                  value={form.grade}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, grade: e.target.value }));
                    if (errors.grade) setErrors((p) => ({ ...p, grade: '' }));
                  }}
                  required
                />
                {errors.grade && <p className="mt-1 text-xs text-red-600">{errors.grade}</p>}
              </div>

              <select
                className="w-full rounded border px-3 py-2"
                value={form.section}
                onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))}
                required
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>

              <div>
                <select
                  className={`w-full rounded border px-3 py-2 ${errors.sessionId ? 'border-red-500 bg-red-50' : ''}`}
                  value={form.sessionId}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, sessionId: e.target.value }));
                    if (errors.sessionId) setErrors((p) => ({ ...p, sessionId: '' }));
                  }}
                  required
                >
                  <option value="">Select Session</option>
                  {academicSessions.map((session) => (
                    <option key={session._id} value={session._id}>{session.name}</option>
                  ))}
                </select>
                {errors.sessionId && <p className="mt-1 text-xs text-red-600">{errors.sessionId}</p>}
              </div>

              <div>
                <select
                  className={`w-full rounded border px-3 py-2 ${errors.mentorId ? 'border-red-500 bg-red-50' : ''}`}
                  value={form.mentorId}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, mentorId: e.target.value }));
                    if (errors.mentorId) setErrors((p) => ({ ...p, mentorId: '' }));
                  }}
                  required
                >
                  <option value="">Select Mentor</option>
                  {academicMentors.map((mentor) => (
                    <option key={mentor._id} value={mentor._id}>{mentor.name} ({mentor.email})</option>
                  ))}
                </select>
                {errors.mentorId && <p className="mt-1 text-xs text-red-600">{errors.mentorId}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => {
                  setIsCreateOpen(false);
                  setErrors({});
                }} className="rounded border px-3 py-1.5 text-sm">Cancel</button>
                <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicClassList;
