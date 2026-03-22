import React from 'react';

const SearchFilterSort = ({
  searchValue,
  onSearchChange,
  filterOptions = [],
  filterValue,
  onFilterChange,
  sortOptions = [],
  sortValue,
  onSortChange,
  sortOrderValue,
  onSortOrderChange,
  onReset
}) => {
  return (
    <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-md">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:items-center">
        <div className="w-full lg:col-span-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filterOptions.length > 0 && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:col-span-2"
          >
            <option value="">All</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {sortOptions.length > 0 && (
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:col-span-2"
          >
            <option value="">Sort By</option>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {sortOptions.length > 0 && (
          <button
            onClick={() => onSortOrderChange(sortOrderValue === 'asc' ? 'desc' : 'asc')}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium transition hover:bg-gray-100 lg:col-span-2"
            title={`Sort ${sortOrderValue === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrderValue === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        )}

        <button
          onClick={onReset}
          className="w-full rounded-lg bg-gray-400 px-4 py-2 font-medium text-white transition hover:bg-gray-500 lg:col-span-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilterSort;
