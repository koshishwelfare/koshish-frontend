import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ListPageHeader = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  addButtonText = 'Add New',
  addButtonPath = '#',
  searchPlaceholder = 'Search...'
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-6">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="admin-heading">{title}</h1>
        <button
          onClick={() => navigate(addButtonPath)}
          className="admin-btn admin-btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          <FaPlus size={16} />
          {addButtonText}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-3.5 text-slate-400" size={16} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="admin-input pl-10 w-full"
        />
      </div>
    </div>
  );
};

export default ListPageHeader;
