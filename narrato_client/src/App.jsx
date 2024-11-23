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
        
        </Routes></BrowserRouter>  
    </>
  )
}

export default App