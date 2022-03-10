import Avatar from "../Avatar/Avatar";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import ProfileSearchResult from "../ProfileSearchResult/ProfileSearchResult";
import LoadingIcon from "../../Components/LoadingIcon/LoadingIcon";

const ProfilePanel = ({ profile }) => {
  const [searchProfiles, setSearchProfiles] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    getFilteredProfiles();
  }, [searchProfiles]);

  const updateSearch = (e) => setSearchProfiles(e?.target?.value);
  const debouncedOnChange = debounce(updateSearch, 180);

  async function getFilteredProfiles() {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, website, avatar_url, about_me, profile_tag`)
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

  return (
    <div className="profile-panel-container p-2 text-slate-400 mt-[.5em]">
      {profile ? (
        <div>
          <div>
            <Link to={`/profiles/${profile.profile_tag}`}>
              <div className="profile-panel-avatar ml-1">
                <Avatar
                  url={profile.avatar_url}
                  isReadOnly={true}
                  height={"80px"}
                  width={"80px"}
                />
              </div>
            </Link>
            <div className="m-1">
              <b>
                <p className="text-lg">{profile.username}</p>
              </b>
              <p className="text-sm">@{profile.profile_tag}</p>
            </div>
            <div className="profile-panel-navigation">
              <Link to="/" className="nav-link">
                <span className="display: flex m-1 mt-[1em]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <b>Home</b>
                </span>
              </Link>
              <Link to="/settings" className="nav-link">
                <span className="display: flex m-1 mt-[1em]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <b>Settings</b>
                </span>
              </Link>
              <div className="search-bar">
                <input
                  placeholder="Search profile..."
                  onChange={debouncedOnChange}
                  className="rounded-lg border-[1px] border-gray-600 w-full pl-2 ml-1 bg-gray-900 p-2 m-[.5em]"
                />
                {loading ? (
                  <div className="loading-icon display: flex justify-center items-center">
                    <LoadingIcon />
                  </div>
                ) : (
                  <div className="filtered-profiles display: flex flex-col ml-1 w-full bg-gray-900 rounded-md">
                    {filteredProfiles.length !== 0 &&
                      filteredProfiles.map((filteredProfile) => (
                        <Link
                          to={"/profiles/" + filteredProfile.profile_tag}
                          onClick={(e) => setSearchProfiles("")}
                          className="filtered-profile"
                        >
                          <ProfileSearchResult
                            key={filteredProfile.id}
                            profile={filteredProfile}
                          />
                        </Link>
                      ))}
                  </div>
                )}
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
