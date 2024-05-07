import React from 'react'
import Menu from './Menu'
import Hmbrgr from './Hmbrgr'

const Navbar = () => {
  return (
    <>
        <div className="nav">
            <div className="menu">
                <Menu />
            </div>
            <div className="hmb">
                <Hmbrgr />
            </div>
        </div>
    </>
  )
}

export default Navbar