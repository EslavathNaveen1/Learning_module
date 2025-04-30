 import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../src/index.css';
import Login from './Components/LoginDetails/Login';
import ChangePassword from './Components/LoginDetails/ChangePassword';
import Register from './Components/LoginDetails/Register';
import MainHome from './Components/Home/MainHome';
import Courses from './Components/PLaylist/Courses';
import About from './Components/Home/About';
import AdminDashBoard from './Components/Admin/AdminDashBoard';
import UserDashBoard from './Components/User/UserDashBoard';
import AdminUsers from './Components/Admin/AdminUsers';
import Contact from './Components/Home/Contact';
import Home from './Components/Home/Home';
import MainHeader from './Components/Headers/MainHeader';
import { useContext } from 'react';
import AuthContext from './Components/AuthContext';
import DashBoardHeader from './Components/Headers/DashBoardHeader';
import ProtectedRoute from './Components/ProtectedRoute';
import EnrolledCourses from './Components/PLaylist/EnrolledCourses';
import Profile from './Components/LoginDetails/Profile';
import AdminVideos from './Components/Admin/AdminVideos';
import Playlists from './Components/PLaylist/Playlists';
import ManagerDashBoard from './Components/Manager/ManagerDashBoard';
import AdminDocs from './Components/Admin/AdminDocs';
 
function App() {
  const { isLogged } = useContext(AuthContext);
 
  return (
    <>
      {isLogged ?<DashBoardHeader /> : <MainHeader />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Courses' element={<Courses />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Register' element={<Register />} />
             
        <Route path="/adminDocs/:playlistId" element={<AdminDocs />} />
        <Route path="/AdminVideos/:playlistId" element={<AdminVideos />} />
        <Route path='/managerDashBoard' element={<ManagerDashBoard/>} />
 
        <Route element={<ProtectedRoute roles={['Admin']} />}>
          <Route path='/Admin/Home' element={<AdminDashBoard />} />
          <Route path='/Admin/Actions' element={<AdminDashBoard />} />
          <Route path='/AdminUsers' element={<AdminUsers />} />
          <Route path='/About' element={<About />} />
          <Route path='/Contact' element={<Contact />} />
        </Route>
 
        <Route element={<ProtectedRoute roles={['Manager']} />}>
          <Route path='/Manager/Home' element={<ManagerDashBoard />} />
          <Route path='/Manager/Actions' element={<ManagerDashBoard />} />
          <Route path='/Manager/About' element={<About />} />
          <Route path='/Manager/Contact' element={<Contact />} />
 
        </Route>
 
        <Route element={<ProtectedRoute roles={['User']} />}>
          <Route path='/UserDashBoard' element={<UserDashBoard />} />
          <Route path='/User/enrolled-courses' element={<EnrolledCourses />}></Route>
         
        </Route>
 
        <Route element={<ProtectedRoute roles={['User','Admin','Manager']}/>}>
        <Route path='/User/courses' element={<UserDashBoard />} />
        <Route path='/User/about' element={<About />} />
        <Route path='/User/contact' element={<Contact />} />
        <Route path='/User/profile' element={<Profile/>} />
        </Route>
       
       
          <Route path='/ChangePassword' element={<ChangePassword />} />
         
       
      </Routes>
    </>
  );
}
export default App;
 
 
 
 