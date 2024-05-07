import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import server from '../../server'

const Addpln = () => {
    const [cur, setCur] = useState()
    const [vl, setVl] = useState()
    let name, value
    const navig = useNavigate()

    const getcurr = async () => {
        try {
            const res = await axios.get(`${server}/currms/fetch`)
            const dta = await res.data
            // console.log(dta)
            setCur(dta.data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getcurr()
    }, [])

    const hndlinp = (e) => {
        name = e.target.name
        value = e.target.value
        setVl({...vl, [name]:value})
    }

    const hndlsub = async (e) => {
        e.preventDefault()
        const {plnnm, plninfo, plncost, plncurr, colcode} = vl
        const plnbg = '#'+colcode
        console.log(plnbg)
        

        try {
            const res = await axios.post(`${server}/pln/create`, {plnnm, plninfo, plncost, plncurr, plnbg})
            const dta = await res.data
            // console.log(data)

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
                <div id="addpln">
                    <div className="hdr">Add Plan</div>
                    <div className="frmsec">
                        <form className='frm'>
                            <div className="form-group">
                                <label htmlFor="plnnm">Name</label>
                                <input type="text" className='form-control' name="plnnm" id="plnnm" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="plninfo">Info</label>
                                <textarea className='form-control' name="plninfo" id="plninfo" cols="30" rows="4" onChange={hndlinp}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="plncost">Cost</label>
                                <input type="text" className='form-control' name="plncost" id="plncost" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="plncurr">Currency</label>
                                <select className='form-control' name="plncurr" id="plncurr" onChange={hndlinp}>
                                    <option value="0">-----Select-----</option>
                                    {
                                        cur&&cur.map((elm, i) => (
                                            <option value={elm._id} key={i}>{elm.curcode}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="colcode">Bgcolor Code</label>
                                <input type="text" className='form-control' name="colcode" id="colcode" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <input type="submit" value='Add' onClick={hndlsub} />
                            </div>
                        </form>
                    </div>
                    <div className="lnk"><NavLink to='/admin/countrymaster/upldcountry'>Import Country data</NavLink></div>
                </div>
            </div>

            <Footer />
        </div>
    </>
  )
}

export default Addpln