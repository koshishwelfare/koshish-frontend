import { HiChevronDown } from 'react-icons/hi';

const FilterToolbar = ({ 
  sortValue, 
  onSortChange, 
  filterValue, 
  onFilterChange,
  sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'A-Z', value: 'asc' },
    { label: 'Z-A', value: 'desc' }
  ],
  filterOptions = [],
  showFilter = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Sort Dropdown */}
      <div className="flex-1 relative">
        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
          Sort By
        </label>
        <div className="relative">
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="admin-input appearance-none pr-10"
          >
            <option value="">Select sorting</option>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <HiChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Filter Dropdown - Conditional */}
      {showFilter && filterOptions.length > 0 && (
        <div className="flex-1 relative">
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Filter
          </label>
          <div className="relative">
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="admin-input appearance-none pr-10"
            >
              <option value="">All</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <HiChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-end">
        <p className="text-xs font-medium text-slate-500">
          <span className="hidden sm:inline">Showing filtered and sorted results</span>
          <span className="sm:hidden">Results</span>
        </p>
      </div>
    </div>
  );
};

export default FilterToolbar;
