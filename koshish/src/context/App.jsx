
import { createContext, useCallback, useEffect, useState } from "react";
import getHeader from "../utils/App/home/getHeader";
import {getTopmentor,getCoOrdinator,getAllMentor,getAllAlumni,getAllFaculty,SearchMembers} from "../utils/App/mentor/getAllMentor";
import {getCoCircularMembers} from "../utils/App/mentor/getCoCircular";
import { getCollaboratorOrganizations } from "../utils/App/mentor/getCollaborators";
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
 const [topMentor, setTopMentor] = useState([]);
 const [coordinator, setCoordinator] = useState({});
 const [homeEvent, setHomeEvent] = useState([])
 const [newEvent, setNewEvent] = useState([])
 const [pastEvent, setPastEvent] = useState([])
 const [idEvent, setIdEvent] = useState({})
 const [testimorals, setTestimorals] = useState([]);
 const [allMentor, setAllMentor] = useState([]);
 const [allFaculty, setAllFaculty] = useState([]);
 const [coCircularMembers, setCoCircularMembers] = useState([]);
 const [collaboratorOrganizations, setCollaboratorOrganizations] = useState([]);
 const [searchMember, setSearchMember] = useState([]);
 const [allAlumni, setAllAlumni] = useState([]);
 const [myMentor, setMyMentor] = useState([]);
 const [newAnnouncement, setNewAnnouncement] = useState([]);
 const [pastAnnouncement, setPastAnnouncement] = useState([]);
 const [myAnnouncement, setMyAnnouncement] = useState({});
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
  getCoOrdinator(backendURL, setCoordinator)
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
const handleTestimonials = useCallback(()=>{
  getTestimorals(backendURL,setTestimorals)
}, [backendURL])
const handleGetAllMentor = useCallback((options = {})=>{
  getAllMentor(backendURL, setAllMentor, options)
}, [backendURL])
const handleGetAllAlumni = useCallback((options = {})=>{
  getAllAlumni(backendURL, setAllAlumni, options)
}, [backendURL])
const handleGetAllFaculty = useCallback((options = {})=>{
  getAllFaculty(backendURL, setAllFaculty, options)
}, [backendURL])
const handleGetCoCircularMembers = useCallback((options = {})=>{
  getCoCircularMembers(backendURL, setCoCircularMembers, options)
}, [backendURL])
const handleGetCollaboratorOrganizations = useCallback((options = {})=>{
  getCollaboratorOrganizations(backendURL, setCollaboratorOrganizations, options)
}, [backendURL])
const handleSearchMember = useCallback((name, options = {})=>{
  SearchMembers(backendURL, setSearchMember, name, options)
}, [backendURL])
const handleGetMyMentor = useCallback((id)=>{
  getmyMentor(backendURL, setMyMentor, id)
}, [backendURL])
const handleContactus = useCallback((data)=>{
  contactus(backendURL, data);
}, [backendURL])

const handleNewAnnouncement = useCallback((options = {})=>{
  getNewAnnouncement(backendURL, setNewAnnouncement, options);
}, [backendURL])
const handlePastAnnouncement = useCallback((options = {})=>{
  getpastAnnouncement(backendURL,setPastAnnouncement, options);
}, [backendURL])
const handlemyAnnouncement = useCallback((id)=>{
  getmyAnnouncement(backendURL, setMyAnnouncement, id);
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
  topMentor, setTopMentor, handleTopMentor,
  TopMentor: topMentor,
  coordinator, setCoordinator, handleCoOrdinator,
  coOrdi: coordinator,
  setCoOrdi: setCoordinator,
      homeEvent, setHomeEvent,handleHomeEvent,
      newEvent, setNewEvent,handleNewEvent,
      pastEvent, setPastEvent,handlePastEvent,
      idEvent, setIdEvent,handleIDEvent,
  testimorals, setTestimorals, handleTestimonials,
  handelTestimorals: handleTestimonials,
  allMentor, setAllMentor, handleGetAllMentor,
  handelgetAllMentor: handleGetAllMentor,
      handleContactus,
  allFaculty, setAllFaculty, handleGetAllFaculty,
  allFuclty: allFaculty,
  setAllFuculty: setAllFaculty,
  handelgetAllFaculty: handleGetAllFaculty,
  coCircularMembers, setCoCircularMembers, handleGetCoCircularMembers,
  coCircularData: coCircularMembers,
  handelGetCoCircularMembers: handleGetCoCircularMembers,
  collaboratorOrganizations, setCollaboratorOrganizations, handleGetCollaboratorOrganizations,
  allAlumni, setAllAlumni, handleGetAllAlumni,
  handelgetAllAlumni: handleGetAllAlumni,
  searchMember, setSearchMember, handleSearchMember,
  handelSearchMember: handleSearchMember,
  myMentor, setMyMentor, handleGetMyMentor,
  setmyMentor: setMyMentor,
  handelgetmyMentor: handleGetMyMentor,
  newAnnouncement, setNewAnnouncement, handleNewAnnouncement,
  setnewAnnouncement: setNewAnnouncement,
      pastAnnouncement, setPastAnnouncement,handlePastAnnouncement,
  myAnnouncement, setMyAnnouncement, handlemyAnnouncement,
  setmyAnnouncement: setMyAnnouncement,
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