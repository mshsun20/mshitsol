import React from 'react'
import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom'
import Redirection from './components/Redirection';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Users from './components/userparts/Users';
import Addusr from './components/userparts/Addusr';
import Upldusrs from './components/userparts/Upldusrs';
import Exprtusrs from './components/userparts/Exprtusrs';
import Usracc from './components/userparts/Usracc';
import Editusr from './components/userparts/Editusr';
import Services from './components/serviceparts/Services';
import Plans from './components/planparts/Plans';
import Features from './components/featureparts/Features';
import Faqs from './components/faqparts/Faqs';
import Feedbacks from './components/feedbackparts/Feedbacks';
import Cntrymaster from './components/coutrymparts/Cntrymaster';
import Addcntrym from './components/coutrymparts/Addcntrym';
import Upldcntrym from './components/coutrymparts/Upldcntrym';
import Exprtcntrym from './components/coutrymparts/Exprtcntrym';
import Cntrymdtl from './components/coutrymparts/Cntrymdtl';
import Editcntrym from './components/coutrymparts/Editcntrym';
import Currmaster from './components/currencymparts/Currmaster';
import Addcurrm from './components/currencymparts/Addcurrm';
import Upldcurrm from './components/currencymparts/Upldcurrm';
import Exprtcurrm from './components/currencymparts/Exprtcurrm';
import Currmdtl from './components/currencymparts/Currmdtl';
import Editcurrm from './components/currencymparts/Editcurrm';

const App = () => {
  return (
    <>
        <Routes>
          <Route path='/' element={<Redirection />} />
          <Route path='/admin' element={<Redirection />} />
          <Route path='/admin/login' element={<Login />} />
          <Route path='/admin/register' element={<Register />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<Users />} />
          <Route path='/admin/users/adduser' element={<Addusr />} />
          <Route path='/admin/users/upldusers' element={<Upldusrs />} />
          <Route path='/admin/users/exprtusers' element={<Exprtusrs />} />
          <Route path='/admin/users/usracc/:id' element={<Usracc />} />
          <Route path='/admin/users/edituser/:id' element={<Editusr />} />
          <Route path='/admin/services' element={<Services />} />
          <Route path='/admin/plans' element={<Plans />} />
          <Route path='/admin/features' element={<Features />} />
          <Route path='/admin/faqs' element={<Faqs />} />
          <Route path='/admin/feedbacks' element={<Feedbacks />} />
          <Route path='/admin/countrymaster' element={<Cntrymaster />} />
          <Route path='/admin/countrymaster/addcountry' element={<Addcntrym />} />
          <Route path='/admin/countrymaster/upldcountry' element={<Upldcntrym />} />
          <Route path='/admin/countrymaster/exprtcountry' element={<Exprtcntrym />} />
          <Route path='/admin/countrymaster/countrydtl/:id' element={<Cntrymdtl />} />
          <Route path='/admin/countrymaster/editcountry/:id' element={<Editcntrym />} />
          <Route path='/admin/currencymaster' element={<Currmaster />} />
          <Route path='/admin/currencymaster/addcurrency' element={<Addcurrm />} />
          <Route path='/admin/currencymaster/upldcurrency' element={<Upldcurrm />} />
          <Route path='/admin/currencymaster/exprtcurrency' element={<Exprtcurrm />} />
          <Route path='/admin/currencymaster/currencydtl/:id' element={<Currmdtl />} />
          <Route path='/admin/currencymaster/editcurrency/:id' element={<Editcurrm />} />
        </Routes>
    </>
  )
}

export default App