import { useContext } from 'react'
import { ToastContainer } from 'react-toastify';
import Indexcocirculer from './pages/cocerculer/indexcocirculer'
import Indexcoordinator from './pages/coordinater/Indexcoordinator'
import IndexTeacher from './pages/teacher/IndexTeacher'
import { CocirculerContext } from './context/cocirculer'
import { CoordinatorContext } from './context/coordinater'
import { TeacherContext } from './context/teacher'
import Login from './components/login'

function App() {
     const {cirToken}= useContext(CocirculerContext);
     const {ordiToken}= useContext(CoordinatorContext);
     const {teaToken}= useContext(TeacherContext);

     const activeRole = ordiToken
       ? 'coordinator'
       : (cirToken ? 'cocirculer' : (teaToken ? 'teacher' : null));

  return (
    <div className="min-h-screen">
      { 
         !activeRole
         ? <Login/>
         : <div>
          {activeRole === 'cocirculer' && <Indexcocirculer/>}
          {activeRole === 'coordinator' && <Indexcoordinator/>}
          {activeRole === 'teacher' && <IndexTeacher/>}
         </div>
         }
         <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop />
    </div>
  )
}

export default App
