import { createSelector } from "reselect";
import memoize from "lodash.memoize";

export const selectModalTokens = (state) => state.modal.modalList;

export const selectSearchModalTokenName = (state) =>
  state.modal.modalSearchToken;

export const selectFilterModalList = memoize((searchQuery) =>
  createSelector([selectModalTokens], (tokens) => {
    console.log("selectFilterModalList tokens : ", tokens);
    if (tokens[0]?.asset) {
      console.log("ll: ", tokens);
      return tokens
        ?.map((key) => key?.asset)
        ?.filter(
          (token) =>
            token?.name
              ?.toLowerCase()
              .includes(searchQuery.trim()?.toLowerCase()) ||
            token?.id?.includes(searchQuery.trim())
        ).map((item,index)=>{
          return {
              accountId:item.chainId.data,
              chain_id:item.chainId.data,
              id:item.chainId.data,
              is_lp_token:item.is_lp_token,
              name:item.name,
              symbol:item.symbol,
              amount:tokens[index].amount

          }
      })
        .reverse();
    }
    return tokens
      ?.map((key) => key)
      ?.filter(
        (token) =>
          token?.name
            ?.toLowerCase()
            .includes(searchQuery.trim()?.toLowerCase()) ||
          token?.id?.includes(searchQuery.trim())
      )
      .reverse();
  })
);
