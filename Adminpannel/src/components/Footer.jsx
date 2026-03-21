const Footer = () => {
  return (
    <footer className="mt-10 border-t border-slate-200/80 bg-white/70 py-5">
      <div className="app-content flex flex-col items-center justify-between gap-2 text-sm text-slate-600 md:flex-row">
        <p className="font-semibold">&copy; 2026 Koshish. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="font-medium transition-colors hover:text-slate-900">Facebook</a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="font-medium transition-colors hover:text-slate-900">Twitter</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="font-medium transition-colors hover:text-slate-900">Instagram</a>
        </div>
      </div>
   </footer>
  )
}

export default Footer