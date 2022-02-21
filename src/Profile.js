import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import SignIn from './SignIn'
import Account from './Account'

export default function Home() {
    const [session, setSession] = useState(null)
  
    useEffect(() => {
      setSession(supabase.auth.session())
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])
  
    return (
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        {!session ? <SignIn /> : <Account key={session.user.id} session={session} />}
      </div>
    )
  }