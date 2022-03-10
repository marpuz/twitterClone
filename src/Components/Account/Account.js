import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useHistory } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import LoadingIcon from "../LoadingIcon/LoadingIcon";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [about_me, setAboutMe] = useState(null);
  const [profile_tag, setPorifleTag] = useState(null);
  const [id, setId] = useState(null);
  const history = useHistory();
  const user = supabase.auth.user();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, website, avatar_url, about_me, profile_tag`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setAboutMe(data.about_me);
        setPorifleTag(data.profile_tag);
        setId(data.id);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url, about_me }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
        about_me,
        profile_tag: username.replace(/ /g, ""),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      setPorifleTag(username.replace(/ /g, ""));
      window.location.reload();
    }
  }

  return (
    <div className="display: flex bg-gray-900 m-4 p-2 rounded-md text-slate-400 justify-center items-center p-8">
      {loading ? (
        <div className="loading-icon">
          <LoadingIcon />
        </div>
      ) : (
        <div className="form-widget">
          <p className="m-1">Email:{session.user.email}</p>
          <p className="m-1 mb-3 text-sm">@{profile_tag}</p>
          <div className="m-1">
            <Avatar
              url={avatar_url}
              size={150}
              height={"200px"}
              width={"200px"}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ username, website, avatar_url: url });
              }}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="username">Name</label>
            <input
              className="rounded-lg border-[1px] border-gray-600 pl-2 ml-1 bg-gray-900 p-2 m-1 w-full"
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="website">Website</label>
            <input
              className="rounded-lg border-[1px] border-gray-600 pl-2 ml-1 bg-gray-900 p-2 m-1 w-full"
              id="website"
              type="website"
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="about_me">About me</label>
            <div>
              <textarea
                className="rounded-lg border-[1px] border-gray-600 pl-2 ml-1 bg-gray-900 p-2 m-1 w-full"
                id="about_me"
                type="text"
                value={about_me || ""}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
          </div>
          <div className="display: flex justify-center">
            <button
              className="follow-btn display: flex justify-center items-center text-sm rounded-lg border-[2px] border-white mt-3 p-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white m-3"
              onClick={() => {
                updateProfile({ username, website, avatar_url, about_me });
              }}
              disabled={loading}
            >
              <b>{loading ? "Loading ..." : "Update"}</b>
            </button>

            <button
              className="follow-btn display: flex justify-center items-center text-sm rounded-lg border-[2px] border-white mt-3 p-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white m-3"
              onClick={() => {
                supabase.auth.signOut();
                history.push("/signin");
              }}
            >
              <b>Sign Out</b>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
