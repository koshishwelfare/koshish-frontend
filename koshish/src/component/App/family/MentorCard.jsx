import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
const MentorCard = ({ item, profilePathBase = '/family' }) => {
  const navigate = useNavigate();
  const profilePath = `${profilePathBase}/${item._id}`;
  return (
    <div className="app-card group w-full cursor-pointer border border-emerald-200 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
     <Helmet>
        <title>Family-Koshish</title>
        <meta name="description" content={`Learn more about ${item.name}, a mentor at Koshish.`} />
        <meta name="keywords" content={`Koshish, Mentors, ${item.name}`} />
        <meta name="author" content="Koshish Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
     </Helmet>
      <div className="flex justify-center relative">
        <img
          src={item.image}
          alt={item.name}
          onClick={() => navigate(profilePath)}
          className="h-32 w-32 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56"
        />
        {item.isTop && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg border-2 border-yellow-300">
            <span className="text-xl">⭐</span>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-lg bg-white p-4 text-center shadow-inner">
        {item.name !="NAN" &&<h2 className="text-lg sm:text-xl font-semibold text-blue10 mb-1">
          {item.name}
        
            {item.yog && item.yog !=-1 && <span className="text-sm ml-2 text-gray-800">{item.yog-4}-{item.yog-2000}</span>}
          
        </h2>}
        {item.speciality != "NAN" &&  <p className="mb-2 text-sm font-semibold text-emerald-700 sm:text-lg">
          {item.speciality}
        </p>}
        {item.subject && item.subject !== "NAN" && (
          <p className="mb-2 text-sm text-slate-600">
            <span className="font-semibold">📖 Subject:</span> {item.subject}
          </p>
        )}
        {item.classTeacher && item.classTeacher !== "NAN" && (
          <p className="mb-2 text-sm text-slate-600">
            <span className="font-semibold">👨‍🏫 Class:</span> {item.classTeacher}
          </p>
        )}
        {(item.session?.name || item.sessionId?.name) && (
          <p className="mb-2 text-sm text-slate-600">
            <span className="font-semibold">📅 Session:</span> {item.session?.name || item.sessionId?.name}
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        {item.linkedin != "NAN" && (
          <a
            href={item.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-2xl transition-transform duration-300 hover:scale-110"
          >
            <FaLinkedin />
          </a>
        )}
        <button
          onClick={() => navigate(profilePath)}
          className="app-btn-primary"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
