import { useContext, useEffect } from 'react';
import { StudentContext } from '../../context/StudentContext';

const StudentAttendance = () => {
  const { studentAttendance, studentFetchAttendance } = useContext(StudentContext);

  useEffect(() => {
    studentFetchAttendance();
  }, []);

  const rows = Array.isArray(studentAttendance) ? studentAttendance : [];

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-5">
      <h2 className="text-2xl font-bold text-blue10 mb-4">My Attendance</h2>

      {rows.length > 0 && (
        <div className="space-y-3 md:hidden">
          {rows.map((item) => (
            <article key={item._id} className="app-data-card">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="app-data-label">Date</p>
                  <p className="app-data-value">{item.date}</p>
                </div>
                <div>
                  <p className="app-data-label">Status</p>
                  <p className="app-data-value">{item.status}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="app-data-label">Remarks</p>
                <p className="app-data-value">{item.remarks || '-'}</p>
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
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.date}</td>
                  <td className="border p-2">{item.status}</td>
                  <td className="border p-2">{item.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!rows.length && <p className="mt-3 text-gray-500">No attendance data found.</p>}
    </div>
  );
};

export default StudentAttendance;
