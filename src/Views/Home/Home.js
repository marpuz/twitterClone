import './Home.css'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Post from '../../Components/Post/Post';
import AddPost from '../../Components/AddPost/AddPost'

const Home = () => {
    const session = supabase.auth.session()
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        getPosts()
      }, [session])

    async function getPosts() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('posts')
                .select(`*, profiles:user_id (username, avatar_url, profile_tag)`)
                
      
            if (error) {
              throw error
            }
      
            if (data) {
                setPosts(data.sort((a, b) => a - b))
            }
          } catch (error) {
            alert(error.message)
          } finally {
            setLoading(false)
          }
    }
    



    return (
      <div>{session? 
        <div className="home-container">
            <AddPost session={session} />
            <div className='posts'>{loading? 'Loading...' : posts && posts.map(post => <Post key={post.post_id} post={post} />)}</div>
        </div> : 'You must log in' }
        </div>
    );
}
 
export default Home;