import Link from 'next/link'
import React from 'react'

const Custom404 = () => {
  return (
    <div className='notfound'>
        <h1>404</h1>
        <p>
            Oops! The page you are looking for does not exist.
        </p>

        <Link
            href="/"
            style={{
                padding: "0.5rem 1rem",
                background: "#0070f3",
                fontSize: "1.2rem",
                color: "white",
                borderRadius: "0.5rem",
            }}
        >
            Go Back Home
        </Link>
    </div>
  )
}

export default Custom404