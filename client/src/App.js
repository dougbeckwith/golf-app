import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AddClub from './pages/AddClub'
import Clubs from './pages/Clubs/Clubs'
import Club from './pages/Club/Club'
import EditClub from './pages/EditClub'
import Landing from './pages/Landing'
import Layout from './components/Layout'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import Logout from './pages/Logout'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* private routes */}
          <Route path='/clubs' element={<Layout />}>
            <Route index element={<Clubs />} />
            <Route path=':id' element={<Club />} />
            <Route path='add' element={<AddClub />} />
            <Route path=':id/edit' element={<EditClub />} />
          </Route>

        {/* public routes */}
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/logout' element={<Logout />} />

        {/* catch any non matching routes */}
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
