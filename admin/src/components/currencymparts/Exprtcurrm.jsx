import { useState, useEffect } from 'react'
import '../../styles/Currencym.css'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'
import * as XLSX from 'xlsx'

const Exprtcurrm = () => {
    const [dta, setDta] = useState()

    const fetchDta = async () => {
        const res = await axios.get(`${server}/currms/fetch`)
        const data = await res.data.data
        const modDta = data.map((obj) => {
        return {
            'currency_code':obj.curcode,
            'currency_name':obj.curnm,
            'currency_info':obj.curinfo,
            'currency_symbol':obj.cursymbl,
            'country_name':obj.cntry.cntrynm,
            'currency_iso_code':obj.curiso,
            'currency_alt_key':obj.curaltky,
            'created_on':new Date(obj.createdAt).toLocaleString(),
            'updated_on':new Date(obj.updatedAt).toLocaleString()
        }
        })
        // console.log(dta)
        // console.log(modDta)
        setDta(modDta)
    }
    useEffect(() => {
        fetchDta()
    }, [])

    const hndlxlsxexprt = (e) => {
        const wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(dta)

        XLSX.utils.book_append_sheet(wb, ws, 'Currency Master data')
        XLSX.writeFile(wb, 'Currency_Master.xlsx')
    }
    const hndlcsvexprt = (e) => {
        const wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(dta)

        XLSX.utils.book_append_sheet(wb, ws, 'Currency Master data')
        XLSX.writeFile(wb, 'Currency_Master.csv')
    }

  return (
    <>
        <div className="wbpg">
          <Header />

          <div className="main">
            <div className="hdr">Export All Currencies data</div>
            <div className="contents">
              <div className="hd">Choose Export Option from following</div>
              <div className="optgrp">
                <span>Export as: </span>
                <button onClick={hndlxlsxexprt}>XLSX File</button>
                <button onClick={hndlcsvexprt}>CSV File</button>
              </div>
            </div>
          </div>

          <Footer />
        </div>
    </>
  )
}

export default Exprtcurrm