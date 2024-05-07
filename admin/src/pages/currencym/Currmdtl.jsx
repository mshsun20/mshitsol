import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../../styles/Countrym.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import server from '../../server'

const Currmdtl = () => {
    const {id} = useParams()
    const [vl, setVl] = useState({curcode:'', curnm:'', curinfo:'', cursymbl:'', cntry:'', curiso:'', curaltky:''})

    const getdtls = async () => {
        const res = await axios.get(`${server}/currms/retrieve/`+id)
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
                <div id="cursec">
                    <div className="hdr">Currency details</div>
                    <div className="dtl">
                        <div className="dinf">
                            <div className="hds">Currency Code</div>
                            <div className="dtas">{vl.curcode}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Currency Name</div>
                            <div className="dtas">{vl.curnm}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Currency Details</div>
                            <div className="dtas">{vl.curinfo}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Added On</div>
                            <div className="dtas">{new Date(vl.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Modified On</div>
                            <div className="dtas">{new Date(vl.updatedAt).toLocaleString()}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Currency Symbol</div>
                            <div className="dtas">{vl.cursymbl}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Country</div>
                            <div className="dtas">{vl.cntry.cntrynm}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">ISO Code</div>
                            <div className="dtas">{vl.curiso}</div>
                        </div>
                        <div className="dinf">
                            <div className="hds">Alternate Key</div>
                            <div className="dtas">{vl.curaltky}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    </>
  )
}

export default Currmdtl