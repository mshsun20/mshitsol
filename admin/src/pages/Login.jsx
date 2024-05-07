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
    const {admkey, admpass} = vl

    try {
      const res = await axios.post(`${server}/admin/login`, {admkey, admpass})
      const dta = await res.data
      // console.log(dta)
      if (dta.statuscode === 220) {
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
                <input type="text" id='admkey' name="admkey" required={true} onChange={hndlinp} />
                <label htmlFor='admkey'>Account Id</label>
              </div>
              <div className="user-box">
                <input type="password" id='admpass' name="admpass" required={true} onChange={hndlinp} />
                <label htmlFor='admpass'>Password</label>
              </div>
              <div className="user-box" style={{display:'flex',justifyContent:'space-between',flexDirection:'row',width:'100%'}}>
                <div className="rembr" style={{display:'flex',justifyContent:'space-between',flexDirection:'row',width:'30%'}}>
                  <input type="checkbox" name="rempss" id="rempss" style={{float:'left',display:'inline-block',width:'20%'}} />
                  <span style={{display:'flex',justifyContent:'center',width:'80%',fontSize:'0.9rem'}}>Remember Me</span>
                </div>
                <div className="frgt" style={{color:'crimson',fontSize:'1rem'}}>
                  <NavLink to='/admin/forgetpass'>Forget Password</NavLink>
                </div>
              </div>
              <NavLink className="btnlnk" onClick={hndlclk}>
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