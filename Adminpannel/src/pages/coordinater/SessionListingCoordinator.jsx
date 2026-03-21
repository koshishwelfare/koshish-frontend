import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoordinatorContext } from '../../context/coordinater';

const SessionListingCoordinator = () => {
  const { coordinatorSessionsListing, handleGetCoordinatorSessionsList } = useContext(CoordinatorContext);
  const navigate = useNavigate();

  const [searchDraft, setSearchDraft] = useState('');
  const [filters, setFilters] = useState({
    q: '',
    isActive: '',
    startYear: '',
    endYear: '',
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
    handleGetCoordinatorSessionsList(filters);
  }, [filters]);

  const rows = useMemo(() => coordinatorSessionsListing?.records || [], [coordinatorSessionsListing]);

  const applyFilters = (overrides = {}) => {
    setFilters((prev) => ({ ...prev, ...overrides }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Session Listing</h2>
        <p className="mt-1 text-sm text-slate-600">View academic sessions with search, filtering, sorting, and pagination.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 grid gap-2 md:grid-cols-8">
          <input
            type="text"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search session name"
            className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
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
          <input
            type="number"
            min={2000}
            max={2100}
            value={filters.startYear}
            onChange={(e) => applyFilters({ startYear: e.target.value, page: 1 })}
            placeholder="Start Year"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={2000}
            max={2100}
            value={filters.endYear}
            onChange={(e) => applyFilters({ endYear: e.target.value, page: 1 })}
            placeholder="End Year"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={filters.sortBy}
            onChange={(e) => applyFilters({ sortBy: e.target.value, page: 1 })}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="createdAt">Sort: Created</option>
            <option value="updatedAt">Sort: Updated</option>
            <option value="name">Sort: Name</option>
            <option value="startYear">Sort: Start Year</option>
            <option value="endYear">Sort: End Year</option>
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
          <select
            value={filters.limit}
            onChange={(e) => applyFilters({ limit: Number(e.target.value), page: 1 })}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="px-3 py-2 font-semibold">Session Name</th>
                <th className="px-3 py-2 font-semibold">Start Year</th>
                <th className="px-3 py-2 font-semibold">End Year</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-800">
                    <button
                      type="button"
                      onClick={() => navigate(`/sessions/${row._id}/classes`)}
                      className="text-left text-blue-700 hover:underline"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{row.startYear ?? '-'}</td>
                  <td className="px-3 py-2 text-slate-700">{row.endYear ?? '-'}</td>
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
                  <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                    No sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">
            Page {coordinatorSessionsListing?.pagination?.page || 1} of {coordinatorSessionsListing?.pagination?.totalPages || 1} | Total {coordinatorSessionsListing?.pagination?.total || 0}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(coordinatorSessionsListing?.pagination?.page || 1) <= 1}
              onClick={() =>
                applyFilters({ page: Math.max((coordinatorSessionsListing?.pagination?.page || 1) - 1, 1) })
              }
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm"
              disabled={(coordinatorSessionsListing?.pagination?.page || 1) >= (coordinatorSessionsListing?.pagination?.totalPages || 1)}
              onClick={() =>
                applyFilters({
                  page: Math.min(
                    (coordinatorSessionsListing?.pagination?.page || 1) + 1,
                    coordinatorSessionsListing?.pagination?.totalPages || 1
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

export default SessionListingCoordinator;
