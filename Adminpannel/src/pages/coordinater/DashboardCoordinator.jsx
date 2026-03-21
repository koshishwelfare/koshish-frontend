import { Link } from 'react-router-dom';

const DashboardCoordinator = () => {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Coordinator Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Manage coordinator operations from a clean overview panel.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Action</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Manage Co-curricular Users</h2>
          <p className="mt-2 text-sm text-slate-600">Add users, view listing, and control which account is active.</p>
          <Link
            to="/change-cocirculer"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Open Management
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">System</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Workspace Status</h2>
          <p className="mt-2 text-sm text-slate-600">Coordinator panel is active and ready for operations.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tip</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Quick Navigation</h2>
          <p className="mt-2 text-sm text-slate-600">Use sidebar links to switch between dashboard and coordinator actions.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCoordinator;
