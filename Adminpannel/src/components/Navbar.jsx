import { useContext } from 'react'
import { AppContext } from '../context/app';
import { CocirculerContext } from '../context/cocirculer';
import { CoordinatorContext } from '../context/coordinater';
import { TeacherContext } from '../context/teacher';
import logoutAllRoles from '../utilities/App/logout';

const Navbar = () => {
  const { backendURL } = useContext(AppContext);
  const { cirToken, setCirToken } = useContext(CocirculerContext);
  const { ordiToken, setOrdiToken } = useContext(CoordinatorContext);
  const { teaToken, setTeaToken } = useContext(TeacherContext);

  const activeRole = ordiToken ? 'Coordinator' : cirToken ? 'Co-curricular' : teaToken ? 'Teacher' : 'Admin';

  const handleLogout = async () => {
    await logoutAllRoles(backendURL, { cirToken, ordiToken, teaToken });
    setCirToken(false);
    setOrdiToken(false);
    setTeaToken(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="app-content flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D0BAQFQ6sFIgZncMg/company-logo_200_200/company-logo_200_200/0/1697705568505?e=2147483647&v=beta&t=s9tHs8Fq5xCuRpqXmO81GJcWElaWFs2JumQs82cPzpI"
              alt="Koshish logo"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 md:text-lg">Koshish Admin Panel</h1>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{activeRole} Console</p>
          </div>
        </div>

        <button onClick={handleLogout} className="admin-btn admin-btn-danger text-sm">
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar