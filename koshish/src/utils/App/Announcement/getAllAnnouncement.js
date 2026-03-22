import axios from 'axios'
import {toast} from 'react-toastify'

const buildQueryParams = (options = {}) => {
    const params = {
        page: 1,
        limit: 20,
        ...options
    };
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            delete params[key];
        }
    });
    return params;
};

const normalizeListPayload = (payload) => ({
    data: Array.isArray(payload?.data) ? payload.data : [],
    pagination: payload?.pagination || null
});

const getNewAnnouncement = async(backendURL,setAllAnnouncement,options = {}) => {
    try {
       const {data} = await axios.get(backendURL+'/api/app/announcement', {
        params: buildQueryParams({
            isAtive: true,
            ...options
        })
       }); 
       if(data.success){
           setAllAnnouncement(normalizeListPayload(data))
       }
       else  toast.error(data.message)
    } catch (error) {
       setAllAnnouncement('5xx')
       toast.error(error.message);
    }
}
const getpastAnnouncement = async(backendURL,setAllAnnouncement,options = {}) => {
    try {
       const {data} = await axios.get(backendURL+'/api/app/announcement', {
        params: buildQueryParams({
            isAtive: false,
            ...options
        })
       }); 
       if(data.success){
           setAllAnnouncement(normalizeListPayload(data))
       }
       else  toast.error(data.message)
    } catch (error) {
       setAllAnnouncement('5xx')
       toast.error(error.message);
    }
}
const getmyAnnouncement = async(backendURL,setmyAnnouncement,id) => {
    try {
       const {data} = await axios.post(backendURL+'/api/app/announcement/id',{id} ); 
       if(data.success){
           setmyAnnouncement(data.data)
       }
       else  toast.error(data.message)
    } catch (error) {
    //    console.log(error)
       toast.error(error.message);
    }
}

export  {
    getmyAnnouncement, 
    getNewAnnouncement,getpastAnnouncement}