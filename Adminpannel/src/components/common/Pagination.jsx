const Pagination = ({ page, pageSize, totalItems, onChange }) => {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  if (totalPages <= 1) return null;

  const goPrev = () => onChange(Math.max(1, page - 1));
  const goNext = () => onChange(Math.min(totalPages, page + 1));

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);

  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={goPrev}
        className="admin-btn admin-btn-secondary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page === 1}
      >
          Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${p === page ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={goNext}
        className="admin-btn admin-btn-secondary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page === totalPages}
      >
          Next
      </button>
    </div>
  );
};

export default Pagination;
