import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import DataTable from '../../common/DataTable';

const ManageAcademic = () => {
  const {
    academicSessions,
    academicClasses,
    handleGetAcademicSessions,
    handleGetAcademicClasses
  } = useContext(CocirculerContext);

  useEffect(() => {
    handleGetAcademicSessions();
    handleGetAcademicClasses();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue10 mb-6">Academic Management</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="text-lg font-semibold">Session Management</h2>
          <p className="mt-1 text-sm text-slate-600">Create session using modal and manage session records from listing.</p>
          <div className="mt-4 flex gap-2">
            <Link to="/academic/sessions" className="rounded bg-blue-600 px-3 py-2 text-sm text-white">Open Session Listing</Link>
            <span className="rounded border px-3 py-2 text-sm text-slate-700">Total: {academicSessions.length}</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <h2 className="text-lg font-semibold">Class Management</h2>
          <p className="mt-1 text-sm text-slate-600">Create class using modal and manage class records from listing.</p>
          <div className="mt-4 flex gap-2">
            <Link to="/academic/classes" className="rounded bg-blue-600 px-3 py-2 text-sm text-white">Open Class Listing</Link>
            <span className="rounded border px-3 py-2 text-sm text-slate-700">Total: {academicClasses.length}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Sessions</h3>
          <DataTable
            pageSize={5}
            rows={academicSessions}
            emptyText="No sessions found"
            columns={[
              { key: 'name', label: 'Session' },
              {
                key: 'duration',
                label: 'Duration',
                render: (row) => `${row.startYear || '-'} - ${row.endYear || '-'}`
              },
              {
                key: 'isActive',
                label: 'Status',
                render: (row) => (row.isActive ? 'Active' : 'Inactive')
              }
            ]}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Classes</h3>
          <DataTable
            pageSize={5}
            rows={academicClasses}
            emptyText="No classes found"
            columns={[
              { key: 'name', label: 'Class' },
              { key: 'grade', label: 'Grade' },
              { key: 'section', label: 'Section' },
              {
                key: 'mentor',
                label: 'Mentor',
                render: (row) => row.mentorId?.name || '-'
              },
              {
                key: 'teacher',
                label: 'Teacher',
                render: (row) => row.teacherId?.username || '-'
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageAcademic;
