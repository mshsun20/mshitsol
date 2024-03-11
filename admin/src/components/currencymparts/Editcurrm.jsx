import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../../styles/Currencym.css'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'

const Editcurrm = () => {
    const {id} = useParams()
    const [cntr, setCntr] = useState()
    const [vl, setVl] = useState({curcode:'', curnm:'', curinfo:'', cursymbl:'', cntry:'', curiso:'', curaltky:''})
    let name, value
    const navig = useNavigate()

    const getCntrym = async () => {
        try {
            const res = await axios.get(`${server}/cntryms/fetch`)
            const dta = await res.data
            // console.log(data.data)

            if (dta.statuscode === 220) {
                setCntr(dta.data.sort((a, b) => {
                    let x = a.cntrynm, y = b.cntrynm
                    if (x < y) {return -1}
                    if (x > y) {return 1}
                    return 0
                }))
            }
            else {
                setCntr(null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getcurr = async () => {
        const res = await axios.get(`${server}/currms/retrieve/`+id)
        const dta = await res.data
        // console.log(dta.data)
        setVl(dta.data)
    }
    useEffect(() => {
        getCntrym()
        getcurr()
    }, [])

    const hndlinp = (e) => {
        name = e.target.name
        value = e.target.value
        setVl({...vl, [name]:value})
    }

    const hndlsub = async (e) => {
        e.preventDefault()
        const {curcode, curnm, curinfo, cursymbl, cntry, curiso, curaltky} = vl

        try {
            const res = await axios.put(`${server}/currm/update/`+id, {curcode, curnm, curinfo, cursymbl, cntry, curiso, curaltky})
            const dta = await res.data

            if (dta.statuscode === 220) {
                window.alert(dta.success)
                navig('/admin/currencymaster')
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
                <div className="hdr">Edit Currency details</div>
                <div className="dtl">
                    <form>
                        <div className="frmgrp">
                            <label htmlFor="curcode">Code</label>
                            <input type="text" id="curcode" name="curcode" value={vl.curcode} onChange={hndlinp} />
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="curnm">Name</label>
                            <input type="text" id="curnm" name="curnm" value={vl.curnm} onChange={hndlinp} />
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="curinfo">Info</label>
                            <input type="text" id="curinfo" name="curinfo" value={vl.curinfo} onChange={hndlinp} />
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="cursymbl">Symbol</label>
                            <input type="text" id="cursymbl" name="cursymbl" value={vl.cursymbl} onChange={hndlinp} />
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="cntry">Country</label>
                            <select name="cntry" id="cntry" value={vl.cntry._id} onChange={hndlinp}>
                                <option value="0">-----Select Country-----</option>
                                {
                                    (cntr) ? cntr.map((elm, i) => (
                                    <option value={elm._id} key={i}>{elm.cntrynm}</option>
                                    )) : null
                                }
                            </select>
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="curiso">ISO Code</label>
                            <input type="text" id="curiso" name="curiso" value={vl.curiso} onChange={hndlinp} />
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="curaltky">Alternate Key</label>
                            <input type="text" id="curaltky" name="curaltky" value={vl.curaltky} onChange={hndlinp} />
                        </div>
                        <div className="frmgrp">
                            <input type="submit" id="currdtl" value='Update' onClick={hndlsub} />
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    </>
  )
}

export default Editcurrm