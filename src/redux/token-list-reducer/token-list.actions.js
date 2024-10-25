import TokenListActionTypes from './token-list.types';

export const updateSearchToken = (name) => ({
    type: TokenListActionTypes.UPDATE_SEARCH_TOKEN,
    payload: name,
});

export const updateTokenList = (tokens) => ({
    type: TokenListActionTypes.UPDATE_TOKEN_lIST,
    payload: tokens,
});