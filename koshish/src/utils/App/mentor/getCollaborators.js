import axios from 'axios'
import { toast } from 'react-toastify'

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

const getCollaboratorOrganizations = async (backendURL, setCollaboratorOrganizations, options = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/app/collaborators/list', {
      params: buildQueryParams(options)
    });

    if (data.success) {
      setCollaboratorOrganizations(normalizeListPayload(data));
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    setCollaboratorOrganizations('5xx');
    toast.error(error.message);
  }
};

const getCollaboratorOrganizationById = async (backendURL, id) => {
  try {
    const { data } = await axios.get(backendURL + `/api/app/collaborators/view/${id}`);
    return data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message
    };
  }
};

export { getCollaboratorOrganizations, getCollaboratorOrganizationById };
