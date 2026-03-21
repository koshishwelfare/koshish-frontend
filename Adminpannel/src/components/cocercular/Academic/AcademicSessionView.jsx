import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CocirculerContext } from '../../../context/cocirculer';
import { formatDateTime } from '../../../utilities/dateFormatter';

const AcademicSessionView = () => {
  const { id } = useParams();
  const { handleGetAcademicSessionById } = useContext(CocirculerContext);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await handleGetAcademicSessionById(id);
      if (data) {
        setSession(data);
      }
    };
    load();
  }, [id]);

  if (!session) {
    return <div className="rounded bg-white p-4 shadow">Loading session...</div>;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow md:p-6">
      <h2 className="mb-4 text-xl font-semibold">Session View</h2>
      <div className="space-y-2 text-sm">
        <p><strong>Name:</strong> {session.name}</p>
        <p><strong>Start Year:</strong> {session.startYear}</p>
        <p><strong>End Year:</strong> {session.endYear}</p>
        <p><strong>Status:</strong> {session.isActive ? 'Active' : 'Inactive'}</p>
        <hr className="my-3" />
        <p><strong>Created:</strong> {formatDateTime(session.createdAt)}</p>
        <p><strong>Last Updated:</strong> {formatDateTime(session.updatedAt)}</p>
      </div>
      <div className="mt-5 flex gap-2">
        <Link to="/academic/sessions" className="rounded border px-3 py-1.5 text-sm">Back</Link>
        <Link to={`/academic/sessions/edit/${session._id}`} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">Edit</Link>
      </div>
    </div>
  );
};

export default AcademicSessionView;
