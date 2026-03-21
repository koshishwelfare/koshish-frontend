import axios from 'axios'
import {toast} from 'react-toastify'
const contact = async(backendURL,setContact,cirToken) => {
    try {
        const hasJwt = Boolean(cirToken && cirToken !== '__COOKIE_AUTH__');
        const config = {
            withCredentials: true,
            headers: hasJwt ? { authCociculertoken: cirToken } : {}
        };
        const {data} = await axios.get(backendURL+ '/api/cocirculer/contact/all', config);
        if (data.success){
            setContact(data.data);
            toast.success(data.message);
        }
        else toast.error(data.message);
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

export default contact