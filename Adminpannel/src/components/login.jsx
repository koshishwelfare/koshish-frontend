import { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { CocirculerContext } from '../context/cocirculer';
import { CoordinatorContext } from '../context/coordinater';
import { TeacherContext } from '../context/teacher';
import login from '../utilities/App/login';
import { recoverCredentialsByRole } from '../utilities/App/login';
import { AppContext } from '../context/app';
const Login = () => {
    const { setCirToken } = useContext(CocirculerContext);
    const { setOrdiToken } = useContext(CoordinatorContext)
    const { setTeaToken } = useContext(TeacherContext)
    const { backendURL } = useContext(AppContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [recoverRole, setRecoverRole] = useState('teacher');
    const [recoverEmail, setRecoverEmail] = useState('');
    const [recoverUsername, setRecoverUsername] = useState('');
    const [recoverLoading, setRecoverLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!role) {
            toast.info('Please select a role.');
            return;
        }

        setLoading(true);
        try {
            if (role === 'cocircular') {
                await login(backendURL, username, password, role, setCirToken)
            } else if (role === 'coordinator') {
                await login(backendURL, username, password, role, setOrdiToken)
            } else if (role === 'teacher') {
                await login(backendURL, username, password, role, setTeaToken)
            }
        } finally {
            setLoading(false);
        }
    }

    const onRecoverHandler = async (e) => {
        e.preventDefault();
        setRecoverLoading(true);
        try {
            await recoverCredentialsByRole(backendURL, recoverRole, {
                email: recoverEmail,
                username: recoverUsername
            });
        } finally {
            setRecoverLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center px-4 py-10 sm:px-6">
            <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">
                <aside className="relative hidden overflow-hidden bg-slate-900 p-10 text-white lg:block">
                    <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-blue-500/30 blur-2xl" />
                    <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

                    <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Koshish Administration</p>
                    <h1 className="relative mt-4 text-4xl font-black leading-tight">Secure Portal For Campus Operations</h1>
                    <p className="relative mt-6 max-w-sm text-sm leading-relaxed text-slate-200">
                        Manage co-curricular programs, teacher tools, and coordinator operations from a single professional dashboard.
                    </p>
                </aside>

                <div className="p-6 sm:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Welcome back</p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Sign in to Admin Panel</h2>

                    <form className="mt-8 space-y-5" onSubmit={onSubmitHandler}>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">Username</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                className="admin-input"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="admin-input"
                                type="password"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
                            <select
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="admin-input"
                                required
                            >
                                <option value="">Select role</option>
                                <option value="coordinator">Coordinator</option>
                                <option value="cocircular">Co-curricular</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>

                        <button className="admin-btn admin-btn-primary w-full py-2.5" disabled={loading} type="submit">
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-slate-200 pt-5">
                        <p className="mb-3 text-sm font-semibold text-slate-700">Forgot Password</p>
                        <form className="space-y-3" onSubmit={onRecoverHandler}>
                            <select
                                value={recoverRole}
                                onChange={(e) => setRecoverRole(e.target.value)}
                                className="admin-input"
                                required
                            >
                                <option value="teacher">Teacher</option>
                                <option value="cocircular">Co-curricular</option>
                                <option value="student">Student</option>
                            </select>

                            <input
                                value={recoverEmail}
                                onChange={(e) => setRecoverEmail(e.target.value)}
                                className="admin-input"
                                type="email"
                                placeholder={recoverRole === 'student' ? 'Registered email (optional for student)' : 'Registered email'}
                                required={recoverRole !== 'student'}
                            />

                            {recoverRole === 'student' && (
                                <input
                                    value={recoverUsername}
                                    onChange={(e) => setRecoverUsername(e.target.value)}
                                    className="admin-input"
                                    placeholder="Student username (optional if email provided)"
                                />
                            )}

                            <button className="admin-btn admin-btn-secondary w-full py-2.5" disabled={recoverLoading} type="submit">
                                {recoverLoading ? 'Processing...' : 'Send Recovery Credentials'}
                            </button>
                        </form>
                    </div>
                </div>
                        </div>
                </section>
        )
}

export default Login