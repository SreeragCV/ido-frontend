import { createSelector } from "reselect";
import memoize from "lodash.memoize";

export const selectHistoryList = (state) => state.history.historyList;

export const selectHistorySearchItem = (state) =>
  state.history.historySearchItem;

export const selectFilterHistoryList = memoize((searchQuery) =>
  createSelector([selectHistoryList], (tokens) => {
    console.log("tokens from other side", Object.keys(tokens).map(ky => {
      console.log(tokens[ky].tx_hash)
      return tokens[ky]
    }).filter(ele => {
      console.log(ele.tx_hash.toString('hex')?.toLowerCase(), 'rrrr')
    }), searchQuery);
    return Object.keys(tokens)
      .map((key) => tokens[Number(key)])
      .filter(
        (token) =>
          token.tx_hash.toString('hex')
            ?.toLowerCase()
            ?.includes(searchQuery?.trim()?.toLowerCase()) ||
          token.tx_rid.toString('hex').toLowerCase()?.includes(searchQuery?.trim()?.toLowerCase())
      )
      .reverse();
  })
);
