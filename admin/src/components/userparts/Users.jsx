import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/Users.css'
import Header from "../Header"
import Footer from "../Footer"
import axios from 'axios'
import server from '../../server'

const Users = () => {
  const [dta, setDta] = useState()
  const [uid, setUid] = useState()

  const getDta = async () => {
    try {
      const res = await axios.get(`${server}/usrs/fetch`)
      const data = await res.data
      console.log(data.data)

      if (data.statuscode === 220) {
        setDta(data.data)
      }
      else {
        setDta(null)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getDta()
  }, [])

  const rmvcnfrm = (id) => {
    setUid(id)
    document.querySelector('.cnf').style.height = '15rem'
    document.querySelector('.bckdrp').style.height = '100vh'
    document.querySelector('.cnf span').style.display = 'flex'
    document.querySelector('.cnf .btngrp').style.display = 'flex'
  }
  const rmvcls = () => {
    document.querySelector('.cnf').style.height = 0
    document.querySelector('.bckdrp').style.height = 0
    document.querySelector('.cnf span').style.display = 'none'
    document.querySelector('.cnf .btngrp').style.display = 'none'
  }
  const rmvOk = async () => {
    try {
      const res = await axios.delete(`${server}/usr/remove/`+uid)
      const data = await res.data
      // console.log(data)

      if (data.statuscode === 220) {
        console.warn(data.message)
        getDta()
        rmvcls()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
        <div className="wbpg">
          <Header />

          <div className="main">
            <div className='cnf'>
              <span>Confirm to remove User ?</span>
              <div className="btngrp">
                <button id='okbtn' onClick={rmvOk}>Ok</button>
                <button id='cnclbtn' onClick={rmvcls}>Cancel</button>
              </div>
            </div>
            
            <div className="bckdrp"></div>

            <div id="usersec">
              <div className="hdr">Manage Users</div>
              <div className="optgrp">
                <div className="fltrgrp">Search Filters</div>
                <div className="actgrp">
                  <span>Actions</span>
                  <div className="opt">
                    <div className="lnk"><NavLink to='/admin/users/adduser'>Add User</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/users/upldusers'>Import Users</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/users/exprtusers'>Export Users</NavLink></div>
                  </div>
                </div>
              </div>
              <div className="dtatbl">
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Phone</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Created On</th>
                      <th>Modified On</th>
                      <th>Address</th>
                      <th>Country</th>
                      <th>Pincode</th>
                      <th className='edthd'>Edit</th>
                      <th className='rmvhd'>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (dta) ? dta.map((elm, i) => (
                        <tr key={i}>
                          <td className='nowrp'><NavLink to={`/admin/users/usracc/${elm._id}`}>{elm.ufname}</NavLink></td>
                          <td className='nowrp'>{elm.uphn}</td>
                          <td className='nowrp'>{elm.uname}</td>
                          <td className='nowrp'>{elm.ueml}</td>
                          <td>{new Date(elm.createdAt).toLocaleString()}</td>
                          <td>{new Date(elm.updatedAt).toLocaleString()}</td>
                          <td>{elm.uaddr}</td>
                          <td>{(elm.cntry.cntrynm)}</td>
                          <td className='nowrp'>{elm.upin}</td>
                          <td className='edtbtn'><NavLink className='btn' to={`/admin/users/edituser/${elm._id}`}>__</NavLink></td>
                          <td className='rmvbtn'><button className='btn' onClick={(e) => rmvcnfrm(elm._id)}>X</button></td>
                        </tr>
                      )) : null
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Footer />
        </div>
    </>
  )
}

export default Users