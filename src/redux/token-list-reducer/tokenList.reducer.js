import TokenListActionTypes from './token-list.types';

const INITIAL_STATE = {
    tokenList: [],
    searchToken: '',
};

const tokenListReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TokenListActionTypes.UPDATE_SEARCH_TOKEN:
            return {
                ...state,
                searchToken: action.payload,
            };

        case TokenListActionTypes.UPDATE_TOKEN_lIST:
            return {
                ...state,
                tokenList: [...action.payload],
            };
        default:
            return state;
    }
};

export default tokenListReducer;

