import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  }

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandlord();
  }, [listing.userRef])

  return (
    <div>
      {landlord && (
        <div className='flex flex-col gap-4'>


          <div>
            <p className='text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
              <span className='h-px w-4 bg-amber-500'></span>
              Contact Landlord
            </p>
            <p className='text-white text-sm leading-relaxed'>
              Message <span className='text-amber-400 font-semibold'>{landlord.username}</span> about{' '}
              <span className='text-amber-400 font-semibold'>{listing.name}</span>
            </p>
          </div>

          {/* Textarea */}
          <textarea
            name="message"
            id="message"
            rows="4"
            value={message}
            onChange={onChange}
            placeholder="Hi, I'm interested in this property. Can we schedule a viewing?"
            className='w-full bg-slate-800 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none transition-all duration-200 resize-none'
          />


          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='w-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-colors duration-200 text-center block'
          >
            ✉ Send Message
          </Link>


          <p className='text-xs text-slate-500 text-center'>
            Sends to: {landlord.email}
          </p>

        </div>
      )}
    </div>
  )
}