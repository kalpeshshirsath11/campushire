import React from 'react';
import { CheckCircle2, Circle, AlertCircle, XCircle } from 'lucide-react';

const Timeline = ({ currentStatus }) => {
  const stages = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'APTITUDE', label: 'Aptitude Test' },
    { key: 'TECHNICAL', label: 'Technical Round' },
    { key: 'HR', label: 'HR Interview' },
    { key: 'FINAL', label: 'Result' } // Selected or Rejected
  ];

  // Helper to determine status value index
  const getStatusIndex = (status) => {
    switch (status) {
      case 'APPLIED':
      case 'SHORTLISTED':
        return 0;
      case 'APTITUDE':
        return 1;
      case 'TECHNICAL':
        return 2;
      case 'HR':
        return 3;
      case 'SELECTED':
      case 'REJECTED':
        return 4;
      default:
        return -1;
    }
  };

  const currentIndex = getStatusIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';
  const isSelected = currentStatus === 'SELECTED';

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between items-center w-full">
        {/* Background Connecting Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-800 z-0"></div>

        {/* Active Progress Line */}
        <div 
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] transition-all duration-500 z-0 ${
            isRejected ? 'bg-red-500/60' : 'bg-brand-blue/60'
          }`}
          style={{ width: `${(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%` }}
        ></div>

        {/* Timeline Steps */}
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          let StepIcon = Circle;
          let iconColor = 'text-text-low bg-bg-deep border-slate-800';

          if (isCompleted) {
            StepIcon = CheckCircle2;
            iconColor = 'text-brand-blue bg-bg-deep border-brand-blue/20';
          } else if (isCurrent) {
            if (stage.key === 'FINAL') {
              if (isSelected) {
                StepIcon = CheckCircle2;
                iconColor = 'text-emerald-400 bg-bg-deep border-emerald-500/30 animate-pulse';
              } else if (isRejected) {
                StepIcon = XCircle;
                iconColor = 'text-red-400 bg-bg-deep border-red-500/30';
              }
            } else {
              StepIcon = AlertCircle;
              iconColor = 'text-brand-cyan bg-bg-deep border-brand-cyan/30 animate-pulse';
            }
          }

          return (
            <div key={stage.key} className="flex flex-col items-center z-10 relative">
              {/* Icon Container */}
              <div className={`p-1.5 rounded-full border-2 transition-all duration-300 ${iconColor}`}>
                <StepIcon size={20} className="shrink-0" />
              </div>
              
              {/* Label */}
              <span className={`text-[11px] font-semibold mt-2.5 uppercase tracking-wide transition-all ${
                isCurrent 
                  ? (isRejected ? 'text-red-400 font-bold' : isSelected ? 'text-emerald-400 font-bold' : 'text-brand-cyan font-bold') 
                  : isCompleted ? 'text-text-high' : 'text-text-low'
              }`}>
                {stage.key === 'FINAL' && isSelected ? 'Selected' : stage.key === 'FINAL' && isRejected ? 'Rejected' : stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
