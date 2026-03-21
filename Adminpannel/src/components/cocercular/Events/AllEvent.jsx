import { useState, useContext, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { CocirculerContext } from '../../../context/cocirculer';
import { useNavigate } from 'react-router-dom';
import ListPageHeader from '../../common/ListPageHeader';
import FilterToolbar from '../../common/FilterToolbar';
import DataTable from '../../common/DataTable';
import { toast } from 'react-toastify';

const AllEvent = () => {
  const { getEvent, handelgetEvent } = useContext(CocirculerContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    handelgetEvent();
  }, []);

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    if (!getEvent) return [];

    let data = [...getEvent];

    // Search filter
    if (search.trim()) {
      data = data.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort logic
    if (sort === 'asc') {
      data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'desc') {
      data.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sort === 'newest') {
      data.reverse();
    }

    return data;
  }, [getEvent, search, sort, filter]);

  // Table Columns with Actions
  const columns = [
    { key: 'name', label: 'Event Name' },
    {
      key: 'date',
      label: 'Date',
      render: (row) => {
        try {
          return new Date(row.date || row.createdAt).toLocaleDateString();
        } catch {
          return '-';
        }
      }
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (row.description || '-').substring(0, 50) + '...'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/event/view/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/event/update/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this event?')) {
                // TODO: Add delete handler
                toast.success('Event deleted successfully');
              }
            }}
            className="admin-btn admin-btn-danger p-2 flex items-center gap-1"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )
    }
  ];

  if (!getEvent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="All Events"
        searchValue={search}
        onSearchChange={setSearch}
        addButtonText="Add Event"
        addButtonPath="/event/add"
        searchPlaceholder="Search by event name..."
      />

      <FilterToolbar
        sortValue={sort}
        onSortChange={setSort}
        filterValue={filter}
        onFilterChange={setFilter}
        sortOptions={[
          { label: 'Newest First', value: 'newest' },
          { label: 'Oldest First', value: 'oldest' },
          { label: 'A-Z', value: 'asc' },
          { label: 'Z-A', value: 'desc' }
        ]}
      />

      <DataTable
        columns={columns}
        rows={filteredData}
        emptyText="No events found"
        pageSize={8}
      />
    </div>
  );
};

export default AllEvent;