import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../supabase";
import { 
  deleteUserFaiure,
  deleteUserStart,
  deleteUserSuccess,
  signInFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure, 
  updateUserStart, 
  updateUserSuccess 
} from "../redux/user/userSlice";
import {Link} from "react-router-dom"

export const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  
  // Destructure error and loading from Redux state
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError,setShowListingsError] = useState(false);
  const [userListings,setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    setFileUploadError(false);
    setUpdateSuccess(false);
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

      // Using functional update to prevent losing text input data
      setFormData((prev) => ({ ...prev, avatar: urlData.publicUrl }));
      setUploading(false);
    } catch (error) {
      setFileUploadError(true);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);
      
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async() =>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFaiure(data.message));
        return; 
      }

      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFaiure(error.message));
    }
  }

  const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    
    const res = await fetch('/api/auth/signout');
    const data = await res.json();

    if (data.success === false) {
      dispatch(signInFailure(data.message)); 
      return;
    }
    
    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};

const handleShowListings = async(e) => {
  try {
    setShowListingsError(false);
    const res = await fetch(`/api/user/listings/${currentUser._id}`);
    const data =await res.json()
    if(data.success === false){
      setShowListingsError(true);
      return;
    }
    setUserListings(data);
  } catch (error) {
    setShowListingsError(true);
  }
}

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <div className="h-6 self-center">
          {fileUploadError ? (
            <span className="text-sm text-red-700">
              Error Uploading Image (Check Supabase Policies)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-sm text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 && uploading ? (
            <span className="text-sm text-green-700">
              Image uploaded successfully!
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
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading || uploading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      {/* ERROR AND SUCCESS MESSAGES */}
      <div className="mt-5">
        {error && <p className="text-red-700 text-center">{error}</p>}
        {updateSuccess && (
          <p className="text-green-700 text-center">User updated successfully!</p>
        )}
      </div>

      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingsError ? 'Error showing Listings' : ''}</p>

      {userListings && userListings.length > 0 && 
      <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 my-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing)=>(
          <div key={listing._id} className="gap-4 border rounded-lg p-3 flex justify-between items-center"> 
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain"/>
              </Link>
              <Link className="text-slate-700 font-semibold  hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
        </div>
      ))}  
      </div>}
    </div>
  );
};