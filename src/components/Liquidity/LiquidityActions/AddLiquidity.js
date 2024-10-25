import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

import BlockchainContext from "../../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../../contexts/AppContext/app.context";
import { DECIMAL_REGEX } from "../../../utils/constant";
import {
  getMinifiedAddress,
  adjustSlippage,
  getDeadlineInMillis,
  roundFloat,
} from "../../../utils/util.functions";
import {
  addLiquidityFunc,
  fetchPriceFunc,
} from "../../../services/rell_post.services/liquidity.service";
import { Modal } from "../../UI/Modal";
import { Render } from "../../Wrapper/ConditionalRender";

const AddLiquidity = ({
  pair,
  tokenList,
  slippage,
  deadline,
  getPairs,

  loadTokenList,
}) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState("");
  const [firstTokenBalance, setFirstTokenBalance] = useState("");
  const [secondTokenAmount, setSecondTokenAmount] = useState("");
  const [secondTokenBalance, setSecondTokenBalance] = useState("");
  const [lpTokenBalance, setLpTokenbalance] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  const blockchain = useContext(BlockchainContext);
  const { chromia_account, pageLoaded, metamaskAccount } = useContext(AppContext);

  const refresh = () => {
    setLpTokenbalance("");
    setFirstTokenAmount("");
    setFirstTokenBalance("");
    setSecondTokenAmount("");
    setSecondTokenBalance("");
    // loadTokenList();
    getPairs();
  };

  const addLiquidity = async () => {
    setButtonVisible(false);
    try {
      const amountAMin = adjustSlippage(firstTokenAmount, slippage);
      const amountBMin = adjustSlippage(secondTokenAmount, slippage);

      await addLiquidityFunc({
        blockchain: blockchain,
        asset1Id: pair?.asset1?.id,
        asset2Id: pair?.asset2?.id,
        tokenAmount1: firstTokenAmount.toString(),
        tokenAmount2: secondTokenAmount.toString(),
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

  const handleAddLiquidity = async () => {
    await toast.promise(addLiquidity(), {
      loading: "Adding liquidity...",
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

  const fetchPrice = async () => {
    const first = pair?.asset1?.id;
    const second = pair?.asset2?.id;
    const amount = firstTokenAmount;
    if (first && second && amount) {
      try {
        const priceTuple = await fetchPriceFunc({
          blockchain: blockchain,
          tokenA: first,
          tokenB: second,
          amount: amount,
          metamaskAccount: metamaskAccount
        });

        //console.log('tuple', priceTuple, (parseFloat(priceTuple?.quote).toFixed(18)))
        setSecondTokenAmount(parseFloat(priceTuple?.quote).toFixed(18));
      } catch (err) {
        console.log(err);
        toast(err.shortReason);
      }
    }
  };

  const getBalance = (tokenId) => {
    console.log("recalculating balance", tokenList);
    if (tokenList[0]?.asset)
      return tokenList.find(
        (element) =>
          element?.asset?.id.toString("hex").toLowerCase() ===
          tokenId?.toString('hex')?.toLowerCase()
      )?.amount;

    return tokenList.find(
      (element) =>
        element?.id.toString("hex").toLowerCase() === tokenId?.toString('hex').toLowerCase()
    )?.amount;
  };

  const isValid = () => {
    return (
      firstTokenAmount &&
      secondTokenAmount &&
      parseFloat(firstTokenAmount) &&
      parseFloat(secondTokenAmount)
    );
  };

  useEffect(() => {
    if (pair) {
      setFirstTokenBalance(getBalance(pair?.asset1?.id));
      setSecondTokenBalance(getBalance(pair?.asset2?.id));
      setLpTokenbalance(getBalance(pair?.lp_token?.id));
      console.log("refreshing balance");
    }
  }, [pair]);

  useEffect(() => {
    if (pair) {
      if (firstTokenAmount) {
        fetchPrice();
      } else {
        setSecondTokenAmount(0);
      }
    }
  }, [pair?.id, firstTokenAmount]);

  console.log("pair..", pair?.lp_token?.id, lpTokenBalance);

  return (
    <>
      {firstTokenBalance && (
        <div className="d-flex justify-content-end">
          <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
            Available:{" "}
            <b>{`${new Intl.NumberFormat("en-US").format(
              firstTokenBalance
            )}`}</b>{" "}
          </span>
        </div>
      )}

      {showModal && (
        <Modal
          heading="Liquidity added successfully"
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      <div className="group flex min-h-[70px] mb-5 rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
        <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600">
          <span className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin">
            {/* <img alt="Logo" src="assets/media/icons/busd.png" className="h-30px" /> */}
            <span className="ltr:ml-2 rtl:mr-2">{pair?.asset1?.symbol}</span>
          </span>
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="0.0"
            inputMode="decimal"
            className="w-full rounded-tr-lg rounded-br-lg border-0 exchange-value pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
            value={firstTokenAmount}
            onChange={(e) => {
              const amount = e.target.value;
              if (amount === "") {
                setFirstTokenAmount("");
              } else if (amount.match(DECIMAL_REGEX)) {
                setFirstTokenAmount(e.target.value);
              }
            }}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center z-[1] -mt-4 -ml-4 rounded-full shadow-large dark:bg-gray-600">
        <button className="relative inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium outline-none transition-all sm:text-sm text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 exchange-icon text-gray-900 my-5 dark:text-white rounded-full w-8 h-8">
          <span className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#fff"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
              ></path>
            </svg>
          </span>
        </button>
      </div>
      {secondTokenBalance && (
        <div className="d-flex justify-content-end">
          <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
            Available:{" "}
            <b>{`${new Intl.NumberFormat("en-US").format(
              secondTokenBalance
            )}`}</b>{" "}
          </span>
        </div>
      )}
      <div className="group flex min-h-[70px] mb-10 rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
        <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600">
          <span className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin">
            {/* <img alt="Logo" src="assets/media/icons/busd.png" className="h-30px" /> */}
            <span className="ltr:ml-2 rtl:mr-2">{pair?.asset2?.symbol}</span>
          </span>
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="0.0"
            inputMode="decimal"
            className="w-full rounded-tr-lg rounded-br-lg border-0 exchange-value pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
            value={secondTokenAmount}
            disabled={true}
          />
        </div>
      </div>
      <div className="mb-10">
        <div className="separator separator-dashed my-5"></div>
        <div className="gap-4 xs:gap-[18px]">
          <div className="text-gray-500">
            <span className="font-medium">
              My Liquidity (share{" "}
              {roundFloat((lpTokenBalance * 100) / pair?.lp_supply, 2)}%)
            </span>
            <br />
            <span className="fs-4 text-white">
              {getMinifiedAddress(pair?.id.toString('hex'))}
            </span>
          </div>
        </div>
      </div>
      <Render condition={buttonVisible}>
        <button
          type="submit"
          disabled={!isValid()}
          className="btn btn-primary w-100"
          onClick={handleAddLiquidity}
        >
          Add Liquidity
        </button>
      </Render>
    </>
  );
};

export default AddLiquidity;
