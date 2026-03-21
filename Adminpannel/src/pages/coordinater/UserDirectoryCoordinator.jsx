import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoordinatorContext } from '../../context/coordinater';

const UserDirectoryCoordinator = () => {
  const {
    coordinatorMembersListing,
    coordinatorStudentsListing,
    handleGetCoordinatorMembersList,
    handleGetCoordinatorStudentsList
  } = useContext(CoordinatorContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('members');
  const [memberSearchDraft, setMemberSearchDraft] = useState('');
  const [studentSearchDraft, setStudentSearchDraft] = useState('');

  const [memberFilters, setMemberFilters] = useState({
    q: '',
    role: '',
    isActive: '',
    sortBy: 'joinTime',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const [studentFilters, setStudentFilters] = useState({
    q: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMemberFilters((prev) => {
        if (prev.q === memberSearchDraft) return prev;
        return { ...prev, q: memberSearchDraft, page: 1 };
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [memberSearchDraft]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudentFilters((prev) => {
        if (prev.q === studentSearchDraft) return prev;
        return { ...prev, q: studentSearchDraft, page: 1 };
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [studentSearchDraft]);

  useEffect(() => {
    handleGetCoordinatorMembersList(memberFilters);
  }, [memberFilters]);

  useEffect(() => {
    handleGetCoordinatorStudentsList(studentFilters);
  }, [studentFilters]);

  const applyMemberFilters = async (overrides = {}) => {
    const next = { ...memberFilters, ...overrides };
    setMemberFilters(next);
  };

  const applyStudentFilters = async (overrides = {}) => {
    const next = { ...studentFilters, ...overrides };
    setStudentFilters(next);
  };

  const openTeacherProfile = (id) => navigate(`/profile/teacher/${id}`);

  const openStudentProfile = (id) => navigate(`/profile/student/${id}`);

  const memberRows = useMemo(() => coordinatorMembersListing?.records || [], [coordinatorMembersListing]);
  const studentRows = useMemo(() => coordinatorStudentsListing?.records || [], [coordinatorStudentsListing]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Member and Student Directory</h2>
        <p className="mt-1 text-sm text-slate-600">Coordinator can view all teachers/members and students with profile access.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded px-3 py-2 text-sm font-semibold ${activeTab === 'members' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setActiveTab('members')}
        >
          All Members
        </button>
        <button
          type="button"
          className={`rounded px-3 py-2 text-sm font-semibold ${activeTab === 'students' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setActiveTab('students')}
        >
          All Students
        </button>
      </div>

      {activeTab === 'members' ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 grid gap-2 md:grid-cols-6">
            <input
              type="text"
              value={memberSearchDraft}
              onChange={(e) => setMemberSearchDraft(e.target.value)}
              placeholder="Search member"
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={memberFilters.role}
              onChange={(e) => setMemberFilters((prev) => ({ ...prev, role: e.target.value, page: 1 }))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Roles</option>
              <option value="mentor">Mentor</option>
              <option value="sponsor">Sponsor</option>
              <option value="alumni">Alumni</option>
              <option value="collaborator">Collaborator</option>
            </select>
            <select
              value={memberFilters.isActive}
              onChange={(e) => setMemberFilters((prev) => ({ ...prev, isActive: e.target.value, page: 1 }))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={memberFilters.sortBy}
              onChange={(e) => setMemberFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="joinTime">Sort: Join Time</option>
              <option value="createdAt">Sort: Created</option>
              <option value="name">Sort: Name</option>
              <option value="email">Sort: Email</option>
              <option value="role">Sort: Role</option>
            </select>
            <select
              value={memberFilters.sortOrder}
              onChange={(e) => setMemberFilters((prev) => ({ ...prev, sortOrder: e.target.value, page: 1 }))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <button
              type="button"
              onClick={() => applyMemberFilters({ page: 1 })}
              className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Apply
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Email</th>
                  <th className="px-3 py-2 font-semibold">Role</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {memberRows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => openTeacherProfile(row._id)}
                        className="text-left text-blue-700 hover:underline"
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className="px-3 py-2">{row.email}</td>
                    <td className="px-3 py-2">{row.role || '-'}</td>
                    <td className="px-3 py-2">{row.isActive ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))}
                {!memberRows.length && (
                  <tr>
                    <td colSpan={4} className="px-3 py-5 text-center text-slate-500">No members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {coordinatorMembersListing?.pagination?.page || 1} of {coordinatorMembersListing?.pagination?.totalPages || 1} | Total {coordinatorMembersListing?.pagination?.total || 0}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorMembersListing?.pagination?.page || 1) <= 1}
                onClick={() => applyMemberFilters({ page: Math.max((coordinatorMembersListing?.pagination?.page || 1) - 1, 1) })}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorMembersListing?.pagination?.page || 1) >= (coordinatorMembersListing?.pagination?.totalPages || 1)}
                onClick={() => applyMemberFilters({ page: Math.min((coordinatorMembersListing?.pagination?.page || 1) + 1, coordinatorMembersListing?.pagination?.totalPages || 1) })}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 grid gap-2 md:grid-cols-5">
            <input
              type="text"
              value={studentSearchDraft}
              onChange={(e) => setStudentSearchDraft(e.target.value)}
              placeholder="Search student"
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={studentFilters.sortBy}
              onChange={(e) => setStudentFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="createdAt">Sort: Created</option>
              <option value="name">Sort: Name</option>
              <option value="username">Sort: Username</option>
              <option value="email">Sort: Email</option>
            </select>
            <select
              value={studentFilters.sortOrder}
              onChange={(e) => setStudentFilters((prev) => ({ ...prev, sortOrder: e.target.value, page: 1 }))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <select
              value={studentFilters.limit}
              onChange={(e) => setStudentFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <button
              type="button"
              onClick={() => applyStudentFilters({ page: 1 })}
              className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Apply
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Username</th>
                  <th className="px-3 py-2 font-semibold">Email</th>
                  <th className="px-3 py-2 font-semibold">Roll/Reg</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => openStudentProfile(row._id)}
                        className="text-left text-blue-700 hover:underline"
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className="px-3 py-2">{row.username}</td>
                    <td className="px-3 py-2">{row.email}</td>
                    <td className="px-3 py-2">{row.rollNumber || row.registrationNumber || '-'}</td>
                  </tr>
                ))}
                {!studentRows.length && (
                  <tr>
                    <td colSpan={4} className="px-3 py-5 text-center text-slate-500">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {coordinatorStudentsListing?.pagination?.page || 1} of {coordinatorStudentsListing?.pagination?.totalPages || 1} | Total {coordinatorStudentsListing?.pagination?.total || 0}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorStudentsListing?.pagination?.page || 1) <= 1}
                onClick={() => applyStudentFilters({ page: Math.max((coordinatorStudentsListing?.pagination?.page || 1) - 1, 1) })}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm"
                disabled={(coordinatorStudentsListing?.pagination?.page || 1) >= (coordinatorStudentsListing?.pagination?.totalPages || 1)}
                onClick={() => applyStudentFilters({ page: Math.min((coordinatorStudentsListing?.pagination?.page || 1) + 1, coordinatorStudentsListing?.pagination?.totalPages || 1) })}
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

export default UserDirectoryCoordinator;
