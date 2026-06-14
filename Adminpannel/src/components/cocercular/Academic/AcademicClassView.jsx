import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import { formatDateTime } from '../../../utilities/dateFormatter';

const AcademicClassView = () => {
  const { id } = useParams();
  const { handleGetAcademicClassById } = useContext(CocirculerContext);
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await handleGetAcademicClassById(id);
      if (data) {
        setClassData(data);
      }
    };
    load();
  }, [id]);

  if (!classData) {
    return <div className="rounded bg-white p-4 shadow">Loading class...</div>;
  }

  const primaryMentorId = String(classData?.mentorId?._id || classData?.mentorId || '');
  const assignedMentors = Array.isArray(classData.teacherIds)
    ? classData.teacherIds
        .map((mentor) => ({
          id: String(mentor?._id || mentor || ''),
          label: mentor?.name || mentor?.username || mentor?.email || 'Unknown Mentor'
        }))
        .filter((mentor) => Boolean(mentor.id))
    : [];

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Class View</h2>
      <div className="space-y-2 text-sm">
        <p><strong>Class:</strong> {classData.name}</p>
        <p><strong>Grade:</strong> {classData.grade}</p>
        <p><strong>Section:</strong> {classData.section}</p>
        <p><strong>Session:</strong> {classData.sessionId?.name || '-'}</p>
        <p><strong>Mentor:</strong> {classData.mentorId?.name || '-'}</p>
        <p><strong>Mentor Email:</strong> {classData.mentorId?.email || '-'}</p>
        <div>
          <p><strong>Assigned Mentors:</strong></p>
          {assignedMentors.length ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {assignedMentors.map((mentor) => (
                <span
                  key={mentor.id}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${mentor.id === primaryMentorId ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}
                >
                  {mentor.label}
                  {mentor.id === primaryMentorId ? ' (Primary)' : ''}
                </span>
              ))}
            </div>
          ) : (
            <p>-</p>
          )}
        </div>
        <hr className="my-3" />
        <p><strong>Created:</strong> {formatDateTime(classData.createdAt)}</p>
        <p><strong>Last Updated:</strong> {formatDateTime(classData.updatedAt)}</p>
      </div>
      <div className="mt-5 flex gap-2">
        <Link to="/academic/classes" className="rounded border px-3 py-1.5 text-sm">Back</Link>
        <Link to={`/academic/classes/edit/${classData._id}`} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">Edit</Link>
      </div>
    </div>
  );
};

export default AcademicClassView;
