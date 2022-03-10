import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabaseClient";
import Post from "../../Components/Post/Post";
import Avatar from "../../Components/Avatar/Avatar";
import LoadingIcon from "../../Components/LoadingIcon/LoadingIcon";
import { SupabaseContext } from "../../State";

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
  const { getFollowers } = useContext(SupabaseContext);

  useEffect(() => {
    getProfile();
  }, [profile_tag]);

  useEffect(() => {
    getPosts();
  }, [id]);

  useEffect(() => {
    isFollowers();
    if (user.id === id) {
      setUserProfile(true);
    }
  }, [id, followers]);

  async function isFollowers() {
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
        getFollowers();
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
        getFollowers();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="background ">
      {session ? (
        <div>
          {loading ? (
            <div className="loading-icon display: flex justify-center items-center">
              <LoadingIcon />
            </div>
          ) : (
            <div>
              {profileExist ? (
                <div className="profile-container ">
                  <div className="profile-info display: flex flex-col bg-gray-900 m-4 p-8 rounded-md ">
                    <div>
                      <Avatar
                        url={avatar_url}
                        isReadOnly={true}
                        height={"180px"}
                        width={"180px"}
                      />
                    </div>
                    <div>
                      {!followers ? (
                        <button
                          className="follow-btn display: flex justify-center items-center text-sm rounded-lg border-[2px] border-white mt-3 p-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                          onClick={follow}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          <b className="text-white">Follow</b>
                        </button>
                      ) : (
                        <button
                          className="follow-btn display: flex justify-center items-center text-sm rounded-lg border-[2px] border-white mt-3 p-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                          onClick={unfollow}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                            />
                          </svg>
                          <b className="text-white">Unfollow</b>
                        </button>
                      )}
                    </div>
                    <b>
                      <p className="text-slate-400">{username}</p>
                    </b>
                    <p className="text-slate-400 text-sm">@{profile_tag}</p>
                    <div>
                      <p className="text-slate-400 mt-3">about me:</p>
                      <p className="text-slate-400">{about_me}</p>
                    </div>
                    <a className="text-slate-200" href={"https://" + website}>
                      {website}
                    </a>
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
