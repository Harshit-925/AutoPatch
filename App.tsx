import React, { useState, useRef } from 'react';
import { NeonButton } from './components/NeonButton';
import { DiffViewer } from './components/DiffViewer';
import { analyzeAndFixCode } from './services/geminiService';
import { FixResult } from './types';

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [errorLog, setErrorLog] = useState<string>('');
  const [result, setResult] = useState<FixResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    // Reset previous results when new file is loaded
    setResult(null); 
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleBustBug = async () => {
    if (!fileContent) {
      setError("Please upload a source code file first.");
      return;
    }
    if (!errorLog.trim()) {
      setError("Please paste the stack trace or error log.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fixResult = await analyzeAndFixCode(fileContent, errorLog);
      setResult(fixResult);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-50"></div>
      <div className="absolute bottom-0 right-0 p-4 text-[#00ff41] opacity-60 text-xs tracking-[0.2em] font-bold z-50 pointer-events-none">
        CODE BUSTERS_v1.0
      </div>

      {/* Header */}
      <header className="mb-8 flex items-end gap-4 border-b border-[#00ff41]/30 pb-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          AUTO<span className="text-[#00ff41]">PATCH</span>
        </h1>
        <span className="text-xs text-[#00ff41] mb-2 font-mono">[ SYSTEM ONLINE ]</span>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        
        {/* Left Column: Inputs */}
        <div className="flex flex-col gap-6 h-full">
          
          {/* File Upload */}
          <div className="bg-[#0a0a0a] border border-[#333] p-6 rounded-sm relative group hover:border-[#00ff41]/50 transition-colors">
             <div className="absolute -top-3 left-4 bg-[#050505] px-2 text-[#00ff41] text-xs font-bold uppercase tracking-wider">
              Source Input
             </div>
             
             <input
              type="file"
              ref={fileInputRef}
              accept=".java,.js,.py,.ts,.tsx,.jsx"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#333] hover:border-[#00ff41] group-hover:bg-[#00ff41]/5 cursor-pointer h-24 flex flex-col items-center justify-center transition-all duration-300"
            >
              {fileName ? (
                <div className="flex items-center gap-2 text-[#00ff41]">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   <span className="font-bold">{fileName}</span>
                </div>
              ) : (
                <div className="text-gray-500 group-hover:text-[#00ff41]">
                  [ CLICK TO UPLOAD .JS .JAVA .PY ]
                </div>
              )}
            </div>
          </div>

          {/* Error Log Input */}
          <div className="flex-1 flex flex-col bg-[#0a0a0a] border border-[#333] p-6 rounded-sm relative hover:border-[#00ff41]/50 transition-colors min-h-[300px]">
            <div className="absolute -top-3 left-4 bg-[#050505] px-2 text-[#00ff41] text-xs font-bold uppercase tracking-wider">
              Error Log / Stack Trace
            </div>
            <textarea
              className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-400 placeholder-gray-700"
              placeholder="// Paste your stack trace, compiler error, or bug description here..."
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <div className="mt-auto">
             {error && (
              <div className="mb-4 text-red-500 bg-red-900/20 border border-red-900/50 p-3 text-xs font-bold animate-pulse">
                [ERROR]: {error}
              </div>
            )}
            <NeonButton 
              label="BUST BUG" 
              onClick={handleBustBug} 
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="flex flex-col h-full gap-6">
          <div className="flex-1 bg-[#0a0a0a] border border-[#333] p-1 rounded-sm relative min-h-[500px] flex flex-col">
            <div className="absolute -top-3 left-4 bg-[#050505] px-2 text-[#00ff41] text-xs font-bold uppercase tracking-wider z-10">
              Analysis & Patch
            </div>

            {result ? (
              <div className="flex flex-col h-full w-full">
                {/* Explanation Panel */}
                <div className="p-4 border-b border-[#333] bg-[#0f0f0f] mb-1">
                  <h3 className="text-[#00ff41] font-bold mb-2 text-sm uppercase tracking-wider">> AI Analysis Report</h3>
                  <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-[#00ff41] pl-4">
                    {result.explanation}
                  </p>
                </div>

                {/* Diff View */}
                <div className="flex-1 relative overflow-hidden">
                   <DiffViewer originalCode={fileContent} fixedCode={result.fixedCode} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
                <div className="w-16 h-16 border-2 border-dashed border-[#333] rounded-full flex items-center justify-center mb-4 animate-[spin_10s_linear_infinite]">
                  <div className="w-2 h-2 bg-[#333] rounded-full"></div>
                </div>
                <p className="font-mono text-xs tracking-widest">[ AWAITING INPUT DATA ]</p>
                <p className="font-mono text-[10px] mt-2 opacity-50">System Standby...</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;