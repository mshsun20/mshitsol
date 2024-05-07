import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
// import bootstrap from 'bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Home from '../pages/Home'
import Register from '../pages/user/Register'
import Login from '../pages/user/Login'
import Forgetpass from '../pages/user/Forgetpass'
import Cnfrmcode from '../pages/user/Cnfrmcode'
import Resetpass from '../pages/user/Resetpass'
import Services from '../pages/service/Services'
import Plans from '../pages/plan/Plans'
import Portfolio from '../pages/portfolio/Portfolio'
import Testimonials from '../pages/testimonial/Testimonials'
import Contacts from '../pages/contact/Contacts'


const Router = () => {
  return (
    <>
        <Header />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/user/forgetpass' element={<Forgetpass />} />
            <Route path='/user/cnfirmcode' element={<Cnfrmcode />} />
            <Route path='/user/resetpass/:id' element={<Resetpass />} />
            <Route path='/services' element={<Services />} />
            <Route path='/plans' element={<Plans />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/testimonials' element={<Testimonials />} />
            <Route path='/contacts' element={<Contacts />} />
        </Routes>
        <Footer />
    </>
  )
}

export default Router