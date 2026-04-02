import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300 w-full sm:w-80 flex flex-col group'>
      <Link to={`/listing/${listing._id}`}>


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
              ${listing.type === 'rent'
                ? 'bg-blue-500 text-white'
                : 'bg-green-500 text-white'}`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>


          {listing.offer && (
            <div className='absolute top-3 right-3'>
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
            <p className='text-xs text-slate-400 truncate leading-relaxed'>
              {listing.address}
            </p>
          </div>


          <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>


          <div className='h-px bg-slate-100 mt-auto'></div>


          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1.5 text-slate-600'>
              <FaBed className='text-amber-400' size={13} />
              <span className='text-xs font-bold'>
                {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
              </span>
            </div>
            <div className='flex items-center gap-1.5 text-slate-600'>
              <FaBath className='text-amber-400' size={12} />
              <span className='text-xs font-bold'>
                {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
              </span>
            </div>
            {listing.parking && (
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