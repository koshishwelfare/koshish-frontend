import { useContext, useEffect } from 'react';
import { StudentContext } from '../../context/StudentContext';

const StudentAttendance = () => {
  const { studentAttendance, studentFetchAttendance } = useContext(StudentContext);

  useEffect(() => {
    studentFetchAttendance();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-5 overflow-x-auto">
      <h2 className="text-2xl font-bold text-blue10 mb-4">My Attendance</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border">Date</th>
            <th className="text-left p-2 border">Status</th>
            <th className="text-left p-2 border">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {studentAttendance.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border">{item.date}</td>
              <td className="p-2 border">{item.status}</td>
              <td className="p-2 border">{item.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!studentAttendance.length && <p className="text-gray-500 mt-3">No attendance data found.</p>}
    </div>
  );
};

export default StudentAttendance;
