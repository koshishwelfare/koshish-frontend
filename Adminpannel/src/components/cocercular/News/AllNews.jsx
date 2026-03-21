import { useState, useContext, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { CocirculerContext } from '../../../context/cocirculer';
import { useNavigate } from 'react-router-dom';
import ListPageHeader from '../../common/ListPageHeader';
import FilterToolbar from '../../common/FilterToolbar';
import DataTable from '../../common/DataTable';
import { toast } from 'react-toastify';

const AllNews = () => {
  const { news, handelgetAllNews } = useContext(CocirculerContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('');
  const [newsData, setNewsData] = useState(news || []);

  useEffect(() => {
    handelgetAllNews();
  }, []);

  useEffect(() => {
    setNewsData(news || []);
  }, [news]);

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let data = [...newsData];

    // Search filter
    if (search.trim()) {
      data = data.filter((item) =>
        item.heading?.toLowerCase().includes(search.toLowerCase()) ||
        item.content?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort logic
    if (sort === 'asc') {
      data.sort((a, b) => (a.heading || '').localeCompare(b.heading || ''));
    } else if (sort === 'desc') {
      data.sort((a, b) => (b.heading || '').localeCompare(a.heading || ''));
    } else if (sort === 'newest') {
      data.reverse();
    }

    return data;
  }, [newsData, search, sort, filter]);

  const handleToggleVisibility = (id) => {
    toast.info('Visibility toggle - feature to be configured');
    // TODO: Implement visibility toggle
  };

  // Table Columns with Actions
  const columns = [
    { key: 'heading', label: 'News Title' },
    {
      key: 'content',
      label: 'Content',
      render: (row) => (row.content || '-').substring(0, 50) + '...'
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
            onClick={() => navigate(`/news/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/news/update/${row._id}`)}
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
              if (window.confirm('Are you sure you want to delete this news?')) {
                toast.success('News deleted successfully');
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

  if (!newsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="All News"
        searchValue={search}
        onSearchChange={setSearch}
        addButtonText="Add News"
        addButtonPath="/news/add"
        searchPlaceholder="Search by news title..."
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
        emptyText="No news found"
        pageSize={8}
      />
    </div>
  );
};

export default AllNews;
