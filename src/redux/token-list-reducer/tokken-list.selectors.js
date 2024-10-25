import { createSelector } from 'reselect';
import memoize from 'lodash.memoize';

export const selectTokens = (state) => state.token.tokenList;

export const selectSearchTokenName = (state) => state.token.searchToken;

export const selectFilterTokenList = memoize((searchQuery) =>


    createSelector([selectTokens], (tokens) =>
        Object.keys(tokens)
            .map((key) => tokens[key])
            .filter((token) =>
                (token.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) || (token.symbol.toLowerCase().includes(searchQuery.trim().toLowerCase())))
            )
            .reverse()
    )
);



