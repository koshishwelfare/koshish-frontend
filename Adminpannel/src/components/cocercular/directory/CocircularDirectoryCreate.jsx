import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CocircularDirectoryCreate = () => {
  const navigate = useNavigate();
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('email', form.email);
      payload.append('password', form.password);
      payload.append('speciality', form.speciality);
      payload.append('degree', form.degree);
      payload.append('linkedin', form.linkedin);
      payload.append('quote', form.quote);
      payload.append('about', form.about);
      payload.append('isactive', String(form.isactive));
      if (form.image) {
        payload.append('image', form.image);
      }

      const { data } = await axios.post(`${backendURL}/api/cocirculer/cocircular/add`, payload, {
        withCredentials: true,
        headers: {
          ...(token ? { authCociculertoken: token } : {}),
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!data?.success) {
        toast.error(data?.message || 'Unable to create co-curricular profile');
        return;
      }

      toast.success(data.message || 'Co-curricular profile created');
      navigate('/directory/co-curricular');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/directory/co-curricular')}>
        Back to Directory
      </button>

      <div className="admin-card p-6">
        <h1 className="admin-heading mb-4">Add Co-Curricular Profile</h1>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <input className="admin-input" placeholder="Name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="admin-input" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="admin-input" type="password" placeholder="Password (min 8 chars)" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          <input className="admin-input" placeholder="Speciality" value={form.speciality} onChange={(e) => setForm((p) => ({ ...p, speciality: e.target.value }))} />
          <input className="admin-input" placeholder="Degree" value={form.degree} onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))} />
          <input className="admin-input" placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))} />
          <input className="admin-input md:col-span-2" placeholder="Quote" value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} />
          <textarea className="admin-input md:col-span-2 min-h-28" placeholder="About" value={form.about} onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))} />

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Profile Image</label>
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
              {saving ? 'Saving...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CocircularDirectoryCreate;
