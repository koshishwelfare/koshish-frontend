
import { createContext, useState } from "react";
import changecocirculer, {
  activateCocirculer,
  deactivateCocirculer,
  getCocirculerList,
  getCoordinatorMembersList,
  getCoordinatorStudentsList,
  getCoordinatorSessionsList,
  getCoordinatorSessionClassesList,
  getCoordinatorEventsList,
  getCoordinatorNewsList,
  getCoordinatorGalleryList,
  getCoordinatorCocircularProfile,
  getCoordinatorTeacherProfile,
  getCoordinatorStudentProfile
} from "../utilities/coordinator/changecocirculer";
export const CoordinatorContext = createContext(1);
const  CoordinatorContextProvider = (props) => {
      const [ordiToken , setOrdiToken] = useState(localStorage.getItem('ordiToken') ||false);
      const [cocirculerUsers, setCocirculerUsers] = useState([]);
      const [cocirculerPagination, setCocirculerPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
      });
      const [coordinatorMembersListing, setCoordinatorMembersListing] = useState({
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      });
      const [coordinatorStudentsListing, setCoordinatorStudentsListing] = useState({
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      });
      const [coordinatorSessionsListing, setCoordinatorSessionsListing] = useState({
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      });
      const [coordinatorSessionClassesListing, setCoordinatorSessionClassesListing] = useState({
        session: null,
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      });
      const [coordinatorEventsListing, setCoordinatorEventsListing] = useState({
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      });
      const [coordinatorNewsListing, setCoordinatorNewsListing] = useState({
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      });
      const [coordinatorGalleryListing, setCoordinatorGalleryListing] = useState({
        records: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }
      });
      const [selectedCoordinatorProfile, setSelectedCoordinatorProfile] = useState(null);
      const [cocirculerLoading, setCocirculerLoading] = useState(false);
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      const hadleChangeCocirculer= async(formData)=>{
        const ok = await changecocirculer(backendURL,formData,ordiToken);
        if (ok) {
          await handleGetCocirculerList();
        }
        return ok;
      }

      const handleGetCocirculerList = async (query = {}) => {
        setCocirculerLoading(true);
        const data = await getCocirculerList(backendURL, ordiToken, query);
        setCocirculerUsers(data.records || []);
        setCocirculerPagination(data.pagination || {
          page: 1,
          limit: Number(query.limit) || 10,
          total: 0,
          totalPages: 1
        });
        setCocirculerLoading(false);
        return data;
      };

      const handleActivateCocirculer = async (id, query = {}) => {
        const ok = await activateCocirculer(backendURL, id, ordiToken);
        if (ok) {
          await handleGetCocirculerList(query);
        }
        return ok;
      };

      const handleDeactivateCocirculer = async (id, query = {}) => {
        const ok = await deactivateCocirculer(backendURL, id, ordiToken);
        if (ok) {
          await handleGetCocirculerList(query);
        }
        return ok;
      };

      const handleGetCoordinatorMembersList = async (query = {}) => {
        const data = await getCoordinatorMembersList(backendURL, ordiToken, query);
        setCoordinatorMembersListing(data);
        return data;
      };

      const handleGetCoordinatorStudentsList = async (query = {}) => {
        const data = await getCoordinatorStudentsList(backendURL, ordiToken, query);
        setCoordinatorStudentsListing(data);
        return data;
      };

      const handleGetCoordinatorSessionsList = async (query = {}) => {
        const data = await getCoordinatorSessionsList(backendURL, ordiToken, query);
        setCoordinatorSessionsListing(data);
        return data;
      };

      const handleGetCoordinatorSessionClassesList = async (sessionId, query = {}) => {
        const data = await getCoordinatorSessionClassesList(backendURL, ordiToken, sessionId, query);
        setCoordinatorSessionClassesListing(data);
        return data;
      };

      const handleGetCoordinatorEventsList = async (query = {}) => {
        const data = await getCoordinatorEventsList(backendURL, ordiToken, query);
        setCoordinatorEventsListing(data);
        return data;
      };

      const handleGetCoordinatorNewsList = async (query = {}) => {
        const data = await getCoordinatorNewsList(backendURL, ordiToken, query);
        setCoordinatorNewsListing(data);
        return data;
      };

      const handleGetCoordinatorGalleryList = async (query = {}) => {
        const data = await getCoordinatorGalleryList(backendURL, ordiToken, query);
        setCoordinatorGalleryListing(data);
        return data;
      };

      const handleGetCoordinatorCocircularProfile = async (id) => {
        const data = await getCoordinatorCocircularProfile(backendURL, ordiToken, id);
        setSelectedCoordinatorProfile(data);
        return data;
      };

      const handleGetCoordinatorTeacherProfile = async (id) => {
        const data = await getCoordinatorTeacherProfile(backendURL, ordiToken, id);
        setSelectedCoordinatorProfile(data);
        return data;
      };

      const handleGetCoordinatorStudentProfile = async (id) => {
        const data = await getCoordinatorStudentProfile(backendURL, ordiToken, id);
        setSelectedCoordinatorProfile(data);
        return data;
      };

const value = {
         ordiToken ,
         setOrdiToken,
         hadleChangeCocirculer,
         cocirculerUsers,
         cocirculerPagination,
         coordinatorMembersListing,
         coordinatorStudentsListing,
         coordinatorSessionsListing,
         coordinatorSessionClassesListing,
         coordinatorEventsListing,
         coordinatorNewsListing,
         coordinatorGalleryListing,
         selectedCoordinatorProfile,
         cocirculerLoading,
         handleGetCocirculerList,
         handleActivateCocirculer,
         handleDeactivateCocirculer,
         handleGetCoordinatorMembersList,
         handleGetCoordinatorStudentsList,
         handleGetCoordinatorSessionsList,
         handleGetCoordinatorSessionClassesList,
         handleGetCoordinatorEventsList,
         handleGetCoordinatorNewsList,
         handleGetCoordinatorGalleryList,
         handleGetCoordinatorCocircularProfile,
         handleGetCoordinatorTeacherProfile,
         handleGetCoordinatorStudentProfile
 }
return (
    <>
      <CoordinatorContext.Provider value={value}>
            {props.children}
      </CoordinatorContext.Provider>
    </>
  );
}
export default CoordinatorContextProvider