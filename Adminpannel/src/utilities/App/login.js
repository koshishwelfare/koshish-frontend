import axios from "axios"
import { toast } from "react-toastify"

const COOKIE_SESSION_TOKEN = '__COOKIE_AUTH__';

const clearRoleTokens = () => {
    localStorage.removeItem('ordiToken');
    localStorage.removeItem('cirToken');
    localStorage.removeItem('teaToken');
};

const normalizeMessage = (data, fallback) => data?.message || data?.massage || fallback;
const resolveToken = (data, role) => {
    if (!data) return null;
    if (data.token) return data.token;
  if (role === 'coordinator') return data.coordinatorToken || data.cocirculertoken || null;
    if (role === 'cocircular') return data.cocirculertoken || null;
    if (role === 'teacher') return data.teachertoken || null;
    return null;
};

const coordinatorLogin = async (backendURL,username,password,role,setToken) => {
  try {
        const setTokenSafe = typeof setToken === 'function' ? setToken : () => {};
     if (role === 'coordinator') {
  const payload = { username: String(username || '').trim(), password };
  const {data} = await axios.post(backendURL+'/api/coordinater/login', payload, { withCredentials: true });
        const token = resolveToken(data, role);
    if (data.success) {
        const sessionToken = token || COOKIE_SESSION_TOKEN;
                clearRoleTokens();
        setTokenSafe(sessionToken)
        localStorage.setItem('ordiToken', sessionToken)
                toast.success(normalizeMessage(data, 'Coordinator login successful'));
                return true;
    }
    else {
                toast.error(normalizeMessage(data, 'Coordinator login failed'))
                return false;
    }
}
else if (role === 'cocircular') {
        const {data} = await axios.post(backendURL+'/api/cocirculer/login', {username,password}, { withCredentials: true });
                const token = resolveToken(data, role);
                if (data.success) {
                    if (token) {
                        const sessionToken = token || COOKIE_SESSION_TOKEN;
                        clearRoleTokens();
                        setTokenSafe(sessionToken);
                        localStorage.setItem('cirToken', sessionToken);
                        toast.success(normalizeMessage(data, 'Co-curricular login successful'));
                        return true;
                    } else {
                        clearRoleTokens();
                        setTokenSafe(COOKIE_SESSION_TOKEN);
                        localStorage.setItem('cirToken', COOKIE_SESSION_TOKEN);
                        toast.success(normalizeMessage(data, 'Co-curricular login successful'));
                        return true;
                    }
        }
        else {
                        toast.error(normalizeMessage(data, 'Co-curricular login failed'))
                        return false;
        }
}
else if (role === 'teacher') {
    const {data} = await axios.post(backendURL+'/api/teacher/login', {username,password}, { withCredentials: true });
    const token = resolveToken(data, role);
    if (data.success && token) {
            clearRoleTokens();
        setTokenSafe(token)
            localStorage.setItem('teaToken', token)
            toast.success(normalizeMessage(data, 'Teacher login successful'));
            return true;
  }
  else {
            toast.error(normalizeMessage(data, 'Teacher login failed'))
            return false;
  }
}
} catch (error) {
    toast.error(error.message)
    return false;
  }
}

export default coordinatorLogin