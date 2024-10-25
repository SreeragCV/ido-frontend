import AssetBalanceV2 from "../models/AssetBalanceV2";
import { getSession } from "../utils/blockchain/blockchain";

export const fetchAllTokenList = async ({
  blockchain,
  lpMode,
  metamaskAccount = null,
}) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      let res = await session.query({
        name: "ft3m.get_all_asset_balances",
        args: {
          is_lp_token: lpMode,
        },
      });

      return res;
    }
    let response = await blockchain.query("ft3.get_all_asset_balances", {
      is_lp_token: lpMode,
    });

    return response;
  } catch (err) {
    console.log("fetchAllTokenList err : ", err);
  }
};

export const fetchTokenBalanceByAccount = async ({
  blockchain,
  accountId,
  assetId,
  metamaskAccount = null,
}) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      let res = await session.query({
        name: "ft3m.get_asset_balance",
        args: {
          account_id: accountId,
          asset_id: assetId,
        },
      });
      return res;
    }
    let response = await blockchain.query("ft3.get_asset_balance", {
      account_id: accountId,
      asset_id: assetId,
    });
    return response;
  } catch (err) {
    console.log("fetchTokenBalanceByAccount err : ", err);
  }
};

export const fetchTokenListByAccount = async ({ blockchain, accountId }) => {
  try {
    let response = await AssetBalanceV2.getByAccountId(accountId, blockchain);
    console.log("fetchTokenListByAccount response : ", response);
    return response;
  } catch (err) {
    console.log("fetchTokenListByAccount err : ", err);
  }
};

export const getAllTokens = async ({ blockchain, metamaskAccount = null }) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      let res = await session.query({
        name: "ft3m.get_all_asset_bal",
        args: {},
      });
      return res;
    }
    let response = await blockchain.query("ft3.get_all_asset_bal", {});
    console.log("getAllTokens response : ", response);
    return response;
  } catch (err) {
    console.log("getAllTokens err : ", err);
  }
};

export const fetchPools = async ({
  blockchain,
  accountId,
  offset,
  limit,
  metamaskAccount = null,
}) => {
  try {
    let response;
    let size, list;

    if (metamaskAccount) {
      let session = await getSession();
      size = await session.query({
        name: "ft3m.get_pairs_count",
        args: {
          acc_id: accountId,
        },
      });
      list = await session.query({
        name: "ft3m.get_pair_infos",
        args: {
          acc_id: accountId,
          _offset: offset,
          _limit: limit,
        },
      });
    } else {
      size = await blockchain.query("ft3.get_pairs_count", {
        acc_id: accountId,
      });

      list = await blockchain.query("ft3.get_pair_infos", {
        acc_id: accountId,
        _offset: offset,
        _limit: limit,
      });
    }

    response = {
      size: size[0],
      list: list,
    };
    return response;
  } catch (err) {
    console.log("fetchPools err : ", err);
  }
};

export const fetchDexHistory = async ({
  blockchain,
  accountId,
  offset,
  limit,
  metamaskAccount = null,
}) => {
  try {
    let response;
    let size = null;
    let list = null;
    if (metamaskAccount) {
      let session = await getSession();

      size = await session.query({
        name: "ft3m.get_dex_history_count",
        args: {
          acc_id: accountId,
        },
      });

      list = await session.query({
        name: "ft3m.get_dex_history",
        args: {
          acc_id: accountId,
          _offset: offset,
          _limit: limit,
        },
      });
    } else {
      size = await blockchain.query("ft3.get_dex_history_count", {
        acc_id: accountId,
      });

      list = await blockchain.query("ft3.get_dex_history", {
        acc_id: accountId,
        _offset: offset,
        _limit: limit,
      });
    }

    response = {
      size: size[0],
      list: list.reverse(),
    };

    console.log("fetchDexHistory response : ", response);

    return response;
  } catch (err) {
    console.log("fetchDexHistory err : ", err);
  }
};

export const getRecentTransactionHash = async ({
  blockchain,
  accountId,
  metamaskAccount = null,
}) => {
  if (metamaskAccount) {
    let session = await getSession();
    let res = await session.query({
      name: "ft3m.get_recent_tx_hash",
      args: {
        acc_id: accountId,
      },
    });
    return res;
  }
  return blockchain.query("ft3.get_recent_tx_hash", {
    acc_id: accountId,
  });
};

export const queryParticipantByID = async (id, client) => {
  const res = await client.query("ft4.get_accounts_by_participant_id", {
    id: id,
  });
  return res;
};

export const getAllPolls = async ({ metamaskAccount }) => {
  if (metamaskAccount) {
    let session = await getSession();
    let res = await session.query({
      name: "get_all_polls",
      args: {},
    });

    return res;
  }
};

export const getPollOptionsById = async ({ metamaskAccount, pollId }) => {
  if (metamaskAccount) {
    let session = await getSession();
    let res = await session.query({
      name: "get_poll_options",
      args: {
        poll_id: pollId,
      },
    });
    return res;
  }
};

export const getPollResult = async ({ metamaskAccount, pollId }) => {
  if (metamaskAccount) {
    let session = await getSession();
    let res = await session.query({
      name: "get_poll_results",
      args: {
        poll_id: pollId,
      },
    });
    return res;
  }
};


export const getWhitelistUsers=async(metamaskAccount=true)=>{
  if (metamaskAccount) {
    let session = await getSession();
    let res = await session.query({
      name: "get_whitelist_user",
      args: {
        
      },
    });
    console.log(res?.map((item)=>item.toString('hex')),"white")
    return res?.map((item)=>item.toString('hex'));
  }
  

} 