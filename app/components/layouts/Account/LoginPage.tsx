import React from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
    username: string
    password: string
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<FormData>()
  const formSubmit = handleSubmit(({ username, password }) => {
    console.log(username)
    console.log(password)
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

          <div className="button-group">
            <button type="submit" className='form-button'>Submit details</button>
          </div>
        </form>
    </>
  )
}

export default LoginPage