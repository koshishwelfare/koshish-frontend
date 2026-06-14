import { useContext, useEffect, useState } from 'react';
import { StudentContext } from '../../context/StudentContext';

const StudentProfile = () => {
  const {
    studentProfile,
    studentFetchProfile,
    studentUpdateProfile,
    studentLogout,
    studentLoading
  } = useContext(StudentContext);

  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    bio: '',
    profileImage: ''
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    studentFetchProfile();
  }, []);

  useEffect(() => {
    if (studentProfile) {
      setForm({
        name: studentProfile.name || '',
        phoneNumber: studentProfile.phoneNumber || '',
        bio: studentProfile.bio || '',
        profileImage: studentProfile.profileImage || ''
      });
    }
  }, [studentProfile]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      image: profileImageFile || undefined
    };
    const ok = await studentUpdateProfile(payload);
    if (ok) {
      setProfileImageFile(null);
      setIsEditMode(false);
    }
  };

  const onCancelEdit = () => {
    if (studentProfile) {
      setForm({
        name: studentProfile.name || '',
        phoneNumber: studentProfile.phoneNumber || '',
        bio: studentProfile.bio || '',
        profileImage: studentProfile.profileImage || ''
      });
    }
    setProfileImageFile(null);
    setIsEditMode(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue10">Student Profile</h2>
        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 rounded-lg bg-blue10 text-white hover:opacity-95 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={studentLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
        <p><span className="font-semibold">Email:</span> {studentProfile?.email || '-'}</p>
        <p><span className="font-semibold">Registration No:</span> {studentProfile?.registrationNumber || '-'}</p>
        <p><span className="font-semibold">Roll Number:</span> {studentProfile?.rollNumber || '-'}</p>
        <p>
          <span className="font-semibold">Class:</span>{' '}
          {studentProfile?.classId
            ? `${studentProfile.classId.name || ''} ${studentProfile.classId.grade || ''}${studentProfile.classId.section ? ` ${studentProfile.classId.section}` : ''}`.trim()
            : '-'}
        </p>
        <p>
          <span className="font-semibold">Session:</span>{' '}
          {studentProfile?.sessionId
            ? `${studentProfile.sessionId.name || ''}${studentProfile.sessionId.startYear ? ` (${studentProfile.sessionId.startYear}${studentProfile.sessionId.endYear ? `-${studentProfile.sessionId.endYear}` : ''})` : ''}`
            : '-'}
        </p>
        <p><span className="font-semibold">Course (Campus):</span> {studentProfile?.course || '-'}</p>
        <p><span className="font-semibold">Year (Campus):</span> {studentProfile?.year || '-'}</p>
      </div>

      <p className="mb-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        You can update personal details only. Campus data (class, session, course, year, registration) is managed by admin.
      </p>

      {!isEditMode ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={studentProfile?.profileImage || form.profileImage || 'https://via.placeholder.com/64?text=Profile'}
              alt="Student profile"
              className="h-16 w-16 rounded-full object-cover border border-slate-200"
            />
            <div>
              <p className="text-sm text-slate-500">Personal profile photo</p>
              <p className="text-base font-semibold text-slate-800">{studentProfile?.name || '-'}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><span className="font-semibold">Phone Number:</span> {studentProfile?.phoneNumber || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-1">Bio</p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 min-h-16">
              {studentProfile?.bio || 'No bio added yet.'}
            </p>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="flex items-center gap-3">
            <img
              src={studentProfile?.profileImage || form.profileImage || 'https://via.placeholder.com/64?text=Profile'}
              alt="Student profile"
              className="h-16 w-16 rounded-full object-cover border border-slate-200"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <textarea
            value={form.bio}
            onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Bio"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            disabled={studentLoading}
            className="w-full bg-blue10 text-white py-2 rounded-lg font-semibold hover:opacity-95 transition disabled:opacity-60"
          >
            {studentLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentProfile;
