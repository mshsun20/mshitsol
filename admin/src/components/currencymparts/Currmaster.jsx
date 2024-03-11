import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/Currencym.css'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'

const Currmaster = () => {
  const [dta, setDta] = useState()
  const [cid, setCid] = useState()

  const getDta = async () => {
    try {
      const res = await axios.get(`${server}/currms/fetch`)
      const data = await res.data
      // console.log(data.data)

      if (data.statuscode === 220) {
        setDta(data.data.sort((a, b) => {
          let x = a.curcode, y = b.curcode
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
      const res = await axios.delete(`${server}/currm/remove/`+cid)
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
              <span>Confirm to remove Currency ?</span>
              <div className="btngrp">
                <button id='okbtn' onClick={rmvOk}>Ok</button>
                <button id='cnclbtn' onClick={rmvcls}>Cancel</button>
              </div>
            </div>
            
            <div className="bckdrp"></div>

            <div id="cursec">
              <div className="hdr">Currency Master</div>
              <div className="optgrp">
                <div className="fltrgrp">Search Filters</div>
                <div className="actgrp">
                  <span>Actions</span>
                  <div className="opt">
                    <div className="lnk"><NavLink to='/admin/currencymaster/addcurrency'>Add Currency</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/currencymaster/upldcurrency'>Import Currencies</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/currencymaster/exprtcurrency'>Export Currencies</NavLink></div>
                  </div>
                </div>
              </div>
              <div className="dtatbl">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Info</th>
                      <th>Symbol</th>
                      <th style={{backgroundColor:'#714979',color:'#d68dd0'}}>Country</th>
                      <th>ISO Code</th>
                      <th>Alternate Key</th>
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
                          <td className='nowrp'><NavLink to={`/admin/currencymaster/currencydtl/${elm._id}`}>{elm.curcode}</NavLink></td>
                          <td className='nowrp'>{elm.curnm}</td>
                          <td className='nowrp'>{elm.curinfo}</td>
                          <td>{elm.cursymbl}</td>
                          <td className='nowrp' style={{backgroundColor:'#4f3255'}}>{elm.cntry.cntrynm}</td>
                          <td>{elm.curiso}</td>
                          <td>{elm.curaltky}</td>
                          <td>{new Date(elm.createdAt).toLocaleString()}</td>
                          <td>{new Date(elm.updatedAt).toLocaleString()}</td>
                          <td className='edtbtn'><NavLink className='btn' to={`/admin/currencymaster/editcurrency/${elm._id}`}>__</NavLink></td>
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

export default Currmaster