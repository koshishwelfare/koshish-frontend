import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AppContext } from "../../../context/App";
import Loader from "../../Loader";
import NoData from "../../NoData";

const CoordinatorProfile = () => {
  const { coOrdi, handleCoOrdinator } = useContext(AppContext);

  useEffect(() => {
    handleCoOrdinator();
  }, [handleCoOrdinator]);

  if (coOrdi === "5xx") {
    return <NoData />;
  }

  if (!coOrdi || !coOrdi._id) {
    return <Loader />;
  }

  return (
    <div className="app-section pt-28 pb-16 px-4">
      <Helmet>
        <title>Coordinator Profile - Koshish</title>
        <meta name="description" content="Profile of the currently active co-curricular coordinator." />
        <meta name="keywords" content="Koshish, Coordinator, Co-Curricular" />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <img
            src={coOrdi.image}
            alt={coOrdi.name}
            className="h-44 w-44 rounded-2xl object-cover shadow-md"
          />

          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold text-blue10">{coOrdi.name}</h1>
            {coOrdi.speciality && (
              <p className="text-lg font-semibold text-emerald-700">{coOrdi.speciality}</p>
            )}
            {coOrdi.joinTime && (
              <p className="text-sm text-slate-500">Joined on {new Date(coOrdi.joinTime).toDateString()}</p>
            )}
            {coOrdi.linkedin && coOrdi.linkedin !== "NAN" && (
              <a
                href={coOrdi.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                View LinkedIn
              </a>
            )}
          </div>
        </div>

        {coOrdi.quote && (
          <div className="mt-8 rounded-xl border-l-4 border-emerald-400 bg-emerald-50 p-4 text-slate-700">
            {coOrdi.quote}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorProfile;