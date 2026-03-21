import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';

const StudentLeaderboard = () => {
  const { testId } = useParams();
  const { studentLeaderboard, studentFetchLeaderboard } = useContext(StudentContext);

  useEffect(() => {
    studentFetchLeaderboard(testId);
  }, [testId]);

  return (
    <div className="bg-white rounded-lg shadow p-5 overflow-x-auto">
      <h2 className="text-2xl font-bold text-blue10 mb-4">Leaderboard</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border">Rank</th>
            <th className="text-left p-2 border">Student</th>
            <th className="text-left p-2 border">Reg No</th>
            <th className="text-left p-2 border">Score</th>
          </tr>
        </thead>
        <tbody>
          {studentLeaderboard.map((row) => (
            <tr key={`${row.rank}-${row.registrationNumber}`}>
              <td className="p-2 border">{row.rank}</td>
              <td className="p-2 border">{row.studentName}</td>
              <td className="p-2 border">{row.registrationNumber}</td>
              <td className="p-2 border">{row.score} / {row.totalMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!studentLeaderboard.length && <p className="text-gray-500 mt-3">No leaderboard data available.</p>}
    </div>
  );
};

export default StudentLeaderboard;
