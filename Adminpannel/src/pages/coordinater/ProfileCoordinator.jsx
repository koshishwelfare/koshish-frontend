import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoordinatorContext } from '../../context/coordinater';

const typeLabelMap = {
  cocircular: 'Co-curricular',
  teacher: 'Teacher',
  student: 'Student'
};

const formatLabel = (key) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

const isEmptyLike = (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return true;
  }

  const text = String(value).trim().toLowerCase();
  return text === '' || text === 'nan' || text === 'null' || text === 'undefined';
};

const isLikelyUrl = (value) => {
  if (isEmptyLike(value)) {
    return false;
  }

  return /^https?:\/\/\S+$/i.test(String(value).trim());
};

const isLikelyImageField = (key) => /(image|img|photo|avatar|logo|banner|pic)/i.test(key);

const isLikelyImageUrl = (value) => {
  if (isEmptyLike(value)) {
    return false;
  }

  if (!isLikelyUrl(value)) {
    return false;
  }

  const cleaned = value.split('?')[0];
  if (/\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(cleaned)) {
    return true;
  }

  return /(cloudinary|image|img|photo|avatar)/i.test(value);
};

const getProfileImageUrl = (profile) => {
  if (!profile) {
    return null;
  }

  const imageKeys = ['imgurl', 'image', 'imageUrl', 'img', 'photo', 'avatar', 'profileImage', 'profilePhoto'];
  for (const key of imageKeys) {
    const value = profile[key];
    if (isLikelyImageUrl(value)) {
      return String(value);
    }
  }

  for (const [key, value] of Object.entries(profile)) {
    if (isLikelyImageField(key) && isLikelyImageUrl(value)) {
      return String(value);
    }
  }

  return null;
};

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11 4" />
    <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L13 20" />
  </svg>
);

const ProfileCoordinator = () => {
  const { userType, id } = useParams();
  const navigate = useNavigate();
  const {
    handleGetCoordinatorCocircularProfile,
    handleGetCoordinatorTeacherProfile,
    handleGetCoordinatorStudentProfile
  } = useContext(CoordinatorContext);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      let data = null;
      if (userType === 'cocircular') {
        data = await handleGetCoordinatorCocircularProfile(id);
      } else if (userType === 'teacher') {
        data = await handleGetCoordinatorTeacherProfile(id);
      } else if (userType === 'student') {
        data = await handleGetCoordinatorStudentProfile(id);
      }
      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [userType, id]);

  const profileTitle = typeLabelMap[userType] || 'User';
  const displayName =
    profile?.name ||
    profile?.fullname ||
    profile?.fullName ||
    profile?.username ||
    `${profileTitle} Profile`;
  const displayEmail = profile?.email || profile?.emailid || profile?.mail || null;
  const initials =
    displayName
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') ||
    profileTitle.slice(0, 2).toUpperCase();
  const profileImageUrl = getProfileImageUrl(profile);

  const visibleEntries = profile
    ? Object.entries(profile).filter(([key, value]) => {
        if (['__v', 'password'].includes(key)) {
          return false;
        }

        // Keep only one main image in the header and hide extra image-url fields below.
        if (isLikelyImageField(key) && isLikelyImageUrl(value)) {
          return false;
        }

        return true;
      })
    : [];

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={displayName}
                  className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{profileTitle}</p>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{displayName}</h2>
                {displayEmail && <p className="text-sm text-slate-600">{displayEmail}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {typeof profile?.isactive === 'boolean' && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    profile.isactive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {profile.isactive ? 'Active' : 'Inactive'}
                </span>
              )}

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Profile Details</h3>
          {!loading && !!visibleEntries.length && (
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{visibleEntries.length} fields</span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl border border-slate-200 p-3">
                <div className="h-3 w-24 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : !profile ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
            <p className="text-sm font-medium text-slate-600">Profile not found.</p>
            <p className="mt-1 text-xs text-slate-500">The selected record may have been removed or is unavailable.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEntries.map(([key, value]) => (
              <div key={key} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{formatLabel(key)}</p>
                {typeof value === 'object' && value !== null ? (
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-50 p-2 text-xs text-slate-700">
                    {formatValue(value)}
                  </pre>
                ) : isLikelyUrl(value) ? (
                  <div className="mt-2">
                    <a
                      href={String(value)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      aria-label={`Open ${formatLabel(key)} link`}
                    >
                      <LinkIcon />
                      Open Link
                    </a>
                  </div>
                ) : (
                  <p className="mt-1 break-all font-medium text-slate-800">{formatValue(value)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCoordinator;
