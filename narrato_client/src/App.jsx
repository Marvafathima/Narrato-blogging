import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavbarWithSearch } from './components/Navbar';
function App() {

  return (
    <>
       <BrowserRouter>
       <Routes>
       <Route path="" element={<NavbarWithSearch/>}></Route>
        </Routes></BrowserRouter>  
    </>
  )
}

export default App
