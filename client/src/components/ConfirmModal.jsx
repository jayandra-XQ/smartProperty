export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) {
  if (!isOpen) return null;

  return (
    <>

      <div
        className='fixed inset-0 z-50 flex items-center justify-center px-4'
        style={{ background: 'rgba(13, 27, 42, 0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <div
          className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative'
          onClick={(e) => e.stopPropagation()}
        >

          <div
            className='absolute top-0 left-0 right-0'
            style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
          ></div>

          <div className='pt-10 px-8 pb-6 text-center'>
            <div className='w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-5'>
              <svg className='w-7 h-7 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
              </svg>
            </div>
            <h2 className='text-xl font-bold text-slate-800 mb-2'>{title || 'Are you sure?'}</h2>

            <p className='text-slate-500 text-sm leading-relaxed'>
              {message || 'This action cannot be undone. Please confirm you want to proceed.'}
            </p>
          </div>
          <div className='h-px bg-slate-100 mx-8'></div>
          <div className='px-8 py-6 flex gap-3'>

            <button
              onClick={onClose}
              disabled={loading}
              className='flex-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50'
            >
              Cancel
            </button>


            <button
              onClick={onConfirm}
              disabled={loading}
              className='flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <svg className='animate-spin h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                  </svg>
                  Deleting...
                </>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}