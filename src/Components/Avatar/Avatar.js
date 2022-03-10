import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Avatar({
  url,
  size,
  onUpload,
  isReadOnly,
  height,
  width,
}) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event) {
    if (isReadOnly) return;
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="display: flex justify-center flex-col items-center">
      <img
        src={
          avatarUrl ? avatarUrl : process.env.PUBLIC_URL + "/default-avatar.jpg"
        }
        alt="Avatar"
        className="inline-block rounded-full ring-2 ring-white"
        style={{
          height: height,
          width: width,
          borderRadius: "50%",
        }}
      />
      {!isReadOnly && (
        <div style={{ width: size }}>
          <label
            className="upload-btn text-white display: flex justify-center items-center text-sm rounded-lg border-[2px] border-white mt-3 p-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            htmlFor="single"
          >
            <b>
              {uploading ? (
                "Uploading ..."
              ) : (
                <div className="display: flex items-center justify-center">
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>{" "}
                  Upload
                </div>
              )}
            </b>
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
