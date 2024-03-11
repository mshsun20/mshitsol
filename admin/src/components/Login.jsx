import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import axios from 'axios'
import server from '../server'

const Login = () => {
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
    const {admunam, admpass} = vl

    try {
      const res = await axios.post(`${server}/admin/login`, {admunam, admpass})
      const dta = await res.data
      // console.log(dta)
      if (dta.statuscode === 220) {
        // console.log(dta.admin)
        localStorage.setItem('admin', dta.admin)
        window.alert(dta.success)
        navig('/admin/dashboard')
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
        <div className='lgpg'>
          <div className="login-box">
            <span className='hdr'>Admin Site Login</span>
            <form>
              <div className="user-box">
                {/* <label>Username</label> */}
                <input type="text" id='admunam' name="admunam" required={true} onChange={hndlinp} />
                <label htmlFor='admunam'>Username</label>
              </div>
              <div className="user-box">
                {/* <label>Password</label> */}
                <input type="password" id='admpass' name="admpass" required={true} onChange={hndlinp} />
                <label htmlFor='admpass'>Password</label>
              </div>
              <NavLink onClick={hndlclk}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Log In
              </NavLink>
            </form>
          </div>
        </div>
    </>
  )
}

export default Login