import axios from 'axios';
import { toast } from 'react-toastify'

const buildCoordinatorConfig = (ordiToken) => {
  const hasJwt = Boolean(ordiToken && ordiToken !== '__COOKIE_AUTH__');
  return {
    withCredentials: true,
    headers: hasJwt
      ? {
          authcooditoken: ordiToken,
          Authorization: `Bearer ${ordiToken}`
        }
      : {}
  };
};

const changecocirculer =async (backendURL,formData,ordiToken) => {
  try {
    const {data} = await axios.post(backendURL + '/api/coordinater/change-cociculer', formData, buildCoordinatorConfig(ordiToken))
    if (data.success){
        toast.success(data.message);
        return true;
    }
    else {
        toast.error(data.message);
        return false;
    }
} catch (error) {
    toast.error(error.message);
    return false;
  }
}

export const getCocirculerList = async (backendURL, ordiToken, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/coordinater/cocircular/list', {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch co-curricular users');
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const activateCocirculer = async (backendURL, id, ordiToken) => {
  try {
    const { data } = await axios.patch(backendURL + `/api/coordinater/cocircular/activate/${id}`, {}, buildCoordinatorConfig(ordiToken));
    if (data.success) {
      toast.success(data.message || 'Co-curricular activated');
      return true;
    }
    toast.error(data.message || 'Activation failed');
    return false;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

export const deactivateCocirculer = async (backendURL, id, ordiToken) => {
  try {
    const { data } = await axios.patch(backendURL + `/api/coordinater/cocircular/deactivate/${id}`, {}, buildCoordinatorConfig(ordiToken));
    if (data.success) {
      toast.success(data.message || 'Co-curricular deactivated');
      return true;
    }
    toast.error(data.message || 'Deactivation failed');
    return false;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

export const getCoordinatorMembersList = async (backendURL, ordiToken, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/coordinater/members/list', {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch members');
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const getCoordinatorStudentsList = async (backendURL, ordiToken, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/coordinater/students/list', {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch students');
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const getCoordinatorSessionsList = async (backendURL, ordiToken, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/coordinater/sessions/list', {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch sessions');
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const getCoordinatorSessionClassesList = async (backendURL, ordiToken, sessionId, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + `/api/coordinater/sessions/${sessionId}/classes/list`, {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch classes');
      return {
        session: null,
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      session: data.session || null,
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      session: null,
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const getCoordinatorEventsList = async (backendURL, ordiToken, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/coordinater/events/list', {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch events');
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const getCoordinatorNewsList = async (backendURL, ordiToken, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/coordinater/news/list', {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch news');
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const getCoordinatorGalleryList = async (backendURL, ordiToken, query = {}) => {
  try {
    const { data } = await axios.get(backendURL + '/api/coordinater/gallery/list', {
      ...buildCoordinatorConfig(ordiToken),
      params: query
    });
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch gallery');
      return {
        records: [],
        pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
      };
    }
    return {
      records: Array.isArray(data.records) ? data.records : [],
      pagination: data.pagination || { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  } catch (error) {
    toast.error(error.message);
    return {
      records: [],
      pagination: { page: 1, limit: Number(query.limit) || 10, total: 0, totalPages: 1 }
    };
  }
};

export const getCoordinatorCocircularProfile = async (backendURL, ordiToken, id) => {
  try {
    const { data } = await axios.get(backendURL + `/api/coordinater/cocircular/profile/${id}`, buildCoordinatorConfig(ordiToken));
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch co-curricular profile');
      return null;
    }
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export const getCoordinatorTeacherProfile = async (backendURL, ordiToken, id) => {
  try {
    const { data } = await axios.get(backendURL + `/api/coordinater/teacher/profile/${id}`, buildCoordinatorConfig(ordiToken));
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch teacher profile');
      return null;
    }
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export const getCoordinatorStudentProfile = async (backendURL, ordiToken, id) => {
  try {
    const { data } = await axios.get(backendURL + `/api/coordinater/student/profile/${id}`, buildCoordinatorConfig(ordiToken));
    if (!data.success) {
      toast.error(data.message || 'Failed to fetch student profile');
      return null;
    }
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

export default changecocirculer