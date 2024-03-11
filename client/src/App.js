import React from 'react'
import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import Services from './components/serviceparts/Services'
import Portfolio from './components/portfolioparts/Portfolio'
import Testimonials from './components/testimonialparts/Testimonials'
import Contacts from './components/contactparts/Contacts'

const App = () => {
  return (
    <>
        <Header />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/services' element={<Services />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/testimonials' element={<Testimonials />} />
            <Route path='/contacts' element={<Contacts />} />
        </Routes>
        <Footer />
    </>
  )
}

export default App