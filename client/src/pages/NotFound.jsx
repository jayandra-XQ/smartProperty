import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-[#0d1b2a] flex items-center justify-center px-6 relative overflow-hidden'>

      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      ></div>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500 opacity-[0.04] rounded-full'></div>
      <div className='absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400 opacity-[0.03] rounded-full'></div>
      <div className='absolute -top-20 -right-20 w-80 h-80 bg-amber-400 opacity-[0.03] rounded-full'></div>

      <div
        className='absolute top-0 left-0 right-0'
        style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
      ></div>

      <div className='relative z-10 text-center max-w-lg'>

        <div className='relative mb-6'>
          <p
            className='font-black text-white select-none leading-none'
            style={{ fontSize: 'clamp(8rem, 20vw, 14rem)', opacity: 0.06 }}
          >
            404
          </p>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-6xl'>🏚️</div>
          </div>
        </div>

        <div className='flex items-center justify-center gap-3 mb-4'>
          <div className='h-px w-8 bg-amber-500'></div>
          <p className='text-xs font-bold tracking-[0.25em] uppercase text-amber-500'>
            Page Not Found
          </p>
          <div className='h-px w-8 bg-amber-500'></div>
        </div>

        <h1 className='text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight'>
          Looks like this property
          <br />
          <span className='text-amber-400 italic font-light'>doesn't exist</span>
        </h1>


        <p className='text-slate-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto'>
          The page you're looking for may have been removed, had its name changed, or is temporarily unavailable.
        </p>


        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            to='/'
            className='bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-colors duration-200'
          >
            ← Back to Home
          </Link>
          <Link
            to='/search'
            className='border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-200'
          >
            Browse Listings
          </Link>
        </div>

      </div>
    </div>
  );
}