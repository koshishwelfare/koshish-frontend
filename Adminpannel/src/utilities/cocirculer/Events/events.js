import axios from "axios"
import { toast } from "react-toastify"
const AllEvents =async (backendURL, setEvent, cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.get(backendURL+'/api/cocirculer/events/all', config)
       if (data.success) {
            setEvent(data.data)
            toast.success(data.message);
       }
       else{
        toast.error(data.message);
       }
    } catch (error) {
        console.log(error)

    }
}
const EventsById =async (backendURL,setEventById, id,cirToken) => {
    try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
        withCredentials: true,
        headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.get(backendURL+ `/api/cocirculer/event/view/${id}`, config);
      if(data.success){
          setEventById(data.data);
          toast.success(data.message);
      }
      else toast.error(data.message);
      
  } catch (error) {
      console.log(error)
      toast.error(error.message);
  }
  }
const updateEvent =async (backendURL,formdata, id,cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.patch(backendURL+ `/api/cocirculer/event/update/${id}`, formdata, config);
      if(data.success){
         
          toast.success(data.message);
      }
      else toast.error(data.message);
      
  } catch (error) {
      console.log(error)
      toast.error(error.message);
  }
  }
  const hideEvent =async (backendURL, id, cirToken) => {
    try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
        withCredentials: true,
        headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.put(backendURL+ `/api/cocirculer/event/hide/${id}`,{}, config);
      if(data.success){
          toast.success(data.message);
      }
      else toast.error(data.message);
      
  } catch (error) {
      console.log(error)
      toast.error(error.message);
  }
  }
  const topEvent =async (backendURL, id, cirToken) => {
    try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
        withCredentials: true,
        headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.put(backendURL+ `/api/cocirculer/event/top/${id}`,{}, config);
      if(data.success){
        
          toast.success(data.message);
      }
      else toast.error(data.message);
      
  } catch (error) {
      console.log(error)
      toast.error(error.message);
  }
  }
  const deleteEventById =async (backendURL, id, cirToken) => {
    try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
        withCredentials: true,
        headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.delete(backendURL+ `/api/cocirculer/event/delete/${id}`, config);
      if(data.success){
        
          toast.success(data.message);
      }
      else toast.error(data.message);
      
  } catch (error) {
      console.log(error)
      toast.error(error.message);
  }
  }
  const Addevent =async (backendURL, formdata, cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.post(backendURL+'/api/cocirculer/event/add', formdata, config)
       if (data.success) {
            toast.success(data.message);
       }
       else{
        toast.error(data.message);
       }
    } catch (error) {
        console.log(error)

    }
  }
export  {Addevent,updateEvent,hideEvent,AllEvents,topEvent,EventsById,deleteEventById}