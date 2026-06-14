import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import NoAnouncement from './NoAnouncement'
import { AppContext } from '../../../context/App'
import NewsCard from './NewsCard'
import SectionIntro from '../../common/SectionIntro'
import SearchFilterSort from '../../common/SearchFilterSort'
import Pagination from '../../common/Pagination'
import ServerErr from '../../SeverErr'

const PastAnouncement = () => {
  const { pastAnnouncement, handlePastAnnouncement } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeFilter, setActiveFilter] = useState('false');
  const [paginationData, setPaginationData] = useState(null);

  useEffect(()=>{
    handlePastAnnouncement({
      q: searchValue,
      sortBy: sortValue,
      sortOrder,
      page: currentPage,
      limit,
      isAtive: activeFilter === '' ? undefined : activeFilter === 'true'
    })
  }, [handlePastAnnouncement, searchValue, sortValue, sortOrder, currentPage, limit, activeFilter])

  useEffect(() => {
    if (pastAnnouncement && typeof pastAnnouncement === 'object' && pastAnnouncement.pagination) {
      setPaginationData(pastAnnouncement.pagination);
    }
  }, [pastAnnouncement]);

  const handleReset = () => {
    setCurrentPage(1);
    setLimit(20);
    setSearchValue('');
    setSortValue('date');
    setSortOrder('desc');
    setActiveFilter('false');
  };

  const displayData = pastAnnouncement && Array.isArray(pastAnnouncement.data)
    ? pastAnnouncement.data
    : (Array.isArray(pastAnnouncement) ? pastAnnouncement : []);

  return (
    <div className='app-section pt-2'>
      <Helmet>
        <title>Past Announcements - Koshish</title>
        <meta name='description' content='Explore the past announcements from Koshish and stay informed about our journey.' />
        <meta name='keywords' content='Koshish, Past Announcements, Updates' />
        <meta name='author' content='Koshish Team' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='robots' content='index, follow' />
      </Helmet>
      <SectionIntro
        title="Past Announcements"
        description="Explore previous announcements and important updates from Koshish."
      />

      <SearchFilterSort
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={[
          { label: 'All', value: '' },
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ]}
        filterValue={activeFilter}
        onFilterChange={(value) => {
          setActiveFilter(value);
          setCurrentPage(1);
        }}
        sortOptions={[
          { label: 'Date', value: 'date' },
          { label: 'Heading', value: 'heading' },
          { label: 'Updated Time', value: 'updatedAt' }
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOrderValue={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={handleReset}
      />

       {pastAnnouncement === '5xx' ? (
        <ServerErr />
      ) : displayData.length !== 0 ?
       
       <div
       className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
       >
          {
           displayData.map ((announcement)=>{
              return (
                <NewsCard key={announcement._id} announcement={announcement} />
              )
            })
          }
       </div> : <NoAnouncement/>}

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
    </div>
  )
}

export default PastAnouncement