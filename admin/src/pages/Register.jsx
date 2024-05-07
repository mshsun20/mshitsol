import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/Register.css'
import axios from 'axios'
import server from '../server'

const Register = () => {
  const [dta, setDta] = useState()
  const [vl, setVl] = useState()
  let name, value
  const navig = useNavigate()

  const getCntrym = async () => {
    try {
      const res = await axios.get(`${server}/cntryms/fetch`)
      const data = await res.data
      // console.log(data.data)

      if (data.statuscode === 220) {
        setDta(data.data.sort((a, b) => {
          let x = a.cntrynm, y = b.cntrynm
          if (x < y) {return -1}
          if (x > y) {return 1}
          return 0
        }))
      }
      else {
        setDta(null)
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

  const hndlclk = async (e) => {
    e.preventDefault()
    const {admunam, admeml, admpass, admphn, admfnam, admaddr, cntry, admpin} = vl

    if (!admunam || !admeml || !admpass || !admphn || !admaddr) {
      window.alert(`All fields are required...!`)
    }
    else {
      try {
        const res = await axios.post(`${server}/admin/create`, {admunam, admeml, admpass, admphn, admfnam, admaddr, cntry, admpin})
        const data = await res.data
        // console.log(data)
        if (data.statuscode === 220) {
          window.alert(data.success)
          navig('/admin/login')
        }
        else {
          window.alert(data.error)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <>
        <div className='rgpg'>
          <div className="register-box">
            <span className='hdr'>Admin Site Registration</span>
            <form>
              <div className="user-box">
                <input type="text" id='admunam' name="admunam" required={true} onChange={hndlinp} />
                <label htmlFor='admunam'>Username</label>
              </div>
              <div className="user-box">
                <input type="text" id='admeml' name="admeml" required={true} onChange={hndlinp} />
                <label htmlFor='admeml'>Email</label>
              </div>
              <div className="user-box">
                <input type="password" id='admpass' name="admpass" required={true} onChange={hndlinp} />
                <label htmlFor='admpass'>Password</label>
              </div>
              <div className="user-box">
                <input type="text" id='admphn' name="admphn" required={true} onChange={hndlinp} />
                <label htmlFor='admphn'>Phone</label>
              </div>
              <div className="user-box">
                <input type="text" id='admfnam' name="admfnam" required={true} onChange={hndlinp} />
                <label htmlFor='admfnam'>Full Name</label>
              </div>
              <div className="user-box">
                <input type="text" id='admaddr' name="admaddr" required={true} onChange={hndlinp} />
                <label htmlFor='admaddr'>Address</label>
              </div>
              <div className="user-box">
                {/* <label htmlFor='cntry'>Country</label> */}
                <select name="cntry" id="cntry" onChange={hndlinp}>
                  <option value="0">-----Choose Country-----</option>
                  {
                    (dta) ? dta.map((elm, i) => (
                      <option value={elm._id} key={i}>{elm.cntrynm}</option>
                    )) : null
                  }
                </select>
              </div>
              <div className="user-box">
                <input type="text" id='admpin' name="admpin" required={true} onChange={hndlinp} />
                <label htmlFor='admpin'>Pin Code</label>
              </div>
              <NavLink onClick={hndlclk}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Submit
              </NavLink>
            </form>
          </div>
        </div>
    </>
  )
}

export default Register