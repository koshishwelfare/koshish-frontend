import { useState, useContext, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import ListPageHeader from '../../common/ListPageHeader';
import FilterToolbar from '../../common/FilterToolbar';
import DataTable from '../../common/DataTable';
import { toast } from 'react-toastify';

const AllGallary = () => {
  const navigate = useNavigate();
  const { gallaryAll, handelGalleryAll, handelDeleteGallery } = useContext(CocirculerContext);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('');
  const [galleryData, setGalleryData] = useState(gallaryAll || []);

  useEffect(() => {
    handelGalleryAll();
  }, []);

  useEffect(() => {
    setGalleryData(gallaryAll || []);
  }, [gallaryAll]);

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let data = [...galleryData];

    // Search filter
    if (search.trim()) {
      data = data.filter((item) =>
        item.galleryTitle?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort logic
    if (sort === 'asc') {
      data.sort((a, b) => (a.galleryTitle || '').localeCompare(b.galleryTitle || ''));
    } else if (sort === 'desc') {
      data.sort((a, b) => (b.galleryTitle || '').localeCompare(a.galleryTitle || ''));
    } else if (sort === 'newest') {
      data.reverse();
    }

    return data;
  }, [galleryData, search, sort, filter]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this gallery album?')) {
      handelDeleteGallery(id);
      toast.success('Gallery album deleted successfully');
    }
  };

  // Table Columns with Actions
  const columns = [
    { key: 'galleryTitle', label: 'Gallery Title' },
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
            onClick={() => navigate(`/gallery/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/gallery/update/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="admin-btn admin-btn-danger p-2 flex items-center gap-1"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )
    }
  ];

  if (!galleryData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="All Gallery Albums"
        searchValue={search}
        onSearchChange={setSearch}
        addButtonText="Add Gallery"
        addButtonPath="/gallery/add"
        searchPlaceholder="Search by gallery title..."
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
        emptyText="No gallery albums found"
        pageSize={8}
      />
    </div>
  );
};

export default AllGallary;