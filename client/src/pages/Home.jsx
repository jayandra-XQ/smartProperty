import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO — Split Layout
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>

        {/* LEFT — Text */}
        <div className='bg-[#0d1b2a] flex flex-col justify-center px-10 md:px-16 lg:px-20 py-24 relative overflow-hidden'>

          {/* Decorative blobs */}
          <div className='absolute -top-32 -left-32 w-96 h-96 bg-amber-500 opacity-5 rounded-full'></div>
          <div className='absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400 opacity-5 rounded-full'></div>
          {/* Gold top accent */}
          <div className='absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-transparent via-amber-500 to-transparent'></div>

          <div className='relative z-10 max-w-lg'>

            {/* Eyebrow */}
            <div className='flex items-center gap-3 mb-8'>
              <div className='h-px w-8 bg-amber-500'></div>
              <p className='text-xs font-semibold tracking-[0.25em] uppercase text-amber-500'>
                Premium Real Estate
              </p>
            </div>

            {/* Headline */}
            <h1 className='text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-6'>
              Find Your
              <br />
              <span className='text-amber-400 italic font-light'>Perfect</span>
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
                className='bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 transition-colors duration-200 text-center'
              >
                Explore Properties
              </Link>
              <Link
                to='/search?offer=true'
                className='border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-400 text-sm font-semibold tracking-widest uppercase px-8 py-4 transition-all duration-200 text-center'
              >
                View Offers
              </Link>
            </div>

            {/* Stats */}
            <div className='flex gap-10 pt-8 border-t border-slate-700/60'>
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
        <div className='relative min-h-[55vh] lg:min-h-screen bg-slate-900'>
          {offerListings && offerListings.length > 0 ? (
            <>
              <Swiper navigation loop className='h-full w-full absolute inset-0'>
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
                      <div className='absolute inset-0 bg-linear-to-t from-[#0d1b2a]/80 via-transparent to-transparent'></div>
                      {/* Property badge */}
                      <div className='absolute bottom-8 left-8 right-8'>
                        <p className='text-xs font-semibold tracking-widest uppercase text-amber-400 mb-1'>Featured Property</p>
                        <p className='text-white font-semibold text-lg truncate'>{listing.name}</p>
                        <p className='text-slate-300 text-sm truncate'>{listing.address}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Gold left accent line */}
              <div className='absolute top-0 bottom-0 left-0 w-0.75 bg-linear-to-b from-transparent via-amber-500 to-transparent z-10'></div>
            </>
          ) : (
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
              <div className='text-6xl opacity-20'>🏡</div>
              <p className='text-slate-600 text-xs tracking-widest uppercase'>Loading properties...</p>
            </div>
          )}
        </div>

      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TRUST BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LISTING SECTIONS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className='max-w-6xl mx-auto px-6 py-20 flex flex-col gap-20'>

        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='flex items-end justify-between mb-8 pb-5 border-b-2 border-slate-100'>
              <div>
                <p className='text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
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
                <p className='text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
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
                <p className='text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className='bg-[#0d1b2a] py-24 px-6 text-center relative overflow-hidden'>
        {/* Decorative circle */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-amber-500 opacity-[0.04] rounded-full'></div>
        {/* Gold top line */}
        <div className='absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-transparent via-amber-500 to-transparent'></div>

        <div className='relative z-10 max-w-2xl mx-auto'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            <div className='h-px w-8 bg-amber-500'></div>
            <p className='text-xs font-semibold tracking-[0.25em] uppercase text-amber-500'>Get Started Today</p>
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
              className='bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm tracking-widest uppercase px-10 py-4 transition-colors duration-200'
            >
              Start Searching
            </Link>
            <Link
              to='/about'
              className='border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-semibold text-sm tracking-widest uppercase px-10 py-4 transition-all duration-200'
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}