import { cn } from '@/lib/utils';
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  onStepClick?: (step: number) => void;
}

export default function ProgressBar({ currentStep, steps, className, onStepClick }: ProgressBarProps) {
  const [showContactDialog, setShowContactDialog] = useState(false);
  
  const stepsData: Step[] = steps.map((label, index) => ({
    number: index + 1,
    label,
    isActive: index + 1 === currentStep,
    isCompleted: index + 1 < currentStep
  }));

  return (
    <>
    <div className={cn('w-full py-4', className)}>
      <div className="flex items-center justify-between relative gap-2">
        <button
          onClick={() => setShowContactDialog(true)}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        >
          <Icon name="Phone" size={20} className="text-white group-hover:rotate-12 transition-transform" />
        </button>
        
        <div className="flex items-center justify-between flex-1 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

          {stepsData.map((step, index) => (
            <button
              key={index}
              onClick={() => onStepClick?.(step.number)}
              disabled={!onStepClick}
              className="flex flex-col items-center flex-1 disabled:cursor-default"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 mb-2',
                  step.isCompleted && 'bg-primary text-white shadow-md',
                  step.isActive && 'bg-primary text-white shadow-lg ring-4 ring-primary/20 scale-110',
                  !step.isCompleted && !step.isActive && 'bg-gray-200 text-gray-400',
                  onStepClick && 'cursor-pointer hover:scale-105'
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
            </button>
          ))}
        </div>
      </div>
    </div>
    
    <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Связаться с нами</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <a
            href="tel:+74012520725"
            className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-primary transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Phone" size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Телефон</div>
              <div className="text-sm text-muted-foreground">+7 (4012) 52-07-25</div>
            </div>
          </a>
          
          <a
            href="https://wa.me/74012520725"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-primary transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={24} className="text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">WhatsApp</div>
              <div className="text-sm text-muted-foreground">+7 (4012) 52-07-25</div>
            </div>
          </a>
          
          <a
            href="https://t.me/konigelectric"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-primary transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Send" size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Telegram</div>
              <div className="text-sm text-muted-foreground">@konigelectric</div>
            </div>
          </a>
          
          <a
            href="https://vk.com/electro_konig"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-primary transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Globe" size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">ВКонтакте</div>
              <div className="text-sm text-muted-foreground">electro_konig</div>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}