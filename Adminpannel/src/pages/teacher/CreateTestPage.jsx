import { useContext, useState } from 'react';
import { TeacherContext } from '../../context/teacher';

const CreateTestPage = ({ onCreated }) => {
  const { handleAddTestSeries } = useContext(TeacherContext);

  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    subject: '',
    className: '',
    durationMinutes: 30,
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 0,
    explanation: '',
    marks: 1
  });
  const [questions, setQuestions] = useState([]);

  const addQuestionToList = () => {
    if (!testForm.questionText || !testForm.optionA || !testForm.optionB) return;

    const options = [testForm.optionA, testForm.optionB];
    if (testForm.optionC) options.push(testForm.optionC);
    if (testForm.optionD) options.push(testForm.optionD);

    setQuestions((prev) => ([
      ...prev,
      {
        questionText: testForm.questionText,
        options,
        correctOption: Number(testForm.correctOption),
        explanation: testForm.explanation,
        marks: Number(testForm.marks || 1)
      }
    ]));

    setTestForm((prev) => ({
      ...prev,
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 0,
      explanation: '',
      marks: 1
    }));
  };

  const submitTestSeries = async (e) => {
    e.preventDefault();
    if (!questions.length) return;

    await handleAddTestSeries({
      title: testForm.title,
      description: testForm.description,
      subject: testForm.subject,
      className: testForm.className,
      durationMinutes: Number(testForm.durationMinutes || 30),
      questions
    });

    setQuestions([]);
    setTestForm({
      title: '',
      description: '',
      subject: '',
      className: '',
      durationMinutes: 30,
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 0,
      explanation: '',
      marks: 1
    });

    if (onCreated) {
      onCreated();
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">Create Test Series</h2>
      </div>

      <form className="bg-white rounded-lg shadow p-5 space-y-3" onSubmit={submitTestSeries}>
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={testForm.title} onChange={(e) => setTestForm((p) => ({ ...p, title: e.target.value }))} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Subject" value={testForm.subject} onChange={(e) => setTestForm((p) => ({ ...p, subject: e.target.value }))} />
        <input className="w-full border rounded px-3 py-2" placeholder="Class" value={testForm.className} onChange={(e) => setTestForm((p) => ({ ...p, className: e.target.value }))} />
        <input className="w-full border rounded px-3 py-2" placeholder="Duration minutes" type="number" value={testForm.durationMinutes} onChange={(e) => setTestForm((p) => ({ ...p, durationMinutes: e.target.value }))} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={testForm.description} onChange={(e) => setTestForm((p) => ({ ...p, description: e.target.value }))} />

        <div className="border-t pt-3">
          <h3 className="font-semibold mb-2">Add Question</h3>
          <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Question text" value={testForm.questionText} onChange={(e) => setTestForm((p) => ({ ...p, questionText: e.target.value }))} />
          <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Option A" value={testForm.optionA} onChange={(e) => setTestForm((p) => ({ ...p, optionA: e.target.value }))} />
          <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Option B" value={testForm.optionB} onChange={(e) => setTestForm((p) => ({ ...p, optionB: e.target.value }))} />
          <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Option C" value={testForm.optionC} onChange={(e) => setTestForm((p) => ({ ...p, optionC: e.target.value }))} />
          <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Option D" value={testForm.optionD} onChange={(e) => setTestForm((p) => ({ ...p, optionD: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input className="w-full border rounded px-3 py-2" type="number" min={0} placeholder="Correct option index" value={testForm.correctOption} onChange={(e) => setTestForm((p) => ({ ...p, correctOption: e.target.value }))} />
            <input className="w-full border rounded px-3 py-2" type="number" min={1} placeholder="Marks" value={testForm.marks} onChange={(e) => setTestForm((p) => ({ ...p, marks: e.target.value }))} />
          </div>
          <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Explanation" value={testForm.explanation} onChange={(e) => setTestForm((p) => ({ ...p, explanation: e.target.value }))} />
          <button type="button" className="px-4 py-2 bg-green-600 text-white rounded" onClick={addQuestionToList}>Add Question</button>
        </div>

        <p className="text-sm text-gray-600">Questions added: {questions.length}</p>
        <button className="w-full py-2 bg-blue-700 text-white rounded" type="submit">Create Test Series</button>
      </form>
    </div>
  );
};

export default CreateTestPage;
