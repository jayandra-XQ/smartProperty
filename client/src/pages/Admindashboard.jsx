import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminDashboard() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');


  const [modal, setModal] = useState({ open: false, id: null, type: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) { console.log(error); }
      finally { setLoadingStats(false); }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=100');
        const data = await res.json();
        setListings(data);
      } catch (error) { console.log(error); }
      finally { setLoadingListings(false); }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) { console.log(error); }
      finally { setLoadingUsers(false); }
    };
    fetchUsers();
  }, []);


  const deleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) return;
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (error) { console.log(error); }
  };


  const handleConfirm = async () => {
    setDeleting(true);
    if (modal.type === 'listing') await deleteListing(modal.id);
    setDeleting(false);
    setModal({ open: false, id: null, type: '' });
  };

  const statCards = stats ? [
    { label: 'Total Listings', value: stats.totalListings, icon: '🏡', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-200/50', text: 'text-amber-600' },
    { label: 'For Rent', value: stats.rentListings, icon: '🔑', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-200/50', text: 'text-blue-600' },
    { label: 'For Sale', value: stats.saleListings, icon: '🏷️', bg: 'from-green-500/10 to-green-500/5', border: 'border-green-200/50', text: 'text-green-600' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-200/50', text: 'text-purple-600' },
    { label: 'With Offers', value: stats.offerListings, icon: '✦', bg: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-200/50', text: 'text-rose-600' },
    { label: 'Admins', value: stats.adminUsers, icon: '🛡️', bg: 'from-slate-500/10 to-slate-500/5', border: 'border-slate-200/50', text: 'text-slate-600' },
  ] : [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'listings', label: 'Listings', icon: '⊞', count: listings.length },
    { id: 'users', label: 'Users', icon: '◎', count: users.length },
  ];

  return (
    <div className='min-h-screen' style={{ background: '#f0f2f5' }}>


      <div className='fixed top-0 left-0 h-full w-64 bg-[#0d1b2a] z-20 hidden lg:flex flex-col'>
        <div className='absolute top-0 left-0 right-0'
          style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}></div>
        <div className='absolute inset-0 opacity-[0.03]' style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}></div>

        {/* Logo */}
        <div className='relative z-10 px-6 py-8 border-b border-slate-700/50'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xs font-black'>S</div>
            <span className='text-white font-bold text-base'>smartProperty</span>
          </div>
          <p className='text-xs text-slate-500 tracking-widest uppercase mt-1'>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className='relative z-10 flex-1 px-4 py-6 flex flex-col gap-1'>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <div className='flex items-center gap-3'>
                <span className='text-base'>{tab.icon}</span>
                <span className='text-xs font-bold tracking-widest uppercase'>{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                  ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>


        <div className='relative z-10 px-4 py-6 border-t border-slate-700/50 flex flex-col gap-2'>
          <Link to='/create-listing'
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white transition-colors duration-200'>
            <span>+</span>
            <span className='text-xs font-bold tracking-widest uppercase'>New Listing</span>
          </Link>
          <Link to='/'
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200'>
            <span>←</span>
            <span className='text-xs font-bold uppercase'>Back to Site</span>
          </Link>
        </div>

        <div className='relative z-10 px-4 pb-6'>
          <div className='flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-700/50'>
            <img src={currentUser?.avatar} alt='' className='w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/30 shrink-0' />
            <div className='min-w-0 flex-1'>
              <p className='text-white text-xs font-bold truncate'>{currentUser?.username}</p>
              <p className='text-amber-500 text-xs font-bold'>Admin</p>
            </div>
          </div>
        </div>
      </div>


      <div className='lg:ml-64'>

        <div className='bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm'>
          <div>
            <p className='text-xs font-bold tracking-widest uppercase text-slate-400 mb-0.5'>
              {tabs.find(t => t.id === activeTab)?.label}
            </p>
            <h1 className='text-xl font-bold text-slate-800'>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'listings' && 'All Listings'}
              {activeTab === 'users' && 'All Users'}
            </h1>
          </div>

          {/* Mobile tabs */}
          <div className='flex lg:hidden gap-1'>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200
                  ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className='hidden lg:flex items-center gap-3'>
            <div className='flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2'>
              <div className='w-2 h-2 rounded-full bg-green-400'></div>
              <span className='text-xs font-bold text-slate-600'>System Online</span>
            </div>
          </div>
        </div>

        <div className='p-8'>


          {activeTab === 'overview' && (
            <div className='flex flex-col gap-8'>

              {/* Stat cards */}
              <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4'>
                {loadingStats ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className='bg-white rounded-2xl border border-slate-200 p-5 animate-pulse'>
                      <div className='h-10 w-10 bg-slate-100 rounded-xl mb-4'></div>
                      <div className='h-7 w-10 bg-slate-100 rounded mb-2'></div>
                      <div className='h-3 w-16 bg-slate-50 rounded'></div>
                    </div>
                  ))
                ) : statCards.map((card) => (
                  <div key={card.label}
                    className={`bg-white rounded-2xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden`}>
                    <div
                      className='absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6'
                      style={{ background: `linear-gradient(225deg, ${card.bg.includes('amber') ? 'rgba(245,158,11,0.1)' : card.bg.includes('blue') ? 'rgba(59,130,246,0.1)' : card.bg.includes('green') ? 'rgba(34,197,94,0.1)' : card.bg.includes('purple') ? 'rgba(168,85,247,0.1)' : card.bg.includes('rose') ? 'rgba(244,63,94,0.1)' : 'rgba(100,116,139,0.1)'}, transparent)` }}
                    ></div>
                    <div className='relative z-10 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 bg-slate-50'>
                      {card.icon}
                    </div>
                    <p className='relative z-10 text-3xl font-black text-slate-800 mb-1'>{card.value}</p>
                    <p className={`relative z-10 text-xs font-bold uppercase tracking-widest ${card.text}`}>{card.label}</p>
                  </div>
                ))}
              </div>


              <div className='rounded-2xl overflow-hidden relative'
                style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2d42 100%)' }}>
                <div className='absolute top-0 left-0 right-0'
                  style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}></div>
                <div className='absolute -right-10 -top-10 w-48 h-48 bg-amber-500 opacity-5 rounded-full'></div>
                <div className='px-8 py-7 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                  <div>
                    <p className='text-xs font-bold tracking-widest uppercase text-amber-500 mb-2 flex items-center gap-2'>
                      <span className='h-px w-4 bg-amber-500 inline-block'></span>
                      Welcome Back
                    </p>
                    <h2 className='text-2xl font-bold text-white mb-1'>{currentUser?.username} 👋</h2>
                    <p className='text-slate-400 text-sm'>
                      You have <span className='text-amber-400 font-bold'>{listings.length} listings</span> and{' '}
                      <span className='text-amber-400 font-bold'>{users.length} users</span> on the platform.
                    </p>
                  </div>
                  <Link to='/create-listing'
                    className='shrink-0 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs tracking-widest uppercase px-6 py-3.5 rounded-xl transition-colors duration-200'>
                    + Create Listing
                  </Link>
                </div>
              </div>


              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>


                <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
                  <div className='px-6 py-4 border-b border-slate-100 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                      <h2 className='text-sm font-bold text-slate-800'>Recent Listings</h2>
                    </div>
                    <button onClick={() => setActiveTab('listings')}
                      className='text-xs font-bold tracking-widest uppercase text-amber-500 hover:text-amber-600 transition-colors duration-200'>
                      View All →
                    </button>
                  </div>
                  <div className='divide-y divide-slate-50'>
                    {listings.slice(0, 5).map((listing) => (
                      <div key={listing._id} className='flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors duration-150 group'>
                        <img src={listing.imageUrls[0]} alt=''
                          className='w-12 h-10 object-cover rounded-lg shrink-0 border border-slate-100 group-hover:border-amber-200 transition-colors duration-200' />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-semibold text-slate-700 truncate group-hover:text-amber-600 transition-colors duration-200'>{listing.name}</p>
                          <p className='text-xs text-slate-400 truncate mt-0.5'>{listing.address}</p>
                        </div>
                        <div className='flex flex-col items-end gap-1 shrink-0'>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                            ${listing.type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {listing.type}
                          </span>
                          <p className='text-xs font-bold text-slate-600'>
                            ${listing.offer
                              ? listing.discountPrice.toLocaleString('en-US')
                              : listing.regularPrice.toLocaleString('en-US')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {listings.length === 0 && !loadingListings && (
                      <div className='py-10 text-center'>
                        <p className='text-3xl mb-2'>🏡</p>
                        <p className='text-slate-400 text-sm'>No listings yet</p>
                      </div>
                    )}
                  </div>
                </div>


                <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
                  <div className='px-6 py-4 border-b border-slate-100 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                      <h2 className='text-sm font-bold text-slate-800'>Recent Users</h2>
                    </div>
                    <button onClick={() => setActiveTab('users')}
                      className='text-xs font-bold tracking-widest uppercase text-amber-500 hover:text-amber-600 transition-colors duration-200'>
                      View All →
                    </button>
                  </div>
                  <div className='divide-y divide-slate-50'>
                    {users.slice(0, 5).map((user) => (
                      <div key={user._id} className='flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors duration-150 group'>
                        <img src={user.avatar} alt=''
                          className='w-9 h-9 rounded-full object-cover shrink-0 border-2 border-slate-100 group-hover:border-amber-200 transition-colors duration-200' />
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2'>
                            <p className='text-sm font-semibold text-slate-700 truncate'>{user.username}</p>
                            {user.role === 'admin' && (
                              <span className='text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white shrink-0'>Admin</span>
                            )}
                          </div>
                          <p className='text-xs text-slate-400 truncate mt-0.5'>{user.email}</p>
                        </div>
                        <p className='text-xs text-slate-400 shrink-0'>
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                    {users.length === 0 && !loadingUsers && (
                      <div className='py-10 text-center'>
                        <p className='text-slate-400 text-sm'>No users found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
              <div className='px-8 py-5 border-b border-slate-100 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                  <h2 className='text-sm font-bold text-slate-800'>All Listings</h2>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='bg-[#0d1b2a] text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full'>
                    {listings.length} total
                  </span>
                  <Link to='/create-listing'
                    className='bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-xl transition-colors duration-200'>
                    + Add New
                  </Link>
                </div>
              </div>

              {loadingListings ? (
                <div className='p-12 text-center'>
                  <div className='w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3'></div>
                  <p className='text-slate-400 text-xs tracking-widest uppercase'>Loading listings...</p>
                </div>
              ) : listings.length === 0 ? (
                <div className='py-20 text-center'>
                  <div className='text-5xl mb-4'>🏡</div>
                  <p className='text-slate-600 font-bold text-lg mb-1'>No listings yet</p>
                  <p className='text-slate-400 text-sm mb-6'>Create your first listing to get started</p>
                  <Link to='/create-listing'
                    className='bg-amber-500 text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xl hover:bg-amber-400 transition-colors duration-200'>
                    + Create Listing
                  </Link>
                </div>
              ) : (
                <>

                  <div className='grid grid-cols-12 gap-4 px-8 py-3 bg-slate-50 border-b border-slate-100'>
                    <div className='col-span-1 text-xs font-bold tracking-widest uppercase text-slate-400'>#</div>
                    <div className='col-span-5 text-xs font-bold tracking-widest uppercase text-slate-400'>Property</div>
                    <div className='col-span-2 text-xs font-bold tracking-widest uppercase text-slate-400 hidden md:block'>Price</div>
                    <div className='col-span-2 text-xs font-bold tracking-widest uppercase text-slate-400 hidden sm:block'>Type</div>
                    <div className='col-span-2 text-xs font-bold tracking-widest uppercase text-slate-400 text-right'>Actions</div>
                  </div>

                  <div className='divide-y divide-slate-50'>
                    {listings.map((listing, index) => (
                      <div key={listing._id} className='grid grid-cols-12 gap-4 items-center px-8 py-4 hover:bg-amber-50/30 transition-colors duration-150 group'>
                        <div className='col-span-1'>
                          <span className='text-xs font-black text-slate-200 group-hover:text-amber-400 transition-colors duration-200'>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className='col-span-5 flex items-center gap-3 min-w-0'>
                          <Link to={`/listing/${listing._id}`} className='shrink-0'>
                            <img src={listing.imageUrls[0]} alt=''
                              className='h-12 w-16 object-cover rounded-xl border border-slate-100 group-hover:border-amber-200 transition-all duration-200 group-hover:shadow-sm' />
                          </Link>
                          <Link to={`/listing/${listing._id}`} className='min-w-0'>
                            <p className='text-slate-800 font-semibold text-sm truncate group-hover:text-amber-600 transition-colors duration-200'>{listing.name}</p>
                            <p className='text-slate-400 text-xs truncate mt-0.5'>{listing.address}</p>
                          </Link>
                        </div>
                        <div className='col-span-2 hidden md:block'>
                          <p className='text-sm font-bold text-slate-700'>
                            ${listing.offer
                              ? listing.discountPrice.toLocaleString('en-US')
                              : listing.regularPrice.toLocaleString('en-US')}
                          </p>
                          {listing.type === 'rent' && <p className='text-xs text-slate-400'>per month</p>}
                          {listing.offer && (
                            <p className='text-xs text-green-600 font-bold'>
                              Save ${(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')}
                            </p>
                          )}
                        </div>
                        <div className='col-span-2 hidden sm:flex gap-1.5 flex-wrap'>
                          <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full
                            ${listing.type === 'rent' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                            {listing.type}
                          </span>
                          {listing.offer && (
                            <span className='text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200'>
                              Offer
                            </span>
                          )}
                        </div>
                        <div className='col-span-2 flex items-center gap-2 justify-end'>
                          <Link to={`/update-listing/${listing._id}`}>
                            <button className='text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-amber-600 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-all duration-200'>
                              Edit
                            </button>
                          </Link>

                          <button
                            onClick={() => setModal({ open: true, id: listing._id, type: 'listing' })}
                            className='text-xs font-bold tracking-widest uppercase text-slate-300 hover:text-red-500 border border-slate-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200'>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between'>
                    <p className='text-xs text-slate-400'>{listings.length} total {listings.length === 1 ? 'property' : 'properties'}</p>
                    <Link to='/create-listing' className='text-xs font-bold tracking-widest uppercase text-amber-500 hover:text-amber-600 transition-colors duration-200'>
                      + Add New
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}


          {activeTab === 'users' && (
            <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
              <div className='px-8 py-5 border-b border-slate-100 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                  <h2 className='text-sm font-bold text-slate-800'>All Users</h2>
                </div>
                <span className='bg-[#0d1b2a] text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full'>
                  {users.length} total
                </span>
              </div>

              {loadingUsers ? (
                <div className='p-12 text-center'>
                  <div className='w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3'></div>
                  <p className='text-slate-400 text-xs tracking-widest uppercase'>Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className='py-20 text-center'>
                  <p className='text-slate-400 text-sm'>No users found</p>
                </div>
              ) : (
                <>

                  <div className='grid grid-cols-12 gap-4 px-8 py-3 bg-slate-50 border-b border-slate-100'>
                    <div className='col-span-1 text-xs font-bold tracking-widest uppercase text-slate-400'>#</div>
                    <div className='col-span-5 text-xs font-bold tracking-widest uppercase text-slate-400'>User</div>
                    <div className='col-span-3 text-xs font-bold tracking-widest uppercase text-slate-400 hidden md:block'>Joined</div>
                    <div className='col-span-3 text-xs font-bold tracking-widest uppercase text-slate-400'>Role</div>
                  </div>

                  <div className='divide-y divide-slate-50'>
                    {users.map((user, index) => (
                      <div key={user._id} className='grid grid-cols-12 gap-4 items-center px-8 py-4 hover:bg-amber-50/30 transition-colors duration-150 group'>
                        <div className='col-span-1'>
                          <span className='text-xs font-black text-slate-200 group-hover:text-amber-400 transition-colors duration-200'>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className='col-span-5 flex items-center gap-3 min-w-0'>
                          <div className='relative shrink-0'>
                            <img src={user.avatar} alt=''
                              className='w-10 h-10 rounded-full object-cover border-2 border-slate-100 group-hover:border-amber-300 transition-colors duration-200' />
                            {user.role === 'admin' && (
                              <div className='absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center'>
                                <span className='text-white text-[8px] font-black'>A</span>
                              </div>
                            )}
                          </div>
                          <div className='min-w-0'>
                            <p className='text-slate-800 font-semibold text-sm truncate'>{user.username}</p>
                            <p className='text-slate-400 text-xs truncate mt-0.5'>{user.email}</p>
                          </div>
                        </div>
                        <div className='col-span-3 hidden md:block'>
                          <p className='text-xs font-semibold text-slate-600'>
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className='col-span-3'>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full
                            ${user.role === 'admin' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {user.role === 'admin' ? '🛡️ Admin' : 'User'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='px-8 py-4 bg-slate-50/50 border-t border-slate-100'>
                    <p className='text-xs text-slate-400'>
                      {users.length} registered {users.length === 1 ? 'user' : 'users'} ·{' '}
                      {users.filter(u => u.role === 'admin').length} admin{users.filter(u => u.role === 'admin').length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

      <ConfirmModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, id: null, type: '' })}
        onConfirm={handleConfirm}
        loading={deleting}
        title='Delete Listing?'
        message='This listing will be permanently deleted from the platform. This cannot be undone.'
        confirmText='Delete Listing'
      />

    </div>
  );
}