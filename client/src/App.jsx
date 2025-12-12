import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './services/protectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdvanceSetting from './pages/AdvanceSetting.jsx'
import FormCanvas from './components/Canvas/FormCanvas.jsx'
import TestCanvas from './components/Canvas/TestCanvas.jsx'
import CanvasProgress from './components/Canvas/CanvasProgress.jsx'
import D from './Admin/Super-Admin/pages/Dashboard.jsx'
import Notifications from './pages/Notification.jsx'


function App() {

  return (
    <>
     <Router>

      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        
          <Route path='/account/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
          <Route path='/account/advance-setting' element={<ProtectedRoute><AdvanceSetting/></ProtectedRoute>}></Route>
          <Route path='/account/canvas' element={<ProtectedRoute><FormCanvas/></ProtectedRoute>}></Route>
          <Route path='/account/test' element={<ProtectedRoute><TestCanvas/></ProtectedRoute>}></Route>
          <Route path='/account/create/menu' element={<ProtectedRoute><CanvasProgress/></ProtectedRoute>}></Route>
          <Route path='/account/notifications' element={<ProtectedRoute><Notifications/></ProtectedRoute>}></Route>
          
        <Route path='/admin/dashboard' element={<D/>}></Route>


        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
     </Router>
       
    </>
  )
}

export default App
