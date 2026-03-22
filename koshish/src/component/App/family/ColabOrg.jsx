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

const ColabOrg = () => {
  const { collaboratorOrganizations, handleGetCollaboratorOrganizations } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    handleGetCollaboratorOrganizations({
      q: searchValue,
      sortBy: sortValue,
      sortOrder,
      page: currentPage,
      limit,
      isActive: true
    });
  }, [handleGetCollaboratorOrganizations, searchValue, sortValue, sortOrder, currentPage, limit]);

  const collaboratorItems = collaboratorOrganizations && Array.isArray(collaboratorOrganizations.data)
    ? collaboratorOrganizations.data
    : (Array.isArray(collaboratorOrganizations) ? collaboratorOrganizations : []);

  const paginationData = collaboratorOrganizations && typeof collaboratorOrganizations === "object" && collaboratorOrganizations.pagination
    ? collaboratorOrganizations.pagination
    : null;

  const handleReset = () => {
    setCurrentPage(1);
    setLimit(20);
    setSearchValue("");
    setSortValue("createdAt");
    setSortOrder("desc");
  };

  return (
    <div className="app-section pt-2 text-center">
      <Helmet>
        <title>Collaborators - Koshish</title>
        <meta name="description" content="Organizations collaborating with Koshish." />
        <meta name="keywords" content="Koshish, Collaborators, Partners" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <SectionIntro
        title="Collaborator Organizations"
        description="Organizations that collaborate with Koshish and strengthen our social impact."
      />

      <SearchFilterSort
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortOptions={[
          { label: "Joined", value: "createdAt" },
          { label: "Name", value: "name" },
          { label: "Status", value: "isActive" }
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOrderValue={sortOrder}
        onSortOrderChange={setSortOrder}
        onReset={handleReset}
      />

      <div className="app-card border-none bg-transparent p-5 shadow-none">
        {collaboratorOrganizations && (
          <div>
            {collaboratorOrganizations === "5xx" ? (
              <ServerErr />
            ) : (
              <div>
                {collaboratorOrganizations === "NODATA" ? (
                  <NoData />
                ) : (
                  <div>
                    {collaboratorItems.length === 0 ? (
                      <NoData />
                    ) : (
                      <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {collaboratorItems.map((item, idx) => (
                          <MentorCard item={item} key={idx} profilePathBase="/collaborator" />
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

export default ColabOrg;
