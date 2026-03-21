
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import AppContextProvider from './context/app.jsx';
import CocirculerContextProvider from './context/cocirculer.jsx';
import CoordinatorContextProvider from './context/coordinater.jsx';
import TeacherContextProvider from './context/teacher.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <AppContextProvider >
        <CocirculerContextProvider>
          <CoordinatorContextProvider>
            <TeacherContextProvider>
              <App />
            </TeacherContextProvider>
          </CoordinatorContextProvider>
        </CocirculerContextProvider>
     </AppContextProvider>
    
  </BrowserRouter>,
)
