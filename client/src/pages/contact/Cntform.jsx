import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/Contacts.css'

const Cntform = () => {
    const [vl, setVl] = useState()
    let name, value

    const hndlinp = (e) => {
        name = e.target.name
        value = e.target.value
        setVl({...vl, [name]:value})
    }

  return (
    <>
        <section id="contact">
            <h1 className="section-header">Submit Your Queries</h1>
            <div className="contact-wrapper">
                <form id="contact-form" className="form-horizontal">
                    <div className="form-group">
                        <div className="col-sm-12">
                            <input type="text" className="formControl" id="name" name="name" placeholder="FULL NAME *" required onChange={hndlinp} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-12">
                            <input type="text" className="formControl" id="phone" name="phone" placeholder="PHONE NO. *" required onChange={hndlinp} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-12">
                            <input type="email" className="formControl" id="email" name="email" placeholder="EMAIL" required onChange={hndlinp} />
                        </div>
                    </div>
                    <textarea className="formControl" rows="3" name="message" placeholder="MESSAGE *" required onChange={hndlinp}></textarea>
                    <button className="btn send-button" id="submit" type="submit" value="SEND">
                        <div className="alt-send-button">
                            <i className="fa fa-paper-plane"></i>
                            <span className="send-text">SEND</span>
                        </div>
                    </button>
                </form>

                <div className="direct-contact-container">
                    <ul className="contact-list">
                        <li className="list-item"><i className="fa fa-map-marker fa-2x"><span className="contact-text place"><NavLink to="https://www.google.com/maps/place/22%C2%B030'20.3%22N+88%C2%B013'45.1%22E/@22.5051579,88.2283789,18.5z/data=!4m4!3m3!8m2!3d22.505649!4d88.229198?authuser=0&entry=ttu" target='_blank' title="Our location">Kolkata - 700140, WB</NavLink></span></i></li>
                        <li className="list-item"><i className="fa fa-phone fa-2x"><span className="contact-text phone"><NavLink to="tel:+91-8100514697" title="Speak with us">(+91) 8100514697</NavLink></span></i></li>
                        <li className="list-item"><i className="fa fa-envelope fa-2x"><span className="contact-text gmail"><NavLink to="mailto:msh.sun20@gmail.com" title="Send us an email">msh.sun20@gmail.com</NavLink></span></i></li>
                    </ul>
                    <hr />
                    <ul className="social-media-list">
                        <li>
                            <NavLink to="#" target="_blank" className="contact-icon">
                                <i className="fa fa-facebook" aria-hidden="true"></i>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="#" target="_blank" className="contact-icon">
                                <i className="fa fa-twitter" aria-hidden="true"></i>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="#" target="_blank" className="contact-icon">
                                <i className="fa fa-instagram" aria-hidden="true"></i>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="#" target="_blank" className="contact-icon">
                                <i className="fa fa-linkedin" aria-hidden="true"></i>
                            </NavLink>
                        </li>       
                    </ul>
                    <hr />
                    <div className="copyright">&copy; All of the Rights Reserved to <span style={{fontStyle:'oblique'}}>MSHITSOL</span></div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Cntform