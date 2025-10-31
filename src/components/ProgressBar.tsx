import { cn } from '@/lib/utils';

interface Step {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export default function ProgressBar({ currentStep, steps, className }: ProgressBarProps) {
  const stepsData: Step[] = steps.map((label, index) => ({
    number: index + 1,
    label,
    isActive: index + 1 === currentStep,
    isCompleted: index + 1 < currentStep
  }));

  return (
    <div className={cn('w-full py-4', className)}>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {stepsData.map((step, index) => (
          <div 
            key={index}
            className="flex flex-col items-center flex-1"
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 mb-2',
                step.isCompleted && 'bg-primary text-white shadow-md',
                step.isActive && 'bg-primary text-white shadow-lg ring-4 ring-primary/20 scale-110',
                !step.isCompleted && !step.isActive && 'bg-gray-200 text-gray-400'
              )}
            >
              {step.isCompleted ? '✓' : step.number}
            </div>
            <span 
              className={cn(
                'text-xs text-center transition-colors duration-300',
                (step.isActive || step.isCompleted) ? 'text-primary font-semibold' : 'text-gray-400'
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
