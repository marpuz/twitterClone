import ProfilePanel from "../ProfilePanel/ProfilePanel";
import "./Wrapper.css";
import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import LoadingIcon from "../LoadingIcon/LoadingIcon";
import FollowersPanel from "../FollowersPanel/FollowersPanel";

const Wrapper = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [profileLoading, setProfileLoading] = useState(null);
  const [followersLoading, setFollowersLoading] = useState(null);
  const user = supabase.auth.user();
  const session = supabase.auth.session();

  useEffect(() => {
    getProfile();
  }, [session]);

  useEffect(() => {
    getFollowers();
  }, [session]);

  async function getFollowers() {
    if (!session) return;
    try {
      const { data, error } = await supabase
        .from("Followers")
        .select("*, profiles:followedUser (*)")
        .eq("followedBy", user.id);

      if (error) {
        throw error;
      }

      if (data.length !== 0) {
        setFollowers(data);
        console.log(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function getProfile() {
    if (!session) return;
    try {
      setProfileLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url, profile_tag`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <div className="wrapper">
      {!profileLoading ? (
        <div className="profile-panel">
          <ProfilePanel profile={profile} />
        </div>
      ) : (
        <div className="loading-icon">
          <LoadingIcon />
        </div>
      )}
      <div className="content">{children}</div>

      <div className="followers-panel">
        {!followersLoading ? (
          followers &&
          followers.map((follower) => (
            <FollowersPanel key={follower.followedUser} follower={follower} />
          ))
        ) : (
          <div className="loading-icon">
            <LoadingIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wrapper;
