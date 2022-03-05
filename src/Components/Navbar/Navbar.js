import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import "./Navbar.css";
import ProfileSearchResult from "../ProfileSearchResult/ProfileSearchResult";

const Navbar = () => {
  const [session, setSession] = useState(null);
  const [profileTag, setProfileTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchProfiles, setSearchProfiles] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const updateSearch = (e) => setSearchProfiles(e?.target?.value);
  const debouncedOnChange = debounce(updateSearch, 180);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    getProfileTag();
  }, [session]);

  useEffect(() => {
    getFilteredProfiles();
  }, [searchProfiles]);

  async function getFilteredProfiles() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, about_me, profile_tag`)
        .textSearch("username", searchProfiles);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFilteredProfiles(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getProfileTag() {
    if (!session) return;
    try {
      const user = supabase.auth.user();
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`profile_tag`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfileTag(data.profile_tag);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav>
      <div className="navbar">
        <span className="page-title">My Tweeter</span>
        <div className="search-bar">
          <input
            className="search-bar-input"
            placeholder="Search profile..."
            onChange={debouncedOnChange}
          />
          <div className="filtered-profiles">
            {filteredProfiles &&
              filteredProfiles.map((profile) => (
                <Link
                  to={"/profiles/" + profile.profile_tag}
                  onClick={() => setSearchProfiles("")}
                  className="filtered-profile"
                >
                  <ProfileSearchResult key={profile.id} profile={profile} />
                </Link>
              ))}
          </div>
        </div>
        <Link to="/" className="nav-link">
          <span>Home</span>
        </Link>
        {session ? (
          <Link to={"/profiles/" + profileTag} className="nav-link">
            <span>Profile</span>
          </Link>
        ) : (
          ""
        )}
        {session ? (
          <Link to="/settings" className="nav-link">
            <span>Settings</span>
          </Link>
        ) : (
          <Link to="/signin" className="nav-link">
            <span>Log in</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
