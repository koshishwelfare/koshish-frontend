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

const getAllMentor = async (backendURL,setAllMentor,options = {}) => {
   try {
  const {data} = await axios.get(backendURL+ '/api/app/member/all', {
        params: buildQueryParams(options)
       })
       if(data.success) {
             setAllMentor(normalizeListPayload(data));
       }
       else toast.error(data.message);
   } catch (error) {
     setAllMentor('5xx');
     toast.error(error.message);
   }
}
const getAllAlumni = async (backendURL,setAllAlumni,options = {}) => {
  try {
      const {data} = await axios.get(backendURL+ '/api/app/member/all', {
        params: buildQueryParams({
          role: 'alumni',
          ...options
        })
      })
      if(data.success) {
        setAllAlumni(normalizeListPayload(data));
      }
      else toast.error(data.message);
  } catch (error) {
    setAllAlumni('5xx');
    toast.error(error.message);
  }
}
const getAllFaculty = async (backendURL,setAllAlumni,options = {}) => {
  try {
      const {data} = await axios.get(backendURL+ '/api/app/member/all', {
        params: buildQueryParams({
          role: 'visionary',
          ...options
        })
      })
      if(data.success) {
        setAllAlumni(normalizeListPayload(data));
      }
      else toast.error(data.message);
  } catch (error) {
    setAllAlumni('5xx');
    toast.error(error.message);
  }
}
const SearchMembers = async (backendURL,setSearchMember,name,options = {}) => {
  try {
      const {data} = await axios.get(backendURL+ '/api/app/member/all', {
        params: buildQueryParams({ q: name, ...options })
      })
      if(data.success) {
        setSearchMember(normalizeListPayload(data));
      }
      else toast.error(data.message);
  } catch (error) {
    setSearchMember('5xx');
    toast.error(error.message);
  }
}

const getTopmentor = async (backendURL,setTopMentor,options = {}) => {
  try {
      const {data} = await axios.get(backendURL+ '/api/app/member/all', {
        params: buildQueryParams({
          isTop: true,
          isActive: true,
          page: 1,
          limit: 4,
          sortBy: 'joinTime',
          sortOrder: 'desc',
          ...options
        })
      })
      if(data.success) {
        setTopMentor(data.data);
      }
      else toast.error(data.message);
  } catch (error) {
    setTopMentor('5xx');
    toast.error(error.message);
  }
}

const getCoOrdinator = async (backendURL,setCoOrdi,options = {}) => {
  try {
      const {data} = await axios.get(backendURL+ '/api/app/co-curricular/list', {
        params: buildQueryParams({
          isTop: true,
          isactive: true,
          page: 1,
          limit: 1,
          sortBy: 'date',
          sortOrder: 'desc',
          ...options
        })
      })
      if(data.success) {
        setCoOrdi(Array.isArray(data.data) && data.data.length ? data.data[0] : false);
      }
      else toast.error(data.message);
  } catch (error) {
    setCoOrdi('5xx');
    toast.error(error.message);
  }
}

export {getAllMentor,getAllAlumni,getAllFaculty,SearchMembers,getTopmentor,getCoOrdinator}