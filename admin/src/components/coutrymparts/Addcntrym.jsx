import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'

const Addcntrym = () => {
    const [vl, setVl] = useState()
    let name, value
    const navig = useNavigate()

    const hndlinp = (e) => {
        name = e.target.name
        value = e.target.value
        setVl({...vl, [name]:value})
    }

    const hndlsub = async (e) => {
        e.preventDefault()
        const {cntrycode, cntrynm, cntryinfo} = vl

        try {
            const res = await axios.post(`${server}/cntrym/create`, {cntrycode, cntrynm, cntryinfo})
            const data = await res.data
            // console.log(data)

            if (data.statuscode === 220) {
                window.alert(data.success)
                navig('/admin/countrymaster')
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
                    <div className="hdr">Add Country</div>
                    <div className="frmsec">
                        <form className='frm'>
                            <div className="form-group">
                                <label htmlFor="cntrycode">Code</label>
                                <input type="text" name="cntrycode" id="cntrycode" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cntrynm">Name</label>
                                <input type="text" name="cntrynm" id="cntrynm" onChange={hndlinp} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cntryinfo">Info</label>
                                <textarea name="cntryinfo" id="cntryinfo" cols="30" rows="4" onChange={hndlinp}></textarea>
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

export default Addcntrym