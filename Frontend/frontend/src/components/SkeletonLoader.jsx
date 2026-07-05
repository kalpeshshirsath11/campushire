import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="glass-card rounded-xl p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-24 bg-slate-800 rounded"></div>
        <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
      </div>
      <div className="h-8 w-16 bg-slate-800 rounded mb-2"></div>
      <div className="h-3 w-32 bg-slate-800 rounded"></div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="glass-card rounded-xl overflow-hidden animate-pulse">
      <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
        <div className="h-4 w-32 bg-slate-800 rounded"></div>
        <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
      </div>
      <div className="divide-y divide-slate-800">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/4 bg-slate-800 rounded"></div>
                <div className="h-3 w-1/6 bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="h-4 w-16 bg-slate-800 rounded"></div>
            <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DriveCardSkeleton = () => {
  return (
    <div className="glass-card rounded-xl p-6 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-slate-800 rounded"></div>
          <div className="h-3 w-24 bg-slate-800 rounded"></div>
        </div>
        <div className="h-5 w-16 bg-slate-800 rounded-full"></div>
      </div>
      <div className="h-12 w-full bg-slate-800/40 rounded-lg"></div>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <div className="h-3 w-12 bg-slate-800 rounded"></div>
          <div className="h-4 w-16 bg-slate-800 rounded"></div>
        </div>
        <div className="space-y-1">
          <div className="h-3 w-12 bg-slate-800 rounded"></div>
          <div className="h-4 w-20 bg-slate-800 rounded"></div>
        </div>
      </div>
      <div className="h-9 w-full bg-slate-800 rounded-lg pt-4"></div>
    </div>
  );
};
