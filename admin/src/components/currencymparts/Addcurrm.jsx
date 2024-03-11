import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'

const Addcurrm = () => {
    const [cntry, setCntry] = useState()
    const [vl, setVl] = useState()
    let name, value
    const navig = useNavigate()

    const getCntrym = async () => {
        try {
            const res = await axios.get(`${server}/cntryms/fetch`)
            const dta = await res.data
            // console.log(data.data)

            if (dta.statuscode === 220) {
                setCntry(dta.data.sort((a, b) => {
                    let x = a.cntrynm, y = b.cntrynm
                    if (x < y) {return -1}
                    if (x > y) {return 1}
                    return 0
                }))
            }
            else {
                setCntry(null)
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getCntrym()
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
            const res = await axios.post(`${server}/currm/create`, {curcode, curnm, curinfo, cursymbl, cntry, curiso, curaltky})
            const data = await res.data
            console.log(data)

            if (data.statuscode === 220) {
                window.alert(data.success)
                navig('/admin/currencymaster')
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
                <div id="addcntry">
                    <div className="hdr">Add Currency</div>
                    <div className="frmsec">
                        <form className='frm'>
                            <div className="form-group">
                                <label htmlFor="curcode">Code</label>
                                <input type="text" name="curcode" id="curcode" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="curnm">Name</label>
                                <input type="text" name="curnm" id="curnm" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="curinfo">Info</label>
                                <input type="text" name="curinfo" id="curinfo" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="curiso">ISO Code</label>
                                <input type="text" name="curiso" id="curiso" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cursymbl">Symbol</label>
                                <input type="text" name="cursymbl" id="cursymbl" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="curaltky">Alternate Key</label>
                                <input type="text" name="curaltky" id="curaltky" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <select name="cntry" id="cntry" onChange={hndlinp}>
                                    <option value="0">-----Select Country-----</option>
                                    {
                                        (cntry) ? cntry.map((elm, i) => (
                                        <option value={elm._id} key={i}>{elm.cntrynm}</option>
                                        )) : null
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="submit" value='Add' onClick={hndlsub} />
                            </div>
                        </form>
                    </div>
                    <div className="lnk"><NavLink to='/admin/currencymaster/upldcurrency'>Import Currency data</NavLink></div>
                </div>
            </div>

            <Footer />
        </div>
    </>
  )
}

export default Addcurrm