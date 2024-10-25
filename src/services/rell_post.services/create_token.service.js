import { get } from "react-hook-form";
import AssetV2 from "../../models/AssetV2";
import { AssetBalance, op } from "ft3-lib";
import { getSession } from "../../utils/blockchain/blockchain";
import { gtv } from "postchain-client";

export const getExistingToken = async ({ blockchain, tokenName, metamaskAccount }) => {
    try {
        if (metamaskAccount) {
            let session = await getSession()
            let res = await session.query({
                name: 'ft3m.get_asset_by_name', args: {
                    name: tokenName
                }
            })
            console.log('res form token: ', res)
            return res;
        }
        let response = await AssetV2.getByName(tokenName, blockchain);

        return response;

    } catch (err) {
        console.log('getExistingToken err : ', err)
    }
}

export const registerNewToken = async ({ blockchain, tokenName, symbol, chainId, metamaskAccount = null }) => {
    try {
        if (metamaskAccount) {
            let session = await getSession()
            await session.call(op("ft3m.dev_register_asset", tokenName, symbol, chainId));

            let tokenID = gtv.gtvHash([tokenName, chainId]) // this generates the actual id of the token and is used to give balance to the user

            return {
                id: tokenID
            }

        } else {

            let response = await AssetV2.register(tokenName, symbol, chainId, blockchain)

            return response;
        }

    } catch (err) {
        console.log('registerNewToken err : ', err)
    }
}

export const giveBalance = async ({ blockchain, accountId, tokenId, initialSupply, metamaskAccount = null }) => {
    try {
        if (metamaskAccount) {
            let session = await getSession()
            await session.call(op("ft3m.dev_give_balance", tokenId, accountId, initialSupply));
        }
        else

            await AssetBalance.giveBalance(accountId, tokenId, initialSupply, blockchain);

    } catch (err) {
        console.log('giveBalance err : ', err)
    }
}