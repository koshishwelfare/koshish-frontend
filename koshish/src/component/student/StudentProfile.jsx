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
    course: '',
    year: '',
    bio: '',
    profileImage: ''
  });

  useEffect(() => {
    studentFetchProfile();
  }, []);

  useEffect(() => {
    if (studentProfile) {
      setForm({
        name: studentProfile.name || '',
        phoneNumber: studentProfile.phoneNumber || '',
        course: studentProfile.course || '',
        year: studentProfile.year || '',
        bio: studentProfile.bio || '',
        profileImage: studentProfile.profileImage || ''
      });
    }
  }, [studentProfile]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await studentUpdateProfile(form);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue10">Student Profile</h2>
        <button
          type="button"
          onClick={studentLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
        <p><span className="font-semibold">Email:</span> {studentProfile?.email || '-'}</p>
        <p><span className="font-semibold">Registration No:</span> {studentProfile?.registrationNumber || '-'}</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
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
        <input
          type="text"
          value={form.course}
          onChange={(e) => setForm((prev) => ({ ...prev, course: e.target.value }))}
          placeholder="Course"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="text"
          value={form.year}
          onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
          placeholder="Year"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="url"
          value={form.profileImage}
          onChange={(e) => setForm((prev) => ({ ...prev, profileImage: e.target.value }))}
          placeholder="Profile image URL"
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
    </div>
  );
};

export default StudentProfile;
