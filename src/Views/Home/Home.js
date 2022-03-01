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

  // async function getFollowers() {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from("Followers")
  //       .select(`*`)
  //       .eq("followedBy", user.id);

  //     if (error) {
  //       throw error;
  //     }

  //     if (data) {
  //       setFollowers(data);
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function getPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles!inner(*, Followers!inner(*))")
        .eq("Followers.followedUser", user.id);

      if (error) {
        throw error;
      }

      if (data) {
        setPosts(data.sort((a, b) => a - b));
        console.log(data);
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
        "You must log in"
      )}
    </div>
  );
};

export default Home;
