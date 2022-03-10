import ProfilePanel from "../ProfilePanel/ProfilePanel";
import "./Wrapper.css";
import { supabase } from "../../supabaseClient";
import { useState, useEffect, useContext } from "react";
import LoadingIcon from "../LoadingIcon/LoadingIcon";
import FollowersPanel from "../FollowersPanel/FollowersPanel";
import { SupabaseContext } from "../../State";

const Wrapper = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const user = supabase.auth.user();
  const session = supabase.auth.session();
  const supabaseState = useContext(SupabaseContext);

  useEffect(() => {
    getProfile();
  }, [session]);

  useEffect(() => {
    supabaseState.getFollowers();
  }, [session]);

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
    <div className="grid grid-cols-6 max-h-[100vh] overflow-auto">
      <div className="col-span-1"></div>
      {!profileLoading ? (
        <div className="profile-panel col-span-1 position: sticky top-0 h-min">
          <ProfilePanel profile={profile} />
        </div>
      ) : (
        <div className="loading-icon">
          <LoadingIcon />
        </div>
      )}
      <div className="content col-span-2">{children}</div>

      <div className="followers-panel col-span-2 position: sticky top-0 h-min">
        {supabaseState.followers &&
          supabaseState.followers.map((follower) => (
            <FollowersPanel key={follower.followedUser} follower={follower} />
          ))}
      </div>
    </div>
  );
};

export default Wrapper;
