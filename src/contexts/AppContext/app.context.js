import { createContext, useReducer } from "react";

const initialState = {
  chromia_account: null,
  collapsed_sidebar: false,
  is_page_loaded: true,
  metamaskAccount: null,
  currentProvider: localStorage.getItem('currentProvider') ? JSON.parse(localStorage.getItem('currentProvider')) : {
    chromia: false,
    metamask: false
  },
  loading: true
};

const actions = {
  SET_ACCOUNT: "SET_ACCOUNT",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  PAGE_LOADED: "PAGE_LOADED",
  SET_METAMASK: "SET_METAMASK",
  SET_CURRENT_PROVIDER: "SET_CURRENT_PROVIDER",
  SET_LOADING: "SET_LOADING"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_ACCOUNT:
      return { ...state, chromia_account: action.chromia_account };
    case actions.TOGGLE_SIDEBAR:
      return { ...state, collapsed_sidebar: action.collapsed_sidebar };
    case actions.PAGE_LOADED:
      return { ...state, is_page_loaded: action.is_page_loaded };
    case actions.SET_METAMASK:
      return { ...state, metamaskAccount: action.metamaskAccount };
    case actions.SET_CURRENT_PROVIDER:
      localStorage.setItem('currentProvider', JSON.stringify(action.currentProvider))
      return {
        ...state, currentProvider: {
          ...state.currentProvider,
          ...action.currentProvider
        }
      };
    case actions.SET_LOADING:
      return { ...state, loading: action.loading };

    default:
      return state;
  }
};

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    chromia_account: state.chromia_account,
    collapsed_sidebar: state.collapsed_sidebar,
    is_page_loaded: state.is_page_loaded,
    metamaskAccount: state.metamaskAccount,
    currentProvider: state.currentProvider,
    loading: state.loading,

    setAccount: (chromia_account) => {
      dispatch({ type: actions.SET_ACCOUNT, chromia_account });
    },
    setLoading: (loading) => {
      dispatch({ type: actions.SET_LOADING, loading });
    },

    setCurrentProvider: (currentProvider) => {
      dispatch({ type: actions.SET_CURRENT_PROVIDER, currentProvider });
    },

    setMetamaskAccount: (metamaskAccount) => {
      dispatch({ type: actions.SET_METAMASK, metamaskAccount });
    },
    toggleSidebar: (collapsed_sidebar) => {
      dispatch({ type: actions.TOGGLE_SIDEBAR, collapsed_sidebar });
    },
    pageLoaded: (is_page_loaded) => {
      dispatch({ type: actions.PAGE_LOADED, is_page_loaded });
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
