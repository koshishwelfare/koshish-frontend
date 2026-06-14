import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, limit, onLimitChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mb-8 mt-8 rounded-xl border border-slate-200 bg-white px-3 py-4 shadow-sm sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
            currentPage === 1
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Prev
        </button>

        <p className="text-sm font-medium text-gray-600">
          Page {currentPage} of {totalPages}
        </p>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
            currentPage === totalPages
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg font-medium text-blue-500 hover:bg-blue-100"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 py-2 text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-2 rounded-lg font-medium transition ${
              currentPage === num
                ? 'bg-blue-500 text-white'
                : 'text-blue-500 hover:bg-blue-100'
            }`}
          >
            {num}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 py-2 text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg font-medium text-blue-500 hover:bg-blue-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex justify-center">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
