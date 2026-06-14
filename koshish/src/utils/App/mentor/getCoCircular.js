import axios from 'axios'
import {toast} from 'react-toastify'

const buildQueryParams = (options = {}) => {
  const params = {
    page: 1,
    limit: 20,
    ...options
  };
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      delete params[key];
    }
  });
  return params;
};

const normalizeListPayload = (payload) => ({
  data: Array.isArray(payload?.data) ? payload.data : [],
  pagination: payload?.pagination || null
});

const getCoCircularMembers = async (backendURL, setCoCircularMembers, options = {}) => {
  try {
    const params = buildQueryParams(options);

    const { data } = await axios.get(backendURL + '/api/app/co-curricular/list', {
      params
    })
    if (data.success) {
      if (!Array.isArray(data.data) || data.data.length === 0) {
        setCoCircularMembers('NODATA');
        return;
      }
      setCoCircularMembers(normalizeListPayload(data));
    }
    else toast.error(data.message);
  } catch (error) {
    setCoCircularMembers('5xx');
    toast.error(error.message);
  }
}

export { getCoCircularMembers }
