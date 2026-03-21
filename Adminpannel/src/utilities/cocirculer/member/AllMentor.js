import axios from "axios"
import { toast } from "react-toastify"
const AllMentor =async (backendURL, setMentor, cirToken) => {
  try {
    const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
    const config = {
        withCredentials: true,
        headers: hasJwt ? { authCociculertoken: cirToken } : {}
    };
    const {data} = await axios.get(backendURL+ '/api/cocirculer/member/all', config);
    if(data.success){
        setMentor(data.data);
        toast.success(data.message);
    }
    else toast.error(data.message);
    
} catch (error) {
    console.log(error)
    toast.error(error.message);
}
}

export default AllMentor