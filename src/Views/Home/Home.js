import "./Home.css";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Post from "../../Components/Post/Post";
import AddPost from "../../Components/AddPost/AddPost";

const Home = () => {
  const session = supabase.auth.session();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const user = supabase.auth.user();

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
          <AddPost session={session} />
          <div className="posts">
            {loading
              ? "Loading..."
              : posts &&
                posts.map((post) => <Post key={post.post_id} post={post} />)}
          </div>
        </div>
      ) : (
        <div className="home-container">
          <h1>You must be logged in</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
