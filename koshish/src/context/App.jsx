
import { createContext, useCallback, useEffect, useState } from "react";
import getHeader from "../utils/App/home/getHeader";
import {getTopmentor,getCoOrdinator,getAllMentor,getAllAlumni,getAllFaculty,SearchMembers} from "../utils/App/mentor/getAllMentor";
import {getEventByID, getHomeEvent,getNewEvent,getPastEvent}  from '../utils/App/Events/getAllEvents'
import getTestimorals from "../utils/App/home/getTestimorals";
import contactus from "../utils/App/contactus";
import getmyMentor from "../utils/App/mentor/getMentor";
import {getAllMemories,getAllNews,getGalleryById} from '../utils/App/Gallery/gallary'
import { getmyAnnouncement, getNewAnnouncement,getpastAnnouncement} from "../utils/App/Announcement/getAllAnnouncement";
export const AppContext = createContext(1);
const  AppContextProvider = (props) => {
 const [docuTitle, setDocuTitle] =useState('Koshish-Welfare');
     
 useEffect(()=>{
  document.title = docuTitle
 },[docuTitle])
 const [headerData,setHeaderData ] = useState([]);
 const [TopMentor,setTopMentor ] = useState([]);
 const [coOrdi,setCoOrdi] = useState({});
 const [homeEvent, setHomeEvent] = useState([])
 const [newEvent, setNewEvent] = useState([])
 const [pastEvent, setPastEvent] = useState([])
 const [idEvent, setIdEvent] = useState({})
 const [testimorals, setTestimorals] = useState([]);
 const [allMentor, setAllMentor] = useState([]);
 const [allFuclty, setAllFuculty] = useState([]);
 const [searchMember, setSearchMember] = useState([]);
 const [allAlumni, setAllAlumni] = useState([]);
 const [myMentor, setmyMentor] = useState([]);
 const [newAnnouncement, setnewAnnouncement] = useState([]);
 const [pastAnnouncement, setPastAnnouncement] = useState([]);
 const [myAnnouncement, setmyAnnouncement] = useState({});
 const [memories, setMemories] = useState([]);
 const [newspaper, setNewsPaper] = useState([]);
 const [galleryById, setGalleryById] = useState({});
 const backendURL = import.meta.env.VITE_BACKEND_URL
const handleHeader = useCallback(()=>{
  getHeader(backendURL, setHeaderData)
}, [backendURL])
const handleTopMentor = useCallback(()=>{
  getTopmentor(backendURL,setTopMentor)
}, [backendURL])
const handleCoOrdinator = useCallback(()=>{
  getCoOrdinator(backendURL,setCoOrdi)
}, [backendURL])
const handleNewEvent = useCallback((options = {})=>{
  getNewEvent(backendURL,setNewEvent, options)
}, [backendURL])
const handlePastEvent = useCallback((options = {})=>{
 getPastEvent(backendURL,setPastEvent, options)
}, [backendURL])
const handleHomeEvent = useCallback(()=>{
  getHomeEvent(backendURL,setHomeEvent)
}, [backendURL])
const handleIDEvent = useCallback((id)=>{
  getEventByID(backendURL,setIdEvent,id)
}, [backendURL])
const handelTestimorals = useCallback(()=>{
  getTestimorals(backendURL,setTestimorals)
}, [backendURL])
const handelgetAllMentor = useCallback(()=>{
  getAllMentor(backendURL,setAllMentor)
}, [backendURL])
const handelgetAllAlumni = useCallback(()=>{
  getAllAlumni(backendURL,setAllAlumni)
}, [backendURL])
const handelgetAllFaculty = useCallback(()=>{
  getAllFaculty(backendURL,setAllFuculty)
}, [backendURL])
const handelSearchMember = useCallback((name)=>{
  SearchMembers(backendURL,setSearchMember,name)
}, [backendURL])
const handelgetmyMentor = useCallback((id)=>{
   console.log("_id: ",id);
  getmyMentor(backendURL,setmyMentor,id)
}, [backendURL])
const handleContactus = useCallback((data)=>{
  contactus(backendURL, data);
}, [backendURL])

const handleNewAnnouncement = useCallback((options = {})=>{
  getNewAnnouncement(backendURL,setnewAnnouncement, options);
}, [backendURL])
const handlePastAnnouncement = useCallback((options = {})=>{
  getpastAnnouncement(backendURL,setPastAnnouncement, options);
}, [backendURL])
const handlemyAnnouncement = useCallback((id)=>{
  getmyAnnouncement(backendURL,setmyAnnouncement,id);
}, [backendURL])
const handleMemories = useCallback((options = {})=>{
  getAllMemories(backendURL,setMemories, options);
}, [backendURL])
const handleNewsPaper = useCallback((options = {})=>{
  getAllNews(backendURL,setNewsPaper, options);
}, [backendURL])
const handleGallaryById = useCallback((id)=>{
  getGalleryById(backendURL,setGalleryById,id);
}, [backendURL])
const value = {
      docuTitle, setDocuTitle,
      headerData,setHeaderData ,handleHeader,
      TopMentor,setTopMentor,handleTopMentor,
      coOrdi,setCoOrdi,handleCoOrdinator,
      homeEvent, setHomeEvent,handleHomeEvent,
      newEvent, setNewEvent,handleNewEvent,
      pastEvent, setPastEvent,handlePastEvent,
      idEvent, setIdEvent,handleIDEvent,
      testimorals, setTestimorals,handelTestimorals,
      allMentor, setAllMentor,handelgetAllMentor,
      handleContactus,
      allFuclty, setAllFuculty,handelgetAllFaculty,
      allAlumni, setAllAlumni,  handelgetAllAlumni,
      searchMember, setSearchMember,handelSearchMember,
      myMentor, setmyMentor,handelgetmyMentor,
      newAnnouncement, setnewAnnouncement,handleNewAnnouncement,
      pastAnnouncement, setPastAnnouncement,handlePastAnnouncement,
      myAnnouncement, setmyAnnouncement,handlemyAnnouncement,
    // gallery
    memories, setMemories,handleMemories,
    newspaper, setNewsPaper,handleNewsPaper,
    galleryById, setGalleryById,handleGallaryById,


 }
return (
    <>
      <AppContext.Provider value={value}>
            {props.children}
      </AppContext.Provider>
    </>
  );
}
export default AppContextProvider