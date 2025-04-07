// context/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  username: 'Username',
  file: null,
  youtubeUrl: '',
  showStudyOptions: false,
  activeTab: 0,
  isProcessing: false,
  progressValue: 0,
  generatedText: '',
  studyResults: {},
  activeResultSection: null,
  chatMessages: [],
  userMessage: '',
  isChatLoading: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.payload };
    case 'SET_YOUTUBE_URL':
      return { ...state, youtubeUrl: action.payload };
    case 'SET_SHOW_STUDY_OPTIONS':
      return { ...state, showStudyOptions: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_IS_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_PROGRESS_VALUE':
      return { ...state, progressValue: action.payload };
    case 'SET_GENERATED_TEXT':
      return { ...state, generatedText: action.payload };
    case 'ADD_STUDY_RESULT':
      return { ...state, studyResults: { ...state.studyResults, [action.payload.name]: action.payload.result } };
    case 'SET_ACTIVE_RESULT_SECTION':
      return { ...state, activeResultSection: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'SET_USER_MESSAGE':
      return { ...state, userMessage: action.payload };
    case 'SET_IS_CHAT_LOADING':
      return { ...state, isChatLoading: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Define actions
  const actions = {
    setFile: (file) => dispatch({ type: 'SET_FILE', payload: file }),
    setYoutubeUrl: (url) => dispatch({ type: 'SET_YOUTUBE_URL', payload: url }),
    setShowStudyOptions: (show) => dispatch({ type: 'SET_SHOW_STUDY_OPTIONS', payload: show }),
    setActiveTab: (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    setIsProcessing: (isProcessing) => dispatch({ type: 'SET_IS_PROCESSING', payload: isProcessing }),
    setProgressValue: (value) => dispatch({ type: 'SET_PROGRESS_VALUE', payload: value }),
    setGeneratedText: (text) => dispatch({ type: 'SET_GENERATED_TEXT', payload: text }),
    addStudyResult: (name, result) => dispatch({ type: 'ADD_STUDY_RESULT', payload: { name, result } }),
    setActiveResultSection: (section) => dispatch({ type: 'SET_ACTIVE_RESULT_SECTION', payload: section }),
    addChatMessage: (message) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message }),
    setUserMessage: (message) => dispatch({ type: 'SET_USER_MESSAGE', payload: message }),
    setIsChatLoading: (isLoading) => dispatch({ type: 'SET_IS_CHAT_LOADING', payload: isLoading }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};