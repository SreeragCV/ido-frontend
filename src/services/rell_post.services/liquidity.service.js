import { nop, op } from "ft3-lib";
import { getStoredAccount } from "../../utils/blockchain/account-storage";
import { getSession } from "../../utils/blockchain/blockchain";

const storedAccount = getStoredAccount();

export const addLiquidityFunc = async ({
  blockchain,
  asset1Id,
  asset2Id,
  tokenAmount1,
  tokenAmount2,
  amountAMin,
  amountBMin,
  deadline,
  accountId,
  metamaskAccount = null
}) => {
  console.log(
    tokenAmount1,
    tokenAmount2,
    amountAMin,
    amountBMin,
    deadline,
    "mouth kabool"
  );

  try {
    if (metamaskAccount) {

      let session = await getSession()
      await session.call(op("ft3m.add_liquidity",
        asset1Id,
        asset2Id,
        tokenAmount1,
        tokenAmount2,
        parseInt(amountAMin),
        parseInt(amountBMin),
        deadline,
        accountId));


    } else {
      await blockchain
        .transactionBuilder()
        .add(
          op(
            "ft3.add_liquidity",
            asset1Id,
            asset2Id,
            tokenAmount1,
            tokenAmount2,
            parseInt(amountAMin),
            parseInt(amountBMin),
            deadline,
            storedAccount.user.authDescriptor.id,
            accountId
          )
        )
        .add(nop())
        .buildAndSign(storedAccount.user)
        .post();
    }
  } catch (err) {
    console.log("addLiquidityFunc err : ", err);
    throw err;
  }
};

export const removeLiquidityFunc = async ({
  blockchain,
  asset1Id,
  asset2Id,
  lpTokenAmount,
  amountAMin,
  amountBMin,
  deadline,
  accountId,
  metamaskAccount = null
}) => {

  console.log('ba;;;', lpTokenAmount)

  try {
    if (metamaskAccount) {
      let session = await getSession()
      await session.call(op("ft3m.remove_liquidity",
        asset1Id,
        asset2Id,
        lpTokenAmount,
        amountAMin,
        amountBMin,
        deadline,
        accountId,
        accountId));

    } else {


      await blockchain
        .transactionBuilder()
        .add(
          op(
            "ft3.remove_liquidity",
            asset1Id,
            asset2Id,
            lpTokenAmount,
            amountAMin,
            amountBMin,
            deadline,
            storedAccount.user.authDescriptor.id,
            accountId
          )
        )
        .add(nop())
        .buildAndSign(storedAccount.user)
        .post();
    }
  } catch (err) {
    console.log("removeLiquidityFunc err : ", err);
    throw err;
  }
};

export const fetchPriceFunc = async ({
  blockchain,
  tokenA,
  tokenB,
  amount,
  metamaskAccount = null
}) => {
  try {
    let priceTuple = null
    if (metamaskAccount) {
      let session = await getSession()
      priceTuple = await session.query({
        name: 'ft3m.get_price_and_quote', args: {
          _tokenA: tokenA,
          _tokenB: tokenB,
          _amount_in: amount,
        }
      })

    }
    else {

      priceTuple = await blockchain.query("ft3.get_price_and_quote", {
        _tokenA: tokenA,
        _tokenB: tokenB,
        _amount_in: amount,
      });
    }

    return priceTuple;
  } catch (err) {
    console.log("fetchPrice err : ", err);
  }
};

export const getPairInfoFunc = async ({ blockchain, token1Id, token2Id, metamaskAccount = null }) => {
  try {

    if (metamaskAccount) {
      let session = await getSession()
      let res = await session.query({
        name: 'ft3m.get_pair_info', args: {
          _tokenA: token1Id,
          _tokenB: token2Id,
        }
      })
      console.log(res, 'from the pair info')
      return res
    }

    const res = await blockchain.query("ft3.get_pair_info", {
      _tokenA: token1Id,
      _tokenB: token2Id,
    });

    return res;
  } catch (err) {
    console.log("getPairInfoFunc err : ", err);
  }
};
