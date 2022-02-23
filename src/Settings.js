import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import SignIn from './SignIn'
import Account from './Account'
import './Settings.css'

export default function Home() {
    const [session, setSession] = useState(null)
  
    useEffect(() => {
      setSession(supabase.auth.session())
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])
  
    return (
      <div className="settings-container">
        <div className='profile-settings'>{!session ? <SignIn /> : <Account key={session.user.id} session={session} />}</div>
      </div>
    )
  }