import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import { isFavourite, toggleFavourite } from '../utils/favourites';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa';

import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [saved, setSaved] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setSaved(isFavourite(data._id));
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error("Failed to fetch listing", error);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(loading);

  const handleSave = () => {
    if (!listing) return;
    const isNowSaved = toggleFavourite(listing._id);
    setSaved(isNowSaved);
  };

  return (
    <main className='min-h-screen bg-slate-50'>

      {/* ── LOADING ── */}
      {loading && (
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
          <div className='w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin'></div>
          <p className='text-slate-400 text-sm font-medium tracking-widest uppercase'>Loading property...</p>
        </div>
      )}

      {error && (
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4'>
          <div className='text-5xl'>🏚️</div>
          <h2 className='text-xl font-bold text-slate-700'>Property Not Found</h2>
          <p className='text-slate-400 text-sm max-w-xs'>This listing may have been removed or the link is invalid.</p>
        </div>
      )}
      {listing && !loading && !error && (
        <div>

          <div className='w-full overflow-hidden relative' style={{ maxHeight: '520px' }}>
            <Swiper navigation loop className='w-full h-130'>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='w-full h-130 relative'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  >
                    <div className='absolute inset-0' style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.6) 0%, transparent 60%)' }}></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className='absolute bottom-5 left-6 z-10 pointer-events-none'>
              <span className='bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20'>
                📷 {listing.imageUrls.length} photo{listing.imageUrls.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className='absolute top-5 right-5 z-10 flex gap-2'>
              <button
                onClick={handleSave}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-200 border
                  ${saved
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-black/40 backdrop-blur-sm border-white/20 text-white hover:bg-red-500 hover:border-red-500'}`}
              >
                {saved ? <FaHeart className='text-sm' /> : <FaRegHeart className='text-sm' />}
              </button>

              {/* Share button */}
              <div
                className='w-11 h-11 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors duration-200'
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <FaShare className='text-white text-sm' />
              </div>
            </div>

            {copied && (
              <div className='absolute top-20 right-5 z-10 bg-[#0d1b2a] border border-amber-500/30 text-amber-400 text-xs font-semibold px-4 py-2 rounded-xl shadow-lg'>
                ✓ Link copied!
              </div>
            )}
          </div>

          <div className='max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8'>

            <div className='lg:col-span-2 flex flex-col gap-6'>

              {/* Title card */}
              <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-7'>
                <div className='flex items-center gap-3 mb-4 flex-wrap'>
                  <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full
                    ${listing.type === 'rent'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-green-50 text-green-600 border border-green-200'}`}>
                    {listing.type === 'rent' ? '🔑 For Rent' : '🏷️ For Sale'}
                  </span>
                  {listing.offer && (
                    <span className='text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200'>
                      ✦ Special Offer
                    </span>
                  )}
                </div>

                <h1 className='text-2xl lg:text-3xl font-bold text-[#0d1b2a] leading-snug mb-3'>
                  {listing.name}
                </h1>

                <p className='flex items-center gap-2 text-slate-500 text-sm mb-5'>
                  <FaMapMarkerAlt className='text-amber-500 shrink-0' />
                  {listing.address}
                </p>

                <div className='flex items-end gap-4 pt-4 border-t border-slate-100 flex-wrap'>
                  <div>
                    <p className='text-xs font-bold tracking-widest uppercase text-slate-400 mb-1'>
                      {listing.offer ? 'Offer Price' : 'Price'}
                    </p>
                    <p className='text-3xl font-bold text-[#0d1b2a]'>
                      ${listing.offer
                        ? listing.discountPrice.toLocaleString('en-US')
                        : listing.regularPrice.toLocaleString('en-US')}
                      {listing.type === 'rent' && (
                        <span className='text-base font-normal text-slate-400 ml-1'>/ month</span>
                      )}
                    </p>
                  </div>
                  {listing.offer && (
                    <div className='mb-1'>
                      <p className='text-sm text-slate-400 line-through'>
                        ${listing.regularPrice.toLocaleString('en-US')}
                      </p>
                      <p className='text-sm font-bold text-green-600'>
                        Save ${(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-7'>
                <div className='flex items-center gap-3 mb-5'>
                  <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                  <h2 className='text-sm font-bold text-slate-800 tracking-wide'>Property Details</h2>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7'>
                  {[
                    { icon: <FaBed className='text-amber-500 text-lg' />, label: 'Bedrooms', value: `${listing.bedrooms} ${listing.bedrooms > 1 ? 'Beds' : 'Bed'}` },
                    { icon: <FaBath className='text-amber-500 text-lg' />, label: 'Bathrooms', value: `${listing.bathrooms} ${listing.bathrooms > 1 ? 'Baths' : 'Bath'}` },
                    { icon: <FaParking className='text-amber-500 text-lg' />, label: 'Parking', value: listing.parking ? 'Available' : 'Not Available' },
                    { icon: <FaChair className='text-amber-500 text-lg' />, label: 'Furnishing', value: listing.furnished ? 'Furnished' : 'Unfurnished' },
                  ].map((feat) => (
                    <div key={feat.label} className='bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-2'>
                      {feat.icon}
                      <p className='text-xs text-slate-400 font-medium'>{feat.label}</p>
                      <p className='text-sm font-bold text-slate-700'>{feat.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className='text-xs font-bold tracking-widest uppercase text-slate-400 mb-3'>Description</p>
                  <p className='text-slate-600 text-sm leading-relaxed'>{listing.description}</p>
                </div>
              </div>

            </div>

            <div className='flex flex-col gap-5'>

              {/* Summary */}
              <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6'>
                <p className='text-xs font-bold tracking-widest uppercase text-amber-500 mb-4 flex items-center gap-2'>
                  <span className='h-px w-4 bg-amber-500'></span>
                  Summary
                </p>
                <div className='flex flex-col'>
                  {[
                    { label: 'Type', value: listing.type === 'rent' ? 'For Rent' : 'For Sale' },
                    { label: 'Bedrooms', value: listing.bedrooms },
                    { label: 'Bathrooms', value: listing.bathrooms },
                    { label: 'Parking', value: listing.parking ? 'Yes' : 'No' },
                    { label: 'Furnished', value: listing.furnished ? 'Yes' : 'No' },
                    { label: 'Special Offer', value: listing.offer ? 'Yes' : 'No' },
                  ].map((item) => (
                    <div key={item.label} className='flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0'>
                      <span className='text-xs text-slate-400 font-medium'>{item.label}</span>
                      <span className='text-xs font-bold text-slate-700'>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!currentUser ? (
                <div className='bg-[#0d1b2a] rounded-2xl overflow-hidden relative'>
                  <div className='absolute top-0 left-0 right-0'
                    style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}></div>
                  <div className='p-6 relative z-10 text-center'>
                    <p className='text-white font-bold text-base mb-2'>Interested in this property?</p>
                    <p className='text-slate-400 text-xs mb-5'>Sign in to contact the landlord directly.</p>
                    <a href='/sign-in'
                      className='block w-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-colors duration-200 text-center'>
                      Sign In to Contact
                    </a>
                  </div>
                </div>
              ) : listing.userRef === currentUser._id ? (
                <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center'>
                  <div className='text-3xl mb-3'>🏡</div>
                  <p className='text-sm font-bold text-slate-700 mb-1'>This is your listing</p>
                  <p className='text-xs text-slate-400'>You cannot contact yourself as the landlord.</p>
                </div>
              ) : (
                <div className='bg-[#0d1b2a] rounded-2xl overflow-hidden relative'>
                  <div className='absolute top-0 left-0 right-0'
                    style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}></div>
                  <div className='absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500 opacity-5 rounded-full'></div>
                  <div className='p-6 relative z-10'>
                    {!contact ? (
                      <>
                        <p className='text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
                          <span className='h-px w-4 bg-amber-500'></span>
                          Interested?
                        </p>
                        <h3 className='text-white font-bold text-base mb-1'>Contact the Landlord</h3>
                        <p className='text-slate-400 text-xs leading-relaxed mb-5'>
                          Reach out to the owner directly to ask questions or schedule a viewing.
                        </p>
                        <button
                          onClick={() => setContact(true)}
                          className='w-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-colors duration-200'>
                          ✉ Contact Landlord
                        </button>
                      </>
                    ) : (
                      <Contact listing={listing} />
                    )}
                  </div>
                </div>
              )}

              <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6'>
                <p className='text-xs text-slate-400 mb-3 text-center'>Save this property</p>
                <button
                  onClick={handleSave}
                  className={`w-full font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2
                    ${saved
                      ? 'bg-red-500 hover:bg-red-600 text-white border border-red-500'
                      : 'border border-slate-200 hover:border-red-400 text-slate-500 hover:text-red-500 hover:bg-red-50'}`}
                >
                  {saved ? <FaHeart className='text-sm' /> : <FaRegHeart className='text-sm' />}
                  {saved ? 'Saved to Favourites' : 'Save Property'}
                </button>
                {saved && (
                  <p className='text-xs text-slate-400 text-center mt-2'>
                    View all saved properties in your profile
                  </p>
                )}
              </div>

              <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center'>
                <p className='text-xs text-slate-400 mb-3'>Share this listing</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className='w-full border border-slate-200 hover:border-amber-400 text-slate-500 hover:text-amber-600 font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2'
                >
                  <FaShare className='text-sm' />
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}