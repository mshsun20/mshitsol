import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import axios from 'axios'
import server from '../../server'

const Features = () => {
  const getFeatrs = async () => {
    try {
      // const res = await axios.get(`${server}/featr/fetch`)
      // const data = await res.data
      // console.log(data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getFeatrs()
  }, [])

  return (
    <>
        <div className="wbpg">
          <Header />

          <div className="main">Features</div>

          <Footer />
        </div>
    </>
  )
}

export default Features