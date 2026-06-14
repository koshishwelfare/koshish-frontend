import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa';
import Loader from '../../Loader';
import NoData from '../../NoData';
import getCoCircularProfileById from '../../../utils/App/mentor/getCoCircularProfile';

const CoCircularProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const response = await getCoCircularProfileById(import.meta.env.VITE_BACKEND_URL, id);
      if (response?.success) {
        setProfile(response.data);
      } else {
        setProfile('NODATA');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!profile || profile === 'NODATA') {
    return <NoData />;
  }

  return (
    <div className="app-section pt-28 pb-16 px-4">
      <Helmet>
        <title>{profile.name} - Co-Curricular | Koshish</title>
        <meta name="description" content={`Know more about ${profile.name}, a co-curricular profile at Koshish.`} />
      </Helmet>

      <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <img
            src={profile.image}
            alt={profile.name}
            className="h-44 w-44 rounded-2xl object-cover shadow-md"
          />

          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold text-blue10">{profile.name}</h1>
            {profile.speciality && (
              <p className="text-lg font-semibold text-emerald-700">{profile.speciality}</p>
            )}
            {profile.degree && (
              <p className="text-sm text-slate-600">Degree: {profile.degree}</p>
            )}
            {profile.date && (
              <p className="text-sm text-slate-500">Joined on {new Date(profile.date).toDateString()}</p>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <FaLinkedin />
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {profile.quote && (
          <div className="mt-8 rounded-xl border-l-4 border-emerald-400 bg-emerald-50 p-4 text-slate-700">
            {profile.quote}
          </div>
        )}

        {profile.about && (
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-slate-700">
            {profile.about}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoCircularProfile;
