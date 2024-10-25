import { nop, op } from "ft3-lib";
import { getStoredAccount } from "../../utils/blockchain/account-storage";
import { getSession } from "../../utils/blockchain/blockchain";

const storedAccount = getStoredAccount();


export const swapFunction = async ({
    blockchain,
    token1Id,
    token2Id,
    token1Amount,
    amountMin,
    deadline,
    accountId,
    metamaskAccount = null
}) => {
    try {

        if (metamaskAccount) {
            let session = await getSession()
            await session.call(op("ft3m.swap", token1Id, token2Id, token1Amount, amountMin, deadline, accountId, accountId));

        }
        else {
            await blockchain.transactionBuilder()
                .add(op("ft3.swap", token1Id, token2Id, token1Amount, amountMin, deadline, storedAccount.user.authDescriptor.id, accountId))
                .add(nop())
                .buildAndSign(storedAccount.user).post();
        }

    } catch (err) {
        console.log('swapFunction err : ', err);
    }
}