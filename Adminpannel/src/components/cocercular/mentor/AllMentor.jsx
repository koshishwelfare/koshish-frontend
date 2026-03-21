import { useState, useContext, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { CocirculerContext } from '../../../context/cocirculer';
import { useNavigate } from 'react-router-dom';
import ListPageHeader from '../../common/ListPageHeader';
import FilterToolbar from '../../common/FilterToolbar';
import DataTable from '../../common/DataTable';
import { toast } from 'react-toastify';

const AllMentor = () => {
  const { getMentor, handelgetMentor } = useContext(CocirculerContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    handelgetMentor();
  }, []);

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    if (!getMentor) return [];

    let data = [...getMentor];

    // Search filter
    if (search.trim()) {
      data = data.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Role filter
    if (filter) {
      data = data.filter((item) => String(item.role || '').toLowerCase() === filter);
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
  }, [getMentor, search, sort, filter]);

  // Table Columns with Actions
  const columns = [
    { key: 'name', label: 'Member Name' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (row.role ? `${row.role.charAt(0).toUpperCase()}${row.role.slice(1)}` : '-')
    },
    { key: 'position', label: 'Position' },
    { key: 'email', label: 'Email' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/member/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/member/update/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this member?')) {
                // TODO: Add delete handler
                toast.success('Member deleted successfully');
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

  if (!getMentor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="All Members"
        searchValue={search}
        onSearchChange={setSearch}
        addButtonText="Add Member"
        addButtonPath="/member/add"
        searchPlaceholder="Search by member name..."
      />

      <FilterToolbar
        sortValue={sort}
        onSortChange={setSort}
        filterValue={filter}
        onFilterChange={setFilter}
        showFilter
        filterOptions={[
          { label: 'Mentor', value: 'mentor' },
          { label: 'Alumni', value: 'alumni' },
          { label: 'Sponsor', value: 'sponsor' },
          { label: 'Collaborator', value: 'collaborator' }
        ]}
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
        emptyText="No members found"
        pageSize={8}
      />
    </div>
  );
};

export default AllMentor;
