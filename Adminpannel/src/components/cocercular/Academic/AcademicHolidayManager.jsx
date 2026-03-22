import { useContext, useEffect, useMemo, useState } from 'react';
import DataTable from '../../common/DataTable';
import { CocirculerContext } from '../../../context/cocirculer';

const INITIAL_FORM = {
  sessionId: '',
  title: '',
  date: '',
  description: '',
  isActive: true
};

const formatDisplayDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString();
};

const AcademicHolidayManager = () => {
  const {
    academicSessions,
    academicHolidays,
    handleGetAcademicSessions,
    handleGetAcademicHolidays,
    handleAddAcademicHoliday,
    handleUpdateAcademicHolidayById,
    handleDeleteAcademicHolidayById
  } = useContext(CocirculerContext);

  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingHoliday, setEditingHoliday] = useState(null);

  useEffect(() => {
    const load = async () => {
      await handleGetAcademicSessions();
      await handleGetAcademicHolidays('');
    };
    load();
  }, []);

  useEffect(() => {
    handleGetAcademicHolidays(selectedSessionId);
  }, [selectedSessionId]);

  const sessionMap = useMemo(() => {
    const map = new Map();
    (academicSessions || []).forEach((session) => {
      map.set(String(session._id), session);
    });
    return map;
  }, [academicSessions]);

  const rows = useMemo(() => {
    return (academicHolidays || []).map((holiday) => ({
      ...holiday,
      sessionInfo: holiday.session || sessionMap.get(String(holiday.session?._id || '')) || null
    }));
  }, [academicHolidays, sessionMap]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingHoliday(null);
  };

  const onCreate = () => {
    setForm((prev) => ({
      ...INITIAL_FORM,
      sessionId: selectedSessionId || prev.sessionId
    }));
    setIsCreateOpen(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!form.sessionId || !form.title || !form.date) return;

    const created = await handleAddAcademicHoliday(form.sessionId, {
      title: form.title,
      date: form.date,
      description: form.description,
      isActive: form.isActive
    });

    if (!created) return;

    setIsCreateOpen(false);
    const sessionId = form.sessionId;
    resetForm();
    setSelectedSessionId(sessionId);
    await handleGetAcademicHolidays(sessionId);
  };

  const openEdit = (holiday) => {
    setEditingHoliday(holiday);
    setForm({
      sessionId: String(holiday?.session?._id || ''),
      title: holiday?.title || '',
      date: holiday?.date ? new Date(holiday.date).toISOString().slice(0, 10) : '',
      description: holiday?.description || '',
      isActive: typeof holiday?.isActive === 'boolean' ? holiday.isActive : true
    });
    setIsEditOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingHoliday?._id || !form.sessionId || !form.title || !form.date) return;

    const updated = await handleUpdateAcademicHolidayById(form.sessionId, editingHoliday._id, {
      title: form.title,
      date: form.date,
      description: form.description,
      isActive: form.isActive
    });

    if (!updated) return;

    setIsEditOpen(false);
    const sessionId = form.sessionId;
    resetForm();
    setSelectedSessionId(sessionId);
    await handleGetAcademicHolidays(sessionId);
  };

  const onDelete = async (holiday) => {
    const sessionId = String(holiday?.session?._id || '');
    if (!sessionId || !holiday?._id) return;

    const ok = window.confirm('Delete this holiday?');
    if (!ok) return;

    const deleted = await handleDeleteAcademicHolidayById(sessionId, holiday._id);
    if (!deleted) return;

    await handleGetAcademicHolidays(selectedSessionId || sessionId);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Holiday Management</h2>
          <p className="text-sm text-slate-600">Manage co-curricular holidays in dedicated academic sessions.</p>
        </div>
        <button type="button" onClick={onCreate} className="rounded border px-3 py-1.5 text-sm">
          Add Holiday
        </button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Filter by Session</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
          >
            <option value="">All Sessions</option>
            {(academicSessions || []).map((session) => (
              <option key={session._id} value={session._id}>
                {`${session.name} (${session.startYear}-${session.endYear})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        pageSize={8}
        rows={rows}
        emptyText="No holidays found"
        columns={[
          {
            key: 'session',
            label: 'Session',
            render: (row) => {
              const session = row.sessionInfo;
              if (!session) return '-';
              return `${session.name} (${session.startYear}-${session.endYear})`;
            }
          },
          { key: 'title', label: 'Holiday' },
          {
            key: 'date',
            label: 'Date',
            render: (row) => formatDisplayDate(row.date)
          },
          {
            key: 'description',
            label: 'Description',
            render: (row) => row.description || '-'
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (row.isActive ? 'Active' : 'Inactive')
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <button type="button" onClick={() => openEdit(row)} className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(row)} className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  Delete
                </button>
              </div>
            )
          }
        ]}
      />

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Add Holiday</h3>
            <form className="space-y-3" onSubmit={submitCreate}>
              <select
                className="w-full rounded border px-3 py-2"
                value={form.sessionId}
                onChange={(e) => setForm((p) => ({ ...p, sessionId: e.target.value }))}
                required
              >
                <option value="">Select Session</option>
                {(academicSessions || []).map((session) => (
                  <option key={session._id} value={session._id}>
                    {`${session.name} (${session.startYear}-${session.endYear})`}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded border px-3 py-2"
                placeholder="Holiday title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <input
                className="w-full rounded border px-3 py-2"
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                required
              />
              <textarea
                className="min-h-20 w-full rounded border px-3 py-2"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
              <select
                className="w-full rounded border px-3 py-2"
                value={form.isActive ? 'active' : 'inactive'}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'active' }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetForm();
                  }}
                  className="rounded border px-3 py-1.5 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Edit Holiday</h3>
            <form className="space-y-3" onSubmit={submitEdit}>
              <select
                className="w-full rounded border px-3 py-2"
                value={form.sessionId}
                onChange={(e) => setForm((p) => ({ ...p, sessionId: e.target.value }))}
                required
              >
                <option value="">Select Session</option>
                {(academicSessions || []).map((session) => (
                  <option key={session._id} value={session._id}>
                    {`${session.name} (${session.startYear}-${session.endYear})`}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded border px-3 py-2"
                placeholder="Holiday title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <input
                className="w-full rounded border px-3 py-2"
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                required
              />
              <textarea
                className="min-h-20 w-full rounded border px-3 py-2"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
              <select
                className="w-full rounded border px-3 py-2"
                value={form.isActive ? 'active' : 'inactive'}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'active' }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    resetForm();
                  }}
                  className="rounded border px-3 py-1.5 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicHolidayManager;
