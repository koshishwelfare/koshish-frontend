import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AppContext } from '../../../context/App'
import AlbumCard from './AlbumCard'
import Pagination from '../../common/Pagination'
import SearchFilterSort from '../../common/SearchFilterSort'
import SectionIntro from '../../common/SectionIntro'

const Newspaper = () => {
  const { newspaper, handleNewsPaper } = useContext(AppContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [searchValue, setSearchValue] = useState('')
  const [sortValue, setSortValue] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [paginationData, setPaginationData] = useState(null)

  useEffect(() => {
    handleNewsPaper({
      q: searchValue,
      sortBy: sortValue,
      sortOrder: sortOrder,
      page: currentPage,
      limit: limit,
      isNews: true
    })
  }, [handleNewsPaper, searchValue, sortValue, sortOrder, currentPage, limit])

  useEffect(() => {
    if (newspaper && typeof newspaper === 'object' && newspaper.pagination) {
      setPaginationData(newspaper.pagination)
    }
  }, [newspaper])

  const handleReset = () => {
    setCurrentPage(1)
    setLimit(20)
    setSearchValue('')
    setSortValue('date')
    setSortOrder('desc')
  }

  const displayData = newspaper && Array.isArray(newspaper.data) ? newspaper.data : (Array.isArray(newspaper) ? newspaper : [])
  return (
    <div className="app-section pt-2">
      <Helmet>
        <title> Koshish in the News</title>
        <meta name='description' content='Koshish in the News - Stay updated with the latest news articles featuring Koshish.' />
        <meta name='keywords' content='Koshish, News, Articles, Social Impact' />
        <meta name='author' content='Koshish Team' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='robots' content='index, follow' />
      </Helmet>
      <SectionIntro
        title="Koshish in the News"
        description="Recognitions and newspaper coverage that highlight our work and social impact."
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

      {/* Newspaper Grid */}
      {displayData.length === 0 ? (
        <p className="text-center text-gray-500 text-lg font-medium py-6">
          No Newspaper found.
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
                setLimit(newLimit)
                setCurrentPage(1)
              }}
            />
          )}
        </>
      )}
    </div>

  )
}

export default Newspaper