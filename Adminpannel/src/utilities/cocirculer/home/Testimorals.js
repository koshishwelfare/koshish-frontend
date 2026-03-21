import axios from "axios"
import { toast } from "react-toastify"
const AddTestimorals =async (backendURL, formdata, cirToken) => {
  try {
    const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
    const config = {
        withCredentials: true,
        headers: hasJwt ? { authcociculertoken: cirToken } : {}
    };
    const {data}= await axios.post(backendURL+'/api/cocirculer/testimorals/add',formdata, config)
    if(data.success){
        toast.success(data.message);
    }
    else {
        toast.error(data.message)
    }

} catch (error) {
     console.log(error)
     toast.error(error.message)
  }
}
const getAllTestimoral = async (backendURL, setTestimoral, cirToken) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.get(backendURL+'/api/cocirculer/testimorals', config)
     if (data.success) {
          setTestimoral(data.data)
          toast.success(data.message);
     }
     else{
      toast.error(data.message);
     }
  } catch (error) {
      console.log(error)

  }
}
const updateTestimonial = async (backendURL,formdata, id,cirToken ) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.patch(backendURL+`/api/cocirculer/testimorals/update/${id}`,formdata, config)
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

const getTestimonialById = async (backendURL,setTestimoralById,id,cirToken) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.get(backendURL+`/api/cocirculer/testimorals/view/${id}`, config)
     if (data.success) {
          setTestimoralById(data.data)
          toast.success(data.message);
     }
     else{
      toast.error(data.message);
     }
  } catch (error) {
      console.log(error)

  }
}

const hideTestimoralById = async (backendURL, id, cirToken) => {
  try {
      const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
      const config = {
          withCredentials: true,
          headers: hasJwt ? { authCociculertoken: cirToken } : {}
      };
      const {data} = await axios.patch(backendURL+`/api/cocirculer/testimorals/change/${id}`,{}, config)
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

export  {AddTestimorals,getAllTestimoral,updateTestimonial,getTestimonialById,hideTestimoralById}