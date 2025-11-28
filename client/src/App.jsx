import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './services/protectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdvanceSetting from './pages/AdvanceSetting.jsx'
import FormCanvas from './components/Canvas/FormCanvas.jsx'


function App() {

  return (
    <>
     <Router>

      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/home' element={<Dashboard/>}></Route>
        <Route path='/advance-setting' element={<AdvanceSetting/>}></Route>
        <Route path='/canvas' element={<FormCanvas/>}></Route>


        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
     </Router>
       
    </>
  )
}

export default App
