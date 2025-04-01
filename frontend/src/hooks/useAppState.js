// hooks/useAppState.js
import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import * as api from '../services/api';

export const useAppState = () => {
  const { state, dispatch } = useApp();

  const setFile = useCallback((file) => {
    dispatch({ type: 'SET_FILE', payload: file });
  }, [dispatch]);

  const setYoutubeUrl = useCallback((url) => {
    dispatch({ type: 'SET_YOUTUBE_URL', payload: url });
  }, [dispatch]);

  const setActiveTab = useCallback((tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, [dispatch]);

  const setIsProcessing = useCallback((isProcessing) => {
    dispatch({ type: 'SET_IS_PROCESSING', payload: isProcessing });
  }, [dispatch]);

  const setProgressValue = useCallback((value) => {
    dispatch({ type: 'SET_PROGRESS_VALUE', payload: value });
  }, [dispatch]);

  const setGeneratedText = useCallback((text) => {
    dispatch({ type: 'SET_GENERATED_TEXT', payload: text });
  }, [dispatch]);

  const addStudyResult = useCallback((name, result) => {
    dispatch({ type: 'ADD_STUDY_RESULT', payload: { name, result } });
  }, [dispatch]);

  const setActiveResultSection = useCallback((section) => {
    dispatch({ type: 'SET_ACTIVE_RESULT_SECTION', payload: section });
  }, [dispatch]);

  const addChatMessage = useCallback((message) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
  }, [dispatch]);

  const setUserMessage = useCallback((message) => {
    dispatch({ type: 'SET_USER_MESSAGE', payload: message });
  }, [dispatch]);

  const setIsChatLoading = useCallback((isLoading) => {
    dispatch({ type: 'SET_IS_CHAT_LOADING', payload: isLoading });
  }, [dispatch]);

  return {
    state,
    actions: {
      setFile,
      setYoutubeUrl,
      setActiveTab,
      setIsProcessing,
      setProgressValue,
      setGeneratedText,
      addStudyResult,
      setActiveResultSection,
      addChatMessage,
      setUserMessage,
      setIsChatLoading,
    },
  };
};