import { useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from 'axios'
import server from '../server'

const Resetpass = () => {
    const {id} = useParams()
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
        const {admpass, admrepass} = vl

        try {
            if (admrepass === admpass) {
                const res = await axios.post(`${server}/admin/pass/update/`+id, {admpass})
                const dta = await res.data
                // console.log(dta)

                if (dta.statuscode === 220) {
                    window.alert(dta.success)
                    navig('/admin/login')
                }
                else {
                    window.alert(dta.error)
                    navig('/admin/forgetpass')
                }
            }
            else {
                window.alert('Passwords should be same ...!')
                document.querySelector('#admrepass').focus()
            }
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <>
        <div className='lgpg'>
            <div className="login-box">
                <span className='hdr'>Reset Password</span>
                <form>
                    <div className="user-box">
                        <input type="password" id='admpass' name="admpass" required={true} onChange={hndlinp} />
                        <label htmlFor='admpass'>New Password</label>
                    </div>
                    <div className="user-box">
                        <input type="password" id='admrepass' name="admrepass" required={true} onChange={hndlinp} />
                        <label htmlFor='admrepass'>Retype Password</label>
                    </div>
                    <div className="user-box" style={{display:'flex',justifyContent:'space-between',flexDirection:'row',width:'100%'}}>
                        <div className="frgt" style={{backgroundColor:'crimson',padding:'0.5rem 1rem',color:'cornsilk',fontSize:'1rem',border:'none',borderRadius:'0.2rem'}}>
                            <NavLink to='/admin/login'>Sign In Page</NavLink>
                        </div>
                    </div>
                    <NavLink className="btnlnk" onClick={hndlclk}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Change
                    </NavLink>
                </form>
            </div>
        </div>
    </>
  )
}

export default Resetpass