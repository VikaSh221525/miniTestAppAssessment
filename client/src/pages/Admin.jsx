import { useEffect, useState } from 'react';
import api from '../api/axios';

const INITIAL_FORM = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctIndex: '0',
  subject: '',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'list'
  const [form, setForm] = useState(INITIAL_FORM);
  const [questions, setQuestions] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchQuestions = () => {
    setFetchLoading(true);
    api.get('/admin/questions')
      .then(({ data }) => setQuestions(data))
      .catch(() => {})
      .finally(() => setFetchLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/questions', {
        text: form.text.trim(),
        options: [form.optionA, form.optionB, form.optionC, form.optionD].map((o) => o.trim()),
        correctIndex: parseInt(form.correctIndex),
        subject: form.subject.trim(),
      });
      setSuccess('Question added successfully.');
      setForm(INITIAL_FORM);
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch {
      setError('Failed to delete question.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-base-200">

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-base-100 border-r border-base-300 flex flex-col py-6 px-3 gap-1">
        <p className="text-xs font-semibold text-base-content/40 uppercase tracking-widest px-3 mb-2">
          Questions
        </p>

        <button
          onClick={() => setActiveTab('add')}
          className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium w-full text-left
            ${activeTab === 'add'
              ? 'bg-primary text-primary-content'
              : 'text-base-content hover:bg-base-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Question
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium w-full text-left
            ${activeTab === 'list'
              ? 'bg-primary text-primary-content'
              : 'text-base-content hover:bg-base-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          All Questions
          {questions.length > 0 && (
            <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold
              ${activeTab === 'list' ? 'bg-primary-content/20 text-primary-content' : 'bg-base-300 text-base-content/60'}`}>
              {questions.length}
            </span>
          )}
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 py-8 px-8 overflow-y-auto">

        {/* ── ADD QUESTION TAB ── */}
        {activeTab === 'add' && (
          <div className="max-w-xl">
            <h1 className="text-lg font-semibold mb-6">Add New Question</h1>

            {error && <div className="alert alert-error py-2 text-sm mb-4">{error}</div>}
            {success && <div className="alert alert-success py-2 text-sm mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Question text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Question</label>
                <textarea
                  name="text"
                  rows={3}
                  className="textarea textarea-bordered text-sm resize-none focus:outline-none"
                  placeholder="Type your question here..."
                  value={form.text}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Options grid */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Answer Options</label>
                <div className="grid grid-cols-2 gap-3">
                  {OPTION_LABELS.map((letter, i) => (
                    <div key={letter} className="flex items-center gap-2">
                      <span className={`w-7 h-7 shrink-0 flex items-center justify-center rounded text-xs font-bold
                        ${String(i) === form.correctIndex
                          ? 'bg-primary text-primary-content'
                          : 'bg-base-200 text-base-content/60'}`}>
                        {letter}
                      </span>
                      <input
                        type="text"
                        name={`option${letter}`}
                        className="input input-bordered input-sm flex-1 text-sm"
                        placeholder={`Option ${letter}`}
                        value={form[`option${letter}`]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct answer + subject */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Correct Answer</label>
                  <select
                    name="correctIndex"
                    className="select select-bordered select-sm text-sm"
                    value={form.correctIndex}
                    onChange={handleChange}
                  >
                    {OPTION_LABELS.map((letter, i) => (
                      <option key={letter} value={String(i)}>Option {letter}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Subject <span className="text-base-content/40 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    name="subject"
                    className="input input-bordered input-sm text-sm"
                    placeholder="e.g. JavaScript"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Preview of correct option */}
              {form[`option${OPTION_LABELS[parseInt(form.correctIndex)]}`] && (
                <div className="flex items-center gap-2 px-3 py-2 bg-success/8 border border-success/20 rounded text-sm">
                  <span className="text-success font-semibold text-xs">✓ Correct:</span>
                  <span className="text-base-content/80">{form[`option${OPTION_LABELS[parseInt(form.correctIndex)]}`]}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-6"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? <span className="loading loading-spinner loading-xs"></span>
                    : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── ALL QUESTIONS TAB ── */}
        {activeTab === 'list' && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold">All Questions</h1>
              <span className="text-sm text-base-content/50">{questions.length} total</span>
            </div>

            {error && <div className="alert alert-error py-2 text-sm mb-4">{error}</div>}

            {fetchLoading ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-16 text-base-content/40 text-sm">
                No questions yet.{' '}
                <button className="link link-primary" onClick={() => setActiveTab('add')}>
                  Add one
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {questions.map((q, i) => (
                  <div
                    key={q._id}
                    className="bg-base-100 border border-base-300 rounded px-5 py-4 flex items-start gap-4"
                  >
                    <span className="text-sm font-semibold text-base-content/30 w-5 shrink-0 pt-0.5">
                      {i + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-2">{q.text}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {q.options.map((opt, idx) => (
                          <p key={idx} className={`text-xs flex items-center gap-1.5
                            ${idx === q.correctIndex ? 'text-success font-medium' : 'text-base-content/50'}`}>
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                              ${idx === q.correctIndex ? 'bg-success text-white' : 'bg-base-200 text-base-content/40'}`}>
                              {OPTION_LABELS[idx]}
                            </span>
                            {opt}
                          </p>
                        ))}
                      </div>
                      {q.subject && (
                        <span className="inline-block mt-2 text-[11px] px-2 py-0.5 bg-base-200 text-base-content/50 rounded">
                          {q.subject}
                        </span>
                      )}
                    </div>

                    <button
                      className="btn btn-ghost btn-xs text-error shrink-0"
                      onClick={() => handleDelete(q._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
