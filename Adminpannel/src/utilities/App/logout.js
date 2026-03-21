import axios from 'axios';

const postLogout = async (url, headers = {}) => {
  try {
    await axios.post(url, {}, { withCredentials: true, headers });
  } catch (error) {
    // Ignore logout endpoint failures; local token cleanup still signs user out in UI.
  }
};

const logoutAllRoles = async (backendURL, { cirToken, ordiToken, teaToken }) => {
  const coordinatorHeaders =
    ordiToken && ordiToken !== '__COOKIE_AUTH__'
      ? { authcooditoken: ordiToken }
      : {};

  const cocircularHeaders = 
    cirToken && cirToken !== '__COOKIE_AUTH__'
      ? { authcociculertoken: cirToken }
      : {};

  await Promise.all([
    postLogout(`${backendURL}/api/cocirculer/logout`, cocircularHeaders),
    postLogout(`${backendURL}/api/coordinater/logout`, coordinatorHeaders),
    postLogout(`${backendURL}/api/teacher/logout`, teaToken ? { authteachertoken: teaToken } : {})
  ]);

  localStorage.removeItem('cirToken');
  localStorage.removeItem('ordiToken');
  localStorage.removeItem('teaToken');
};

export default logoutAllRoles;
