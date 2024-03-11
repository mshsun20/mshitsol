import { useState, useEffect } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import axios from 'axios'
import server from '../../server'

const Plans = () => {
  const getPlns = async () => {
    try {
      const res = await axios.get(`${server}/pln/fetch`)
      const data = await res.data
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getPlns()
  }, [])

  return (
    <>
        <div className="wbpg">
          <Header />

          <div className="main">Plans</div>

          <Footer />
        </div>
    </>
  )
}

export default Plans