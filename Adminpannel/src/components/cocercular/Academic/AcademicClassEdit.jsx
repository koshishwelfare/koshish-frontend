import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import { formatDateTime } from '../../../utilities/dateFormatter';

const AcademicClassEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    academicSessions,
    academicMentors,
    handleGetAcademicSessions,
    handleGetAcademicMentors,
    handleGetAcademicClassById,
    handleUpdateAcademicClassById
  } = useContext(CocirculerContext);

  const [form, setForm] = useState({
    name: '',
    grade: '',
    section: 'A',
    sessionId: '',
    mentorId: '',
    teacherIds: [],
    isActive: true
  });
  const [mentorToAdd, setMentorToAdd] = useState('');
  const [classData, setClassData] = useState(null);
  const [errors, setErrors] = useState({});

  const addMentorTag = () => {
    if (!mentorToAdd) return;
    setForm((prev) => ({
      ...prev,
      teacherIds: [...new Set([...(prev.teacherIds || []), mentorToAdd, prev.mentorId].filter(Boolean))]
    }));
    setMentorToAdd('');
  };

  const removeMentorTag = (mentorId) => {
    if (!mentorId || mentorId === form.mentorId) return;
    setForm((prev) => ({
      ...prev,
      teacherIds: (prev.teacherIds || []).filter((id) => id !== mentorId)
    }));
  };

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
    handleGetAcademicSessions();
    handleGetAcademicMentors();
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await handleGetAcademicClassById(id);
      if (data) {
        setClassData(data);
        setForm({
          name: data.name || '',
          grade: data.grade || '',
          section: data.section || 'A',
          sessionId: data.sessionId?._id || '',
          mentorId: data.mentorId?._id || '',
          teacherIds: [...new Set([
            data.mentorId?._id || '',
            ...((data.teacherIds || []).map((mentor) => mentor?._id || mentor))
          ].filter(Boolean))],
          isActive: data.isActive !== false
        });
      }
    };
    load();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const payload = {
      name: String(form.name || '').trim(),
      grade: String(form.grade || '').trim(),
      section: String(form.section || 'A').trim().toUpperCase(),
      sessionId: String(form.sessionId || '').trim(),
      mentorId: String(form.mentorId || '').trim(),
      teacherIds: [...new Set([String(form.mentorId || '').trim(), ...(form.teacherIds || []).map((tid) => String(tid).trim())].filter(Boolean))],
      isActive: form.isActive
    };
    const updated = await handleUpdateAcademicClassById(id, payload);
    if (updated) {
      navigate(`/academic/classes/view/${id}`);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Edit Class</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
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

        <select className="w-full rounded border px-3 py-2" value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} required>
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
              const mentorId = e.target.value;
              setForm((p) => ({
                ...p,
                mentorId,
                teacherIds: [...new Set([mentorId, ...(p.teacherIds || [])].filter(Boolean))]
              }));
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

        <div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <select
              className="w-full rounded border px-3 py-2"
              value={mentorToAdd}
              onChange={(e) => setMentorToAdd(e.target.value)}
            >
              <option value="">Select mentor to assign</option>
              {academicMentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>{mentor.name} ({mentor.email})</option>
              ))}
            </select>
            <button type="button" className="rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={addMentorTag}>
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(form.teacherIds || []).map((mentorId) => {
              const mentor = academicMentors.find((m) => String(m._id) === String(mentorId));
              const label = mentor ? `${mentor.name}` : mentorId;
              const isPrimary = String(form.mentorId) === String(mentorId);
              return (
                <span key={mentorId} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${isPrimary ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                  {label}
                  {isPrimary ? ' (Primary)' : ''}
                  {!isPrimary && (
                    <button type="button" className="ml-1 rounded px-1 text-slate-500 hover:bg-slate-200" onClick={() => removeMentorTag(mentorId)}>
                      x
                    </button>
                  )}
                </span>
              );
            })}
          </div>
          <p className="mt-1 text-xs text-slate-500">Assign multiple mentors. Primary mentor is always included.</p>
        </div>

        <select className="w-full rounded border px-3 py-2" value={form.isActive ? 'active' : 'inactive'} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'active' }))}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {classData && (
          <div className="space-y-1 border-t pt-3 text-xs text-slate-500">
            <p>Created: {formatDateTime(classData.createdAt)}</p>
            <p>Last Updated: {formatDateTime(classData.updatedAt)}</p>
          </div>
        )}

        <div className="flex gap-2">
          <button className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" type="submit">Save</button>
          <Link to={`/academic/classes/view/${id}`} className="rounded border px-3 py-2">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default AcademicClassEdit;
