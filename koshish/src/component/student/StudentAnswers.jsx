import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';

const StudentAnswers = () => {
  const { testId } = useParams();
  const { studentAnswerSheet, studentFetchAnswers } = useContext(StudentContext);

  useEffect(() => {
    studentFetchAnswers(testId);
  }, [testId]);

  if (!studentAnswerSheet) {
    return <div className="bg-white rounded-lg shadow p-5">Loading answer sheet...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h2 className="text-2xl font-bold text-blue10 mb-2">Answer Sheet</h2>
      <p className="text-gray-700 mb-4">Score: {studentAnswerSheet.score} / {studentAnswerSheet.totalMarks}</p>

      <div className="space-y-4">
        {studentAnswerSheet.answers.map((q) => (
          <div key={q.questionIndex} className="border rounded p-4">
            <p className="font-semibold">Q{q.questionIndex + 1}. {q.questionText}</p>
            <p className="text-sm mt-1">Your Answer: {q.selectedOption !== null ? q.options[q.selectedOption] : 'Not attempted'}</p>
            <p className="text-sm text-green-700">Correct Answer: {q.options[q.correctOption]}</p>
            {q.explanation && <p className="text-sm text-gray-600 mt-1">Explanation: {q.explanation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAnswers;
