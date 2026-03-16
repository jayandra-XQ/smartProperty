import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay]);
  console.log(offerListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className='bg-white'>


      <section className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>

        {/* LEFT — Text panel */}
        <div className='bg-[#0d1b2a] flex flex-col justify-center px-10 md:px-16 lg:px-20 py-24 relative overflow-hidden'>

          {/* Decorative amber blobs */}
          <div className='absolute -top-32 -left-32 w-96 h-96 bg-amber-500 rounded-full opacity-5'></div>
          <div className='absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400 rounded-full opacity-5'></div>
          {/* Subtle grid texture */}
          <div
            className='absolute inset-0 opacity-[0.025]'
            style={{
              backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          ></div>
          {/* Gold top line */}
          <div
            className='absolute top-0 left-0 right-0'
            style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
          ></div>

          <div className='relative z-10 max-w-lg'>

            {/* Eyebrow */}
            <div className='flex items-center gap-3 mb-8'>
              <div className='h-px w-8 bg-amber-500'></div>
              <p className='text-xs font-bold tracking-[0.3em] uppercase text-amber-500'>
                Premium Real Estate
              </p>
            </div>

            {/* Headline */}
            <h1 className='font-bold text-white leading-tight mb-6' style={{ fontSize: 'clamp(2.8rem, 5vw, 4rem)' }}>
              Find Your
              <br />
              <span className='text-amber-400 italic font-light' style={{ fontSize: 'clamp(3rem, 5.5vw, 4.5rem)' }}>
                Perfect
              </span>
              <br />
              Place to Live
            </h1>

            {/* Subtitle */}
            <p className='text-slate-400 text-base leading-relaxed mb-10 max-w-sm'>
              Discover curated properties in the most desirable neighbourhoods.
              Buying, selling, or renting — we guide you every step of the way.
            </p>

            {/* CTAs */}
            <div className='flex flex-col sm:flex-row gap-4 mb-14'>
              <Link
                to='/search'
                className='bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 transition-colors duration-200 text-center rounded-lg'
              >
                Explore Properties
              </Link>
              <Link
                to='/search?offer=true'
                className='border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-400 text-sm font-semibold tracking-widest uppercase px-8 py-4 transition-all duration-200 text-center rounded-lg'
              >
                View Offers
              </Link>
            </div>

            {/* Stats row */}
            <div className='flex gap-10 pt-8 border-t border-slate-700'>
              {[
                { number: '500+', label: 'Listings' },
                { number: '12K', label: 'Happy Clients' },
                { number: '98%', label: 'Satisfaction' },
              ].map((s) => (
                <div key={s.label}>
                  <p className='text-2xl font-bold text-white'>{s.number}</p>
                  <p className='text-xs text-slate-500 uppercase tracking-widest mt-1'>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Swiper image panel */}
        <div className='relative min-h-[55vh] lg:min-h-screen bg-slate-900 overflow-hidden'>
          {offerListings && offerListings.length > 0 ? (
            <>
              <Swiper
                navigation
                loop
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className='h-full w-full absolute inset-0'
              >
                {offerListings.map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <div
                      style={{
                        background: `url(${listing.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                      className='h-full w-full min-h-[55vh] lg:min-h-screen relative'
                    >
                      {/* Gradient overlay */}
                      <div
                        className='absolute inset-0'
                        style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.85) 0%, rgba(13,27,42,0.2) 50%, transparent 100%)' }}
                      ></div>
                      {/* Property badge */}
                      <div className='absolute bottom-8 left-8 right-8 z-10'>
                        <p className='text-xs font-bold tracking-widest uppercase text-amber-400 mb-1'>Featured Property</p>
                        <p className='text-white font-bold text-xl truncate'>{listing.name}</p>
                        <p className='text-slate-300 text-sm truncate mt-0.5'>{listing.address}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Gold left accent line */}
              <div
                className='absolute top-0 bottom-0 left-0 z-10'
                style={{ width: '2px', background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }}
              ></div>
            </>
          ) : (
            /* ── RICH STATIC PANEL — shows while/if no listings ── */
            <div className='absolute inset-0 overflow-hidden' style={{ background: 'linear-gradient(160deg, #0f2236 0%, #0d1b2a 60%, #111827 100%)' }}>

              {/* Grid texture */}
              <div className='absolute inset-0' style={{
                backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}></div>

              {/* Big amber glow blob */}
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full' style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }}></div>

              {/* Gold left accent */}
              <div className='absolute top-0 bottom-0 left-0' style={{ width: '2px', background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }}></div>

              {/* Content */}
              <div className='absolute inset-0 flex flex-col justify-between p-10'>

                {/* TOP — 3 mini stat cards */}
                <div className='flex flex-col gap-3'>
                  <p className='text-xs font-bold tracking-widest uppercase text-amber-500 flex items-center gap-2 mb-1'>
                    <span style={{ display: 'inline-block', width: '16px', height: '1px', background: '#f59e0b' }}></span>
                    Why SmartProperty
                  </p>
                  {[
                    { icon: '🏆', title: 'Top Rated Agency', desc: 'Rated #1 by 12,000+ clients' },
                    { icon: '🔒', title: 'Verified Listings Only', desc: 'Every property is checked' },
                    { icon: '⚡', title: 'Fast & Easy Process', desc: 'Find your home in days' },
                  ].map((card, i) => (
                    <div key={i} className='flex items-center gap-4 rounded-xl px-5 py-4' style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className='text-2xl shrink-0'>{card.icon}</span>
                      <div>
                        <p className='text-white text-sm font-bold leading-tight'>{card.title}</p>
                        <p className='text-slate-400 text-xs mt-0.5'>{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM — big price badge */}
                <div className='rounded-2xl p-6' style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className='text-xs font-bold tracking-widest uppercase text-amber-500 mb-3 flex items-center gap-2'>
                    <span style={{ display: 'inline-block', width: '12px', height: '1px', background: '#f59e0b' }}></span>
                    Starting From
                  </p>
                  <p className='text-white font-bold mb-1' style={{ fontSize: '2.2rem', lineHeight: 1 }}>$500 <span className='text-slate-400 text-base font-normal'>/ month</span></p>
                  <p className='text-slate-400 text-xs mb-4'>Explore properties across all budgets</p>
                  <div className='flex gap-2'>
                    <span className='text-xs font-bold px-3 py-1.5 rounded-full' style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>For Rent</span>
                    <span className='text-xs font-bold px-3 py-1.5 rounded-full' style={{ background: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.2)' }}>For Sale</span>
                    <span className='text-xs font-bold px-3 py-1.5 rounded-full' style={{ background: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.2)' }}>Offers</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </section>


      <div className='bg-amber-500 py-5 px-6'>
        <div className='max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-14'>
          {['Verified Listings', 'Expert Agents', 'Secure Transactions', 'Local Market Knowledge'].map((item) => (
            <div key={item} className='flex items-center gap-2'>
              <span className='text-white text-sm'>✦</span>
              <span className='text-white text-xs font-bold tracking-widest uppercase'>{item}</span>
            </div>
          ))}
        </div>
      </div>


      <div className='bg-slate-50 py-20 px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-14'>
            <p className='text-xs font-bold tracking-[0.25em] uppercase text-amber-500 mb-3 flex items-center justify-center gap-3'>
              <span className='h-px w-8 bg-amber-500 inline-block'></span>
              Simple Process
              <span className='h-px w-8 bg-amber-500 inline-block'></span>
            </p>
            <h2 className='text-3xl lg:text-4xl font-bold text-[#0d1b2a]'>How SmartProperty Works</h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
            {[
              { step: '01', icon: '🔍', title: 'Search Properties', desc: 'Browse thousands of verified listings filtered by location, price, and type.' },
              { step: '02', icon: '🏡', title: 'Pick Your Favourite', desc: 'Save listings you love and compare them side by side at your own pace.' },
              { step: '03', icon: '🤝', title: 'Contact & Move In', desc: 'Reach out to the landlord or agent directly and close the deal fast.' },
            ].map((item) => (
              <div key={item.step} className='bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 relative overflow-hidden group'>
                <div className='absolute top-4 right-5 text-6xl font-black text-slate-50 group-hover:text-amber-50 transition-colors duration-300 select-none leading-none'>
                  {item.step}
                </div>
                <div className='text-4xl mb-5'>{item.icon}</div>
                <h3 className='font-bold text-[#0d1b2a] text-lg mb-2'>{item.title}</h3>
                <p className='text-slate-500 text-sm leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className='max-w-6xl mx-auto px-6 py-20 flex flex-col gap-20'>

        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='flex items-end justify-between mb-8 pb-5 border-b-2 border-slate-100'>
              <div>
                <p className='text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
                  <span className='h-px w-6 bg-amber-500 inline-block'></span>
                  Featured
                </p>
                <h2 className='text-3xl font-bold text-[#0d1b2a]'>Recent Offers</h2>
              </div>
              <Link
                className='hidden sm:inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-amber-500 transition-colors duration-200 border-b border-transparent hover:border-amber-500 pb-0.5'
                to='/search?offer=true'
              >
                View All →
              </Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='flex items-end justify-between mb-8 pb-5 border-b-2 border-slate-100'>
              <div>
                <p className='text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
                  <span className='h-px w-6 bg-amber-500 inline-block'></span>
                  For Rent
                </p>
                <h2 className='text-3xl font-bold text-[#0d1b2a]'>Recent Places for Rent</h2>
              </div>
              <Link
                className='hidden sm:inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-amber-500 transition-colors duration-200 border-b border-transparent hover:border-amber-500 pb-0.5'
                to='/search?type=rent'
              >
                View All →
              </Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='flex items-end justify-between mb-8 pb-5 border-b-2 border-slate-100'>
              <div>
                <p className='text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
                  <span className='h-px w-6 bg-amber-500 inline-block'></span>
                  For Sale
                </p>
                <h2 className='text-3xl font-bold text-[#0d1b2a]'>Recent Places for Sale</h2>
              </div>
              <Link
                className='hidden sm:inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-amber-500 transition-colors duration-200 border-b border-transparent hover:border-amber-500 pb-0.5'
                to='/search?type=sale'
              >
                View All →
              </Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    TESTIMONIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className='bg-slate-50 border-t border-slate-100 py-20 px-6'>
        <div className='max-w-6xl mx-auto'>

          {/* Header */}
          <div className='text-center mb-14'>
            <p className='text-xs font-bold tracking-[0.25em] uppercase text-amber-500 mb-3 flex items-center justify-center gap-3'>
              <span className='h-px w-8 bg-amber-500 inline-block'></span>
              Client Stories
              <span className='h-px w-8 bg-amber-500 inline-block'></span>
            </p>
            <h2 className='text-3xl lg:text-4xl font-bold text-[#0d1b2a]'>What Our Clients Say</h2>
          </div>

          {/* Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
            {[
              {
                quote: "Found our dream home in just 2 weeks. The team was incredibly helpful throughout the whole process — couldn't have done it without them.",
                name: 'Priya S.', initials: 'PS', role: 'Homeowner · Kathmandu',
                badge: 'Buyer', badgeColor: 'bg-green-50 text-green-700 border border-green-200',
                avatarColor: 'bg-amber-100 text-amber-700', stars: 5,
              },
              {
                quote: 'Listed my property and had a tenant within days. Smooth, professional, and completely stress-free from start to finish.',
                name: 'Rohan K.', initials: 'RK', role: 'Property Owner · Pokhara',
                badge: 'Landlord', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
                avatarColor: 'bg-blue-100 text-blue-700', stars: 5,
              },
              {
                quote: 'The search filters are amazing. I found exactly what I needed without wasting time — the whole experience felt modern and effortless.',
                name: 'Anita M.', initials: 'AM', role: 'Renter · Lalitpur',
                badge: 'Renter', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
                avatarColor: 'bg-green-100 text-green-700', stars: 4,
              },
            ].map((t) => (
              <div
                key={t.name}
                className='bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-300 flex flex-col gap-4 relative overflow-hidden'
              >
                {/* Big decorative quote mark */}
                <div className='absolute -top-2 left-4 text-7xl font-serif text-amber-100 leading-none select-none pointer-events-none'>"</div>

                {/* Stars + badge row */}
                <div className='flex items-center justify-between relative z-10'>
                  <div className='flex gap-0.5'>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < t.stars ? 'text-amber-400' : 'text-slate-200'}`} fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    ))}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.badgeColor}`}>{t.badge}</span>
                </div>

                {/* Quote */}
                <p className='text-slate-600 text-sm leading-relaxed italic flex-1 relative z-10 pt-1'>{t.quote}</p>

                {/* Divider */}
                <div className='h-px bg-slate-100'></div>

                {/* Author */}
                <div className='flex items-center gap-3'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${t.avatarColor}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className='text-sm font-bold text-slate-800'>{t.name}</p>
                    <p className='text-xs text-slate-400 mt-0.5'>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom stats strip */}
          <div className='flex items-center justify-center gap-10 mt-14 pt-10 border-t border-slate-200 flex-wrap'>
            {[
              { number: '4.9', label: 'Average Rating' },
              { number: '12K+', label: 'Happy Clients' },
              { number: '98%', label: 'Satisfaction Rate' },
            ].map((s, i) => (
              <div key={s.label} className='flex items-center gap-10'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-[#0d1b2a]'>{s.number}</p>
                  <p className='text-xs text-slate-400 uppercase tracking-widest mt-1'>{s.label}</p>
                </div>
                {i < 2 && <div className='h-10 w-px bg-slate-200'></div>}
              </div>
            ))}
          </div>

        </div>
      </div>


      <div className='bg-[#0d1b2a] py-24 px-6 text-center relative overflow-hidden'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full opacity-[0.04]'></div>

        <div
          className='absolute inset-0 opacity-[0.02]'
          style={{
            backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        ></div>
        <div
          className='absolute top-0 left-0 right-0'
          style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
        ></div>

        <div className='relative z-10 max-w-2xl mx-auto'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            <div className='h-px w-8 bg-amber-500'></div>
            <p className='text-xs font-bold tracking-[0.25em] uppercase text-amber-500'>Get Started Today</p>
            <div className='h-px w-8 bg-amber-500'></div>
          </div>
          <h2 className='text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight'>
            Ready to Find Your
            <br />
            <span className='text-amber-400 italic font-light'>Dream Home?</span>
          </h2>
          <p className='text-slate-400 text-base mb-10 leading-relaxed'>
            Browse hundreds of verified listings and connect with our expert agents today.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/search'
              className='bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm tracking-widest uppercase px-10 py-4 rounded-lg transition-colors duration-200'
            >
              Start Searching
            </Link>
            <Link
              to='/about'
              className='border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-semibold text-sm tracking-widest uppercase px-10 py-4 rounded-lg transition-all duration-200'
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}