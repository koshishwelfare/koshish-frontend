import { useState, useContext, useEffect, useMemo } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import { CocirculerContext } from '../../context/cocirculer';
import ListPageHeader from '../common/ListPageHeader';
import FilterToolbar from '../common/FilterToolbar';
import DataTable from '../common/DataTable';
import { toast } from 'react-toastify';

const Contact = () => {
  const { getcontact, handelContact } = useContext(CocirculerContext);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('');
  const [contactData, setContactData] = useState(getcontact || []);

  useEffect(() => {
    handelContact();
  }, []);

  useEffect(() => {
    setContactData(getcontact || []);
  }, [getcontact]);

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let data = [...contactData];

    // Search filter
    if (search.trim()) {
      data = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase())
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
  }, [contactData, search, sort, filter]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      toast.success('Contact message deleted successfully');
      // TODO: Add delete handler from context
    }
  };

  // Table Columns with Actions
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (row.message || '-').substring(0, 50) + '...'
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
            onClick={() => {
              toast.info(`Message from ${row.name}: ${row.message}`);
            }}
            className="admin-btn admin-btn-secondary p-2 flex items-center gap-1"
            title="View"
          >
            <FaEye size={14} />
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

  if (!contactData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Contact Messages"
        searchValue={search}
        onSearchChange={setSearch}
        addButtonText="Reply to Contact"
        addButtonPath="#"
        searchPlaceholder="Search by name or email..."
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
        emptyText="No contact messages found"
        pageSize={10}
      />
    </div>
  );
};

export default Contact;