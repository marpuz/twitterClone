import Avatar from "../Avatar/Avatar";
import "./Post.css";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <div className="full-post">
      <div className="user-post-avatar">
        <Avatar url={post.profiles.avatar_url} isReadOnly={true} />
      </div>
      <div className="post-content">
        <div className="user-info">
          <b>
            <Link
              to={`/profiles/${post.profiles.profile_tag}`}
              className="profile-link"
            >
              {post.profiles.username}
            </Link>
          </b>
          <span>@{post.profiles.profile_tag}</span>
        </div>
        <p>{post.content}</p>
        <p className="date-time">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default Post;
