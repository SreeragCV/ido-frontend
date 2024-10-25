import PoolListActionTypes from './pool-list.types';

const INITIAL_STATE = {
    poolList: [],
    searchPool: '',
};

const poolListReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PoolListActionTypes.UPDATE_SEARCH_POOL:
            return {
                ...state,
                searchPool: action.payload,
            };

        case PoolListActionTypes.UPDATE_POOL_lIST:
            return {
                ...state,
                poolList: [...action.payload],
            };
        default:
            return state;
    }
};

export default poolListReducer;

