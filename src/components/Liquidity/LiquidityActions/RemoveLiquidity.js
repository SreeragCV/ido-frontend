import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";

import BlockchainContext from "../../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../../contexts/AppContext/app.context";
import { DECIMAL_REGEX } from "../../../utils/constant";
import {
  getMinifiedAddress,
  adjustSlippage,
  getDeadlineInMillis,
} from "../../../utils/util.functions";

import { removeLiquidityFunc } from "../../../services/rell_post.services/liquidity.service";
import { Modal } from "../../UI/Modal";
import { Render } from "../../Wrapper/ConditionalRender";

const RemoveLiquidity = ({
  pair,
  tokenList,
  getPairs,
  slippage,
  deadline,
  loadTokenList,
}) => {
  const [lpTokenAmount, setLpTokenAmount] = useState("");
  const [lpTokenBalance, setLpTokenbalance] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  const blockchain = useContext(BlockchainContext);
  const { chromia_account, pageLoaded, metamaskAccount } = useContext(AppContext);

  const refresh = () => {
    setLpTokenAmount("");
    setLpTokenbalance((pre) => pre - lpTokenAmount);
    getPairs();
  };

  const removeLiquidity = async () => {
    setButtonVisible(false);
    try {
      const amountAMin = adjustSlippage(
        (lpTokenAmount * parseFloat(pair?.amount1)) /
        parseFloat(pair?.lp_supply),
        slippage
      );
      const amountBMin = adjustSlippage(
        (lpTokenAmount * parseFloat(pair?.amount2)) /
        parseFloat(pair?.lp_supply),
        slippage
      );

      await removeLiquidityFunc({
        blockchain: blockchain,
        asset1Id: pair?.asset1?.id,
        asset2Id: pair?.asset2?.id,
        lpTokenAmount: lpTokenAmount,
        amountAMin: amountAMin.toString(),
        amountBMin: amountBMin.toString(),
        deadline: getDeadlineInMillis(deadline),
        accountId: chromia_account.id,
        metamaskAccount: metamaskAccount
      });

      refresh();
    } catch (err) {
      console.log(JSON.stringify(err));
      throw err;
    } finally {
      setButtonVisible(true);
    }
  };

  const handleRemoveLiquidity = async () => {
    await toast.promise(removeLiquidity(), {
      loading: "Removing liquidity...",
      success: () => {
        setShowModal(true);
        return "Done!";
      },
      error: (err) =>
        err?.shortReason ??
        err?.message ??
        "Something went wrong , Try again later",
    });
  };

  const getBalance = (tokenId) => {
    console.log("recalculating balance...", tokenId?.toString('hex'), tokenList);
    const assetBalance = tokenList.find((element) => {
      if (element?.id) {
        return element?.id.toString('hex') === tokenId.toString('hex');
      }
      return element?.asset?.id?.toString("hex")?.toLowerCase() === tokenId?.toString('hex').toLowerCase();
    });
    console.log("assetBalance", assetBalance);
    return assetBalance?.amount;
  };

  const isValid = () => {
    return lpTokenAmount && parseFloat(lpTokenAmount);
  };

  useEffect(() => {
    if (pair) {
      console.log("pair", pair);
      setLpTokenbalance(getBalance(pair?.lp_token?.id));
    }
  }, [pair]);

  return (
    <>
      {lpTokenBalance && (
        <div className="d-flex justify-content-end">
          <span
            className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400 "
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setLpTokenAmount(lpTokenBalance);
            }}
          >
            (Click to get max) Available:{" "}
            <b>{getMinifiedAddress(lpTokenBalance)}</b>{" "}
          </span>
        </div>
      )}
      {showModal && (
        <Modal
          heading="Liquidity removed successfully successfully"
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      <div className="group flex min-h-[70px] mb-5 rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
        <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600">
          <span className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin">
            {/* <img alt="Logo" src="assets/media/icons/busd.png" className="h-30px" /> */}
            <span className="ltr:ml-2 rtl:mr-2">{pair?.lp_token?.symbol}</span>
          </span>
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="0.0"
            inputMode="decimal"
            className="w-full rounded-tr-lg rounded-br-lg border-0 exchange-value pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
            value={lpTokenAmount}
            onChange={(e) => {
              const amount = e.target.value;
              if (amount === "") {
                setLpTokenAmount("");
              } else if (amount.match(DECIMAL_REGEX)) {
                setLpTokenAmount(e.target.value);
              }
            }}
          />
        </div>
      </div>

      <div className="mb-10">
        <div className="separator separator-dashed my-5"></div>
        <div className="gap-4 xs:gap-[18px]">
          <div className="text-gray-500">
            <span className="font-medium">Pool</span>
            <br />
            <span className="fs-4 text-white">
              {getMinifiedAddress(pair?.id.toString('hex'))}
            </span>
          </div>
        </div>
        <br />
        <div className="gap-4 xs:gap-[18px]">
          <div className="text-gray-500">
            <span className="font-medium">Total Liquidity</span>
            <br />
            <span className="fs-4 text-white">
              {" "}
              {`${new Intl.NumberFormat("en-US").format(pair?.amount1)}`}{" "}
              {pair?.asset1?.symbol} /{" "}
              {`${new Intl.NumberFormat("en-US").format(pair?.amount2)}`}
              {pair?.asset2?.symbol}
            </span>
          </div>
        </div>
      </div>

      <Render condition={buttonVisible}>
        <button
          type="submit"
          disabled={!isValid()}
          className="btn btn-primary w-100"
          onClick={handleRemoveLiquidity}
        >
          Remove Liquidity
        </button>
      </Render>
    </>
  );
};

export default RemoveLiquidity;
