import axios from 'axios';
import { toast } from 'react-toastify';

const headers = (cirToken, isFormData = false) => {
  const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
  const config = {
    withCredentials: true,
  };
  
  if (hasJwt) {
    config.headers = { authCociculertoken: cirToken };
  } else {
    config.headers = {};
  }

  if (isFormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
};

const getOwnProfile = async (backendURL, cirToken) => {
  try {
    const { data } = await axios.get(`${backendURL}/api/cocirculer/profile-management`, headers(cirToken));
    if (!data.success) {
      toast.error(data.message);
      return null;
    }
    return data.data || null;
  } catch (error) {
    toast.error(error.message);
    return null;
  }
};

const updateOwnProfile = async (backendURL, cirToken, payload) => {
  try {
    // Check if payload contains a file (File object)
    let isFormData = false;
    Object.values(payload).forEach(value => {
      if (value instanceof File) {
        isFormData = true;
      }
    });

    let requestData = payload;
    if (isFormData) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });
      requestData = formData;
    }

    const { data } = await axios.patch(
      `${backendURL}/api/cocirculer/profile-management`,
      requestData,
      headers(cirToken, isFormData)
    );

    if (!data.success) {
      toast.error(data.message);
      return false;
    }
    toast.success(data.message || 'Profile updated');
    return true;
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

export { getOwnProfile, updateOwnProfile };
