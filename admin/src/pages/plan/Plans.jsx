import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/Plan.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import server from '../../server'

const Plans = () => {
  const [dtadtl, setDtadtl] = useState()
  const [uid, setUid] = useState()

  const getDta = async () => {
    try {
      const res = await axios.get(`${server}/plns/fetch`)
      const dta = await res.data
      console.log(dta)
      setDtadtl(dta.data)
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
      const res = await axios.delete(`${server}/pln/remove/`+uid)
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

            <div id="plnsec">
              <div className="hdr">All Plans</div>

              <div className="optgrp">
                <div className="fltrgrp">Search Filters</div>
                <div className="actgrp">
                  <span>Actions</span>
                  <div className="opt">
                    <div className="lnk"><NavLink to='/admin/plans/addplan'>Add Plan</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/plans/upldplans'>Import Plans</NavLink></div>
                    <div className="lnk"><NavLink to='/admin/plans/exprtplans'>Export Plans</NavLink></div>
                  </div>
                </div>
              </div>

              <div className="dtatbl">
                <table className='table table-dark table-striped table-hover'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Cost</th>
                      <th>Currency</th>
                      <th className='edthd'>Edit</th>
                      <th className='rmvhd'>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (dtadtl)&&dtadtl.map((elm, i) => (
                        <tr key={i}>
                          <td>{elm.plnnm}</td>
                          <td>{elm.plncost}</td>
                          <td>{(elm.plncurr) ? elm.plncurr.curcode : null}</td>
                          <td className='edtbtn'><NavLink className='btn' to={`/admin/users/edituser/${elm._id}`}>__</NavLink></td>
                          <td className='rmvbtn'><button className='btn' onClick={(e) => rmvcnfrm(elm._id)}>X</button></td>
                        </tr>
                      ))
                    }
                    {/* <tr>
                      <td>efe</td>
                      <td>fef</td>
                      <td>vdfvr</td>
                      <td className='edtbtn'><NavLink className='btn' to={`/admin/users/edituser/${elm._id}`}>__</NavLink></td>
                      <td className='rmvbtn'><button className='btn' onClick={(e) => rmvcnfrm(elm._id)}>X</button></td>
                    </tr> */}
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

export default Plans