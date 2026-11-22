export default function QuestionCard({ question, questionNumber, total, selectedAnswer, onSelect }) {
  return (
    <div>
      <p className="text-xs text-base-content/50 mb-2 uppercase tracking-wide">
        Question {questionNumber} of {total}
      </p>
      <p className="text-base font-medium mb-6">{question.text}</p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 px-4 py-3 border rounded cursor-pointer
              ${selectedAnswer === index
                ? 'border-primary bg-primary/5'
                : 'border-base-300 hover:border-base-content/30'
              }`}
          >
            <input
              type="radio"
              name={`question-${question._id}`}
              className="radio radio-primary radio-sm"
              checked={selectedAnswer === index}
              onChange={() => onSelect(index)}
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
