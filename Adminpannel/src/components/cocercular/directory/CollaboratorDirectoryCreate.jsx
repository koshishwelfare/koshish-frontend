import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CollaboratorDirectoryCreate = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    website: '',
    speciality: '',
    about: '',
    isActive: true,
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
      payload.append('website', form.website);
      payload.append('speciality', form.speciality);
      payload.append('about', form.about);
      payload.append('isActive', String(form.isActive));
      if (form.image) {
        payload.append('image', form.image);
      }

      const { data } = await axios.post(`${backendURL}/api/cocirculer/collaborators/add`, payload, {
        withCredentials: true,
        headers: {
          ...(token ? { authCociculertoken: token } : {}),
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!data?.success) {
        toast.error(data?.message || 'Unable to create collaborator');
        return;
      }

      toast.success(data.message || 'Collaborator created');
      navigate('/directory/collaborators');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate('/directory/collaborators')}>
        Back to Directory
      </button>

      <div className="admin-card p-6">
        <h1 className="admin-heading mb-4">Add Collaborator</h1>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <input className="admin-input" placeholder="Organization Name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="admin-input" type="email" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="admin-input" placeholder="Website" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
          <input className="admin-input" placeholder="Speciality" value={form.speciality} onChange={(e) => setForm((p) => ({ ...p, speciality: e.target.value }))} />
          <textarea className="admin-input md:col-span-2 min-h-28" placeholder="About" value={form.about} onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))} />

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Logo / Image</label>
            <input className="admin-input" type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <select className="admin-input" value={form.isActive ? 'active' : 'inactive'} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === 'active' }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Create Collaborator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaboratorDirectoryCreate;
