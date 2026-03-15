import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return;
      }
      setLoading(false);
      setError(null)
      navigate('/sign-in')
      console.log(data)
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16'>
      <div className='w-full max-w-md'>

        {/* Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>

          {/* Card Header */}
          <div className='bg-slate-800 px-8 py-8 text-center'>
            <p className='text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2'>
              Get Started
            </p>
            <h1 className='text-3xl font-bold text-white'>Create Account</h1>
            <p className='text-slate-400 text-sm mt-2'>
              Join thousands finding their perfect home
            </p>
          </div>

          {/* Card Body */}
          <div className='px-8 py-8'>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>

              {/* Username */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold tracking-widest uppercase text-slate-500'>
                  Username
                </label>
                <input
                  className='border border-slate-200 bg-slate-50 p-3 rounded-lg text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                  type='text'
                  placeholder='Choose a username'
                  id='username'
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold tracking-widest uppercase text-slate-500'>
                  Email Address
                </label>
                <input
                  className='border border-slate-200 bg-slate-50 p-3 rounded-lg text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                  type='email'
                  placeholder='you@example.com'
                  id='email'
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold tracking-widest uppercase text-slate-500'>
                  Password
                </label>
                <input
                  className='border border-slate-200 bg-slate-50 p-3 rounded-lg text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                  type='password'
                  placeholder='Create a strong password'
                  id='password'
                  onChange={handleChange}
                />
              </div>

              {/* Error */}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
                  <p className='text-red-600 text-sm font-medium'>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                disabled={loading}
                className='w-full bg-slate-800 text-white py-3 rounded-lg text-sm font-semibold tracking-wide uppercase hover:bg-slate-700 active:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 mt-1'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>

              {/* Divider */}
              <div className='flex items-center gap-3 my-1'>
                <div className='flex-1 h-px bg-slate-100'></div>
                <span className='text-xs text-slate-400 font-medium'>or continue with</span>
                <div className='flex-1 h-px bg-slate-100'></div>
              </div>

              <OAuth />

            </form>

            {/* Footer */}
            <div className='flex items-center justify-center gap-2 mt-6 pt-6 border-t border-slate-100'>
              <p className='text-sm text-slate-500'>Already have an account?</p>
              <Link to='/sign-in' className='text-sm font-semibold text-amber-600 hover:underline underline-offset-4'>
                Sign in
              </Link>
            </div>

          </div>
        </div>

        {/* Below card note */}
        <p className='text-center text-xs text-slate-400 mt-6'>
          By creating an account, you agree to smartProperty's terms & privacy policy.
        </p>

      </div>
    </div>
  )
}