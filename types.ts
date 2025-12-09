export interface BugReport {
  fileName: string;
  originalCode: string;
  errorLog: string;
}

export interface FixResult {
  fixedCode: string;
  explanation: string;
}

export interface DiffPart {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  count?: number;
}