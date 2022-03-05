import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useHistory } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import "./Account.css";

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
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <p>@{profile_tag}</p>
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <label htmlFor="about_me">About me</label>
      <div>
        <textarea
          id="about_me"
          type="text"
          value={about_me || ""}
          onChange={(e) => setAboutMe(e.target.value)}
        />
      </div>
      <div>
        <button
          className="button-block-primary"
          onClick={() => {
            updateProfile({ username, website, avatar_url, about_me });
          }}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button-block"
          onClick={() => {
            supabase.auth.signOut();
            history.push("/signin");
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
