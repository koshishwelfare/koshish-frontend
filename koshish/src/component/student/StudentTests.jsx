import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';

const StudentTests = () => {
  const { studentTests, studentFetchTests } = useContext(StudentContext);
  const [search, setSearch] = useState('');

  useEffect(() => {
    studentFetchTests({ q: search, page: 1, limit: 20 });
  }, [search]);

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue10">Test Series</h2>
        <input
          className="border rounded px-3 py-2"
          placeholder="Search test by title/subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentTests.map((test) => (
          <div key={test._id} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-1">{test.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{test.subject} | {test.className}</p>
            <p className="text-sm mb-1">Questions: {test.totalQuestions}</p>
            <p className="text-sm mb-3">Total Marks: {test.totalMarks}</p>
            <div className="flex gap-2 flex-wrap">
              <Link to={`/student/tests/${test._id}`} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Start Test</Link>
              <Link to={`/student/tests/${test._id}/answers`} className="px-3 py-2 rounded bg-emerald-600 text-white text-sm">See Answer</Link>
              <Link to={`/student/leaderboard/${test._id}`} className="px-3 py-2 rounded bg-purple-600 text-white text-sm">Leaderboard</Link>
            </div>
          </div>
        ))}
      </div>
      {!studentTests.length && <p className="text-gray-500 mt-3">No tests found.</p>}
    </div>
  );
};

export default StudentTests;
