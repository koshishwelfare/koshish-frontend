import axios from 'axios';

const getCoCircularProfileById = async (backendURL, id) => {
  try {
    const { data } = await axios.get(backendURL + `/api/app/co-curricular/view/${id}`);
    return data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message
    };
  }
};

export default getCoCircularProfileById;
