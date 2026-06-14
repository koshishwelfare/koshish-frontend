import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AppContext } from "../../../context/App";
import MentorCard from "./MentorCard";
import SectionIntro from "../../common/SectionIntro";
import SearchFilterSort from "../../common/SearchFilterSort";
import Pagination from "../../common/Pagination";

const SearchMember = () => {
  const { searchMember, handelSearchMember } = useContext(AppContext);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    handelSearchMember(searchValue, {
      q: searchValue,
      sortBy: sortValue,
      sortOrder,
      page: currentPage,
      limit,
    });
  }, [handelSearchMember, searchValue, sortValue, sortOrder, currentPage, limit]);

  const handleReset = () => {
    setSearchValue("");
    setSortValue("name");
    setSortOrder("asc");
    setCurrentPage(1);
    setLimit(20);
  };

  const displayData = searchMember && Array.isArray(searchMember.data)
    ? searchMember.data
    : Array.isArray(searchMember)
      ? searchMember
      : [];

  const paginationData = searchMember && typeof searchMember === "object" && searchMember.pagination
    ? searchMember.pagination
    : null;

  return (
    <div className="app-section pt-2">
      <Helmet>
        <title>Search Member - Koshish</title>
        <meta name="description" content="Search for a member in the Koshish community." />
        <meta name="keywords" content="Koshish, Search, Member" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <SectionIntro
        title="Search Member"
        description="Search a Koshish family member by name and explore their profile."
      />

      <SearchFilterSort
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortOptions={[
          { label: "Name", value: "name" },
          { label: "Join Time", value: "joinTime" },
          { label: "YOG", value: "yog" },
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOrderValue={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={handleReset}
      />

      {/* Search Results */}
      <div className="mt-6">
        {displayData.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No members found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {displayData.map((member, idx) => (
                <MentorCard item={member} key={member._id || idx} />
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
    </div>
  );
};

export default SearchMember;
