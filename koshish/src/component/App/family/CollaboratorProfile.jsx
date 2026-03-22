import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Loader from '../../Loader';
import NoData from '../../NoData';
import { getCollaboratorOrganizationById } from '../../../utils/App/mentor/getCollaborators';

const CollaboratorProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const response = await getCollaboratorOrganizationById(import.meta.env.VITE_BACKEND_URL, id);
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
        <title>{profile.name} - Collaborator | Koshish</title>
        <meta name="description" content={`Know more about ${profile.name}, a collaborator organization with Koshish.`} />
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
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Visit Website
              </a>
            )}
            {profile.email && (
              <p className="text-sm text-slate-600">Email: {profile.email}</p>
            )}
          </div>
        </div>

        {profile.about && (
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-slate-700">
            {profile.about}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaboratorProfile;
