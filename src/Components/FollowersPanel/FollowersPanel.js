import Avatar from "../Avatar/Avatar";
import { Link } from "react-router-dom";
import "./FollowersPanel.css";

const FollowersPanel = ({ follower }) => {
  return (
    <div>
      <Link
        to={`/profiles/${follower.profiles.profile_tag}`}
        className="nav-link"
      >
        <div className="follower-user-box">
          <div className="follower-panel-avatar">
            <Avatar url={follower.profiles.avatar_url} isReadOnly={true} />
          </div>
          <div>
            <p>{follower.profiles.username}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FollowersPanel;
