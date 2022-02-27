import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Signin.css'

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const session = supabase.auth.session()


  const handleSignIn = async (email, password) => {
    try {
      setLoading(true)
      let { user, error } = await supabase.auth.signIn({
        email: email,
        password: password
      })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
      setPassword('')
      setEmail('')
      
    }
  }

  

  return (
    <div className="sign-container">
      <div className="col-6 form-widget">
        <h1 className="header">Sign in!</h1>
        <p className="description">Login using email and password</p>
        <div>
          <input
            className="email-input"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            className="password-input"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleSignIn(email, password)
            }}
            className='sign-button'
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Log in!</span>}
          </button>
        </div>
        <Link to='/signup' className='nav-link'>Sign up for free!</Link>
      </div>
    </div>
  )
}