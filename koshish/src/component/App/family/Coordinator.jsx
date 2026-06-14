import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/App";
import SectionIntro from "../../common/SectionIntro";
import MentorCard from "./MentorCard";
import Loader from "../../Loader";
import NoData from "../../NoData";

const Coordinator = () => {
  const { coOrdi, handleCoOrdinator } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    handleCoOrdinator();
  }, [handleCoOrdinator]);

  return (
    <div className="app-section pt-2 text-center">
      <Helmet>
        <title>Coordinator - Koshish</title>
        <meta name="description" content="Meet the currently active co-curricular coordinator." />
        <meta name="keywords" content="Koshish, Coordinator, Co-Curricular" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <SectionIntro
        title="Coordinator"
        description="Currently active co-curricular coordinator guiding Koshish initiatives."
      />

      {coOrdi === "5xx" ? (
        <NoData />
      ) : !coOrdi ? (
        <Loader />
      ) : coOrdi._id ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="max-w-sm">
              <MentorCard item={coOrdi} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/coordinator-profile')}
            className="app-btn-primary"
          >
            View Full Coordinator Profile
          </button>
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default Coordinator;