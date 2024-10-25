import HistoryListActionTypes from './history-list.types';

const INITIAL_STATE = {
    historyList: [],
    historySearchItem: '',
};

const historyListReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HistoryListActionTypes.UPDATE_HISTORY_SEARCH_ITEM:
            return {
                ...state,
                historySearchItem: action.payload,
            };

        case HistoryListActionTypes.UPDATE_HISTORY_lIST:
            return {
                ...state,
                historyList: [...action.payload],
            };
        default:
            return state;
    }
};

export default historyListReducer;

