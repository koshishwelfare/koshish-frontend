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

const CoCircular = () => {
  const { coCircularMembers, handleGetCoCircularMembers } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    handleGetCoCircularMembers({
      q: searchValue,
      sortBy: sortValue,
      sortOrder,
      page: currentPage,
      limit
    });
  }, [handleGetCoCircularMembers, searchValue, sortValue, sortOrder, currentPage, limit]);

  const memberItems = coCircularMembers && Array.isArray(coCircularMembers.data)
    ? coCircularMembers.data
    : (Array.isArray(coCircularMembers) ? coCircularMembers : []);

  const paginationData = coCircularMembers && typeof coCircularMembers === "object" && coCircularMembers.pagination
    ? coCircularMembers.pagination
    : null;

  const handleReset = () => {
    setCurrentPage(1);
    setLimit(20);
    setSearchValue("");
    setSortValue("date");
    setSortOrder("desc");
  };

  return (
    <div className="app-section pt-2 text-center">
      <Helmet>
        <title>Co-Curricular - Koshish</title>
        <meta name="description" content="Meet active co-curricular members onboarded by coordinators." />
        <meta name="keywords" content="Koshish, Co-Curricular, Members" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.koshishwelfare.in/family/co-curricular" />
      </Helmet>

      <SectionIntro
        title="Co-Curricular"
        description="Active co-curricular members, onboarded and managed by the coordinator team."
      />

      <SearchFilterSort
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortOptions={[
          { label: "Joined", value: "date" },
          { label: "Name", value: "name" },
          { label: "Speciality", value: "speciality" }
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOrderValue={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={handleReset}
      />

      <div className="app-card border-none bg-transparent p-5 shadow-none">
        {coCircularMembers && (
          <div>
            {coCircularMembers === "5xx" ? (
              <ServerErr />
            ) : (
              <div>
                {coCircularMembers === "NODATA" ? (
                  <NoData />
                ) : (
                  <div>
                    {memberItems.length === 0 ? (
                      <NoData />
                    ) : (
                      <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {memberItems.map((item, idx) => (
                          <MentorCard item={item} key={idx} profilePathBase="/co-curricular" />
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

export default CoCircular;