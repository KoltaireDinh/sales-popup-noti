import {useCallback, useEffect, useRef, useState} from 'react';

export default function useSaveBar({input, setInput, saveSetting}) {
  const [loading, setLoading] = useState(null);
  const [show, setShow] = useState(false);
  const previousInputRef = useRef(input);
  const [firstLoad, setFirstLoad] = useState(true);

  const discard = useCallback(async () => {
    setInput(previousInputRef.current);
    setShow(false);
  }, [setInput]);

  const save = useCallback(async () => {
    setLoading('');
    try {
      console.log('Saving this input:', input);
      await saveSetting(input);
      previousInputRef.current = input;
      setShow(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(null);
    }
  }, [input, saveSetting]);

  const showSaveBar = useCallback(() => {
    setShow(true);
  }, []);

  // Auto-detect changes and show save bar
  useEffect(() => {
    if (!firstLoad && input && previousInputRef.current) {
      const hasChanges = JSON.stringify(input) !== JSON.stringify(previousInputRef.current);
      if (hasChanges && !show) {
        setShow(true);
      }
    }
  }, [input, firstLoad, show]);

  // Update previousInputRef when input changes and it's the first load
  useEffect(() => {
    if (firstLoad && input !== previousInputRef.current) {
      previousInputRef.current = input;
      setFirstLoad(false);
    }
  }, [input, firstLoad]);

  return {
    discard,
    save,
    loading,
    showSaveBar,
    show // Export show state for UI components
  };
}
