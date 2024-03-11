import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'
import * as XLSX from 'xlsx'

const Upldcurrm = () => {
    const [exclFil, setExclFil] = useState(null)
    const [excErr, setExcErr] = useState(null)
    const [exclData, setExclData] = useState(null)
    const [exclMp, setExclMp] = useState(null)
    // let ccd=[], cnm=[], cinf=[]
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
            console.log(dataa)
            if (window.confirm(`Show data Confirmation...?`)) {
                if ((dataa[0][0] === 'currency_code')&&(dataa[0][1] === 'currency_name')&&(dataa[0][2] === 'currency_info')&&(dataa[0][3] === 'currency_symbol')&&(dataa[0][4] === 'country_name')&&(dataa[0][5] === 'currency_iso_code')&&(dataa[0][6] === 'currency_alt_key')) {
                    setExclData(data)
                    setExclMp(dataa)
                }
                else {
                    window.alert(`Sheet Format should be: currency_code, currency_name, currency_info, currency_symbol, country_name, currency_iso_code, currency_alt_key`)
                }
            }
            else {
                window.alert(`You have cancelled to see data.`)
            }

            // for (let i=1; i<dataa.length; i++) {
            //     if (dataa[i][0] !== "") {
            //         ccd.push(dataa[i][0])
            //     }
            //     else {
            //         window.alert(`Currency Code is Required.`)
            //     }
            //     if (dataa[i][1] !== "") {
            //         cnm.push(dataa[i][1])
            //     }
            //     else {
            //         window.alert(`Currency Name is Required.`)
            //     }
            //     cinf.push(dataa[i][2])
            // }
        }
        else {
            setExclData(null)
        }
    }
    const hndlupld = async () => {
        if (window.confirm(`Confirm data Bulk Import...?`)) {
            const res = await axios.post(`${server}/currm/upload`, {exclData})
            const stat = await res.data
            // console.log(stat)
            if (stat.statuscode === 220) {
                console.log(stat.message)
                window.alert(`Currency Data Imported Successfully.`)
                navig('/admin/currencymaster')
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
    <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    </>
  )
}

export default Upldcurrm