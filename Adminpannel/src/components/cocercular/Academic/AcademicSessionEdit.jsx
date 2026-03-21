import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import { formatDateTime } from '../../../utilities/dateFormatter';

const AcademicSessionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetAcademicSessionById, handleUpdateAcademicSessionById } = useContext(CocirculerContext);

  const [form, setForm] = useState({
    name: '',
    startYear: '',
    endYear: '',
    isActive: true
  });
  const [session, setSession] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    
    if (!form.name || form.name.trim() === '') {
      newErrors.name = 'Session name is required';
    }
    
    if (!form.startYear) {
      newErrors.startYear = 'Start year is required';
    } else if (isNaN(form.startYear) || form.startYear < 1900 || form.startYear > currentYear + 10) {
      newErrors.startYear = `Start year must be between 1900 and ${currentYear + 10}`;
    }
    
    if (!form.endYear) {
      newErrors.endYear = 'End year is required';
    } else if (isNaN(form.endYear) || form.endYear < 1900 || form.endYear > currentYear + 10) {
      newErrors.endYear = `End year must be between 1900 and ${currentYear + 10}`;
    }
    
    if (form.startYear && form.endYear && Number(form.startYear) > Number(form.endYear)) {
      newErrors.endYear = 'End year must be greater than or equal to start year';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const load = async () => {
      const data = await handleGetAcademicSessionById(id);
      if (data) {
        setSession(data);
        setForm({
          name: data.name || '',
          startYear: data.startYear || '',
          endYear: data.endYear || '',
          isActive: Boolean(data.isActive)
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
    const updated = await handleUpdateAcademicSessionById(id, form);
    if (updated) {
      navigate(`/academic/sessions/view/${id}`);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Edit Session</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <input 
            className={`w-full rounded border px-3 py-2 ${errors.name ? 'border-red-500 bg-red-50' : ''}`} 
            placeholder="Session Name" 
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
            className={`w-full rounded border px-3 py-2 ${errors.startYear ? 'border-red-500 bg-red-50' : ''}`} 
            type="number" 
            placeholder="Start Year (e.g., 2024)" 
            value={form.startYear} 
            onChange={(e) => {
              setForm((p) => ({ ...p, startYear: e.target.value }));
              if (errors.startYear) setErrors((p) => ({ ...p, startYear: '' }));
            }} 
            required 
          />
          {errors.startYear && <p className="mt-1 text-xs text-red-600">{errors.startYear}</p>}
        </div>

        <div>
          <input 
            className={`w-full rounded border px-3 py-2 ${errors.endYear ? 'border-red-500 bg-red-50' : ''}`} 
            type="number" 
            placeholder="End Year (e.g., 2025)" 
            value={form.endYear} 
            onChange={(e) => {
              setForm((p) => ({ ...p, endYear: e.target.value }));
              if (errors.endYear) setErrors((p) => ({ ...p, endYear: '' }));
            }} 
            required 
          />
          {errors.endYear && <p className="mt-1 text-xs text-red-600">{errors.endYear}</p>}
        </div>

        <select className="w-full rounded border px-3 py-2" value={form.isActive ? 'active' : 'inactive'} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'active' }))}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {session && (
          <div className="space-y-1 border-t pt-3 text-xs text-slate-500">
            <p>Created: {formatDateTime(session.createdAt)}</p>
            <p>Last Updated: {formatDateTime(session.updatedAt)}</p>
          </div>
        )}

        <div className="flex gap-2">
          <button className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" type="submit">Save</button>
          <Link to={`/academic/sessions/view/${id}`} className="rounded border px-3 py-2">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default AcademicSessionEdit;
