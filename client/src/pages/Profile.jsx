import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState } from 'react'
import { Link } from "react-router-dom";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const handleFileUpload = async (file) => {
    try {
      setFileUploadError(false);
      setFilePerc(0);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "smartProperty");
      data.append("cloud_name", "dyeicallf");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyeicallf/image/upload",
        { method: "POST", body: data }
      );
      const uploadData = await res.json();
      setFilePerc(100);
      const newAvatar = uploadData.secure_url;

      setFormData((prev) => ({ ...prev, avatar: newAvatar }));

      dispatch(updateUserStart());
      const updateRes = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: newAvatar }),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        dispatch(updateUserFailure(updateData.message));
        return;
      }
      dispatch(updateUserSuccess(updateData));

    } catch (error) {
      setFileUploadError(true);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (!res.ok) { dispatch(updateUserFailure(data.message)); return }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', { method: 'POST' });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {

    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) { setShowListingsError(true); return; }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true, error.message);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>


      <div className='w-full bg-[#0d1b2a] relative overflow-hidden'>

        <div className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent'></div>

        <div className='absolute -top-20 -right-20 w-72 h-72 bg-amber-500 opacity-[0.04] rounded-full'></div>
        <div className='absolute -bottom-10 left-1/3 w-48 h-48 bg-amber-400 opacity-[0.03] rounded-full'></div>

        <div className='absolute inset-0 opacity-[0.03]'
          style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className='max-w-5xl mx-auto px-8 py-14 relative z-10'>
          <div className='flex flex-col sm:flex-row items-center sm:items-end gap-7'>

            <div className='relative shrink-0'>
              <input
                type="file" ref={fileRef} hidden accept='image/*'
                onChange={(e) => { const file = e.target.files[0]; if (file) handleFileUpload(file); }}
              />

              <div className='absolute -inset-1 rounded-full bg-linear-to-br from-amber-400 to-amber-600 opacity-30 blur-sm'></div>
              <img
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className='relative rounded-full h-28 w-28 object-cover cursor-pointer ring-2 ring-amber-500/40 hover:ring-amber-400 transition-all duration-300'
                onClick={() => fileRef.current.click()}
              />

              <button
                type='button'
                onClick={() => fileRef.current.click()}
                className='absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-lg ring-2 ring-[#0d1b2a]'
              >
                ✎
              </button>
            </div>

            {/* User details */}
            <div className='text-center sm:text-left sm:pb-1'>
              <div className='flex items-center justify-center sm:justify-start gap-2 mb-2'>
                <div className='h-px w-5 bg-amber-500'></div>
              </div>
              <h1 className='text-3xl lg:text-4xl font-bold text-white leading-tight mb-1'>
                {currentUser.username}
              </h1>
              <p className='text-slate-400 text-sm'>{currentUser.email}</p>
            </div>
          </div>


          {(fileUploadError || (filePerc > 0 && filePerc <= 100)) && (
            <div className={`mt-6 px-5 py-3 rounded-lg text-sm font-medium flex items-center gap-3 max-w-md
              ${fileUploadError
                ? 'bg-red-900/30 border border-red-500/30 text-red-400'
                : filePerc === 100
                  ? 'bg-green-900/30 border border-green-500/30 text-green-400'
                  : 'bg-amber-900/30 border border-amber-500/30 text-amber-400'}`}>
              <span>{fileUploadError ? '✕' : filePerc === 100 ? '✓' : '⟳'}</span>
              <span>
                {fileUploadError
                  ? 'Upload failed — image must be under 2MB'
                  : filePerc < 100
                    ? `Uploading photo... ${filePerc}%`
                    : 'Photo updated successfully!'}
              </span>
            </div>
          )}
        </div>
      </div>


      <div className='w-full bg-white border-b border-slate-100 shadow-sm'>
        <div className='max-w-5xl mx-auto px-8'>
          <div className='flex gap-0'>
            <div className='text-xs font-bold tracking-widest uppercase text-amber-600 border-b-2 border-amber-500 py-4 px-1 mr-8'>
              Profile
            </div>
          </div>
        </div>
      </div>


      <div className='max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8'>

        <div className='lg:col-span-2 flex flex-col gap-6'>

          <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
            <div className='px-8 py-5 border-b border-slate-100 flex items-center gap-3'>
              <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
              <h2 className='text-sm font-bold text-slate-800 tracking-wide'>Personal Information</h2>
            </div>

            <form className='px-8 py-7 flex flex-col gap-6' onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>Username</label>
                  <input
                    type="text" placeholder='Username'
                    defaultValue={currentUser.username} id='username'
                    className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                    onChange={handleChange}
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>Email Address</label>
                  <input
                    type="email" placeholder='Email'
                    defaultValue={currentUser.email} id='email'
                    className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>New Password</label>
                <input
                  type="password" placeholder='Leave blank to keep current password'
                  id='password'
                  className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                  onChange={handleChange}
                />
                <p className='text-xs text-slate-400 mt-0.5'>Use 8+ characters with a mix of letters & numbers</p>
              </div>

              {/* Messages */}
              {updateSuccess && (
                <div className='bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 flex items-center gap-3'>
                  <span className='text-green-500 text-base'>✓</span>
                  <p className='text-green-700 text-sm font-medium'>Profile updated successfully</p>
                </div>
              )}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 flex items-center gap-3'>
                  <span className='text-red-400 text-base'>✕</span>
                  <p className='text-red-600 text-sm font-medium'>{error}</p>
                </div>
              )}

              <div className='flex items-center justify-between pt-1 border-t border-slate-100'>
                <p className='text-xs text-slate-400'>Last updated today</p>
                <button
                  disabled={loading}
                  className='bg-[#0d1b2a] hover:bg-slate-700 text-white text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 min-w-35'
                >
                  {loading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg className='animate-spin h-3.5 w-3.5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone card */}
          <div className='bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden'>
            <div className='px-8 py-5 border-b border-red-50 flex items-center gap-3'>
              <div className='w-1 h-5 bg-red-400 rounded-full'></div>
              <h2 className='text-sm font-bold text-slate-800 tracking-wide'>Danger Zone</h2>
            </div>
            <div className='px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <p className='text-sm font-semibold text-slate-700 mb-0.5'>Delete this account</p>
                <p className='text-xs text-slate-400'>Permanently remove your account and all your data. This cannot be undone.</p>
              </div>
              <button
                onClick={handleDelete}
                className='shrink-0 border border-red-200 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all duration-200'
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>


        <div className='flex flex-col gap-5'>

          {/* Create Listing CTA */}
          <div className='bg-[#0d1b2a] rounded-2xl overflow-hidden relative'>
            <div className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent'></div>
            <div className='absolute -bottom-8 -right-8 w-32 h-32 bg-amber-500 opacity-5 rounded-full'></div>
            <div className='p-7 relative z-10'>
              <p className='text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-4 flex items-center gap-2'>
                <span className='h-px w-4 bg-amber-500'></span>
                New Listing
              </p>
              <h3 className='text-white font-bold text-lg leading-snug mb-2'>List Your Property</h3>
              <p className='text-slate-400 text-xs leading-relaxed mb-6'>
                Reach thousands of buyers and renters. Create your listing in minutes.
              </p>
              <Link to='/create-listing'>
                <span className='block w-full text-center bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl transition-colors duration-200'>
                  + Create Listing
                </span>
              </Link>
            </div>
          </div>

          {/* View Listings */}
          <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
            <div className='px-6 py-5 border-b border-slate-100 flex items-center gap-3'>
              <div className='w-1 h-5 bg-slate-300 rounded-full'></div>
              <h3 className='text-sm font-bold text-slate-700'>My Listings</h3>
            </div>
            <div className='p-5'>
              <p className='text-xs text-slate-400 mb-4'>
                {userListings.length > 0
                  ? `You have ${userListings.length} active ${userListings.length === 1 ? 'listing' : 'listings'}.`
                  : 'You have no listings yet. Create one to get started.'}
              </p>
              <button
                onClick={handleShowListings}
                className='w-full border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-600 hover:text-amber-700 font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all duration-200'
              >
                View Listings
              </button>
              {showListingsError && (
                <p className='text-red-500 text-xs mt-3'>Could not load listings. Please try again.</p>
              )}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignout}
            className='w-full bg-white border border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-800 font-bold text-xs tracking-widest uppercase py-3.5 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2'
          >
            <span>←</span> Sign Out
          </button>

        </div>
      </div>


      {userListings && userListings.length > 0 && (
        <div className='max-w-5xl mx-auto px-8 pb-20'>
          <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>

            {/* Header */}
            <div className='px-8 py-6 border-b border-slate-100 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-1 h-6 bg-amber-500 rounded-full'></div>
                <div>
                  <p className='text-xs font-bold tracking-widest uppercase text-amber-500 mb-0.5'>My Properties</p>
                  <h2 className='text-base font-bold text-slate-800'>Your Listings</h2>
                </div>
              </div>
              <div className='bg-[#0d1b2a] text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full'>
                {userListings.length} {userListings.length === 1 ? 'listing' : 'listings'}
              </div>
            </div>

            {/* Listing rows */}
            <div className='divide-y divide-slate-50'>
              {userListings.map((listing, index) => (
                <div
                  key={listing._id}
                  className='flex items-center gap-5 px-8 py-5 hover:bg-slate-50/80 transition-colors duration-150 group'
                >
                  {/* Index number */}
                  <span className='text-xs font-bold text-slate-200 w-5 text-center shrink-0 group-hover:text-amber-300 transition-colors duration-200'>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Thumbnail */}
                  <Link to={`/listing/${listing._id}`} className='shrink-0'>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-16 w-24 object-cover rounded-xl border border-slate-100 group-hover:border-amber-200 transition-all duration-200 group-hover:shadow-md'
                    />
                  </Link>

                  {/* Info */}
                  <Link to={`/listing/${listing._id}`} className='flex-1 min-w-0'>
                    <p className='text-slate-800 font-semibold text-sm truncate group-hover:text-amber-600 transition-colors duration-200 mb-0.5'>
                      {listing.name}
                    </p>
                    <p className='text-slate-400 text-xs truncate'>{listing.address}</p>
                  </Link>

                  {/* Type badge */}
                  <span className={`hidden sm:block shrink-0 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full
                    ${listing.type === 'rent'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-green-50 text-green-600 border border-green-200'}`}>
                    {listing.type}
                  </span>

                  {/* Actions */}
                  <div className='flex items-center gap-2 shrink-0'>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-amber-600 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 px-4 py-2 rounded-lg transition-all duration-200'>
                        Edit
                      </button>
                    </Link>
                    <button
                      className='text-xs font-bold tracking-widest uppercase text-slate-300 hover:text-red-500 border border-slate-200 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200'
                      onClick={() => handleListingDelete(listing._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className='px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between'>
              <p className='text-xs text-slate-400'>{userListings.length} total {userListings.length === 1 ? 'property' : 'properties'}</p>
              <Link to='/create-listing' className='text-xs font-bold tracking-widest uppercase text-amber-500 hover:text-amber-600 transition-colors duration-200'>
                + Add New
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}