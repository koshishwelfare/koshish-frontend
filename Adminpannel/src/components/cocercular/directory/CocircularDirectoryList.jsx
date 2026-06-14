import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTable from '../../common/DataTable';
import FilterToolbar from '../../common/FilterToolbar';

const CocircularDirectoryList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const token = localStorage.getItem('cirToken');

  const querySort = useMemo(() => {
    if (sort === 'asc') return { sortBy: 'name', sortOrder: 'asc' };
    if (sort === 'desc') return { sortBy: 'name', sortOrder: 'desc' };
    if (sort === 'oldest') return { sortBy: 'date', sortOrder: 'asc' };
    return { sortBy: 'date', sortOrder: 'desc' };
  }, [sort]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendURL}/api/cocirculer/cocircular/list`, {
          withCredentials: true,
          headers: token ? { authCociculertoken: token } : {},
          params: {
            q: search,
            ...querySort,
            page: 1,
            limit: 100
          }
        });

        if (data?.success) {
          setRows(Array.isArray(data.data) ? data.data : []);
        } else {
          setRows([]);
        }
      } catch (error) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [backendURL, token, search, querySort]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this co-curricular profile? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      const { data } = await axios.delete(`${backendURL}/api/cocirculer/cocircular/delete/${id}`, {
        withCredentials: true,
        headers: token ? { authCociculertoken: token } : {}
      });

      if (!data?.success) {
        toast.error(data?.message || 'Unable to delete profile');
        return;
      }

      toast.success(data.message || 'Profile deleted');
      setRows((prev) => prev.filter((row) => row._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'speciality', label: 'Speciality' },
    {
      key: 'isactive',
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.isactive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {row.isactive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/directory/co-curricular/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2"
            title="View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/directory/co-curricular/edit/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="admin-btn admin-btn-secondary p-2"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="admin-heading">Co-Curricular Directory</h1>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => navigate('/directory/co-curricular/add')}
          >
            Add Co-Curricular
          </button>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or speciality..."
            className="admin-input pl-10 w-full"
          />
        </div>
      </div>

      <FilterToolbar
        sortValue={sort}
        onSortChange={setSort}
        showFilter={false}
      />

      <DataTable
        columns={columns}
        rows={rows}
        emptyText={loading ? 'Loading...' : 'No co-curricular profiles found'}
        pageSize={8}
      />
    </div>
  );
};

export default CocircularDirectoryList;
