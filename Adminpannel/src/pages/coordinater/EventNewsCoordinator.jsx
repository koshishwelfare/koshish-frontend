import { useContext, useEffect, useMemo, useState } from 'react';
import { CoordinatorContext } from '../../context/coordinater';

const EventNewsCoordinator = () => {
  const {
    coordinatorEventsListing,
    coordinatorNewsListing,
    coordinatorGalleryListing,
    handleGetCoordinatorEventsList,
    handleGetCoordinatorNewsList,
    handleGetCoordinatorGalleryList
  } = useContext(CoordinatorContext);

  const [activeTab, setActiveTab] = useState('events');

  const [eventSearchDraft, setEventSearchDraft] = useState('');
  const [eventFilters, setEventFilters] = useState({
    q: '',
    isActive: '',
    registrationOpen: '',
    sortBy: 'startdate',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const [newsSearchDraft, setNewsSearchDraft] = useState('');
  const [newsFilters, setNewsFilters] = useState({
    q: '',
    isAtive: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const [gallerySearchDraft, setGallerySearchDraft] = useState('');
  const [galleryFilters, setGalleryFilters] = useState({
    q: '',
    isActive: '',
    isNews: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setEventFilters((prev) => {
        if (prev.q === eventSearchDraft) return prev;
        return { ...prev, q: eventSearchDraft, page: 1 };
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [eventSearchDraft]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewsFilters((prev) => {
        if (prev.q === newsSearchDraft) return prev;
        return { ...prev, q: newsSearchDraft, page: 1 };
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [newsSearchDraft]);

  useEffect(() => {
    handleGetCoordinatorEventsList(eventFilters);
  }, [eventFilters]);

  useEffect(() => {
    handleGetCoordinatorNewsList(newsFilters);
  }, [newsFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGalleryFilters((prev) => {
        if (prev.q === gallerySearchDraft) return prev;
        return { ...prev, q: gallerySearchDraft, page: 1 };
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [gallerySearchDraft]);

  useEffect(() => {
    handleGetCoordinatorGalleryList(galleryFilters);
  }, [galleryFilters]);

  const applyEventFilters = (overrides = {}) => {
    setEventFilters((prev) => ({ ...prev, ...overrides }));
  };

  const applyNewsFilters = (overrides = {}) => {
    setNewsFilters((prev) => ({ ...prev, ...overrides }));
  };

  const applyGalleryFilters = (overrides = {}) => {
    setGalleryFilters((prev) => ({ ...prev, ...overrides }));
  };

  const eventRows = useMemo(() => coordinatorEventsListing?.records || [], [coordinatorEventsListing]);
  const newsRows = useMemo(() => coordinatorNewsListing?.records || [], [coordinatorNewsListing]);
  const galleryRows = useMemo(() => coordinatorGalleryListing?.records || [], [coordinatorGalleryListing]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Events and News Listing</h2>
        <p className="mt-1 text-sm text-slate-600">Use the same search, filter, sort, refresh, and pagination controls for both lists.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded px-3 py-2 text-sm font-semibold ${activeTab === 'events' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          type="button"
          className={`rounded px-3 py-2 text-sm font-semibold ${activeTab === 'news' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setActiveTab('news')}
        >
          News
        </button>
        <button
          type="button"
          className={`rounded px-3 py-2 text-sm font-semibold ${activeTab === 'gallery' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery
        </button>
      </div>

      {activeTab === 'events' ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 grid gap-2 md:grid-cols-8">
            <input
              type="text"
              value={eventSearchDraft}
              onChange={(e) => setEventSearchDraft(e.target.value)}
              placeholder="Search event name or description"
              className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            />
            <select
              value={eventFilters.isActive}
              onChange={(e) => applyEventFilters({ isActive: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={eventFilters.registrationOpen}
              onChange={(e) => applyEventFilters({ registrationOpen: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Registration</option>
              <option value="true">Open</option>
              <option value="false">Closed</option>
            </select>
            <select
              value={eventFilters.sortBy}
              onChange={(e) => applyEventFilters({ sortBy: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="startdate">Sort: Start Date</option>
              <option value="endDate">Sort: End Date</option>
              <option value="name">Sort: Name</option>
              <option value="isActive">Sort: Status</option>
              <option value="registrationOpen">Sort: Registration</option>
            </select>
            <select
              value={eventFilters.sortOrder}
              onChange={(e) => applyEventFilters({ sortOrder: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <select
              value={eventFilters.limit}
              onChange={(e) => applyEventFilters({ limit: Number(e.target.value), page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button
              type="button"
              onClick={() => handleGetCoordinatorEventsList(eventFilters)}
              className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2 font-semibold">Event</th>
                  <th className="px-3 py-2 font-semibold">Start</th>
                  <th className="px-3 py-2 font-semibold">End</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Registration</th>
                </tr>
              </thead>
              <tbody>
                {eventRows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-800">{row.name || '-'}</td>
                    <td className="px-3 py-2 text-slate-700">{row.startdate ? new Date(row.startdate).toLocaleDateString() : '-'}</td>
                    <td className="px-3 py-2 text-slate-700">{row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'}</td>
                    <td className="px-3 py-2">{row.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="px-3 py-2">{row.registrationOpen ? 'Open' : 'Closed'}</td>
                  </tr>
                ))}
                {!eventRows.length && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-slate-500">No events found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {coordinatorEventsListing?.pagination?.page || 1} of {coordinatorEventsListing?.pagination?.totalPages || 1} | Total {coordinatorEventsListing?.pagination?.total || 0}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorEventsListing?.pagination?.page || 1) <= 1}
                onClick={() => applyEventFilters({ page: Math.max((coordinatorEventsListing?.pagination?.page || 1) - 1, 1) })}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorEventsListing?.pagination?.page || 1) >= (coordinatorEventsListing?.pagination?.totalPages || 1)}
                onClick={() =>
                  applyEventFilters({
                    page: Math.min((coordinatorEventsListing?.pagination?.page || 1) + 1, coordinatorEventsListing?.pagination?.totalPages || 1)
                  })
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'news' ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 grid gap-2 md:grid-cols-7">
            <input
              type="text"
              value={newsSearchDraft}
              onChange={(e) => setNewsSearchDraft(e.target.value)}
              placeholder="Search heading or announcement"
              className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            />
            <select
              value={newsFilters.isAtive}
              onChange={(e) => applyNewsFilters({ isAtive: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={newsFilters.sortBy}
              onChange={(e) => applyNewsFilters({ sortBy: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="date">Sort: Date</option>
              <option value="heading">Sort: Heading</option>
              <option value="isAtive">Sort: Status</option>
            </select>
            <select
              value={newsFilters.sortOrder}
              onChange={(e) => applyNewsFilters({ sortOrder: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <select
              value={newsFilters.limit}
              onChange={(e) => applyNewsFilters({ limit: Number(e.target.value), page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button
              type="button"
              onClick={() => handleGetCoordinatorNewsList(newsFilters)}
              className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2 font-semibold">Heading</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {newsRows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-800">{row.heading || '-'}</td>
                    <td className="px-3 py-2 text-slate-700">{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                    <td className="px-3 py-2">{row.isAtive ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))}
                {!newsRows.length && (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-slate-500">No news found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {coordinatorNewsListing?.pagination?.page || 1} of {coordinatorNewsListing?.pagination?.totalPages || 1} | Total {coordinatorNewsListing?.pagination?.total || 0}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorNewsListing?.pagination?.page || 1) <= 1}
                onClick={() => applyNewsFilters({ page: Math.max((coordinatorNewsListing?.pagination?.page || 1) - 1, 1) })}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorNewsListing?.pagination?.page || 1) >= (coordinatorNewsListing?.pagination?.totalPages || 1)}
                onClick={() =>
                  applyNewsFilters({
                    page: Math.min((coordinatorNewsListing?.pagination?.page || 1) + 1, coordinatorNewsListing?.pagination?.totalPages || 1)
                  })
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 grid gap-2 md:grid-cols-8">
            <input
              type="text"
              value={gallerySearchDraft}
              onChange={(e) => setGallerySearchDraft(e.target.value)}
              placeholder="Search gallery title"
              className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            />
            <select
              value={galleryFilters.isActive}
              onChange={(e) => applyGalleryFilters({ isActive: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={galleryFilters.isNews}
              onChange={(e) => applyGalleryFilters({ isNews: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="true">News Type</option>
              <option value="false">Memory Type</option>
            </select>
            <select
              value={galleryFilters.sortBy}
              onChange={(e) => applyGalleryFilters({ sortBy: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="date">Sort: Date</option>
              <option value="galleryTitle">Sort: Title</option>
              <option value="isActive">Sort: Status</option>
              <option value="isNews">Sort: Type</option>
            </select>
            <select
              value={galleryFilters.sortOrder}
              onChange={(e) => applyGalleryFilters({ sortOrder: e.target.value, page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <select
              value={galleryFilters.limit}
              onChange={(e) => applyGalleryFilters({ limit: Number(e.target.value), page: 1 })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button
              type="button"
              onClick={() => handleGetCoordinatorGalleryList(galleryFilters)}
              className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2 font-semibold">Title</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {galleryRows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-800">{row.galleryTitle || '-'}</td>
                    <td className="px-3 py-2 text-slate-700">{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                    <td className="px-3 py-2 text-slate-700">{row.isNews ? 'News' : 'Memory'}</td>
                    <td className="px-3 py-2">{row.isActive ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))}
                {!galleryRows.length && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-500">No gallery records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {coordinatorGalleryListing?.pagination?.page || 1} of {coordinatorGalleryListing?.pagination?.totalPages || 1} | Total {coordinatorGalleryListing?.pagination?.total || 0}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorGalleryListing?.pagination?.page || 1) <= 1}
                onClick={() => applyGalleryFilters({ page: Math.max((coordinatorGalleryListing?.pagination?.page || 1) - 1, 1) })}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorGalleryListing?.pagination?.page || 1) >= (coordinatorGalleryListing?.pagination?.totalPages || 1)}
                onClick={() =>
                  applyGalleryFilters({
                    page: Math.min((coordinatorGalleryListing?.pagination?.page || 1) + 1, coordinatorGalleryListing?.pagination?.totalPages || 1)
                  })
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventNewsCoordinator;
