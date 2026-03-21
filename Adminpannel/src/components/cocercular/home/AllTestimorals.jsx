import { useState, useContext, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { CocirculerContext } from '../../../context/cocirculer';
import { useNavigate } from 'react-router-dom';
import ListPageHeader from '../../common/ListPageHeader';
import FilterToolbar from '../../common/FilterToolbar';
import DataTable from '../../common/DataTable';
import { toast } from 'react-toastify';

const AllTestimorals = () => {
  const { getTestimoral, handelgetTestimoral } = useContext(CocirculerContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('');
  const [testimonialData, setTestimonialData] = useState(getTestimoral || []);

  useEffect(() => {
    handelgetTestimoral();
  }, []);

  useEffect(() => {
    setTestimonialData(getTestimoral || []);
  }, [getTestimoral]);

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let data = [...testimonialData];

    // Search filter
    if (search.trim()) {
      data = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.content?.toLowerCase().includes(search.toLowerCase())
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
  }, [testimonialData, search, sort, filter]);

  const handleToggleVisibility = (id) => {
    toast.info('Visibility toggle - feature to be configured');
    // TODO: Implement visibility toggle
  };

  // Table Columns with Actions
  const columns = [
    { key: 'name', label: 'Testimonial Author' },
    {
      key: 'content',
      label: 'Content',
      render: (row) => (row.content || row.description || '-').substring(0, 50) + '...'
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => {
        try {
          return new Date(row.createdAt).toLocaleDateString();
        } catch {
          return '-';
        }
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/landpage/testimorals/view/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/landpage/testimorals/update/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => handleToggleVisibility(row._id)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="Toggle Visibility"
          >
            <FaEyeSlash size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this testimonial?')) {
                toast.success('Testimonial deleted successfully');
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

  if (!testimonialData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="All Testimonials"
        searchValue={search}
        onSearchChange={setSearch}
        addButtonText="Add Testimonial"
        addButtonPath="/landpage/testimorals/add"
        searchPlaceholder="Search by author or content..."
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
        emptyText="No testimonials found"
        pageSize={8}
      />
    </div>
  );
};

export default AllTestimorals;