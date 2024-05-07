import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import server from '../../server'
import * as XLSX from 'xlsx'

const Upldcntrym = () => {
    const [exclFil, setExclFil] = useState(null)
    const [excErr, setExcErr] = useState(null)
    const [exclData, setExclData] = useState(null)
    const [exclMp, setExclMp] = useState(null)
    // const [stts, setStts] = useState({})
    // const [ccode, setCcode] = useState([])
    // const [cname, setCname] = useState([])
    // const [cinfo, setCinfo] = useState([])
    let ccd=[], cnm=[], cinf=[]
    // let flg
    const navig = useNavigate()


    // console.log(exclFil)
    let selectedfile
    const fileType = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    const hndlfile = (e) => {
        selectedfile = e.target.files[0]
        if (selectedfile) {
            //  console.log(selectedfile.type)
             if (selectedfile&&fileType.includes(selectedfile.type)) {
                let reader = new FileReader()
                reader.readAsArrayBuffer(selectedfile)
                reader.onload = (e) => {
                    setExcErr(null)
                    setExclFil(e.target.result)
                }
             }
             else {
                setExcErr(`Please Select Only Excel File Type: ".xlsx"`)
                setExclFil(null)
             }
        }
        else {
            console.log(`Please Select an Excel File.`)
        }
    }
    const hndlsub = async (e) => {
        e.preventDefault()
        if (exclFil!==null) {
            const workbook = XLSX.read(exclFil, {type: 'buffer'})
            const wsname = workbook.SheetNames[0]
            const ws = workbook.Sheets[wsname]
            const data = XLSX.utils.sheet_to_json(ws)
            // console.log(data)
            const dataa = XLSX.utils.sheet_to_json(ws, {header: 1})
            // console.log(dataa)
            if (window.confirm(`Show data Confirmation...?`)) {
                if ((dataa[0][0] === 'country_code')&&(dataa[0][1] === 'country_name')&&(dataa[0][2] === 'country_info')) {
                    setExclData(data)
                    setExclMp(dataa)
                }
                else {
                    window.alert(`Sheet Format should be: country_code, country_name, country_info`)
                }
            }
            else {
                window.alert(`You have cancelled to see data.`)
            }

            // setExclData(dataa)
            // console.log(dataa[0].indexOf('account_name')!==-1)
            // for (let i=1; i<dataa.length; i++) {
            //     if (dataa[0].indexOf('account_phone')!==-1) {
            //         ccd.push(dataa[i][dataa[0].indexOf('account_phone')])
            //     }
            //     else {
            //         // window.alert(`Account Phone Number is Required.`)
            //     }
            //     // ccd.push(dataa[i][0])
            //     if (dataa[0].indexOf('contest_id')!==-1) {
            //         cnm.push(dataa[i][dataa[0].indexOf('contest_id')])
            //     }
            //     else {
            //         // window.alert(`Contest Id Required.`)
            //     }
            //     // cnm.push(dataa[i][3])
            //     if (dataa[0].indexOf('ticket_count')!==-1) {
            //         cinf.push(dataa[i][dataa[0].indexOf('ticket_count')])
            //     }
            //     // cinf.push(dataa[i][4])
            // }
            for (let i=1; i<dataa.length; i++) {
                if (dataa[i][1] === "") {
                    window.alert(`Country Name is Required.`)
                }
                // if (dataa[i][0] !== "") {
                //     ccd.push(dataa[i][0])
                // }
                // else {
                //     window.alert(`Country Code is Required.`)
                // }
                // if (dataa[i][1] !== "") {
                //     cnm.push(dataa[i][1])
                // }
                // else {
                //     window.alert(`Country Name is Required.`)
                // }
                // cinf.push(dataa[i][2])
            }
            // setCcode(ccd)
            // setCname(cnm)
            // setCinfo(cinf)
            // console.log(ccd)
            // console.log(cnm)
            // console.log(cinf)
        }
        else {
            setExclData(null)
        }
    }
    // const hndlMap = (e) => {
    //     // name = e.target.name
    //     value = e.target.value
    //     // setIndx(...indx, value)
    // }
    const hndlupld = async () => {
        if (window.confirm(`Confirm data Bulk Import...?`)) {
            const res = await axios.post(`${server}/cntrym/upload`, {exclData})
            const stat = await res.data
            console.log(stat)
            // setStts(stat)
            if (stat.statuscode === 220) {
                console.log(stat.message)
                window.alert(`Country Data Uploaded Successfully.`)
                navig('/admin/countrymaster')
            }
            else {
                console.error(stat.message)
                window.alert(stat.message)
            }
        }
        else {
            window.alert(`You have Cancelled Bulk data Import.`)
        }
    }

  return (
    <div className='wbpg'>
        <Header />

        <div className='main'>
            <div className='impacc'>
                <div className="upldsect">
                    <form className='frm' onSubmit={hndlsub}>
                        <div className="frmgrp">
                            <label htmlFor="accimp">Upload File</label>
                            <input type="file" name="accimp" id="accimp" onChange={hndlfile} />
                            {excErr&&<div className='text-danger' style={{marginTop:5+'px'}}>{excErr}</div>}
                        </div>
                        <div className="frmgrp">
                            <input type="submit" value="Show Data" />
                        </div>
                    </form>
                </div>
                {/* <div className="mapsect">
                    <form className='mpfrm'>
                        <div className="frmgrp">
                            <label htmlFor="accphn">Phone Number</label>
                            <select name="accphn" id="accphn" onChange={hndlMap}>
                                <option value={-1}>--Map Column--</option>
                                {
                                    (exclMp) ? exclMp.map((el, i) => (
                                        <option key={i} value={i}>{el}</option>
                                    )) : ''
                                }
                            </select>                            
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="accnm">Account Name</label>
                            <select name="accnm" id="accnm" onChange={hndlMap}>
                                <option value={-1}>--Map Column--</option>
                                {
                                    (exclMp) ? exclMp.map((el, i) => (
                                        <option key={i} value={i}>{el}</option>
                                    )) : ''
                                }
                            </select>                            
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="acceml">Email Id</label>
                            <select name="acceml" id="acceml" onChange={hndlMap}>
                                <option value={-1}>--Map Column--</option>
                                {
                                    (exclMp) ? exclMp.map((el, i) => (
                                        <option key={i} value={i}>{el}</option>
                                    )) : ''
                                }
                            </select>                            
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="cntsid">Contest</label>
                            <select name="cntsid" id="cntsid" onChange={hndlMap}>
                                <option value={-1}>--Map Column--</option>
                                {
                                    (exclMp) ? exclMp.map((el, i) => (
                                        <option key={i} value={i}>{el}</option>
                                    )) : ''
                                }
                            </select>                            
                        </div>
                        <div className="frmgrp">
                            <label htmlFor="tckc">No. of Tickets</label>
                            <select name="tckc" id="tckc" onChange={hndlMap}>
                                <option value={-1}>--Map Column--</option>
                                {
                                    (exclMp) ? exclMp.map((el, i) => (
                                        <option key={i} value={i}>{el}</option>
                                    )) : ''
                                }
                            </select>                            
                        </div>
                        <div className="frmgrp">
                            <input type="submit" value="Map" />
                        </div>
                    </form>
                    Indices are: <div>{(indx) ? indx.map((el, i) => <span key={i}>{el}</span>) : ''}</div>
                </div> */}
                <div className="viewsect">
                    {exclData===null&&<>Only File with Valid Data Format will be Accepted</>}
                    {exclData!==null&&(
                        <>
                            <div>Selected File is Valid</div>
                            <table border='1'>
                                <thead>
                                    <tr>
                                        {
                                            exclMp ? exclMp[0].map((fld, i) => (
                                                <th key={i}>{fld}</th>
                                            )) : null
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        exclMp ? exclMp.map((elm, i) => (
                                            (i>0) ? (
                                                <tr key={i}>
                                                    {
                                                        elm ? elm.map((vlu, j) => (
                                                            <td key={j}>{vlu}</td>
                                                        )) : (
                                                            <td></td>
                                                        )
                                                    }
                                                </tr>
                                            ) : null
                                        )) : null
                                    }
                                </tbody>
                            </table>
                            <button onClick={hndlupld}>Upload</button>
                            {
                                // (stts.statuscode===201) ? <button onClick={tckGenrt}>Generate Tickets</button> : null
                            }
                        </>
                    )}
                </div>
            </div>
        </div>

        <Footer />
    </div>
  )
}

export default Upldcntrym