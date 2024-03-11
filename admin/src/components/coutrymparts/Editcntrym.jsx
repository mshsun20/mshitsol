import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../../styles/Countrym.css'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'

const Editcntrym = () => {
  const {id} = useParams()
  const [vl, setVl] = useState({cntrycode:'', cntrynm:'', cntryinfo:''})
  let name, value
  const navig = useNavigate()

  const getcntry = async () => {
    const res = await axios.get(`${server}/cntryms/retrieve/`+id)
    const dta = await res.data
    setVl(dta.data)
  }
  useEffect(() => {
    getcntry()
  }, [])

  const hndlinp = (e) => {
    name = e.target.name
    value = e.target.value
    setVl({...vl, [name]:value})
  }

  const hndlsub = async (e) => {
    e.preventDefault()
    const {cntrycode, cntrynm, cntryinfo} = vl

    try {
      const res = await axios.put(`${server}/cntrym/update/`+id, {cntrycode, cntrynm, cntryinfo})
      const dta = await res.data

      if (dta.statuscode === 220) {
        window.alert(dta.success)
        navig('/admin/countrymaster')
      }
      else {
        window.alert(dta.error)
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
            <div className="hdr">Edit Country details</div>
            <div className="dtl">
              <form>
                <div className="frmgrp">
                  <label htmlFor="cntrycode">Code</label>
                  <input type="text" id="cntrycode" name="cntrycode" value={(vl)?(vl.cntrycode):''} onChange={hndlinp} />
                </div>
                <div className="frmgrp">
                  <label htmlFor="cntrynm">Name</label>
                  <input type="text" id="cntrynm" name="cntrynm" value={(vl)?(vl.cntrynm):''} onChange={hndlinp} />
                </div>
                <div className="frmgrp">
                  <label htmlFor="cntryinfo">Info</label>
                  <input type="text" id="cntryinfo" name="cntryinfo" value={(vl)?(vl.cntryinfo):''} onChange={hndlinp} />
                </div>
                <div className="frmgrp">
                  <input type="submit" id="cntrydtl" value='Update' onClick={hndlsub} />
                </div>
              </form>
            </div>
          </div>

          <Footer />
        </div>
    </>
  )
}

export default Editcntrym