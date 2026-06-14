import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AppContext } from "../../../context/App";
import MentorCard from "./MentorCard";
import ServerErr from "../../SeverErr";
import NoData from "../../NoData";
import Loader from "../../Loader";
import SectionIntro from "../../common/SectionIntro";
import SearchFilterSort from "../../common/SearchFilterSort";
import Pagination from "../../common/Pagination";

const IndexMentor = () => {
  const { allMentor, handelgetAllMentor } = useContext(AppContext);
  const isLoadingState = Array.isArray(allMentor);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("joinTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedYog, setSelectedYog] = useState("All");

  useEffect(() => {
    handelgetAllMentor({
      q: searchValue,
      sortBy: sortValue,
      sortOrder,
      page: currentPage,
      limit,
      role: "mentor",
      isActive: true,
      yog: selectedYog === "All" ? undefined : Number(selectedYog)
    });
  }, [handelgetAllMentor, searchValue, sortValue, sortOrder, currentPage, limit, selectedYog]);

  const mentorItems = allMentor && Array.isArray(allMentor.data)
    ? allMentor.data
    : (Array.isArray(allMentor) ? allMentor : []);

  const paginationData = allMentor && typeof allMentor === "object" && allMentor.pagination
    ? allMentor.pagination
    : null;

  const handleFilterChange = (value) => {
    setSelectedYog(value);
    setCurrentPage(1);
  };

  const uniqueYogs = mentorItems.length
    ? Array.from(new Set(mentorItems.map((mentor) => mentor.yog).filter(Boolean))).sort((a, b) => b - a)
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
    <div className="app-section pt-2">
      <Helmet>
        <title>Meet Our Mentors - Koshish</title>
        <meta name="description" content="Discover the inspiring stories of our Koshish mentors." />
        <meta name="keywords" content="Koshish, Mentors, Success Stories" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.koshishwelfare.in/mentors" />
        
      </Helmet>
      <SectionIntro
        title="Meet Our Mentors"
        description="Our mentors actively contribute time, skills, and guidance to help students dream bigger and achieve more."
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

      <div className="app-card border-none p-5 shadow-none">
        {allMentor && (
          <div>
            {allMentor === "5xx" ? (
              <ServerErr />
            ) : (
              <div>
                {isLoadingState ? (
                  <Loader />
                ) : allMentor === "NODATA" ? (
                  <NoData />
                ) : (
                  <div>
                    {mentorItems.length === 0 ? (
                      <NoData />
                    ) : (
                      <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {mentorItems.map((item, idx) => (
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

export default IndexMentor;
