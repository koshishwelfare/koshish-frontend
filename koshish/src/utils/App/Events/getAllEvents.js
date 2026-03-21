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

const getHomeEvent = async (backendURL,setHomeEvent,options = {}) => {
  try {
     const {data} = await axios.get(backendURL + '/api/app/events', {
      params: buildQueryParams({
        isTop: true,
        page: 1,
        limit: 4,
        sortBy: 'startdate',
        sortOrder: 'desc',
        ...options
      })
     })
     if (data.success && data.data.length !=0) {
        setHomeEvent(data.data)
      //   toast.success(data.message)
     }
     else if(data.data.length ==0){
      setHomeEvent('NODATA')
      toast.info(data.message)
     }
     else toast.error(data.message);
  } catch (error) {
   //   console.log(error);
     setHomeEvent('5xx')
    toast.error(error.message);
  }
}
const getNewEvent = async (backendURL,setHomeEvent,options = {}) => {
    try {
       const {data} = await axios.get(backendURL + '/api/app/events', {
        params: buildQueryParams({
          isActive: true,
          ...options
        })
       })
       if (data.success) {
         if(data.data.length==0) {
            setHomeEvent("NODATA")
           }
         else  setHomeEvent(data.data)
          toast.success(data.message)
       }
       else toast.error(data.message);
    } catch (error) {
      //  console.log(error);
       setHomeEvent('5xx')
      toast.error(error.message);
    }
  }
  const getPastEvent = async (backendURL,setHomeEvent,options = {}) => {
    try {
       const {data} = await axios.get(backendURL + '/api/app/events', {
        params: buildQueryParams({
          isActive: false,
          ...options
        })
       })
       if (data.success) {
           if(data.data.length==0) {
            setHomeEvent("NODATA")
           }
         else  setHomeEvent(data.data)
          toast.success(data.message)
       }
       else toast.error(data.message);
    } catch (error) {
      //  console.log(error);
       setHomeEvent('5xx')
      toast.error(error.message);
    }
  }
  const getEventByID = async (backendURL,setIdEvent,id) => {
   try {
      const {data} = await axios.post(backendURL + '/api/app/events/id',{id})
      if (data.success) {
         setIdEvent(data.data)
         toast.success(data.message)
      }
      else toast.error(data.message);
   } catch (error) {
      // console.log(error);
      setIdEvent('5xx')
     toast.error(error.message);
   }
 }
export { getEventByID,getHomeEvent,getNewEvent,getPastEvent}