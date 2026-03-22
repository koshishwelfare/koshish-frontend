import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AppContext } from '../../../context/App';
import AlbumCard from './AlbumCard';
import Pagination from '../../common/Pagination';
import SearchFilterSort from '../../common/SearchFilterSort';
import SectionIntro from '../../common/SectionIntro';

const Memories = () => {
  const { memories, handleMemories } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [paginationData, setPaginationData] = useState(null);

  useEffect(() => {
    handleMemories({
      q: searchValue,
      sortBy: sortValue,
      sortOrder: sortOrder,
      page: currentPage,
      limit: limit,
      isNews: false
    });
  }, [handleMemories, searchValue, sortValue, sortOrder, currentPage, limit]);

  useEffect(() => {
    if (memories && typeof memories === 'object' && memories.pagination) {
      setPaginationData(memories.pagination);
    }
  }, [memories]);

  const handleReset = () => {
    setCurrentPage(1);
    setLimit(20);
    setSearchValue('');
    setSortValue('date');
    setSortOrder('desc');
  };

  const displayData = memories && Array.isArray(memories.data) ? memories.data : (Array.isArray(memories) ? memories : []);

  return (
    <div className="app-section pt-2">
      <Helmet>
        <title>Koshish Memories</title>
        <meta name='description' content='A collection of cherished memories from Koshish.' />
        <meta name='keywords' content='Koshish, Memories, Gallery' />
        <meta name='author' content='Koshish Team' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='robots' content='index, follow' />
      </Helmet>
      
      <SectionIntro
        title="Koshish Memories"
        description="Every moment with Koshish is worth preserving. This section captures the journey through events, efforts, and the people behind them."
      />

      {/* Search, Filter, Sort */}
      <SearchFilterSort
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortOptions={[
          { label: 'Date', value: 'date' },
          { label: 'Title', value: 'galleryTitle' }
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOrderValue={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={handleReset}
      />

      {/* Memories Grid */}
      {displayData.length === 0 ? (
        <p className="text-center text-gray-500 text-lg font-medium py-6">
          No memories found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {displayData.map((item, idx) => (
              <AlbumCard key={item._id || idx} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {paginationData && paginationData.totalPages > 1 && (
            <Pagination
              currentPage={paginationData.page}
              totalPages={paginationData.totalPages}
              onPageChange={setCurrentPage}
              limit={limit}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setCurrentPage(1);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Memories;
