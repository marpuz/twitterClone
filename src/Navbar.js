import { supabase } from './supabaseClient'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css';


const Navbar = () => {
    const [session, setSession] = useState(null)
    const [profileTag, setProfileTag] = useState(null)
    const [loading, setLoading] = useState(true)
    
  
    useEffect(() => {
      setSession(supabase.auth.session())
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])

    useEffect(() => {
      getProfileTag()
    },[])

    async function getProfileTag() {
      
      try {
        const user = supabase.auth.user()
        setLoading(true)
  
        let { data, error, status } = await supabase
          .from('profiles')
          .select(`profile_tag`)
          .eq('id', user.id)
          .single()
  
        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setProfileTag(data.profile_tag)
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    
    
    return (
        <nav>{!loading ? <div className='navbar'>
            <span className='page-title'>My Tweeter</span>
            <Link to='/' className='nav-link'><span>Home</span></Link>
            {session ? <Link  to={'/profiles/' + profileTag} className='nav-link'><span>Profile</span></Link> : null}
            {session ? <Link to='/settings' className='nav-link'><span>Settings</span></Link> : <Link to='/settings' className='nav-link'><span>Log in</span></Link>}
          </div> : null}</nav>
    );
}
 
export default Navbar;