import { useState } from 'react'
import { supabase } from './supabaseClient'
import './SignIn'

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async (email, password) => {
    try {
      setLoading(true)
      let { user, error } = await supabase.auth.signUp({
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
        <h1 className="header">Sign up!</h1>
        <p className="description">Register using email and password</p>
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
              handleSignUp(email, password)
            }}
            className="sign-button"
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Register</span>}
          </button>
        </div>
      </div>
    </div>
  )
}