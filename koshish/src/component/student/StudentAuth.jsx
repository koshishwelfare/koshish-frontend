import { useContext, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { StudentContext } from '../../context/StudentContext';

const initialRegister = {
  name: '',
  username: '',
  email: '',
  password: '',
  registrationNumber: '',
  phoneNumber: '',
  course: '',
  year: ''
};

const initialLogin = {
  username: '',
  password: ''
};

const initialRecovery = {
  email: '',
  username: ''
};

const StudentAuth = () => {
  const { studentRegister, studentLogin, studentLoading, studentRecoverCredentials } = useContext(StudentContext);
  const [tab, setTab] = useState('login');
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [recoveryForm, setRecoveryForm] = useState(initialRecovery);

  const isLoading = useMemo(() => studentLoading, [studentLoading]);

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    await studentRegister(registerForm);
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    await studentLogin(loginForm);
  };

  const onRecoverSubmit = async (e) => {
    e.preventDefault();
    await studentRecoverCredentials(recoveryForm);
  };

  return (
    <div className="min-h-screen bg-green-50 pt-28 pb-16 px-4">
      <Helmet>
        <title>Student Login - Koshish</title>
      </Helmet>

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-md font-semibold transition ${tab === 'login' ? 'bg-blue10 text-white' : 'text-gray-700'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-md font-semibold transition ${tab === 'register' ? 'bg-blue10 text-white' : 'text-gray-700'}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setTab('forgot')}
            className={`flex-1 py-2 rounded-md font-semibold transition ${tab === 'forgot' ? 'bg-blue10 text-white' : 'text-gray-700'}`}
          >
            Forgot Password
          </button>
        </div>

        {tab === 'login' ? (
          <form className="space-y-4" onSubmit={onLoginSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
            >
              {isLoading ? 'Please wait...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setTab('forgot')}
              className="w-full rounded-lg border border-blue10 px-4 py-2 font-semibold text-blue10"
            >
              Forgot Password?
            </button>
          </form>
        ) : tab === 'register' ? (
          <form className="space-y-4" onSubmit={onRegisterSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={registerForm.username}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Registration Number"
              value={registerForm.registrationNumber}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, registrationNumber: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={registerForm.phoneNumber}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Course (optional)"
              value={registerForm.course}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, course: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Year (optional)"
              value={registerForm.year}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, year: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue10 text-white py-2 rounded-lg font-semibold hover:opacity-95 transition disabled:opacity-60"
            >
              {isLoading ? 'Please wait...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onRecoverSubmit}>
            <input
              type="email"
              placeholder="Registered email (optional)"
              value={recoveryForm.email}
              onChange={(e) => setRecoveryForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Username (recommended)"
              value={recoveryForm.username}
              onChange={(e) => setRecoveryForm((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || (!recoveryForm.email && !recoveryForm.username)}
              className="w-full bg-blue10 text-white py-2 rounded-lg font-semibold hover:opacity-95 transition disabled:opacity-60"
            >
              {isLoading ? 'Please wait...' : 'Recover Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentAuth;
