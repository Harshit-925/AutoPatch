import * as Diff from 'diff';
import { DiffPart } from '../types';

/**
 * Computes line-by-line diff between two strings.
 * Using the 'diff' library which is standard for this.
 */
export const computeDiff = (oldText: string, newText: string): DiffPart[] => {
  const changes = Diff.diffLines(oldText, newText, { newlineIsToken: true });
  
  return changes.map(change => ({
    type: change.added ? 'added' : change.removed ? 'removed' : 'unchanged',
    value: change.value,
    count: change.count
  }));
};