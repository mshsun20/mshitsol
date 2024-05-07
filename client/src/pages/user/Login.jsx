import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/Login.css'
import axios from 'axios'
import server from '../../server'
// import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const [vl, setVl] = useState({uname:'', upass:''})
  let name, value
  // const { loginWithRedirect, logout, isAuthenticated, isLoading  } = useAuth0();

  const hndlinp = (e) => {
    name = e.target.name
    value = e.target.value
    setVl({...vl, [name]:value})
  }

  const hndlsub = async (e) => {
    e.preventDefault()
    const {ukey, upass} = vl

    if (!ukey || !upass) {
      window.alert(`All fields are required...!`)
    }
    else {
      try {
        const res = await axios.post(`${server}/user/login`, {ukey, upass})
        const dta = await res.data
        // console.log(data.user)
        if (dta.statuscode === 220) {
          localStorage.setItem('user', dta.user)
          window.alert(dta.success)
          window.location.assign('/')
        }
        else {
          window.alert(dta.error)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <>
      <div className="login">
        <section className="py-3 py-md-5 py-xl-8">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="mb-5">
                  <h2 className="display-5 fw-bold text-center">Login</h2>
                  <p className="text-center m-0">Don't have any account? <NavLink to="/register">Sign Up</NavLink></p>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10 col-xl-8">
                <div className="row gy-5 lgform">
                  <div className="col-12 col-lg-5 formsec">
                    <form>
                      <div className="row gy-3 overflow-hidden">
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input type="text" className="form-control border-0 border-bottom rounded-0" name="ukey" id="ukey" placeholder="name@example.com" onChange={hndlinp} required />
                            <label htmlFor="ukey" className="form-label">User Id</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input type="password" className="form-control border-0 border-bottom rounded-0" name="upass" id="upass" placeholder="Password" onChange={hndlinp} required />
                            <label htmlFor="upass" className="form-label">Password</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row justify-content-between">
                            <div className="col-6">
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="remember_me" id="remember_me" />
                                <label className="form-check-label text-secondary" htmlFor="remember_me">
                                  Remember me
                                </label>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="text-end">
                                <NavLink to="/user/forgetpass" className="link-secondary text-decoration-none">Forgot password?</NavLink>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-grid">
                            <button className="btn btn-primary btn-lg fs-3" type="submit" onClick={hndlsub}>Sign In</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-12 col-lg-2 midlsec d-flex align-items-center justify-content-center gap-3 flex-lg-column">
                    <div className="bg-dark h-100 d-none d-lg-block" style={{width: "1px", opacity: 0.1}}></div>
                    <div className="bg-dark w-100 d-lg-none" style={{height: "1px", opacity: "0.1"}}></div>
                    <div>or</div>
                    <div className="bg-dark h-100 d-none d-lg-block" style={{width: "1px", opacity: "0.1"}}></div>
                    <div className="bg-dark w-100 d-lg-none" style={{height: "1px", opacity: "0.1"}}></div>
                  </div>
                  <div className="col-12 col-lg-5 btnsec d-flex align-items-center">
                    <div className="d-flex gap-3 flex-column w-100 ">
                      <button href="#!" className="btn btn-lg btn-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                          <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                        </svg>
                        <span className="ms-2 fs-10">Sign In with Google</span>
                      </button>
                      <button href="#!" className="btn btn-lg btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                        <span className="ms-2 fs-10">Sign In with Facebook</span>
                      </button>
                      <button href="#!" className="btn btn-lg btn-dark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-apple" viewBox="0 0 16 16">
                          <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                          <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                        </svg>
                        <span className="ms-2 fs-10">Sign In with Apple</span>
                      </button>
                    </div>
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

export default Login