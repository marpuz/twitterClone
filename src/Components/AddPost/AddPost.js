import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Avatar from "../Avatar/Avatar";

const AddPost = (session) => {
  const [avatar_url, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [content, setContent] = useState("");
  const [addPost, setAddPost] = useState(false);
  const user = supabase.auth.user();

  useEffect(() => {
    getProfile();
  }, [session, addPost]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, about_me`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddPost = async (content) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .insert([{ content: content, user_id: user.id }]);
      window.location.reload();
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
      setContent("");
    }
  };

  return (
    <div className="grid grid-cols-6 bg-gray-900 m-4 p-2 rounded-md">
      <div className="col-span-1 ml-7 m-2  h-10 w-10">
        <Avatar
          url={avatar_url}
          isReadOnly={true}
          width={"40px"}
          height={"40px"}
        />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddPost(content);
        }}
        className="col-span-5 p-2 pr-7"
      >
        <input
          type="text"
          placeholder={
            loading ? "Loadnig..." : "What`s goin on " + username + "?"
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded-lg border-[1px] border-gray-600 bg-gray-900 w-full pl-2 text-slate-400 p-2"
        />
      </form>
    </div>
  );
};

export default AddPost;
