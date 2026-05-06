import { useEffect } from 'react';
import { grammarProgress } from './index';

export function useGrammarSync() {
  useEffect(() => {
    grammarProgress.syncFromServer();
  }, []);
}
