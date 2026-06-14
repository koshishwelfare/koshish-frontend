import axios from 'axios'
import {toast} from 'react-toastify'

const buildQueryParams = (options = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20
  };
  
  const mergedParams = { ...defaultParams, ...options };
  
  // Remove undefined, null, and empty string values
  return Object.fromEntries(
    Object.entries(mergedParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );
};

const normalizeListPayload = (payload) => ({
  data: Array.isArray(payload?.data) ? payload.data : [],
  pagination: payload?.pagination || null
});

const getAllMemories = async (backendURL, setMemories, options = {}) => {
   try {
       const params = buildQueryParams({
         isNews: false,
         ...options
       });

       const query = new URLSearchParams(params).toString();
       const {data} = await axios.get(`${backendURL}/api/app/memories${query ? '?' + query : ''}`)
       if(data.success) {
        setMemories(normalizeListPayload(data));
       }
       else toast.error(data.message);
   } catch (error) {
     toast.error(error.message);
   }
}

const getAllNews = async (backendURL, setNewsPaper, options = {}) => {
  try {
      const params = buildQueryParams({
        isNews: true,
        ...options
      });

      const query = new URLSearchParams(params).toString();
      const {data} = await axios.get(`${backendURL}/api/app/newspaper${query ? '?' + query : ''}`)
      if(data.success) {
        setNewsPaper(normalizeListPayload(data));
      }
      else toast.error(data.message);
  } catch (error) {
    toast.error(error.message);
  }
}

const getGalleryById = async (backendURL, setGalleryById, id) => {
    try {
        const {data} = await axios.get(backendURL+ `/api/app/gallery/${id}`)
        if(data.success) {
            setGalleryById(data.data);
        }
        else toast.error(data.message);
    } catch (error) {
      setGalleryById('5xx');
      toast.error(error.message);
    }
  }
  
export {getAllMemories,getAllNews,getGalleryById}