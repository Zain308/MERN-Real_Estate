import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../supabase";

export const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false); // Added to track active upload

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    setFileUploadError(false);
    setFilePerc(0);

    try {
      const fileName = new Date().getTime() + "_" + file.name;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setFilePerc(Math.round(percentage));
          },
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar: urlData.publicUrl });

      // Keep the "100%" or "Success" message visible for 3 seconds
      setTimeout(() => {
        setUploading(false);
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error.message);
      setFileUploadError(true);
      setUploading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-slate-200"
        />

        {/* Improved Progress/Status UI */}
        <div className="h-6 self-center">
          {fileUploadError ? (
            <span className="text-sm text-red-700">
              Error Uploading Image (Check Supabase Policies)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-sm text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 && uploading ? (
            <span className="text-sm text-green-700">
              Image successfully uploaded!
            </span>
          ) : (
            ""
          )}
        </div>

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button
          disabled={uploading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {uploading ? "Uploading..." : "Update Profile"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};
