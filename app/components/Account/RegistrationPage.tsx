import React from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
    username: string
    password: string
    fullName: string
    emailId: string
    phoneNumber: number
    address: string
}

const RegistrationPage = () => {
    const { register, handleSubmit } = useForm<FormData>()
    const formSubmit = handleSubmit(({ username, password, fullName, emailId, phoneNumber, address }) => {
        console.log(username)
        console.log(password)
        console.log(fullName)
        console.log(emailId)
        console.log(phoneNumber)
        console.log(address)
    })
    
  return (
    <>
        <form onSubmit={formSubmit} className='form-sec'>
            <div className="form-group">
                <label>Username</label>
                <input {...register("username")} />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input {...register("password")} />
            </div>

            <div className="form-group">
                <label>Full Name</label>
                <input {...register("fullName")} />
            </div>

            <div className="form-group">
                <label>Email ID</label>
                <input {...register("emailId")} />
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input {...register("phoneNumber")} />
            </div>

            <div className="form-group">
                <label>Address</label>
                <input {...register("address")} />
            </div>

            <div className="button-group">
                <button type="submit" className='form-button'>Submit details</button>
            </div>
        </form>
    </>
  )
}

export default RegistrationPage