import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarWithSearch } from './components/Navbar';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import { Dashboard } from './components/Dashboard';
import { HomeProtectedRoute } from './routes/HomeProtectedRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import UserProfile from './components/UserProfile';
import { ToastContainer, toast } from 'react-toastify';
import { UserPostGridPage } from './components/UserPostGridPage';
import BlogDetailView from './components/BlogDetailView';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <>

       <BrowserRouter>
       <Routes>
       <Route path="nav/" element={<NavbarWithSearch/>}></Route>
       <Route path="" element={<Layout/>}></Route>
       <Route path="/signup" element={<ProtectedRoute><Signup/></ProtectedRoute>}></Route>
       <Route path="/login" element={<ProtectedRoute><Login/></ProtectedRoute>}></Route>
       <Route path="/dashboard" element={<HomeProtectedRoute><UserProfile/></HomeProtectedRoute>}></Route>
        <Route path="/my-blog" element={<HomeProtectedRoute><UserPostGridPage/></HomeProtectedRoute>}></Route>
        <Route path="/post/:id" element={<HomeProtectedRoute><BlogDetailView/></HomeProtectedRoute>}></Route>
       
       
        </Routes></BrowserRouter>  
        <ToastContainer/>
    </>
  )
}

export default App
