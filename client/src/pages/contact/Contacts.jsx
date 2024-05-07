import { useState, useEffect } from 'react'
import '../../styles/Contacts.css'
import axios from 'axios'
import server from '../../server'
import Gmappart from './Gmappart'
import Cntform from './Cntform'

const Contacts = () => {
  const [usr, setUsr] = useState()
  const [loc, setLoc] = useState({lat:'', long:''})
  const [addr, setAddr] = useState('')

  // OpenCage Geocoding API
  let apiEndPoint = `https://api.opencagedata.com/geocode/v1/json`
  let apiKey = `4ee073fe0822481a800905bbe3b17541`

  axios.defaults.withCredentials = true

  const getUsrSess = async () => {
    try {
      let token = localStorage.getItem('user')
      if (token) {
        const res = await axios.get(`${server}/user/sess/`+token)
        const data = await res.data
        console.log(data)

        if (data.statuscode === 220) {
          console.log(data.message)
          setUsr(data.user)
        }
        else {
          console.warn(data.message)
        }
      }
      else {
        console.warn(`Not Yet Logged In...!`)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getUsrSess()
  }, [])

  const getloc = (e) => {
    e.preventDefault()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const {latitude, longitude} = pos.coords
        // console.log(latitude)
        // console.log(longitude)
        setLoc({...loc, lat:latitude, long:longitude})

        let geoqry = `${latitude}+${longitude}`
        let apiUrl = `${apiEndPoint}?key=${apiKey}&q=${geoqry}&pretty=1`
        try {
          const res = await fetch(apiUrl)
          const data = await res.json()
          // console.log(data.results[0])
          setAddr(data.results[0].formatted)
        } catch (error) {
          console.error(error)
        }
      },
      (error) => {
        console.error(error)
        document.querySelector('.errmsg').textContent = error.message
      })
    }
  }

  const clrloc = (e) => {
    e.preventDefault()
    setLoc({})
    setAddr('')
    document.querySelector('.errmsg').textContent = ''
  }

  return (
    <>
        <div className='main'>
          <div className="contacts">
            <div className="hdr">Contact Us</div>
            <div className="mploc"><Gmappart /></div>
            <div className="cnt">
              <div className="gloc">
                <div className="hdng">Current Geo Location Live Tracking</div>
                <div className="locsec">
                  {
                    (usr) ? (
                      <>
                        <button onClick={getloc}>Get Location</button>
                        <button onClick={clrloc}>Clear</button>
                        <div className="locdta">
                          {
                            (loc) ? (
                              <>
                                <div className="latdta"><span style={{fontWeight:800}}>Latitude:&nbsp;&nbsp;</span>{loc.lat}</div>
                                <div className="longdta"><span style={{fontWeight:800}}>Longitude:&nbsp;&nbsp;</span>{loc.long}</div>
                                <div className="fulladdr"><span style={{fontWeight:800}}>Full Address:&nbsp;&nbsp;</span>{addr}</div>
                                <div className="errmsg"></div>
                              </>
                            ) : null
                          }
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{backgroundColor:'navy', width:'fit-content', padding:'0.5rem', color:'azure', fontWeight:500}}>Authenticated Users Only</div>
                      </>
                    )
                  }
                </div>
              </div>
              <div className="cntsec"><Cntform /></div>
            </div>
            {/* <div className="gloc">
              <div className="hdng">Current Geo Location Live Tracking</div>
              <div className="locsec">
                {
                  (usr) ? (
                    <>
                      <button onClick={getloc}>Get Location</button>
                      <button onClick={clrloc}>Clear</button>
                      <div className="locdta">
                        {
                          (loc) ? (
                            <>
                              <div className="latdta"><span style={{fontWeight:800}}>Latitude:&nbsp;&nbsp;</span>{loc.lat}</div>
                              <div className="longdta"><span style={{fontWeight:800}}>Longitude:&nbsp;&nbsp;</span>{loc.long}</div>
                              <div className="fulladdr"><span style={{fontWeight:800}}>Full Address:&nbsp;&nbsp;</span>{addr}</div>
                              <div className="errmsg"></div>
                            </>
                          ) : null
                        }
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{backgroundColor:'navy', width:'fit-content', padding:'0.5rem', color:'azure', fontWeight:500}}>Authenticated Users Only</div>
                    </>
                  )
                }
              </div>
            </div>
            <div className="cntsec"><Cntform /></div> */}
          </div>
        </div>
    </>
  )
}

export default Contacts