import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/Countrym.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import server from '../../server'

const Cntrymaster = () => {
  const [dta, setDta] = useState()
  const [cid, setCid] = useState()

  const getDta = async () => {
    try {
      const res = await axios.get(`${server}/cntryms/fetch`)
      const data = await res.data
      // console.log(data.data)

      if (data.statuscode === 220) {
        setDta(data.data.sort((a, b) => {
          let x = a.cntrynm, y = b.cntrynm
          if (x < y) {return -1}
          if (x > y) {return 1}
          return 0
        }))
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
    setCid(id)
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
      const res = await axios.delete(`${server}/cntrym/remove/`+cid)
      const data = await res.data
      // console.log(data)

      if (data.statuscode === 220) {
        console.warn(data.success)
        window.alert(data.success)
        getDta()
        rmvcls()
      }
      else {
        window.alert(data.error)
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
              <span>Confirm to remove Country ?</span>
              <div className="btngrp">
                <button id='okbtn' onClick={rmvOk}>Ok</button>
                <button id='cnclbtn' onClick={rmvcls}>Cancel</button>
              </div>
            </div>
            
            <div className="bckdrp"></div>

            <div id="cntrysec">
              <div className="hdr">Country Master</div>
              <div className="optgrp">
                <div className="fltrgrp">Search Filters</div>
                <div className="actgrp">
                  <span>Actions</span>
                  <div className="opt">
                    <div className="lnk"><NavLink to='/admin/countrymaster/addcountry'>Add Country</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/countrymaster/upldcountry'>Import Countries</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/countrymaster/exprtcountry'>Export Countries</NavLink></div>
                  </div>
                </div>
              </div>
              <div className="dtatbl">
                <table>
                  <thead>
                    <tr>
                      <th>Country Code</th>
                      <th>Country Name</th>
                      <th>Added On</th>
                      <th>Updated On</th>
                      <th className='edthd'>Edit</th>
                      <th className='rmvhd'>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (dta) ? dta.map((elm, i) => (
                        <tr key={i}>
                          <td className='nowrp'>{elm.cntrycode}</td>
                          <td className='nowrp'><NavLink to={`/admin/countrymaster/countrydtl/${elm._id}`}>{elm.cntrynm}</NavLink></td>
                          <td>{new Date(elm.createdAt).toLocaleString()}</td>
                          <td>{new Date(elm.updatedAt).toLocaleString()}</td>
                          <td className='edtbtn'><NavLink className='btn' to={`/admin/countrymaster/editcountry/${elm._id}`}>__</NavLink></td>
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

export default Cntrymaster