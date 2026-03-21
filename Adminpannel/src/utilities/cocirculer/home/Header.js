import axios from 'axios';
import {toast} from 'react-toastify'
const AddHeader = async (backendURL, formdata, cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.post(backendURL+'/api/cocirculer/header/add', formdata, config)
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
const getAllHeader = async (backendURL, setHeader, cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.get(backendURL+'/api/cocirculer/header/all', config)
       if (data.success) {
            setHeader(data.data)
            toast.success(data.message);
       }
       else{
        toast.error(data.message);
       }
    } catch (error) {
        console.log(error)

    }
}
const hideHeaderHeader = async (backendURL,id,cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.patch(backendURL+`/api/cocirculer/header/hide/${id}`,{}, config)
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
const getHeaderById = async (backendURL,setHeaderById,id,cirToken) => {
    try {
        
        const {data} = await axios.get(backendURL+`/api/cocirculer/header/view/${id}`,{headers:{authCociculertoken:cirToken}} )
       if (data.success) {
            setHeaderById(data.data)
            toast.success(data.message);
       }
       else{
        toast.error(data.message);
       }
    } catch (error) {
        console.log(error)

    }
}
const updateHeaderById = async (backendURL,formdata,id,cirToken) => {
    try {
        
        const {data} = await axios.patch(backendURL+`/api/cocirculer/header/update/${id}`,formdata,{headers:{authCociculertoken:cirToken}} )
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
export  {AddHeader,getAllHeader,hideHeaderHeader,updateHeaderById,getHeaderById}