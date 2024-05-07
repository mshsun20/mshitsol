import { useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import '../../styles/Forgetpass.css'
import axios from 'axios'
import server from '../../server'

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

    const hndlsub = async (e) => {
        e.preventDefault()
        const {upass, urepass} = vl

        try {
            if (urepass === upass) {
                const res = await axios.post(`${server}/user/pass/update/`+id, {upass})
                const dta = await res.data
                // console.log(dta)
                if (dta.statuscode === 220) {
                    window.alert(dta.success)
                    navig('/login')
                }
                else {
                    window.alert(dta.error)
                    navig('/user/forgetpass')
                }
            }
            else {
                window.alert('Passwords should be same ...!')
                document.querySelector('#urepass').focus()
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
                                <h2 className="display-5 fw-bold text-center">Reset Password</h2>
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
                                                    <input type="password" className="form-control border-0 border-bottom rounded-0" name="upass" id="upass" placeholder="name@example.com" onChange={hndlinp} required />
                                                    <label htmlFor="upass" className="form-label">New Password</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input type="password" className="form-control border-0 border-bottom rounded-0" name="urepass" id="urepass" placeholder="Password" onChange={hndlinp} required />
                                                    <label htmlFor="urepass" className="form-label">Retype Password</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-grid">
                                                    <button className="btn btn-info btn-lg fs-3" type="submit" onClick={hndlsub}>Change</button>
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

export default Resetpass