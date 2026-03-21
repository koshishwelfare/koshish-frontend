const DashboardCociculer = () => {
  return (
    <div className="space-y-4">
      <div className="admin-card p-4 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900">Co-curricular Dashboard</h2>
        <p className="text-sm text-slate-600">Overview and quick navigation for co-curricular operations.</p>
      </div>

      <div className="admin-card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">Attendance Module Moved</h3>
        <p className="text-sm text-slate-600">
          Teacher self-attendance token and attendance listing are now inside Academic section.
        </p>
      </div>
    </div>
  );
};

export default DashboardCociculer