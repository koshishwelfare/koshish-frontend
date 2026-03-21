import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';

const StudentTestAttempt = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { studentCurrentTest, studentFetchTestById, studentSubmitCurrentTest } = useContext(StudentContext);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    studentFetchTestById(testId);
  }, [testId]);

  const totalQuestions = useMemo(() => studentCurrentTest?.questions?.length || 0, [studentCurrentTest]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = Object.entries(answers).map(([questionIndex, selectedOption]) => ({
      questionIndex: Number(questionIndex),
      selectedOption: Number(selectedOption)
    }));

    const ok = await studentSubmitCurrentTest(testId, payload);
    if (ok) {
      navigate(`/student/tests/${testId}/answers`);
    }
  };

  if (!studentCurrentTest) {
    return <div className="bg-white rounded-lg shadow p-5">Loading test...</div>;
  }

  return (
    <form className="bg-white rounded-lg shadow p-5" onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold text-blue10 mb-2">{studentCurrentTest.title}</h2>
      <p className="text-gray-600 mb-4">Total Questions: {totalQuestions}</p>

      <div className="space-y-5">
        {studentCurrentTest.questions.map((q) => (
          <div key={q.questionIndex} className="border rounded p-4">
            <p className="font-semibold mb-2">Q{q.questionIndex + 1}. {q.questionText}</p>
            <div className="space-y-2">
              {q.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`question-${q.questionIndex}`}
                    value={optionIndex}
                    checked={String(answers[q.questionIndex] ?? '') === String(optionIndex)}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.questionIndex]: Number(e.target.value) }))}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 px-5 py-2 rounded bg-blue-700 text-white">Submit Test</button>
    </form>
  );
};

export default StudentTestAttempt;
