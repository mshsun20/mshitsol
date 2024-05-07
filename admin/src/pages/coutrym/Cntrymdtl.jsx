import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../../styles/Countrym.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import server from '../../server'

const Cntrymdtl = () => {
    const {id} = useParams()
    const [vl, setVl] = useState({cntrycode:'', cntrynm:'', cntryinfo:''})

    const getdtls = async () => {
        const res = await axios.get(`${server}/cntryms/retrieve/`+id)
        const dta = await res.data
        setVl(dta.data)
    }
    useEffect(() => {
        getdtls()
    }, [])

  return (
    <>
        <div className="wbpg">
            <Header />

            <div className="main">
                <div id="cntrysec">
                    <div className="hdr">Country details</div>
                    <div className="dtl">
                        <div className="dinf">
                            <div className="hds">Country Code</div>
                            <div className="dtas">{vl.cntrycode}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Country Name</div>
                            <div className="dtas">{vl.cntrynm}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Country Details</div>
                            <div className="dtas">{vl.cntryinfo}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Added On</div>
                            <div className="dtas">{new Date(vl.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Modified On</div>
                            <div className="dtas">{new Date(vl.updatedAt).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    </>
  )
}

export default Cntrymdtl