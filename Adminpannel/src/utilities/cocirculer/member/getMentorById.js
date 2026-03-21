import axios from "axios"
import { toast } from "react-toastify"
const getMentorById = async(backendURL, setgetMentorById,id, cirToken) => {
  try {
  const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
  const config = {
    withCredentials: true,
    headers: hasJwt ? { authCociculertoken: cirToken } : {}
  };
  const {data} = await axios.get(backendURL+ `/api/cocirculer/member/u/${id}`, config);
         if(data.success){
            setgetMentorById(data.data);
             toast.success(data.message);
         }
         else toast.error(data.message);
  } catch (error) {
    console.log(error)
    toast.error(error.message);
  }
}
const TerminateMentorById = async(backendURL,id, cirToken) => {
  try {
  const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
  const config = {
    withCredentials: true,
    headers: hasJwt ? { authCociculertoken: cirToken } : {}
  };
  const {data} = await axios.patch(backendURL+ `/api/cocirculer/member/terminate/${id}`,{}, config);
         if(data.success){
           
             toast.success(data.message);
         }
         else toast.error(data.message);
  } catch (error) {
    console.log(error)
    toast.error(error.message);
  }
}
const MakeTopMentorById = async(backendURL,id, cirToken) => {
  try {
  const {data} = await axios.patch(backendURL+ `/api/cocirculer/member/top/${id}`,{}, {headers: {authCociculertoken: cirToken}});
         if(data.success){
           
             toast.success(data.message);
         }
         else toast.error(data.message);
  } catch (error) {
    console.log(error)
    toast.error(error.message);
  }
}

export { getMentorById,MakeTopMentorById,TerminateMentorById}