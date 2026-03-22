import React from 'react'
import { Routes, Route} from 'react-router-dom';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import Events from './events';
import HomeApp from './home';
import Announcements from './announcements';
import Contact from './contact';
import About from './about';
import Error404 from '../../component/Error404';
import Mymentors from '../../component/App/family/mymentors';
import CoordinatorProfile from '../../component/App/family/CoordinatorProfile';
import CoCircularProfile from '../../component/App/family/CoCircularProfile';
import CollaboratorProfile from '../../component/App/family/CollaboratorProfile';
import Myanouncement from '../../component/App/news/myanouncement';
import Myevent from '../../component/App/events/myevent';
import IndexFamiliy from '../../component/App/family/indexFamiliy';
import IndexGallery from '../../component/App/gallery/IndexGallery';
import GalleryById from '../../component/App/gallery/GalleryById';
import PrivacyAndpolicy from '../../component/privacyAndpolicy';
import Certifacation from '../../component/Teacher/certifacation';
import StudentAuth from '../../component/student/StudentAuth';
const IndexApp = () => {
  return (
    <div className='app-shell'>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomeApp/>} />
        <Route path='/events' element={<Events/>} />
        <Route path='/events/:id' element={<Myevent/>} />
        <Route path='/family' element={<IndexFamiliy/>} />
        <Route path='/family/:id' element={<Mymentors/>}/>
        <Route path='/co-curricular/:id' element={<CoCircularProfile/>} />
        <Route path='/collaborator/:id' element={<CollaboratorProfile/>} />
        <Route path='/coordinator-profile' element={<CoordinatorProfile/>} />
        <Route path='/news' element={<Announcements/>} />
        <Route path='/news/:id' element={<Myanouncement/>} />
        <Route path='/gallery' element={<IndexGallery/>} />
        <Route path='/gallery/:id' element={<GalleryById/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/student-auth' element={<StudentAuth/>} />
        <Route path='/certify/:type/:id' element={<Certifacation/>} />
        <Route path='/privacy-and-policy' element={<PrivacyAndpolicy/>} />
        <Route path='*' element={<Error404/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default IndexApp