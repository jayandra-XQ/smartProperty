import React from 'react'

export default function About() {
  return (
    <div className='bg-slate-50 min-h-screen'>

      {/* ── HERO BANNER ── */}
      <div className='w-full bg-slate-800 py-20 px-4'>
        <div className='max-w-6xl mx-auto'>
          <p className='text-xs font-semibold tracking-widest uppercase text-amber-500 mb-3'>
            Who We Are
          </p>
          <h1 className='text-4xl lg:text-6xl font-bold text-white leading-tight mb-4'>
            About <span className='text-amber-400'>smartProperty</span>
          </h1>
          <p className='text-slate-400 text-base max-w-xl leading-relaxed'>
            Your trusted partner in finding the perfect home — buying, selling, or renting.
          </p>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className='w-full bg-amber-500'>
        <div className='max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
          {[
            { number: '500+', label: 'Properties Listed' },
            { number: '12K+', label: 'Happy Clients' },
            { number: '98%', label: 'Satisfaction Rate' },
            { number: '10+', label: 'Years Experience' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className='text-3xl font-bold text-white'>{stat.number}</p>
              <p className='text-xs font-semibold tracking-widest uppercase text-amber-100 mt-1'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className='max-w-6xl mx-auto px-4 py-16'>

        {/* Who We Are + Mission side by side */}
        <div className='grid md:grid-cols-2 gap-8 mb-12'>

          {/* Who We Are */}
          <div className='bg-white rounded-2xl p-8 shadow-sm border border-slate-100'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl'>🏢</div>
              <h2 className='text-xl font-bold text-slate-800'>Who We Are</h2>
            </div>
            <p className='text-slate-600 leading-relaxed text-sm'>
              smartProperty is a leading real estate agency that specializes in helping clients buy, sell, and rent
              properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing
              exceptional service and making the buying and selling process as smooth as possible.
            </p>
          </div>

          {/* Our Mission */}
          <div className='bg-white rounded-2xl p-8 shadow-sm border border-slate-100'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl'>🎯</div>
              <h2 className='text-xl font-bold text-slate-800'>Our Mission</h2>
            </div>
            <p className='text-slate-600 leading-relaxed text-sm'>
              Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized
              service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a
              property, we are here to help you every step of the way.
            </p>
          </div>

        </div>

        {/* Our Promise — full width */}
        <div className='bg-slate-800 rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8'>
          <div className='text-5xl shrink-0'>🤝</div>
          <div>
            <h2 className='text-xl font-bold text-white mb-3'>Our Promise to You</h2>
            <p className='text-slate-300 leading-relaxed text-sm'>
              Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are
              committed to providing the highest level of service to our clients. We believe that buying or selling
              a property should be an exciting and rewarding experience — and we are dedicated to making that a
              reality for each and every one of our clients.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className='mb-4'>
          <p className='text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2'>Why Us</p>
          <h2 className='text-2xl font-bold text-slate-800 mb-8'>What Sets Us Apart</h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[
            { icon: '🔍', title: 'Expert Market Knowledge', desc: 'Deep understanding of local neighbourhoods, pricing trends, and investment potential.' },
            { icon: '⚡', title: 'Fast & Efficient', desc: 'We move quickly so you never miss out on the right property at the right time.' },
            { icon: '🛡️', title: 'Trusted & Transparent', desc: 'No hidden fees, no surprises. We keep you informed at every step of the process.' },
            { icon: '💬', title: 'Personalised Service', desc: 'Every client is unique. We tailor our approach to match your specific needs and goals.' },
            { icon: '📱', title: 'Always Reachable', desc: 'Our agents are available whenever you need them — no waiting, no run-around.' },
            { icon: '🏆', title: 'Proven Track Record', desc: 'Hundreds of successful transactions and thousands of satisfied clients speak for themselves.' },
          ].map((item) => (
            <div key={item.title} className='bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200'>
              <div className='text-3xl mb-3'>{item.icon}</div>
              <h3 className='font-bold text-slate-800 mb-2 text-sm'>{item.title}</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* ── BOTTOM CTA ── */}
      <div className='w-full bg-amber-500 py-14 px-4 text-center'>
        <h2 className='text-2xl font-bold text-white mb-2'>Ready to find your dream home?</h2>
        <p className='text-amber-100 text-sm mb-6'>Browse our latest listings and get in touch with our team today.</p>
        <a
          href='/search'
          className='inline-block bg-white text-amber-600 font-bold text-sm px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors duration-200'
        >
          Explore Properties →
        </a>
      </div>

    </div>
  )
}