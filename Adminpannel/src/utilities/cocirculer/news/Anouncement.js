
import axios from 'axios'
import {toast} from 'react-toastify'
const AddAnouncement = async (backendURL, formdata, cirToken) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.post(backendURL+ '/api/cocirculer/announcement/add',formdata , config)
      if (data.success){
          toast.success(data.message);
      }
      else {
         toast.error(data.message)
      }
  } catch (error) {
    toast.error(error.message);
  }
}
const AllNews = async (backendURL,setNews,cirToken) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.get(backendURL+ '/api/cocirculer/announcement/',config)
      if (data.success){
          setNews(data.data)
          toast.success(data.message);
      }
      else {
         toast.error(data.message)
      }
  } catch (error) {
    toast.error(error.message);
  }
}
const updateNewsById = async (backendURL,formdata,id,cirToken) => {
  try {
       const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
       const config = {
           withCredentials: true,
           headers: hasJwt ? { authCociculertoken: cirToken } : {}
       };
      const {data} = await axios.patch(backendURL+ `/api/cocirculer/announcement/update/${id}`,formdata , config)
      if (data.success){
          toast.success(data.message);
      }
      else {
         toast.error(data.message)
      }
  } catch (error) {
    toast.error(error.message);
  }
}
const getNewsById = async (backendURL,setNewsById,id,cirToken ) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.get(backendURL+ `/api/cocirculer/announcement/view/${id}`,config)
      if (data.success){
          setNewsById(data.data)
          toast.success(data.message);
      }
      else {
         toast.error(data.message)
      }
  } catch (error) {
    toast.error(error.message);
  }
}
const HideNewsbyId = async (backendURL,id,cirToken) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
    const {data} = await axios.patch(backendURL+ `/api/cocirculer/announcement/hide/${id}`, {}, config)
      if (data.success){
          toast.success(data.message);
      }
      else {
         toast.error(data.message)
      }
  } catch (error) {
    toast.error(error.message);
  }
}

export { AddAnouncement,AllNews,updateNewsById,getNewsById,HideNewsbyId}