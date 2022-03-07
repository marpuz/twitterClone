import "./Home.css";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Post from "../../Components/Post/Post";
import AddPost from "../../Components/AddPost/AddPost";
import LoadingIcon from "../../Components/LoadingIcon/LoadingIcon";
import { useHistory } from "react-router-dom";

const Home = () => {
  const session = supabase.auth.session();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const user = supabase.auth.user();
  const history = useHistory();

  useEffect(() => {
    getPosts();
  }, [session]);

  async function getPosts() {
    if (!session) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Followers")
        .select(
          "*, profiles!inner(*, posts!inner(*, profiles:user_id (username, avatar_url, profile_tag)))"
        )
        .eq("followedBy", user.id);

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(
          data
            .flatMap((data) => data.profiles.posts)
            .sort((a, b) => b.post_id - a.post_id)
        );
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {session ? (
        <div className="home-container">
          <div className="post-input">
            <AddPost session={session} />
          </div>
          <div className="posts">
            {loading ? (
              <div className="loading-icon">
                <LoadingIcon />
              </div>
            ) : (
              posts &&
              posts.map((post) => <Post key={post.post_id} post={post} />)
            )}
          </div>
        </div>
      ) : (
        <div className="home-container">
          <h1>You must be logged in</h1>
          {history.push("/signin")}
        </div>
      )}
    </div>
  );
};

export default Home;
