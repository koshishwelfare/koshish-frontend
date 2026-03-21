import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AppContext } from '../../../context/App'
import AlbumCard from './AlbumCard'
import Pagination from '../../common/Pagination'
import SearchFilterSort from '../../common/SearchFilterSort'
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
  }, [searchValue, sortValue, sortOrder, currentPage, limit])

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
    <div className="p-6">
      <Helmet>
        <title> Koshish in the News</title>
        <meta name='description' content='Koshish in the News - Stay updated with the latest news articles featuring Koshish.' />
        <meta name='keywords' content='Koshish, News, Articles, Social Impact' />
        <meta name='author' content='Koshish Team' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='robots' content='index, follow' />
      </Helmet>
      <div className="w-full px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue10 mb-6">
          Koshish in the News
          </h2>
          <p className="text-md sm:text-xl font-sm text-gray-700 leading-relaxed">
          We’re proud to have been recognized in various newspapers. Here, we’ve compiled those proud moments that mark our contribution and commitment toward social impact.
          </p>
        </div>
      </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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