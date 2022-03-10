import Avatar from "../Avatar/Avatar";
import { Link } from "react-router-dom";

const ProfileSearchResult = ({ profile }) => {
  return (
    <div className="search-profile-box display: flex w-full m-3">
      <div className="profile-search-avatar">
        <Avatar
          url={profile.avatar_url}
          isReadOnly={true}
          width={"30px"}
          height={"30px"}
        />
      </div>
      <div className="user-info">
        <b>
          <span className="pl-3">{profile.username}</span>
        </b>
      </div>
    </div>
  );
};

export default ProfileSearchResult;
