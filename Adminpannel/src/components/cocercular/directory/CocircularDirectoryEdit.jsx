import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CocircularDirectoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    degree: '',
    linkedin: '',
    quote: '',
    about: '',
    isactive: true,
    image: null
  });

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

        if (!data?.success || !data?.data) {
          toast.error(data?.message || 'Profile not found');
          navigate('/directory/co-curricular');
          return;
        }

        const row = data.data;
        setForm((prev) => ({
          ...prev,
          name: row.name || '',
          email: row.email || '',
          password: '',
          speciality: row.speciality || '',
          degree: row.degree || '',
          linkedin: row.linkedin || '',
          quote: row.quote || '',
          about: row.about || '',
          isactive: row.isactive !== false,
          image: null
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [backendURL, token, id, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('email', form.email);
      payload.append('speciality', form.speciality);
      payload.append('degree', form.degree);
      payload.append('linkedin', form.linkedin);
      payload.append('quote', form.quote);
      payload.append('about', form.about);
      payload.append('isactive', String(form.isactive));
      if (form.password.trim()) {
        payload.append('password', form.password);
      }
      if (form.image) {
        payload.append('image', form.image);
      }

      const { data } = await axios.patch(`${backendURL}/api/cocirculer/cocircular/update/${id}`, payload, {
        withCredentials: true,
        headers: {
          ...(token ? { authCociculertoken: token } : {}),
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!data?.success) {
        toast.error(data?.message || 'Unable to update profile');
        return;
      }

      toast.success(data.message || 'Profile updated');
      navigate(`/directory/co-curricular/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500">Loading profile...</p>;
  }

  return (
    <div className="space-y-5">
      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate(`/directory/co-curricular/${id}`)}>
        Back to View
      </button>

      <div className="admin-card p-6">
        <h1 className="admin-heading mb-4">Edit Co-Curricular Profile</h1>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <input className="admin-input" placeholder="Name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="admin-input" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="admin-input" type="password" placeholder="New Password (optional)" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          <input className="admin-input" placeholder="Speciality" value={form.speciality} onChange={(e) => setForm((p) => ({ ...p, speciality: e.target.value }))} />
          <input className="admin-input" placeholder="Degree" value={form.degree} onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))} />
          <input className="admin-input" placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))} />
          <input className="admin-input md:col-span-2" placeholder="Quote" value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} />
          <textarea className="admin-input md:col-span-2 min-h-28" placeholder="About" value={form.about} onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))} />

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Profile Image (optional replace)</label>
            <input className="admin-input" type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <select className="admin-input" value={form.isactive ? 'active' : 'inactive'} onChange={(e) => setForm((p) => ({ ...p, isactive: e.target.value === 'active' }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CocircularDirectoryEdit;
