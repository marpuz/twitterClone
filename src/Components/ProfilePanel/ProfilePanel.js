import Avatar from "../Avatar/Avatar";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import ProfileSearchResult from "../ProfileSearchResult/ProfileSearchResult";
import "./ProfilePanel.css";

const ProfilePanel = ({ profile }) => {
  const [searchProfiles, setSearchProfiles] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const session = supabase.auth.session();

  useEffect(() => {
    getFilteredProfiles();
  }, [searchProfiles]);

  const updateSearch = (e) => setSearchProfiles(e?.target?.value);
  const debouncedOnChange = debounce(updateSearch, 180);

  async function getFilteredProfiles() {
    try {
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
    }
  }

  return (
    <div className="profile-panel-container">
      {profile ? (
        <div>
          <div>
            <Link to={`/profiles/${profile.profile_tag}`}>
              <div className="profile-panel-avatar">
                <Avatar url={profile.avatar_url} isReadOnly={true} />
              </div>
            </Link>
            <div>
              <p>{profile.username}</p>
              <p>@{profile.profile_tag}</p>
            </div>
            <div className="profile-panel-navigation">
              <Link to="/" className="nav-link">
                <span>Home</span>
              </Link>
              <Link to="/settings" className="nav-link">
                <span>Settings</span>
              </Link>
              <div className="search-bar">
                <input
                  className="search-bar-input"
                  placeholder="Search profile..."
                  onChange={debouncedOnChange}
                />
                <div className="filtered-profiles">
                  {filteredProfiles &&
                    filteredProfiles.map((filteredProfile) => (
                      <Link
                        to={"/profiles/" + filteredProfile.profile_tag}
                        onClick={() => setSearchProfiles("")}
                        className="filtered-profile"
                      >
                        <ProfileSearchResult
                          key={filteredProfile.id}
                          profile={filteredProfile}
                        />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        "Somethings gone wrong"
      )}
    </div>
  );
};

export default ProfilePanel;
