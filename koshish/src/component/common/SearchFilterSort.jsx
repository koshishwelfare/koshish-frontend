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
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdown */}
        {filterOptions.length > 0 && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Sort By Dropdown */}
        {sortOptions.length > 0 && (
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">Sort By</option>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Sort Order Toggle */}
        {sortOptions.length > 0 && (
          <button
            onClick={() => onSortOrderChange(sortOrderValue === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 font-medium transition w-full sm:w-auto"
            title={`Sort ${sortOrderValue === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrderValue === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 font-medium transition w-full sm:w-auto"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilterSort;
