import { useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const CheckPill = ({ id, label, checked, onChange }) => (
  <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 select-none text-sm font-medium
    ${checked
      ? 'bg-amber-50 border-amber-400 text-amber-700'
      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}>
    <input type='checkbox' id={id} className='accent-amber-500 w-4 h-4' onChange={onChange} checked={checked} />
    {label}
  </label>
);

export default function CreateListing() {

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      try {
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          const data = new FormData();
          data.append("file", files[i]);
          data.append("upload_preset", "smartProperty");
          data.append("cloud_name", "dyeicallf");
          const promise = fetch("https://api.cloudinary.com/v1_1/dyeicallf/image/upload", { method: "POST", body: data })
            .then((res) => res.json())
            .then((data) => data.secure_url);
          promises.push(promise);
        }
        const urls = await Promise.all(promises);
        setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.concat(urls) }));
        setUploading(false);
      } catch (error) {
        setImageUploadError("Image upload failed (2 mb max per image)");
        setUploading(false);
        error && console.log(error);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) { setError(data.message); }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };



  return (
    <div className='min-h-screen bg-slate-50'>


      <div className='w-full bg-[#0d1b2a] relative overflow-hidden'>
        <div className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent'></div>
        <div className='absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500 opacity-5 rounded-full'></div>
        <div className='absolute -top-10 left-1/4 w-32 h-32 bg-amber-400 opacity-[0.03] rounded-full'></div>
        <div className='max-w-5xl mx-auto px-8 py-10 relative z-10'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-6 bg-amber-500'></div>
            <p className='text-xs font-bold tracking-[0.25em] uppercase text-amber-500'>New Property</p>
          </div>
          <h1 className='text-3xl lg:text-4xl font-bold text-white'>Create a Listing</h1>
          <p className='text-slate-400 text-sm mt-2'>Fill in the details below to list your property on SmartProperty</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8'>

          <div className='flex flex-col gap-6'>

            {/* Basic Info card */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
              <div className='px-7 py-5 border-b border-slate-100 flex items-center gap-3'>
                <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                <h2 className='text-sm font-bold text-slate-800 tracking-wide'>Basic Information</h2>
              </div>
              <div className='px-7 py-6 flex flex-col gap-5'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>Property Name</label>
                  <input
                    type="text" placeholder="e.g. Cozy 2BHK near City Centre"
                    className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                    maxLength="62" minLength="10" id="name" required
                    onChange={handleChange} value={formData.name}
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>Description</label>
                  <textarea
                    placeholder="Describe your property — highlights, nearby places, unique features..."
                    className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 resize-none'
                    rows={4} id="description" required
                    onChange={handleChange} value={formData.description}
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>Address</label>
                  <input
                    type="text" placeholder="Full property address"
                    className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                    id="address" required
                    onChange={handleChange} value={formData.address}
                  />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
              <div className='px-7 py-5 border-b border-slate-100 flex items-center gap-3'>
                <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                <h2 className='text-sm font-bold text-slate-800 tracking-wide'>Type & Amenities</h2>
              </div>
              <div className='px-7 py-6 flex flex-col gap-5'>
                <div>
                  <p className='text-xs font-bold tracking-widest uppercase text-slate-400 mb-3'>Listing Type</p>
                  <div className='grid grid-cols-2 gap-3'>
                    <CheckPill id="sale" label="🏷️ For Sale" checked={formData.type === 'sale'} onChange={handleChange} />
                    <CheckPill id="rent" label="🔑 For Rent" checked={formData.type === 'rent'} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <p className='text-xs font-bold tracking-widest uppercase text-slate-400 mb-3'>Amenities</p>
                  <div className='grid grid-cols-2 gap-3'>
                    <CheckPill id="parking" label="🚗 Parking" checked={formData.parking} onChange={handleChange} />
                    <CheckPill id="furnished" label="🛋️ Furnished" checked={formData.furnished} onChange={handleChange} />
                    <CheckPill id="offer" label="🏷️ Special Offer" checked={formData.offer} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
              <div className='px-7 py-5 border-b border-slate-100 flex items-center gap-3'>
                <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                <h2 className='text-sm font-bold text-slate-800 tracking-wide'>Pricing & Details</h2>
              </div>
              <div className='px-7 py-6'>
                <div className='grid grid-cols-3 gap-4 mb-4'>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>Beds</label>
                    <input
                      type="number" id="bedrooms" min="1" max="10" required
                      className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                      onChange={handleChange} value={formData.bedrooms}
                    />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>Baths</label>
                    <input
                      type="number" id="bathrooms" min="1" max="10" required
                      className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                      onChange={handleChange} value={formData.bathrooms}
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>
                      Regular Price {formData.type === 'rent' && <span className='normal-case font-normal text-slate-400'>($ / month)</span>}
                    </label>
                    <input
                      type="number" id="regularPrice" min='50' max='10000000' required
                      className='border border-slate-200 bg-slate-50/80 p-3.5 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                      onChange={handleChange} value={formData.regularPrice}
                    />
                  </div>

                  {formData.offer && (
                    <div className='flex flex-col gap-1.5'>
                      <label className='text-xs font-bold tracking-widest uppercase text-slate-400'>
                        Discounted Price {formData.type === 'rent' && <span className='normal-case font-normal text-slate-400'>($ / month)</span>}
                      </label>
                      <input
                        type='number' id='discountPrice' min='0' max='10000000' required
                        className='border border-amber-200 bg-amber-50/50 p-3.5 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200'
                        onChange={handleChange} value={formData.discountPrice}
                      />
                      {+formData.regularPrice > +formData.discountPrice && (
                        <p className='text-xs text-green-600 font-medium'>
                          ✓ Saving ${(+formData.regularPrice - +formData.discountPrice).toLocaleString()}
                          {formData.type === 'rent' ? '/mo' : ''}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className='flex flex-col gap-6'>

            {/* Images card */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
              <div className='px-7 py-5 border-b border-slate-100 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-1 h-5 bg-amber-500 rounded-full'></div>
                  <h2 className='text-sm font-bold text-slate-800 tracking-wide'>Property Photos</h2>
                </div>
                <span className='text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full'>
                  {formData.imageUrls.length} / 6
                </span>
              </div>

              <div className='px-7 py-6 flex flex-col gap-4'>
                <p className='text-xs text-slate-400 leading-relaxed'>
                  Upload up to <strong className='text-slate-600'>6 photos</strong>. The first image will be used as the cover. Max 2MB per image.
                </p>

                {/* Upload area */}
                <div className='border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl p-5 text-center transition-colors duration-200 bg-slate-50/50 relative'>
                  <div className='text-3xl mb-2'>📷</div>
                  <p className='text-sm text-slate-500 mb-3'>Choose photos to upload</p>
                  <input
                    className='absolute inset-0 opacity-0 cursor-pointer'
                    type="file" accept="image/*" multiple
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                  />
                  <span className='inline-block text-xs font-bold tracking-widest uppercase text-slate-500 border border-slate-300 px-4 py-2 rounded-lg pointer-events-none'>
                    Browse Files
                  </span>
                  {files.length > 0 && (
                    <p className='text-xs text-amber-600 font-medium mt-2'>{files.length} file{files.length > 1 ? 's' : ''} selected</p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={uploading || files.length === 0}
                  onClick={handleImageSubmit}
                  className='w-full border border-amber-400 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {uploading ? (
                    <>
                      <svg className='animate-spin h-3.5 w-3.5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                      </svg>
                      Uploading...
                    </>
                  ) : '↑ Upload Photos'}
                </button>

                {imageUploadError && (
                  <div className='bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
                    <p className='text-red-600 text-xs font-medium'>✕ {imageUploadError}</p>
                  </div>
                )}

                {/* Uploaded images grid */}
                {formData.imageUrls.length > 0 && (
                  <div className='flex flex-col gap-2 mt-1'>
                    {formData.imageUrls.map((url, index) => (
                      <div key={url} className='flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-slate-200 transition-colors duration-150'>
                        <div className='relative shrink-0'>
                          <img src={url} alt="listing" className='w-16 h-14 object-cover rounded-lg border border-slate-200' />
                          {index === 0 && (
                            <span className='absolute -top-1.5 -left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full'>Cover</span>
                          )}
                        </div>
                        <p className='flex-1 text-xs text-slate-400 truncate'>Photo {index + 1}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className='shrink-0 text-xs font-bold tracking-widest uppercase text-slate-300 hover:text-red-500 border border-slate-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200'
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit card */}
            <div className='bg-[#0d1b2a] rounded-2xl overflow-hidden relative'>
              <div className='absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent'></div>
              <div className='absolute -bottom-8 -right-8 w-32 h-32 bg-amber-500 opacity-5 rounded-full'></div>
              <div className='px-7 py-7 relative z-10'>
                <p className='text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-2 flex items-center gap-2'>
                  <span className='h-px w-4 bg-amber-500'></span>
                  Ready to publish?
                </p>
                <h3 className='text-white font-bold text-lg mb-1'>Publish Your Listing</h3>
                <p className='text-slate-400 text-xs leading-relaxed mb-6'>
                  Your listing will be visible to thousands of buyers and renters immediately after publishing.
                </p>

                {error && (
                  <div className='bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3 mb-4'>
                    <p className='text-red-400 text-xs font-medium'>✕ {error}</p>
                  </div>
                )}

                <button
                  disabled={loading || uploading}
                  className='w-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <svg className='animate-spin h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                      </svg>
                      Publishing...
                    </>
                  ) : '✦ Publish Listing'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}