import React, { useContext, useEffect, useState } from "react";
import NoEvent from "./NoEvent";
import { Helmet } from "react-helmet-async";
import { AppContext } from "../../../context/App";
import ServerErr from "../../SeverErr";
import Loader from "../../Loader";
import EventCard from "./EventCard";
import Pagination from "../../common/Pagination";
import SearchFilterSort from "../../common/SearchFilterSort";
import SectionIntro from "../../common/SectionIntro";

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
    <div className="app-section pt-2">
      <Helmet>
        <title>See Recent Events - Koshish</title>
        <meta name="description" content="Stay updated with our recent events at Koshish." />
        <meta name="keywords" content="Koshish, Events, Recent Events" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <SectionIntro
        title="See Recent Events"
        description="Stay updated with our upcoming events. We bring new opportunities for learning, networking, and growth through experiences designed to inspire and empower participants."
      />

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
