import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarWithSearch } from './components/Navbar';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import { Dashboard } from './components/Dashboard';
import { HomeProtectedRoute } from './routes/HomeProtectedRoute';
function App() {

  return (
    <>
       <BrowserRouter>
       <Routes>
       <Route path="nav/" element={<NavbarWithSearch/>}></Route>
       <Route path="" element={<Layout/>}></Route>
       <Route path="/signup" element={<Signup/>}></Route>
       <Route path="/login" element={<Login/>}></Route>
       <Route path="/dashboard" element={<HomeProtectedRoute><Dashboard/></HomeProtectedRoute>}></Route>
        </Routes></BrowserRouter>  
    </>
  )
}

export default App
