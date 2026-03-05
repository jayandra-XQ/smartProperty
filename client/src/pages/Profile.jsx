import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState } from 'react'


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
        {
          method: "POST",
          body: data,
        }
      );
      const uploadData = await res.json();
      setFilePerc(100);
      setFormData((prev) => ({
        ...prev,
        avatar: uploadData.secure_url,
      }));

    } catch (error) {
      setFileUploadError(true);
      error.response && console.log(error.response.data);
    }
  };




  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return
      };

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
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true, error.message);
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden accept='image/*'
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) handleFileUpload(file);
          }}
        />


        <img src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
        />

        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>


        <input
          type="text"
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder='email'
          defaultValue={currentUser.email}
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>

        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}>
          Create Listing
        </Link>

      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignout}>Sign out</span>

      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'> {updateSuccess ? 'User is update successfully' : ''} </p>

      <button onClick={handleShowListings} className='text-green-700 w-full '>Show Listings</button>

      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>


      {userListings && userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>

          {userListings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center ">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='listing cover'
                  className='h-16 w-16 object-contain '
                />
              </Link>

              <Link to={`/listing/${listing._id}`} className='flex-1 text-slate-700 font-semibold hover:underline truncate gap-4'>
                <p >{listing.name}</p>
              </Link>


              <div className="flex flex-col items-center gap-2">
                <button className='text-red-700 uppercase' >Delete</button>
                <button className='text-green-700 uppercase' >Edit</button>

              </div>
            </div>
          ))}

        </div>
      }

    </div>
  )
}
