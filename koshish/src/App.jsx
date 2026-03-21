import { useState, useContext ,useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import IndexApp from './pages/App'
import IndexStudent from './pages/student'
import IndexTeacher from './pages/teachers'
import { StudentContext } from './context/StudentContext'
import { TeacherContext } from './context/TeacherContext'
function App() {
    const {stuToken}= useContext(StudentContext);
    const {teaToken}= useContext(TeacherContext);
  const location = useLocation();

  const isStudentPath = location.pathname.startsWith('/student');
  const isTeacherPath = location.pathname.startsWith('/teacher');

 useEffect(() => {
  const onLoad = () => {
    console.log("Page fully loaded");
  };

  window.addEventListener("load", onLoad);

  return () => {
    window.removeEventListener("load", onLoad);
  };
}, []);

  return (
    <>
     { 
     <div>
     {
        isStudentPath
          ? (stuToken ? <IndexStudent/> : <IndexApp/>)
          : isTeacherPath
            ? (teaToken ? <IndexTeacher/> : <IndexApp/>)
            : <IndexApp/>
      }
       <ToastContainer />
       </div>
       }
       
    </>
  )
}

export default App
