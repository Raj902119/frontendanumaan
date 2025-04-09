interface StepsProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${index + 1 === currentStep 
                ? 'border-blue-600 bg-blue-600 text-white' 
                : index + 1 < currentStep 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-gray-300 text-gray-300'
              } 
              ${onStepClick ? 'cursor-pointer' : ''}`}
            onClick={() => onStepClick?.(index + 1)}
          >
            {index + 1 < currentStep ? '✓' : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div 
              className={`w-20 h-[2px] mx-2 
                ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          )}
          <div 
            className={`absolute mt-8 text-xs whitespace-nowrap 
              ${index + 1 === currentStep 
                ? 'text-blue-600' 
                : index + 1 < currentStep 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
              }`}
            style={{ 
              transform: `translateX(-${50}%)`,
              left: `${(index + 1) * (100 / (steps.length + 1))}%`
            }}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  )
} 