import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import DataTable from '../../common/DataTable';
import { formatDateTime } from '../../../utilities/dateFormatter';

const AcademicSessionList = () => {
  const { academicSessions, handleGetAcademicSessions, handleAddAcademicSession } = useContext(CocirculerContext);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    startYear: '',
    endYear: ''
  });
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
    handleGetAcademicSessions();
  }, []);

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const created = await handleAddAcademicSession(form);
    if (created) {
      setForm({ name: '', startYear: '', endYear: '' });
      setErrors({});
      setIsCreateOpen(false);
      await handleGetAcademicSessions();
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Session Listing</h2>
        <button type="button" onClick={() => setIsCreateOpen(true)} className="rounded border px-3 py-1.5 text-sm">Create Session</button>
      </div>

      <DataTable
        pageSize={8}
        rows={academicSessions}
        emptyText="No sessions found"
        columns={[
          { key: 'name', label: 'Session' },
          { key: 'startYear', label: 'Start Year' },
          { key: 'endYear', label: 'End Year' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (row.isActive ? 'Active' : 'Inactive')
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
                <Link to={`/academic/sessions/view/${row._id}`} className="rounded bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">View</Link>
                <Link to={`/academic/sessions/edit/${row._id}`} className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Edit</Link>
              </div>
            )
          }
        ]}
      />

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Create Session</h3>
            <form className="space-y-3" onSubmit={submitCreate}>
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

export default AcademicSessionList;
