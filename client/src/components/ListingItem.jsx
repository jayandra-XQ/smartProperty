import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaHeart, FaRegHeart } from 'react-icons/fa';
import { isFavourite, toggleFavourite } from '../utils/favourites';
import { useSelector } from 'react-redux';

export default function ListingItem({ listing }) {
  const { currentUser } = useSelector(state => state.user);
  const [saved, setSaved] = useState(() => isFavourite(listing._id));
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 3000);
      return;
    }

    const isNowSaved = toggleFavourite(listing._id);
    setSaved(isNowSaved);
  };

  return (
    <div className='relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300 w-full sm:w-80 flex flex-col group'>

      {showLoginMsg && (
        <div className='absolute top-3 left-3 right-3 z-30 bg-[#0d1b2a] border border-amber-500/40 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2'>
          <span className='text-amber-400'>🔒</span>
          <span>Sign in to save properties</span>
          <button
            onClick={() => { window.location.href = '/sign-in'; }}
            className='ml-auto text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 shrink-0 cursor-pointer'
          >
            Sign In
          </button>
        </div>
      )}

      <button
        onClick={handleFav}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-20
          ${saved
            ? 'bg-red-500 text-white scale-110'
            : 'bg-white/80 backdrop-blur-sm text-slate-400 hover:bg-red-500 hover:text-white hover:scale-110'}`}
      >
        {saved ? <FaHeart className='text-xs' /> : <FaRegHeart className='text-xs' />}
      </button>

      <Link to={`/listing/${listing._id}`} className='flex flex-col flex-1'>

        <div className='relative overflow-hidden h-52'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />

          <div className='absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent'></div>

          <div className='absolute top-3 left-3'>
            <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full
              ${listing.type === 'rent' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>

          {listing.offer && (
            <div className='absolute top-14 right-3'>
              <span className='text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white'>
                Offer
              </span>
            </div>
          )}

          <div className='absolute bottom-3 left-3'>
            <p className='text-white font-bold text-lg leading-none drop-shadow'>
              ${listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && (
                <span className='text-xs font-normal opacity-90 ml-1'>/ mo</span>
              )}
            </p>
            {listing.offer && (
              <p className='text-white/70 text-xs line-through leading-none mt-0.5'>
                ${listing.regularPrice.toLocaleString('en-US')}
              </p>
            )}
          </div>
        </div>

        <div className='p-4 flex flex-col gap-3 flex-1'>
          <p className='font-bold text-slate-800 text-base truncate group-hover:text-amber-600 transition-colors duration-200'>
            {listing.name}
          </p>
          <div className='flex items-start gap-1.5'>
            <MdLocationOn className='text-amber-500 shrink-0 mt-0.5' size={14} />
            <p className='text-xs text-slate-400 truncate leading-relaxed'>{listing.address}</p>
          </div>
          <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>{listing.description}</p>
          <div className='h-px bg-slate-100 mt-auto'></div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1.5 text-slate-600'>
              <FaBed className='text-amber-400' size={13} />
              <span className='text-xs font-bold'>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
            </div>
            <div className='flex items-center gap-1.5 text-slate-600'>
              <FaBath className='text-amber-400' size={12} />
              <span className='text-xs font-bold'>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
            </div>
            {saved && (
              <div className='ml-auto flex items-center gap-1 text-red-400'>
                <FaHeart size={10} />
                <span className='text-xs font-bold'>Saved</span>
              </div>
            )}
            {listing.parking && !saved && (
              <div className='ml-auto'>
                <span className='text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full'>
                  🚗 Parking
                </span>
              </div>
            )}
          </div>
        </div>

      </Link>
    </div>
  );
}