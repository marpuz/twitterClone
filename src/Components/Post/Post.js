import Avatar from "../Avatar/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <div className="grid grid-cols-6 bg-gray-900 m-4 p-2 rounded-md text-slate-400">
      <div className="col-span-1 mt-3 ml-7  h-10 w-10">
        <Avatar
          url={post.profiles.avatar_url}
          isReadOnly={true}
          height={"40px"}
          width={"40px"}
        />
      </div>
      <div className="col-span-5">
        <div className="user-info m-1">
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
        <p className="m-1">{post.content}</p>
        <p className="date-time m-1 text-sm">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default Post;
