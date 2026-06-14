import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/App";
import { Helmet } from "react-helmet-async";
import MentorCard from "./MentorCard";
import ServerErr from "../../SeverErr";
import NoData from "../../NoData";
import Loader from "../../Loader";
import SectionIntro from "../../common/SectionIntro";
import SearchFilterSort from "../../common/SearchFilterSort";
import Pagination from "../../common/Pagination";

const IndexAlumni = () => {
  const { allAlumni, handelgetAllAlumni } = useContext(AppContext);
  const isLoadingState = Array.isArray(allAlumni);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("joinTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedYog, setSelectedYog] = useState("All");

  useEffect(() => {
    handelgetAllAlumni({
      q: searchValue,
      sortBy: sortValue,
      sortOrder,
      page: currentPage,
      limit,
      yog: selectedYog === "All" ? undefined : Number(selectedYog)
    });
  }, [handelgetAllAlumni, searchValue, sortValue, sortOrder, currentPage, limit, selectedYog]);

  const alumniItems = allAlumni && Array.isArray(allAlumni.data)
    ? allAlumni.data
    : (Array.isArray(allAlumni) ? allAlumni : []);

  const paginationData = allAlumni && typeof allAlumni === "object" && allAlumni.pagination
    ? allAlumni.pagination
    : null;

  const handleFilterChange = (value) => {
    setSelectedYog(value);
    setCurrentPage(1);
  };

  const uniqueYogs = alumniItems.length
    ? Array.from(new Set(alumniItems.map((alumnus) => alumnus.yog).filter(Boolean))).sort((a, b) => b - a)
    : [];

  const handleReset = () => {
    setCurrentPage(1);
    setLimit(20);
    setSearchValue("");
    setSortValue("joinTime");
    setSortOrder("desc");
    setSelectedYog("All");
  };

  return (
    <div className="app-section pt-2 text-center">
      <Helmet>
        <title>Meet Our Alumni - Koshish</title>
        <meta name="description" content="Discover the inspiring journeys of our Koshish alumni." />
        <meta name="keywords" content="Koshish, Alumni, Success Stories" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        
      </Helmet>
      <SectionIntro
        title="Meet Our Alumni"
        description="Our alumni laid the foundation of Koshish and continue to inspire us with their journeys."
      />

      <SearchFilterSort
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={[
          { label: "All Years", value: "All" },
          ...uniqueYogs.map((yog) => ({ label: `${yog - 4} - ${yog}`, value: String(yog) }))
        ]}
        filterValue={selectedYog}
        onFilterChange={handleFilterChange}
        sortOptions={[
          { label: "Join Time", value: "joinTime" },
          { label: "Name", value: "name" },
          { label: "YOG", value: "yog" }
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOrderValue={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={handleReset}
      />

      <div className="app-card border-none bg-transparent p-5 shadow-none">
        {allAlumni && (
          <div>
            {allAlumni === "5xx" ? (
              <ServerErr />
            ) : (
              <div>
                {isLoadingState ? (
                  <Loader />
                ) : allAlumni === "NODATA" ? (
                  <NoData />
                ) : (
                  <div>
                    {alumniItems.length === 0 ? (
                      <NoData />
                    ) : (
                      <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {alumniItems.map((item, idx) => (
                          <MentorCard item={item} key={idx} />
                        ))}
                      </div>
                    )}

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
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexAlumni;
