import Avatar from './Avatar'
import './Post.css'

const Post = ({post}) => {
    
    

    return (
        <div className='full-post'>
            <div className='user-post-avatar'><Avatar url={post.profiles.avatar_url} isReadOnly = {true} /></div>
            <div className='post-content'>
                <div className='user-info'>
                    <b><a className='profile-link' href={'/profiles/' + post.profiles.username}>{post.profiles.username}</a></b>
                    <a>@{post.profiles.username}</a>
                </div>
                <p>{post.content}</p>
            </div>
        </div>
    );
}
 
export default Post;