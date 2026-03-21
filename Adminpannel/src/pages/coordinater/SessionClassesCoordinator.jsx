import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoordinatorContext } from '../../context/coordinater';

const SessionClassesCoordinator = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { coordinatorSessionClassesListing, handleGetCoordinatorSessionClassesList } = useContext(CoordinatorContext);

  const [searchDraft, setSearchDraft] = useState('');
  const [filters, setFilters] = useState({
    q: '',
    grade: '',
    section: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.q === searchDraft) return prev;
        return { ...prev, q: searchDraft, page: 1 };
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchDraft]);

  useEffect(() => {
    if (sessionId) {
      handleGetCoordinatorSessionClassesList(sessionId, filters);
    }
  }, [sessionId, filters]);

  const applyFilters = (overrides = {}) => {
    setFilters((prev) => ({ ...prev, ...overrides }));
  };

  const rows = useMemo(() => coordinatorSessionClassesListing?.records || [], [coordinatorSessionClassesListing]);
  const session = coordinatorSessionClassesListing?.session || null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Session Class Listing</h2>
            <p className="mt-1 text-sm text-slate-600">
              {session?.name ? `${session.name} (${session.startYear || '-'}-${session.endYear || '-'})` : 'Classes mapped to selected session'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Back to Sessions
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 grid gap-2 md:grid-cols-8">
          <input
            type="text"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search class name, grade, section"
            className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />
          <input
            type="text"
            value={filters.grade}
            onChange={(e) => applyFilters({ grade: e.target.value, page: 1 })}
            placeholder="Filter grade"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={filters.section}
            onChange={(e) => applyFilters({ section: e.target.value, page: 1 })}
            placeholder="Filter section"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={filters.isActive}
            onChange={(e) => applyFilters({ isActive: e.target.value, page: 1 })}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => applyFilters({ sortBy: e.target.value, page: 1 })}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="createdAt">Sort: Created</option>
            <option value="updatedAt">Sort: Updated</option>
            <option value="name">Sort: Name</option>
            <option value="grade">Sort: Grade</option>
            <option value="section">Sort: Section</option>
            <option value="isActive">Sort: Status</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) => applyFilters({ sortOrder: e.target.value, page: 1 })}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <div className="flex gap-2">
            <select
              value={filters.limit}
              onChange={(e) => applyFilters({ limit: Number(e.target.value), page: 1 })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button
              type="button"
              onClick={() => handleGetCoordinatorSessionClassesList(sessionId, filters)}
              className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-2 font-semibold">Class</th>
                <th className="px-3 py-2 font-semibold">Grade</th>
                <th className="px-3 py-2 font-semibold">Section</th>
                <th className="px-3 py-2 font-semibold">Mentor</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-800">{row.name || '-'}</td>
                  <td className="px-3 py-2 text-slate-700">{row.grade || '-'}</td>
                  <td className="px-3 py-2 text-slate-700">{row.section || '-'}</td>
                  <td className="px-3 py-2 text-slate-700">{row.mentorId?.name || '-'}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {row.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                    No classes found for this session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">
            Page {coordinatorSessionClassesListing?.pagination?.page || 1} of {coordinatorSessionClassesListing?.pagination?.totalPages || 1} | Total {coordinatorSessionClassesListing?.pagination?.total || 0}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(coordinatorSessionClassesListing?.pagination?.page || 1) <= 1}
              onClick={() =>
                applyFilters({ page: Math.max((coordinatorSessionClassesListing?.pagination?.page || 1) - 1, 1) })
              }
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(coordinatorSessionClassesListing?.pagination?.page || 1) >= (coordinatorSessionClassesListing?.pagination?.totalPages || 1)}
              onClick={() =>
                applyFilters({
                  page: Math.min(
                    (coordinatorSessionClassesListing?.pagination?.page || 1) + 1,
                    coordinatorSessionClassesListing?.pagination?.totalPages || 1
                  )
                })
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionClassesCoordinator;
