import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Redirection = () => {
    const navig = useNavigate()

    const goAdmin = () => {
        navig('/admin/dashboard')
    }
    useEffect(() => {
        goAdmin()
    }, [])

  return (
    <>
        <div>Redirection</div>
    </>
  )
}

export default Redirection