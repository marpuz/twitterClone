import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Post from "../../Components/Post/Post";
import "./Profile.css";
import Avatar from "../../Components/Avatar/Avatar";

const Profile = () => {
  let { profile_tag } = useParams();
  const [profileExist, setProfileExist] = useState(false);
  const [followers, setFollowers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [about_me, setAboutMe] = useState(null);
  const [username, setUserName] = useState(null);
  const [posts, setPosts] = useState(null);
  const [usersProfile, setUserProfile] = useState(false);
  const session = supabase.auth.session();
  const user = supabase.auth.user();

  useEffect(() => {
    getProfile();
  }, [profile_tag]);

  useEffect(() => {
    getPosts();
  }, [id]);

  useEffect(() => {
    getFollowers();
    if (user.id === id) {
      setUserProfile(true);
    }
  }, [id, followers]);

  async function getFollowers() {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("Followers")
        .select("*")
        .eq("followedBy", user.id)
        .eq("followedUser", id);

      if (error) {
        throw error;
      }

      if (data.length !== 0) {
        setFollowers(true);
        console.log(data);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
      const name = profile_tag;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, website, avatar_url, about_me, username`)
        .eq("profile_tag", name)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfileExist(true);
        setId(data.id);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setAboutMe(data.about_me);
        setUserName(data.username);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getPosts() {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(`*, profiles:user_id (username, avatar_url, profile_tag)`)
        .eq(`user_id`, id);

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(data.sort((a, b) => a - b));
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function follow() {
    try {
      const { data, error } = await supabase
        .from("Followers")
        .insert([{ followedBy: user.id, followedUser: id }]);

      if (error) {
        throw error;
      }

      if (data) {
        setFollowers(true);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function unfollow() {
    try {
      const { data, error } = await supabase
        .from("Followers")
        .delete()
        .eq("followedBy", user.id)
        .eq("followedUser", id);
      if (error) {
        throw error;
      }

      if (data) {
        setFollowers(false);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="background">
      {session ? (
        <div>
          {loading ? (
            "Loading..."
          ) : (
            <div>
              {profileExist ? (
                <div className="profile-container">
                  <div className="profile-info">
                    <div className="user-profile-avatar">
                      <Avatar url={avatar_url} isReadOnly={true} />
                    </div>
                    {!usersProfile ? (
                      <div>
                        {!followers ? (
                          <button className="follow-btn" onClick={follow}>
                            Follow
                          </button>
                        ) : (
                          <button className="follow-btn" onClick={unfollow}>
                            Unfollow
                          </button>
                        )}
                      </div>
                    ) : (
                      " "
                    )}
                    <b>
                      <p>{username}</p>
                    </b>
                    <p>@{profile_tag}</p>
                    <div>
                      <p>about me:</p>
                      <p>{about_me}</p>
                    </div>
                    <a href={"https://" + website}>{website}</a>
                  </div>

                  <div className="posts">
                    {loading
                      ? "Loading..."
                      : posts &&
                        posts.map((post) => (
                          <Post key={post.post_id} post={post} />
                        ))}
                  </div>
                </div>
              ) : (
                <h1>Profile doesn`t exist</h1>
              )}
            </div>
          )}
        </div>
      ) : (
        "You must be logged"
      )}
    </div>
  );
};

export default Profile;
