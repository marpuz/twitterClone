import { supabase } from './supabaseClient'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css';

const Navbar = () => {
    const [session, setSession] = useState(null)
  
    useEffect(() => {
      setSession(supabase.auth.session())
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])
    
    
    return (
        <nav><div className='navbar'>
            <span className='page-title'>My Tweeter</span>
            <Link to='/' className='nav-link'><span>Home</span></Link>
            {session ? <Link to='/profile' className='nav-link'><span>Profile</span></Link> : <Link to='/profile' className='nav-link'><span>Log in</span></Link>}
          </div></nav>
    );
}
 
export default Navbar;