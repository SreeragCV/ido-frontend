import PoolListActionTypes from "./pool-list.types";

export const updateSearchPool = (name) => ({
    type: PoolListActionTypes.UPDATE_SEARCH_POOL,
    payload: name,
});

export const updatePoolList = (pools) => ({
    type: PoolListActionTypes.UPDATE_POOL_lIST,
    payload: pools,
});