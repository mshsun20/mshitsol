import { useState, useEffect } from 'react'
import '../../styles/Countrym.css'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'
import * as XLSX from 'xlsx'

const Exprtcntrym = () => {
  const [dta, setDta] = useState()

  const fetchDta = async () => {
    const res = await axios.get(`${server}/cntryms/fetch`)
    const data = await res.data.data
    const modDta = data.map((obj) => {
      return {
        'country_code':obj.cntrycode,
        'country_name':obj.cntrynm,
        'country_info':obj.cntryinfo,
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

    XLSX.utils.book_append_sheet(wb, ws, 'Country Master data')
    XLSX.writeFile(wb, 'Country_Master.xlsx')
  }
  const hndlcsvexprt = (e) => {
    const wb = XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(dta)

    XLSX.utils.book_append_sheet(wb, ws, 'Country Master data')
    XLSX.writeFile(wb, 'Country_Master.csv')
  }

  return (
    <>
        <div className="wbpg">
          <Header />

          <div className="main">
            <div className="hdr">Export All Countries data</div>
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

export default Exprtcntrym