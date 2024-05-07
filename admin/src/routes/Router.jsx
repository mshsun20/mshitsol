import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Redirection from '../pages/Redirection';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Forgetpass from '../pages/Forgetpass';
import Cnfrmcode from '../pages/Cnfrmcode';
import Resetpass from '../pages/Resetpass';
import Users from '../pages/user/Users';
import Addusr from '../pages/user/Addusr';
import Upldusrs from '../pages/user/Upldusrs';
import Exprtusrs from '../pages/user/Exprtusrs';
import Usracc from '../pages/user/Usracc';
import Editusr from '../pages/user/Editusr';
import Services from '../pages/service/Services';
import Plans from '../pages/plan/Plans';
import Addpln from '../pages/plan/Addpln'
import Features from '../pages/feature/Features';
import Faqs from '../pages/faq/Faqs';
import Feedbacks from '../pages/feedback/Feedbacks';
import Cntrymaster from '../pages/coutrym/Cntrymaster';
import Addcntrym from '../pages/coutrym/Addcntrym';
import Upldcntrym from '../pages/coutrym/Upldcntrym';
import Exprtcntrym from '../pages/coutrym/Exprtcntrym';
import Cntrymdtl from '../pages/coutrym/Cntrymdtl';
import Editcntrym from '../pages/coutrym/Editcntrym';
import Currmaster from '../pages/currencym/Currmaster';
import Addcurrm from '../pages/currencym/Addcurrm';
import Upldcurrm from '../pages/currencym/Upldcurrm';
import Exprtcurrm from '../pages/currencym/Exprtcurrm';
import Currmdtl from '../pages/currencym/Currmdtl';
import Editcurrm from '../pages/currencym/Editcurrm';


const Router = () => {
  return (
    <>
        <Routes>
          <Route path='/' element={<Redirection />} />
          <Route path='/admin' element={<Redirection />} />
          <Route path='/admin/register' element={<Register />} />
          <Route path='/admin/login' element={<Login />} />
          <Route path='/admin/forgetpass' element={<Forgetpass />} />
          <Route path='/admin/cnfirmcode' element={<Cnfrmcode />} />
          <Route path='/admin/resetpass/:id' element={<Resetpass />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<Users />} />
          <Route path='/admin/users/adduser' element={<Addusr />} />
          <Route path='/admin/users/upldusers' element={<Upldusrs />} />
          <Route path='/admin/users/exprtusers' element={<Exprtusrs />} />
          <Route path='/admin/users/usracc/:id' element={<Usracc />} />
          <Route path='/admin/users/edituser/:id' element={<Editusr />} />
          <Route path='/admin/services' element={<Services />} />
          <Route path='/admin/plans' element={<Plans />} />
          <Route path='/admin/plans/addplan' element={<Addpln />} />
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

export default Router