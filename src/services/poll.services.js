import { op } from "ft3-lib";
import { getSession } from "../utils/blockchain/blockchain";

export const createPoll = async ({
  title,
  options,
  deadline,
  blockchain,
  titleImage,
  metamaskAccount = null,
}) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      await session.call(
        op("create_poll", title, options, deadline, titleImage)
      );
    }
  } catch (err) {
    console.log("swapFunction err : ", err);
    throw err;
  }
};

export const voteForPoll = async ({ voteID, metamaskAccount, isYesVote }) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      await session.call(op("vote_on_poll_option", voteID));
    }
  } catch (err) {
    console.log("swapFunction err : ", err);
    throw err;
  }
};

export const addAnswerForPoll = async ({ pollId, metamaskAccount, optionId }) => {
  try {
    if (metamaskAccount) {
      let session = await getSession();
      await session.call(op("add_right_answer", pollId, optionId));
    }
  } catch (err) {
    console.log("swapFunction err : ", err);
    throw err;
  }
};

