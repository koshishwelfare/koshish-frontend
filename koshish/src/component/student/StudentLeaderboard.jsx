import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';

const StudentLeaderboard = () => {
  const { testId } = useParams();
  const { studentLeaderboard, studentFetchLeaderboard } = useContext(StudentContext);

  useEffect(() => {
    studentFetchLeaderboard(testId);
  }, [testId]);

  const rows = Array.isArray(studentLeaderboard) ? studentLeaderboard : [];

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-5">
      <h2 className="text-2xl font-bold text-blue10 mb-4">Leaderboard</h2>

      {rows.length > 0 && (
        <div className="space-y-3 md:hidden">
          {rows.map((row) => (
            <article key={`${row.rank}-${row.registrationNumber}`} className="app-data-card">
              <p className="app-data-label">Rank</p>
              <p className="app-data-value text-lg font-bold text-blue10">#{row.rank}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="app-data-label">Student</p>
                  <p className="app-data-value">{row.studentName}</p>
                </div>
                <div>
                  <p className="app-data-label">Reg No</p>
                  <p className="app-data-value">{row.registrationNumber}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="app-data-label">Score</p>
                <p className="app-data-value">{row.score} / {row.totalMarks}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Rank</th>
                <th className="border p-2 text-left">Student</th>
                <th className="border p-2 text-left">Reg No</th>
                <th className="border p-2 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.rank}-${row.registrationNumber}`}>
                  <td className="border p-2">{row.rank}</td>
                  <td className="border p-2">{row.studentName}</td>
                  <td className="border p-2">{row.registrationNumber}</td>
                  <td className="border p-2">{row.score} / {row.totalMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!rows.length && <p className="mt-3 text-gray-500">No leaderboard data available.</p>}
    </div>
  );
};

export default StudentLeaderboard;
