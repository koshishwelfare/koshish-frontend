import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CollaboratorDirectoryView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const token = localStorage.getItem('cirToken');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendURL}/api/cocirculer/collaborators/view/${id}`, {
          withCredentials: true,
          headers: token ? { authCociculertoken: token } : {}
        });

        if (data?.success) {
          setProfile(data.data);
        } else {
          setProfile(null);
        }
      } catch (error) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [backendURL, token, id]);

  if (loading) {
    return <p className="text-slate-500">Loading collaborator...</p>;
  }

  if (!profile) {
    return <p className="text-rose-600">Collaborator not found.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate('/directory/collaborators')}
          className="admin-btn admin-btn-secondary"
        >
          Back to Directory
        </button>
        <button
          type="button"
          onClick={() => navigate(`/directory/collaborators/edit/${id}`)}
          className="admin-btn admin-btn-primary"
        >
          Edit Collaborator
        </button>
      </div>

      <div className="admin-card p-6">
        <div className="flex flex-col gap-5 md:flex-row">
          <img src={profile.image} alt={profile.name} className="h-40 w-40 rounded-xl object-cover" />
          <div className="space-y-2">
            <h1 className="admin-heading">{profile.name}</h1>
            <p className="text-slate-600">Speciality: {profile.speciality || '-'}</p>
            <p className="text-slate-600">Email: {profile.email || '-'}</p>
            <p className="text-slate-600">Status: {profile.isActive ? 'Active' : 'Inactive'}</p>
            {profile.website && <a className="text-blue-700 underline" href={profile.website} target="_blank" rel="noreferrer">Visit Website</a>}
          </div>
        </div>
        {profile.about && <p className="mt-4 text-slate-700">{profile.about}</p>}
      </div>
    </div>
  );
};

export default CollaboratorDirectoryView;
