
import axios from 'axios'
import {toast} from 'react-toastify'
const getmyMentor = async (backendURL,setmyMentor,id) => {
  try {
         const {data} = await axios.post(backendURL+ '/api/app/member/my', {id})
                if(data.success) {
                  setmyMentor(data.data);
                }
                else toast.error(data.message);
     } catch (error) {
       setmyMentor('5xx');
       toast.error(error.message);
     }
}

export default getmyMentor