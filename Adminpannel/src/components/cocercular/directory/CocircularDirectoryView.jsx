import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CocircularDirectoryView = () => {
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
        const { data } = await axios.get(`${backendURL}/api/cocirculer/cocircular/view/${id}`, {
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

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this co-curricular profile? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      const { data } = await axios.delete(`${backendURL}/api/cocirculer/cocircular/delete/${id}`, {
        withCredentials: true,
        headers: token ? { authCociculertoken: token } : {}
      });

      if (!data?.success) {
        toast.error(data?.message || 'Unable to delete profile');
        return;
      }

      toast.success(data.message || 'Profile deleted');
      navigate('/directory/co-curricular');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <p className="text-slate-500">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-rose-600">Profile not found.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate('/directory/co-curricular')}
          className="admin-btn admin-btn-secondary"
        >
          Back to Directory
        </button>
        <button
          type="button"
          onClick={() => navigate(`/directory/co-curricular/edit/${id}`)}
          className="admin-btn admin-btn-primary"
        >
          Edit Profile
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="admin-btn admin-btn-secondary"
        >
          Delete Profile
        </button>
      </div>

      <div className="admin-card p-6">
        <div className="flex flex-col gap-5 md:flex-row">
          <img src={profile.image} alt={profile.name} className="h-40 w-40 rounded-xl object-cover" />
          <div className="space-y-2">
            <h1 className="admin-heading">{profile.name}</h1>
            <p className="text-slate-600">Email: {profile.email || '-'}</p>
            <p className="text-slate-600">Speciality: {profile.speciality || '-'}</p>
            <p className="text-slate-600">Degree: {profile.degree || '-'}</p>
            <p className="text-slate-600">Status: {profile.isactive ? 'Active' : 'Inactive'}</p>
            {profile.linkedin && <a className="text-blue-700 underline" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          </div>
        </div>
        {profile.quote && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-slate-700">{profile.quote}</p>}
        {profile.about && <p className="mt-3 text-slate-700">{profile.about}</p>}
      </div>
    </div>
  );
};

export default CocircularDirectoryView;
