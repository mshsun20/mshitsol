import { useState, useEffect } from 'react'
import axios from 'axios'
import server from '../server'

const Topbar = () => {
    const [mode, setMode] = useState('Online')

    const chckMode = async () => {
        try {
            const res = await axios.get(`${server}/chckstat`)
            const data = await res.data
            // console.log(data)
            if (data.statuscode === 200) {
                setMode('Online')
                // console.log(data.message)
            }
            else {
                setMode('Offline')
                console.log(`Server is Offline...!`)
            }
        } catch (error) {
            setMode('Offline')
            console.error(error)
        }
    }

    // const setOn = () => {
    //     if (document.querySelector('.stat')) {
    //         const ondiv = document.createElement('div')
    //         ondiv.classList.add('onln')
    //         ondiv.innerHTML = `Back to Online...`
    //         document.querySelector('.stat').appendChild(ondiv)
    //         setTimeout(() => {
    //             document.querySelector('.stat').removeChild(ondiv)
    //         }, 2000)
    //     }
    //     else {
    //         return null
    //     }
    // }
    useEffect(() => {
        chckMode()
    }, [])
    setInterval(() => {
        chckMode()
    }, 10000);

  return (
    <>
        <div className='topbar'>
            <div className="stat">
                {
                    (mode==='Offline') ? <div className='offln'>Offline Mode</div> : null
                }
            </div>
            <div className="topr">
                <span style={{fontWeight:'bold'}}>Contact Us @</span>&nbsp;&nbsp;<span><a href="tel:+918100514697" style={{fontStyle:'italic'}}>8100514697</a></span>
            </div>
        </div>
    </>
  )
}

export default Topbar