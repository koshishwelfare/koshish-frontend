import React, { useContext, useEffect, useState } from "react";
import NoEvent from "./NoEvent";
import { Helmet } from "react-helmet-async";
import { AppContext } from "../../../context/App";
import ServerErr from "../../SeverErr";
import Loader from "../../Loader";
import EventCard from "./EventCard";
import Pagination from "../../common/Pagination";
import SearchFilterSort from "../../common/SearchFilterSort";

const NewEvent = () => {
  const { newEvent, handleNewEvent } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('startdate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [paginationData, setPaginationData] = useState(null);

  useEffect(() => {
    handleNewEvent({
      q: searchValue,
      sortBy: sortValue,
      sortOrder: sortOrder,
      page: currentPage,
      limit: limit,
      isActive: true
    });
  }, [searchValue, sortValue, sortOrder, currentPage, limit]);

  useEffect(() => {
    if (newEvent && typeof newEvent === 'object' && newEvent.pagination) {
      setPaginationData(newEvent.pagination);
    }
  }, [newEvent]);

  const handleReset = () => {
    setCurrentPage(1);
    setLimit(20);
    setSearchValue('');
    setSortValue('startdate');
    setSortOrder('asc');
  };

  const displayData = newEvent && Array.isArray(newEvent.data) ? newEvent.data : (Array.isArray(newEvent) && newEvent !== 'NODATA' && newEvent !== '5xx' ? newEvent : []);

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>See Recent Events - Koshish</title>
        <meta name="description" content="Stay updated with our recent events at Koshish." />
        <meta name="keywords" content="Koshish, Events, Recent Events" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue10 mb-6">
          See Recent Events
        </h2>
        <p className="text-md sm:text-xl font-sm text-gray-700 leading-relaxed">
          Stay updated with our upcoming events! We are excited to bring new opportunities for learning, networking, and growth. These events are designed to inspire, challenge, and empower participants to make a difference in their fields.
        </p>
      </div>

      {/* Search, Filter, Sort */}
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

      {/* Events Grid */}
      {newEvent !== "5xx" ? (
        <div>
          {newEvent === "NODATA" || displayData.length === 0 ? (
            <NoEvent />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                {displayData.map((event) => (
                  <EventCard key={event._id} event={event} />
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
      ) : (
        <ServerErr />
      )}
    </div>
  );
};

export default NewEvent;
