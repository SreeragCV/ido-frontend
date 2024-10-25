import { createSelector } from 'reselect';
import memoize from 'lodash.memoize';

export const selectPools = (state) => state.pool.poolList;

export const selectSearchPool = (state) => state.pool.searchPool;

export const selectFilterPoolList = memoize((searchQuery) =>


    createSelector([selectPools], (tokens) =>
        Object.keys(tokens)
            .map((key) => tokens[key])
            .filter((token) =>
                (token.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) || (token.symbol.toLowerCase().includes(searchQuery.trim().toLowerCase())))
            )
            .reverse()
    )
);



