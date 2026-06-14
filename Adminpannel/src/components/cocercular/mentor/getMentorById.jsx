import { useParams } from 'react-router-dom'
import { CocirculerContext } from '../../../context/cocirculer';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

const GetMentorById = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const {
    MentorById,
    handelTearminateMentorById,
    handelMakeTopMentorById,
    handelMentorById
  } = useContext(CocirculerContext);

  useEffect(() => {
    handelMentorById(id);
  }, [id]);

  const handleMakeTopMentor = async () => {
    await handelMakeTopMentorById(id);
    await handelMentorById(id);
  };

  const handleTerminateMentor = async () => {
    await handelTearminateMentorById(id);
    await handelMentorById(id);
  };

  if (!MentorById || !MentorById._id) {
    return <div className="admin-card p-6">Loading member preview...</div>;
  }

  return (
    <div className="admin-card p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Member Preview</h2>
          <p className="text-sm text-slate-500">ID: {MentorById._id}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigator('/member/all')} className="admin-btn admin-btn-secondary">Back</button>
          <button onClick={() => navigator(`/member/update/${id}`)} className="admin-btn admin-btn-primary">Edit</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[180px_1fr]">
        <img
          src={MentorById.image}
          alt={MentorById.name}
          className="h-44 w-44 rounded-xl border border-slate-200 object-cover"
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <p><strong>Name:</strong> {MentorById.name || '-'}</p>
          <p><strong>Email:</strong> {MentorById.email || '-'}</p>
          <p><strong>Role:</strong> {MentorById.role || '-'}</p>
          <p><strong>Subject:</strong> {MentorById.subject || '-'}</p>
          <p><strong>Class Teacher:</strong> {MentorById.classTeacher || '-'}</p>
          <p><strong>Speciality:</strong> {MentorById.speciality || '-'}</p>
          <p><strong>YOG:</strong> {MentorById.yog || '-'}</p>
          <p><strong>LinkedIn:</strong> {MentorById.linkedin || '-'}</p>
          <p><strong>Top Member:</strong> {MentorById.isTop ? 'Yes' : 'No'}</p>
          <p><strong>Active:</strong> {MentorById.isActive ? 'Yes' : 'No'}</p>
          <p><strong>Role:</strong> {MentorById.role || '-'}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p><strong>Quote:</strong> {MentorById.quote || '-'}</p>
        <p><strong>About Heading:</strong> {MentorById.aboutHead || '-'}</p>
        <p><strong>About:</strong> {MentorById.about || '-'}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={handleTerminateMentor} className="admin-btn admin-btn-danger">
          {MentorById.isActive ? 'Terminate' : 'Activate'} Member
        </button>
        <button onClick={handleMakeTopMentor} className="admin-btn admin-btn-secondary">
          {MentorById.isTop ? 'Remove Top Member' : 'Make Top Member'}
        </button>
      </div>
    </div>
  )
}

export default GetMentorById