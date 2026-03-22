import React, { useEffect, useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import NoEvent from './NoEvent'
import ServerErr from '../../SeverErr'
import { AppContext } from '../../../context/App'
import EventCard from './EventCard'
import SectionIntro from '../../common/SectionIntro'
import SearchFilterSort from '../../common/SearchFilterSort'
import Pagination from '../../common/Pagination'

const PastEvent = () => {
  const { pastEvent, handlePastEvent } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('startdate');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    handlePastEvent({
      q: searchValue,
      sortBy: sortValue,
      sortOrder,
      page: currentPage,
      limit,
      isActive: false
    });
  }, [handlePastEvent, searchValue, sortValue, sortOrder, currentPage, limit]);

  const handleReset = () => {
    setCurrentPage(1);
    setLimit(20);
    setSearchValue('');
    setSortValue('startdate');
    setSortOrder('desc');
  };

  const displayData = pastEvent && Array.isArray(pastEvent.data)
    ? pastEvent.data
    : (Array.isArray(pastEvent) ? pastEvent : []);

  const paginationData = pastEvent && typeof pastEvent === 'object' && pastEvent.pagination
    ? pastEvent.pagination
    : null;

  return (
    <div className="app-section pt-2">
      <Helmet>
        <title>Our Past Events - Koshish</title>
        <meta name="description" content="Explore the past events organized by Koshish." />
        <meta name="keywords" content="Koshish, Past Events, Workshops, Competitions" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <SectionIntro
        title="Our Past Events"
        description="Our past events have created memorable experiences, from workshops to competitions, bringing together people passionate about growth and development."
      />

      <SearchFilterSort
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortOptions={[
          { label: 'Start Date', value: 'startdate' },
          { label: 'End Date', value: 'endDate' },
          { label: 'Name', value: 'name' }
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOrderValue={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={handleReset}
      />
      
    {pastEvent !== "5xx" ? (
      <div>
      {displayData.length === 0 ? (
        <NoEvent />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayData.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

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
    ) : (
      <ServerErr />
    )}
  </div>
  
  )
}

export default PastEvent