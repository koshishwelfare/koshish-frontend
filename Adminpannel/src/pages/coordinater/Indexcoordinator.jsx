import { Navigate, Routes, Route } from "react-router-dom";
import ChangeCoordinator from "./changeCo-ordinator";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SidebarCoordinator from "../../components/coordinater/SidebarCoordinator";
import DashboardCoordinator from "./DashboardCoordinator";
import UserDirectoryCoordinator from "./UserDirectoryCoordinator";
import ProfileCoordinator from "./ProfileCoordinator";
import SessionListingCoordinator from "./SessionListingCoordinator";
import SessionClassesCoordinator from "./SessionClassesCoordinator";
import EventNewsCoordinator from "./EventNewsCoordinator";
const Indexcoordinator = () => {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-content mt-5 flex flex-col gap-4 md:flex-row">
        <SidebarCoordinator />
        <section className="w-full">
          <div className="admin-surface min-h-[74vh] p-4 sm:p-6">
            <Routes>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<DashboardCoordinator/>} />
              <Route path='/change-cocirculer' element={<ChangeCoordinator/>} />
              <Route path='/user-directory' element={<UserDirectoryCoordinator/>} />
              <Route path='/sessions' element={<SessionListingCoordinator/>} />
              <Route path='/sessions/:sessionId/classes' element={<SessionClassesCoordinator/>} />
              <Route path='/event-news' element={<EventNewsCoordinator/>} />
              <Route path='/profile/:userType/:id' element={<ProfileCoordinator/>} />
            </Routes>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Indexcoordinator;
