import { useState } from 'react'
import {  Routes, Route } from 'react-router-dom'
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
import NewMenu from './components/Canvas/NewMenu.jsx'
import Leads from './pages/sidebar/Leads.jsx'
import Customer from './pages/sidebar/Customer.jsx'
import Reports from './pages/sidebar/Reports.jsx'
import Calendar from './pages/sidebar/Calendar.jsx'
import Events from './pages/sidebar/Events.jsx'
import Meetings from './pages/sidebar/Meetings.jsx'
import Schedule from './pages/sidebar/Schedule.jsx'
import Tasks from './pages/sidebar/Task.jsx'
import Contacts from './pages/sidebar/Contacts.jsx'
import Emails from './pages/sidebar/Emails.jsx'
import Settings from './pages/sidebar/Settings.jsx'
import DynamicPage from './pages/DynamicPage/DynamicPage.jsx'
import Layout from './layout/Layout.jsx'


function App() {

  return (
    <>

      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/account/canvas' element={<FormCanvas/>}></Route>
          <Route path='/account/test' element={<TestCanvas/>}></Route>
          <Route path='/account/create/menu' element={<CanvasProgress/>}></Route>
          <Route path='/account/notifications' element={<Notifications/>}></Route>
          
          <Route path='/dashboard/create/form' element={<NewMenu/>}></Route>
          <Route path='/dashboard/leads' element={<Leads/>}></Route>
          <Route path='/dashboard/customer' element={<Customer/>}></Route>
          <Route path='/dashboard/reports' element={<Reports/>}></Route>
          <Route path='/dashboard/calendar' element={<Calendar/>}></Route>
          <Route path='/dashboard/events' element={<Events/>}></Route>
          <Route path='/dashboard/meetings' element={<Meetings/>}></Route>
          <Route path='/dashboard/schedule' element={<Schedule/>}></Route>
          <Route path='/dashboard/tasks' element={<Tasks/>}></Route>
          <Route path='/dashboard/contacts' element={<Contacts/>}></Route>
          <Route path='/dashboard/emails' element={<Emails/>}></Route>
          <Route path='/dashboard/settings' element={<Settings/>}></Route>
          <Route path={`*`} element={<DynamicPage/>}></Route>
        </Route>

        <Route path='/account/advance-setting' element={<ProtectedRoute><AdvanceSetting/></ProtectedRoute>}> 
        </Route>


       
       
       
        <Route path='/admin/dashboard' element={<D/>}></Route>


        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
       
    </>
  )
}

export default App
