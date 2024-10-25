import { op } from "ft3-lib";
import { getSession } from "../../utils/blockchain/blockchain";

export const depositIdo = async ({
  accountID,
  amount,
  idoId,
  metamaskAccount = null,
}) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      await session.call(op("deposit_ido", accountID, amount, idoId));
    }
  } catch (err) {
    console.log("Init err: ", err);
    throw err;
  }
};

export const getIdoStatus = async ({ metamaskAccount, idoId }) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      let res = await session.query({
        name: "get_general_stats",
        args: {
          ido_id: idoId,
        },
      });
      console.log(res);
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async ({ metamaskAccount, userId }) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      let res = await session.query({
        name: "get_user_details",
        args: {
          user_id: userId,
        },
      });
      return res;
    }
  } catch (error) {
    throw error;
  }
};

