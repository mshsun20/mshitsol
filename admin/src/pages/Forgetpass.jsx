import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from 'axios'
import server from '../server'

const Forgetpass = () => {
    const [vl, setVl] = useState()
    let name, value
    const navig = useNavigate()

    const hndlinp = (e) => {
        name = e.target.name
        value = e.target.value
        setVl({...vl, [name]:value})
    }

    const hndlclk = async (e) => {
        e.preventDefault()
        const {admunam, admeml} = vl

        try {
            const res = await axios.post(`${server}/admin/resetpass`, {admunam, admeml})
            const dta = await res.data
            // console.log(dta)

            if (dta.statuscode === 220) {
                window.alert(dta.message)
                navig('/admin/cnfirmcode')
            }
            else {
                window.alert(dta.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <>
        <div className='lgpg'>
            <div className="login-box">
                <span className='hdr'>Forget Password</span>
                <form>
                    <div className="user-box">
                        <input type="text" id='admunam' name="admunam" required={true} onChange={hndlinp} />
                        <label htmlFor='admunam'>Username</label>
                    </div>
                    <div className="user-box">
                        <input type="email" id='admeml' name="admeml" required={true} onChange={hndlinp} />
                        <label htmlFor='admeml'>Email</label>
                    </div>
                    <div className="user-box" style={{display:'flex',justifyContent:'space-between',flexDirection:'row',width:'100%'}}>
                        <div className="frgt" style={{backgroundColor:'darkgreen',padding:'0.5rem 1rem',color:'lime',fontSize:'1rem',border:'none',borderRadius:'0.2rem'}}>
                            <NavLink to='/admin/login'>Sign In Page</NavLink>
                        </div>
                    </div>
                    <NavLink className="btnlnk" onClick={hndlclk}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Send Code
                    </NavLink>
                </form>
            </div>
        </div>
    </>
  )
}

export default Forgetpass