import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector(state => state.user)
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('searchTerm') || '';
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // Helper to detect active route for nav links
  const isActive = (path) => location.pathname === path;

  return (
    <header className='bg-[#0d1b2a] shadow-lg sticky top-0 z-50'>

      {/* Gold top accent line */}
      <div className='h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent w-full'></div>

      <div className='flex justify-between items-center max-w-6xl mx-auto px-6 py-4 gap-4'>

        {/* ── LOGO ── */}
        <Link to='/'>
          <h1 className='font-bold text-lg sm:text-xl flex items-center gap-0.5 tracking-tight'>
            <span className='text-slate-400'>smart</span>
            <span className='text-amber-400'>Property</span>
          </h1>
        </Link>

        {/* ── SEARCH BAR ── */}
        <form
          onSubmit={handleSubmit}
          className='flex items-center bg-slate-800 border border-slate-700 hover:border-amber-500/50 focus-within:border-amber-500 transition-colors duration-200 rounded-lg px-4 py-2 gap-3 flex-1 max-w-sm'
        >
          <input
            type='text'
            placeholder='Search properties...'
            className='bg-transparent focus:outline-none w-full text-sm text-slate-200 placeholder-slate-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='text-slate-400 hover:text-amber-400 transition-colors duration-200 flex-shrink-0'>
            <FaSearch className='text-sm' />
          </button>
        </form>

        {/* ── NAV LINKS ── */}
        <ul className='flex items-center gap-1'>
          <Link to='/'>
            <li className={`hidden sm:inline-block text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
              ${isActive('/')
                ? 'text-amber-400 bg-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className={`hidden sm:inline-block text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
              ${isActive('/about')
                ? 'text-amber-400 bg-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              About
            </li>
          </Link>

          {/* Profile / Sign In */}
          <Link to='/profile'>
            {currentUser ? (
              <div className='ml-2 flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-amber-500/50 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer'>
                <img
                  className='rounded-full h-7 w-7 object-cover ring-2 ring-amber-500/30'
                  src={currentUser.avatar}
                  alt='profile'
                />
                <span className='hidden sm:block text-sm text-slate-300 font-medium max-w-20 truncate'>
                  {currentUser.username}
                </span>
              </div>
            ) : (
              <li className='ml-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold tracking-widest uppercase px-5 py-2 transition-colors duration-200 cursor-pointer list-none rounded-lg'>
                Sign In
              </li>
            )}
          </Link>
        </ul>

      </div>
    </header>
  )
}