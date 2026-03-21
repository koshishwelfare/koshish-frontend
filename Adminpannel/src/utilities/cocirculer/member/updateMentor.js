import axios from "axios"
import { toast } from "react-toastify"
const updateMentor = async (backendURL, formdata, id, cirToken) => {
   try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.patch(backendURL+ `/api/cocirculer/member/update/${id}`,formdata, config);
                 if(data.success){
                     toast.success(data.message);
                 }
                 else toast.error(data.message);
    } catch (error) {
        console.log(error)
        toast.error(error.message);
    }
}

export default updateMentor