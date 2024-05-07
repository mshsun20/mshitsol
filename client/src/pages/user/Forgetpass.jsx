import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../../styles/Forgetpass.css'
import axios from 'axios'
import server from '../../server'

const Forgetpass = () => {
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
        const {uname, ueml} = vl

        try {
            const res = await axios.post(`${server}/user/resetpass`, {uname, ueml})
            const dta = await res.data
            // console.log(dta)
            if (dta.statuscode === 220) {
                window.alert(dta.message)
                navig('/user/cnfirmcode')
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
        <div className="forgetpass">
            <section className="py-3 py-md-5 py-xl-8">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-5">
                                <h2 className="display-5 fw-bold text-center">Forget Password</h2>
                                <p className="text-center m-0">Don't wanna reset Password? <NavLink to="/login">Sign In</NavLink></p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10 col-xl-8">
                            <div className="row gy-5 frgtform">
                                <div className="col-12 col-lg-5 formsec">
                                    <form>
                                        <div className="row gy-3 overflow-hidden">
                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control border-0 border-bottom rounded-0" name="uname" id="uname" placeholder="name@example.com" onChange={hndlinp} required />
                                                    <label htmlFor="uname" className="form-label">Username</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input type="email" className="form-control border-0 border-bottom rounded-0" name="ueml" id="ueml" placeholder="Password" onChange={hndlinp} required />
                                                    <label htmlFor="ueml" className="form-label">Email</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-grid">
                                                    <button className="btn btn-warning btn-lg fs-3" type="submit" onClick={hndlsub}>Send Code</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>
  )
}

export default Forgetpass