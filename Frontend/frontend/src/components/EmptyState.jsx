import React from 'react';
import { HelpCircle } from 'lucide-react';

const EmptyState = ({ 
  title = 'No records found', 
  description = 'There is no data to display in this list at the moment.',
  icon: Icon = HelpCircle,
  actionButton
}) => {
  return (
    <div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8">
      <div className="p-4 bg-slate-800/50 text-text-low rounded-2xl mb-4 border border-slate-700/50">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-text-low text-sm leading-relaxed max-w-sm mb-6">{description}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
