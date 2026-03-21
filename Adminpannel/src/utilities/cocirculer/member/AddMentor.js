import axios from "axios"
import { toast } from "react-toastify"
const AddMentor = async (backendURL, payload, cirToken) => {
   try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.post(backendURL+ '/api/cocirculer/member/add', payload, config);
        if(data.success){
            toast.success(data.message);
            if (data.credentials?.username && data.credentials?.password) {
                toast.info(`Temp credentials -> Username: ${data.credentials.username} | Password: ${data.credentials.password}`);
            }
            return data;
        }
        else {
            toast.error(data.message);
            return null;
        }
        
    } catch (error) {
        console.log(error)
        toast.error(error.message);
        return null;
    }
}

export default AddMentor