import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaEye, FaSearch } from 'react-icons/fa';
import DataTable from '../../common/DataTable';
import FilterToolbar from '../../common/FilterToolbar';

const CollaboratorDirectoryList = () => {
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
    if (sort === 'oldest') return { sortBy: 'createdAt', sortOrder: 'asc' };
    return { sortBy: 'createdAt', sortOrder: 'desc' };
  }, [sort]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendURL}/api/cocirculer/collaborators/list`, {
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

  const columns = [
    { key: 'name', label: 'Organization' },
    { key: 'speciality', label: 'Speciality' },
    { key: 'email', label: 'Email' },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/directory/collaborators/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2"
            title="View"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => navigate(`/directory/collaborators/edit/${row._id}`)}
            className="admin-btn admin-btn-secondary p-2"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="admin-heading">Collaborator Directory</h1>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => navigate('/directory/collaborators/add')}
          >
            Add Collaborator
          </button>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations..."
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
        emptyText={loading ? 'Loading...' : 'No collaborator organizations found'}
        pageSize={8}
      />
    </div>
  );
};

export default CollaboratorDirectoryList;
