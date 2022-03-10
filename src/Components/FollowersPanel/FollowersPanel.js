import Avatar from "../Avatar/Avatar";
import { Link } from "react-router-dom";

const FollowersPanel = ({ follower }) => {
  return (
    <div className="mt-[1em] display: flex pl-1">
      <Link
        to={`/profiles/${follower.profiles.profile_tag}`}
        className="nav-link"
      >
        <div className="follower-user-box text-slate-400 display: flex items-center">
          <div>
            <Avatar
              url={follower.profiles.avatar_url}
              isReadOnly={true}
              height={"40px"}
              width={"40px"}
            />
          </div>
          <div>
            <p className="pl-2">{follower.profiles.username}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FollowersPanel;
