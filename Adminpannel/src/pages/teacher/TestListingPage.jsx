import { useContext, useEffect, useMemo, useState } from 'react';
import { TeacherContext } from '../../context/teacher';

const TestListingPage = () => {
  const { teacherTests, handleGetTestSeries } = useContext(TeacherContext);

  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    className: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    handleGetTestSeries();
  }, []);

  const subjectOptions = useMemo(() => {
    return [...new Set((teacherTests || []).map((item) => String(item?.subject || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [teacherTests]);

  const classOptions = useMemo(() => {
    return [...new Set((teacherTests || []).map((item) => String(item?.className || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [teacherTests]);

  const listing = useMemo(() => {
    let rows = [...(teacherTests || [])];

    if (filters.subject) {
      rows = rows.filter((row) => String(row?.subject || '') === String(filters.subject));
    }
    if (filters.className) {
      rows = rows.filter((row) => String(row?.className || '') === String(filters.className));
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      rows = rows.filter((row) => (
        String(row?.title || '').toLowerCase().includes(q) ||
        String(row?.description || '').toLowerCase().includes(q) ||
        String(row?.subject || '').toLowerCase().includes(q) ||
        String(row?.className || '').toLowerCase().includes(q)
      ));
    }

    const sortKey = filters.sortBy;
    const dir = filters.sortOrder === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const getValue = (row) => {
        if (sortKey === 'questionCount') return Number(row?.questions?.length || 0);
        if (sortKey === 'durationMinutes') return Number(row?.durationMinutes || 0);
        if (sortKey === 'createdAt') return row?.createdAt || '';
        return row?.[sortKey] || '';
      };
      const av = getValue(a);
      const bv = getValue(b);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
    });

    const total = rows.length;
    const limit = Number(filters.limit) || 10;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const page = Math.min(filters.page, totalPages);
    const pagedRows = rows.slice((page - 1) * limit, (page - 1) * limit + limit);

    return { rows: pagedRows, total, page, totalPages, limit };
  }, [teacherTests, filters]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">Test Listing</h2>
      </div>

      <div className="grid gap-2 rounded-lg bg-white p-4 shadow md:grid-cols-7">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Search title, description, subject, class"
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
        />
        <select className="w-full border rounded px-3 py-2" value={filters.subject} onChange={(e) => setFilters((p) => ({ ...p, subject: e.target.value, page: 1 }))}>
          <option value="">All Subjects</option>
          {subjectOptions.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <select className="w-full border rounded px-3 py-2" value={filters.className} onChange={(e) => setFilters((p) => ({ ...p, className: e.target.value, page: 1 }))}>
          <option value="">All Classes</option>
          {classOptions.map((className) => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>
        <select className="w-full border rounded px-3 py-2" value={filters.sortBy} onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value, page: 1 }))}>
          <option value="createdAt">Sort: Created Time</option>
          <option value="title">Sort: Title</option>
          <option value="subject">Sort: Subject</option>
          <option value="className">Sort: Class</option>
          <option value="questionCount">Sort: Questions</option>
          <option value="durationMinutes">Sort: Duration</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={filters.sortOrder} onChange={(e) => setFilters((p) => ({ ...p, sortOrder: e.target.value, page: 1 }))}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <select className="w-full border rounded px-3 py-2" value={filters.limit} onChange={(e) => setFilters((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))}>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => handleGetTestSeries()}>
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <th className="px-4 py-3 font-bold">Title</th>
              <th className="px-4 py-3 font-bold">Subject</th>
              <th className="px-4 py-3 font-bold">Class</th>
              <th className="px-4 py-3 font-bold">Questions</th>
              <th className="px-4 py-3 font-bold">Duration</th>
              <th className="px-4 py-3 font-bold">Created</th>
            </tr>
          </thead>
          <tbody>
            {listing.rows.map((row) => (
              <tr key={row._id} className="border-t border-slate-100 hover:bg-slate-50/70">
                <td className="px-4 py-3 text-slate-700">{row.title || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.subject || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.className || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{row.questions?.length || 0}</td>
                <td className="px-4 py-3 text-slate-700">{row.durationMinutes || 0} min</td>
                <td className="px-4 py-3 text-slate-700">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {!listing.rows.length && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>No tests found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs font-medium text-slate-500">
            Page {listing.page} of {listing.totalPages} | Total {listing.total}
          </p>
          <div className="flex gap-2">
            <button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={listing.page <= 1} onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}>Prev</button>
            <button type="button" className="rounded border px-3 py-1.5 text-sm" disabled={listing.page >= listing.totalPages} onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestListingPage;
