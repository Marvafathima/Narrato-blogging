import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarWithSearch } from './components/Navbar';
import Layout from './components/Layout';
function App() {

  return (
    <>
       <BrowserRouter>
       <Routes>
       <Route path="nav/" element={<NavbarWithSearch/>}></Route>
       <Route path="" element={<Layout/>}></Route>
       
        </Routes></BrowserRouter>  
    </>
  )
}

export default App
