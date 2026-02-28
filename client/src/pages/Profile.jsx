import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'



export default function Profile() {
  const fileRef = useRef(null);

  const { currentUser } = useSelector(state => state.user)

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});


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


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input
          type="file"
          ref={fileRef}
          hidden accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
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
          id='username'
          className='border p-3 rounded-lg'
        />

        <input
          type="email"
          placeholder='email'
          id='email'
          className='border p-3 rounded-lg'
        />

        <input
          type="password"
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
        />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>

      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>

      </div>
    </div>
  )
}
