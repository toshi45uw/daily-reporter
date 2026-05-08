type Step = { label: string };

const STEPS: Step[] = [
  { label: 'ホーム' },
  { label: '活動確認' },
  { label: '日報確認' },
];

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  isDone
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isActive
                    ? 'bg-white border-blue-600 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  isActive ? 'text-blue-600' : isDone ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-2 mb-4 transition-colors ${
                  stepNum < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
