import Avatar from "../Avatar/Avatar";
import { Link } from "react-router-dom";
import "../ProfileSearchResult/ProfileSearchResult.css";

const ProfileSearchResult = ({ profile }) => {
  return (
    <div className="search-profile-box">
      <div className="profile-search-avatar">
        <Avatar url={profile.avatar_url} isReadOnly={true} />
      </div>
      <div className="user-info">
        <b>
          <span>{profile.username}</span>
        </b>
        <span>@{profile.profile_tag}</span>
      </div>
    </div>
  );
};

export default ProfileSearchResult;
