import React, { useMemo } from 'react';
import { computeDiff } from '../utils/diffEngine';
import { DiffPart } from '../types';

interface DiffViewerProps {
  originalCode: string;
  fixedCode: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ originalCode, fixedCode }) => {
  const diffs: DiffPart[] = useMemo(() => computeDiff(originalCode, fixedCode), [originalCode, fixedCode]);

  return (
    <div className="font-mono text-sm leading-6 border border-[#00ff41]/30 bg-black/80 rounded-sm overflow-hidden h-full flex flex-col">
       <div className="flex border-b border-[#00ff41]/30 bg-[#0a0a0a]">
        <div className="flex-1 px-4 py-2 text-red-400 border-r border-[#00ff41]/30 font-bold">ORIGINAL</div>
        <div className="flex-1 px-4 py-2 text-[#00ff41] font-bold">FIXED</div>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar p-2">
         {/* We will render a unified view for simplicity in this constrained environment, 
             mimicking a side-by-side or split view logically by stacking changes 
             similar to a unified diff but with clear colors */}
        <pre className="m-0">
          {diffs.map((part, index) => {
             // Split values by newline to render line by line correctly
             const lines = part.value.split('\n');
             // Remove last empty string if it exists due to split
             if (lines.length > 0 && lines[lines.length - 1] === '') {
                 lines.pop();
             }

             return lines.map((line, lineIndex) => (
                <div 
                  key={`${index}-${lineIndex}`} 
                  className={`
                    w-full block px-2
                    ${part.type === 'added' ? 'bg-[#00ff41]/10 text-[#00ff41]' : ''}
                    ${part.type === 'removed' ? 'bg-red-900/20 text-red-400 line-through decoration-red-500/50' : ''}
                    ${part.type === 'unchanged' ? 'text-gray-500' : ''}
                  `}
                >
                  <span className="inline-block w-6 select-none opacity-30 mr-2 text-xs">
                    {part.type === 'added' ? '+' : part.type === 'removed' ? '-' : ' '}
                  </span>
                  {line || ' '} {/* Render space for empty lines to maintain height */}
                </div>
             ));
          })}
        </pre>
      </div>
    </div>
  );
};