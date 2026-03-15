import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {

  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-slate-50'>

      {/* ── SIDEBAR / FILTERS ── */}
      <aside className='md:w-72 lg:w-80 bg-white border-b-2 md:border-b-0 md:border-r border-slate-100 shadow-sm flex-shrink-0'>

        {/* Sidebar Header */}
        <div className='px-6 py-5 border-b border-slate-100'>
          <p className='text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1'>SmartProperty</p>
          <h2 className='text-lg font-bold text-slate-800'>Filter Listings</h2>
        </div>

        <form className='flex flex-col gap-7 p-6' onSubmit={handleSubmit}>

          {/* Search Term */}
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-semibold tracking-widest uppercase text-slate-500'>
              Search Term
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Address, city, neighbourhood...'
              className='border border-slate-200 rounded-lg p-3 w-full text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-slate-50'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className='flex flex-col gap-3'>
            <label className='text-xs font-semibold tracking-widest uppercase text-slate-500'>
              Listing Type
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {[
                { id: 'all', label: 'Rent & Sale' },
                { id: 'rent', label: 'Rent' },
                { id: 'sale', label: 'Sale' },
                { id: 'offer', label: 'Offer' },
              ].map(({ id, label }) => (
                <label
                  key={id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 text-sm font-medium select-none
                    ${(id === 'offer' ? sidebardata.offer : sidebardata.type === id)
                      ? 'bg-amber-50 border-amber-400 text-amber-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                  <input
                    type='checkbox'
                    id={id}
                    className='accent-amber-500 w-4 h-4'
                    onChange={handleChange}
                    checked={id === 'offer' ? sidebardata.offer : sidebardata.type === id}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className='flex flex-col gap-3'>
            <label className='text-xs font-semibold tracking-widest uppercase text-slate-500'>
              Amenities
            </label>
            <div className='flex flex-col gap-2'>
              {[
                { id: 'parking', label: '🚗 Parking' },
                { id: 'furnished', label: '🛋️ Furnished' },
              ].map(({ id, label }) => (
                <label
                  key={id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 text-sm font-medium select-none
                    ${sidebardata[id]
                      ? 'bg-amber-50 border-amber-400 text-amber-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                  <input
                    type='checkbox'
                    id={id}
                    className='accent-amber-500 w-4 h-4'
                    onChange={handleChange}
                    checked={sidebardata[id]}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-semibold tracking-widest uppercase text-slate-500'>
              Sort By
            </label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border border-slate-200 rounded-lg p-3 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 cursor-pointer'
            >
              <option value='regularPrice_desc'>Price: High to Low</option>
              <option value='regularPrice_asc'>Price: Low to High</option>
              <option value='createdAt_desc'>Latest First</option>
              <option value='createdAt_asc'>Oldest First</option>
            </select>
          </div>

          {/* Submit */}
          <button className='w-full bg-slate-800 text-white py-3 px-6 rounded-lg text-sm font-semibold tracking-wide uppercase hover:bg-slate-700 active:bg-slate-900 transition-colors duration-200 mt-1'>
            Search Properties
          </button>

        </form>
      </aside>

      {/* ── RESULTS PANEL ── */}
      <div className='flex-1 flex flex-col min-w-0'>

        {/* Results Header */}
        <div className='bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold tracking-widest uppercase text-amber-600 mb-1'>
              Results
            </p>
            <h1 className='text-xl font-bold text-slate-800'>
              {loading ? 'Searching...' : `${listings.length} Listing${listings.length !== 1 ? 's' : ''} Found`}
            </h1>
          </div>
          {sidebardata.searchTerm && (
            <span className='text-sm text-slate-500 italic'>
              for "{sidebardata.searchTerm}"
            </span>
          )}
        </div>

        {/* Listings Grid */}
        <div className='p-8 flex-1'>

          {/* Loading State */}
          {loading && (
            <div className='flex flex-col items-center justify-center h-64 gap-4'>
              <div className='w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin'></div>
              <p className='text-slate-400 text-sm font-medium'>Finding properties for you...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && listings.length === 0 && (
            <div className='flex flex-col items-center justify-center h-64 gap-3 text-center'>
              <div className='text-5xl'>🏠</div>
              <h3 className='text-lg font-semibold text-slate-700'>No listings found</h3>
              <p className='text-slate-400 text-sm max-w-xs'>
                Try adjusting your filters or search with a different term.
              </p>
            </div>
          )}

          {/* Listing Cards */}
          {!loading && listings.length > 0 && (
            <div className='flex flex-wrap gap-5'>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Show More */}
          {showMore && (
            <div className='flex justify-center mt-10'>
              <button
                onClick={onShowMoreClick}
                className='bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-600 font-semibold text-sm px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow'
              >
                Load More Properties ↓
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}