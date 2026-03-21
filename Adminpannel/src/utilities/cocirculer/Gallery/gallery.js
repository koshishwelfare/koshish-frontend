import axios from 'axios'
import {toast} from 'react-toastify'
const getAllGallery = async (backendURL,setGalleryAll,cirToken) => {
   try {
       const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
       const config = {
           withCredentials: true,
           headers: hasJwt ? { authCociculertoken: cirToken } : {}
       };
       const {data} = await axios.get(backendURL+ '/api/cocirculer/gallery', config)
       if(data.success) {
        setGalleryAll(data.data);
           toast.success(data.message);
       }
       else toast.error(data.message);
   } catch (error) {
     console.log(error);
     toast.error(error.message);
   }
}
const AddGallery = async (backendURL,formdata,cirToken) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.post(backendURL+ '/api/cocirculer/gallery/add',formdata, config)
      if(data.success) {
          toast.success(data.message);
      }
      else toast.error(data.message);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}
const deleteGallery = async (backendURL,id,cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.delete(backendURL+ `/api/cocirculer/gallery/delete/${id}`, config)
        if(data.success) {
            toast.success(data.message);
        }
        else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  const updateGallery = async (backendURL,formdata,id,cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.patch(backendURL+ `/api/cocirculer/gallery/update/${id}`,formdata, config)
        if(data.success) {
            toast.success(data.message);
        }
        else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

const getGalleryById = async (backendURL,setGalleryById,id,cirToken ) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.get(backendURL+ `/api/cocirculer/gallery/${id}`, config)
        if(data.success) {
            setGalleryById(data.data);
            toast.success(data.message);
        }
        else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  
export {getAllGallery,AddGallery,updateGallery,deleteGallery ,getGalleryById}