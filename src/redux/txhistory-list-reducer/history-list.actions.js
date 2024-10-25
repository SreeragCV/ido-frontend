import HistoryListActionTypes from './history-list.types';

export const updateHistorySearchItem = (name) => ({
    type: HistoryListActionTypes.UPDATE_HISTORY_SEARCH_ITEM,
    payload: name,
});

export const updateHistoryList = (tokens) => ({
    type: HistoryListActionTypes.UPDATE_HISTORY_lIST,
    payload: tokens,
});