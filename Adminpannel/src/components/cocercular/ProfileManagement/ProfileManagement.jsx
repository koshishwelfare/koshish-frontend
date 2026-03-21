import { useContext, useEffect, useMemo, useState } from 'react';
import { CocirculerContext } from '../../../context/cocirculer';

const blockedKeys = new Set(['_id', '__v', 'password', 'createdAt', 'updatedAt']);
const readOnlyKeys = new Set(['email', 'username']);

const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

const ProfileManagement = () => {
  const { handleGetOwnProfile, handleUpdateOwnProfile } = useContext(CocirculerContext);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const profile = await handleGetOwnProfile();
      if (profile) {
        const sanitized = {};
        Object.entries(profile).forEach(([key, value]) => {
          if (blockedKeys.has(key)) return;
          if (value && typeof value === 'object' && !Array.isArray(value)) return;
          sanitized[key] = value;
        });
        setForm(sanitized);
        if (sanitized.image) {
          setImagePreview(sanitized.image);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const keys = useMemo(() => Object.keys(form).filter((k) => !blockedKeys.has(k) && k !== 'image'), [form]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {};
    keys.forEach((k) => {
      if (readOnlyKeys.has(k)) return;
      payload[k] = form[k];
    });

    // Add image file if selected
    if (imageFile) {
      payload.image = imageFile;
    }

    const ok = await handleUpdateOwnProfile(payload);
    if (ok) {
      setImageFile(null); // Clear the file input after successful upload
      const profile = await handleGetOwnProfile();
      if (profile) {
        const sanitized = {};
        Object.entries(profile).forEach(([key, value]) => {
          if (blockedKeys.has(key)) return;
          if (value && typeof value === 'object' && !Array.isArray(value)) return;
          sanitized[key] = value;
        });
        setForm(sanitized);
        if (sanitized.image) {
          setImagePreview(sanitized.image);
        }
      }
    }
  };

  if (loading) {
    return <div className="rounded bg-white p-4 shadow">Loading profile...</div>;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <h2 className="mb-6 text-xl font-semibold">Profile Management</h2>
      <form className="space-y-4" onSubmit={submit}>
        {/* Profile Picture Section */}
        <div className="mb-6 border-b pb-6">
          <label className="mb-3 block text-sm font-medium">Profile Picture</label>
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Image Preview */}
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-slate-400">No image</span>
              )}
            </div>

            {/* File Input */}
            <div className="flex flex-col justify-center">
              <label className="mb-2 inline-flex cursor-pointer items-center rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <p className="text-xs text-slate-600">Selected: {imageFile.name}</p>
              )}
              <p className="text-xs text-slate-500">Allowed: JPG, PNG, GIF (Max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Other Profile Fields */}
        <div className="space-y-4">
          {keys.map((key) => {
            const value = form[key];
            const readOnly = readOnlyKeys.has(key);

            if (typeof value === 'boolean') {
              return (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    disabled={readOnly}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                  />
                  {formatLabel(key)}
                </label>
              );
            }

            return (
              <div key={key}>
                <label className="mb-1 block text-sm font-medium">{formatLabel(key)}</label>
                <input
                  className={`w-full rounded border px-3 py-2 ${readOnly ? 'bg-slate-100 text-slate-500' : ''}`}
                  type={key === 'date' ? 'date' : 'text'}
                  value={value ?? ''}
                  readOnly={readOnly}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            );
          })}
        </div>

        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileManagement;
