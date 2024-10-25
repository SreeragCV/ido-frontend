import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createStructuredSelector } from "reselect";
import { useSelector } from "react-redux";

import {
  selectModalTokens,
  selectFilterModalList,
  selectSearchModalTokenName,
} from "../../redux/modal-list-reducer/modal-list.selectors";

import { DECIMAL_REGEX } from "../../utils/constant";
import { getDeadlineInMillis, formatFloat } from "../../utils/util.functions";
import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../contexts/AppContext/app.context";
import {
  getPairInfoFunc,
  fetchPriceFunc,
} from "../../services/rell_post.services/liquidity.service";
import { swapFunction } from "../../services/rell_post.services/swap.services";

import Slippage from "../Liquidity/LiquidityActions/Slippage";
import TokenModal from "../TokenList/TokenModal/TokenModalFilter";
import { Modal } from "../UI/Modal";
import { ConfirmSwap } from "./ConfirmSwap";
import { GraphDisabled, GraphEnabled } from "../svg/Graph";
import { DisplayButton } from "../UI/DisplayButton";
import { fetchTokenBalanceByAccount } from "../../services/rell_api.get.services";

const toggleGraphClass = {
  off: "app-sidebar app-sidebar-1 flex-column",
  on: "app-sidebar",
};

const SwapToken = ({
  pair,
  setPair,
  inverted,
  setInverted,
  showGraph,
  setShowGraph,
}) => {
  const blockchain = useContext(BlockchainContext);
  const { chromia_account, pageLoaded, metamaskAccount } = useContext(AppContext);

  const { searchToken } = useSelector(
    createStructuredSelector({ searchToken: selectSearchModalTokenName })
  );

  const { allList } = useSelector(
    createStructuredSelector({ allList: selectModalTokens })
  );

  const tokenList = useSelector(selectFilterModalList(searchToken || ""));

  const [tokenListModalMode, setTokenListModalMode] = useState("hidden");
  const [showEnterTokenDetails, setShowEnterTokenDetails] = useState(true);
  const [firstToken, setFirstToken] = useState(null);
  const [firstTokenAmount, setFirstTokenAmount] = useState("");
  const [firstTokenBalance, setFirstTokenBalance] = useState("");
  const [secondToken, setSecondToken] = useState(null);
  const [secondTokenAmount, setSecondTokenAmount] = useState("");
  const [secondTokenBalance, setSecondTokenBalance] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [deadline, setDeadline] = useState();
  const [price, setPrice] = useState();
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const refresh = () => {
    setTokenListModalMode("hidden");
    // setFirstToken(null);
    // setSecondToken(null);
    setFirstTokenAmount("");
    setFirstTokenBalance("");
    setSecondTokenAmount("");
    setSecondTokenBalance("");
    setPrice("");
  };

  const getPair = async (firstToken, secondToken) => {
    try {
      const existingPair = await getPairInfoFunc({
        blockchain: blockchain,
        token1Id: firstToken?.id,
        token2Id: secondToken?.id,
        metamaskAccount: metamaskAccount
      });

      setPair(existingPair);
    } catch (err) {
      setPair(null);
      toast.error("Pool does not exist for this pair");
    }
  };

  const fetchPrice = async () => {
    const first = firstToken?.id;
    const second = secondToken?.id;
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

        if (isNaN(parseFloat(priceTuple?.quote).toFixed(18))) {
          setSecondToken("");
        }

        setSecondTokenAmount(
          isNaN(parseFloat(priceTuple?.quote).toFixed(18))
            ? 0
            : parseFloat(priceTuple?.quote).toFixed(18)
        );
        setPrice(
          isNaN(parseFloat(priceTuple?.current_price).toFixed(18))
            ? 0
            : parseFloat(priceTuple?.current_price).toFixed(18)
        );
      } catch (err) {
        console.log(err);
        toast(err.shortReason);
      }
    }
  };

  const getBalance = async (token) => {
    if (!chromia_account?.id) return 0;
    const assetBalance = allList.find(
      (element) => element?.id.toString("hex") === token?.id.toString("hex")
    );
    let res = await fetchTokenBalanceByAccount({
      blockchain: blockchain,
      accountId: chromia_account.id,
      assetId: token?.id,
      metamaskAccount: metamaskAccount
    });
    if (!res) {
      return 0;
    } else console.log(res, "res");
    return assetBalance?.amount;
  };

  const getAmountOutMin = () => {
    return (secondTokenAmount * (100 - slippage)) / 100;
  };

  const swapToken = async () => {
    setIsSubmitting(true);
    try {
      await swapFunction({
        blockchain: blockchain,
        token1Id: firstToken.id,
        token2Id: secondToken.id,
        token1Amount: firstTokenAmount,
        amountMin: getAmountOutMin().toString(),
        deadline: getDeadlineInMillis(deadline),
        accountId: chromia_account.id,
        metamaskAccount: metamaskAccount
      });

      refresh();
    } catch (err) {
      console.log(JSON.stringify(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const setToken = (token) => {
    if (tokenListModalMode === "TOKEN1") {
      setFirstToken(token);
      // setFirstTokenAmount(Number(token?.amount));
    }

    if (tokenListModalMode === "TOKEN2") {
      setSecondToken(token);
    }
  };

  const handleSwapToken = () => {
    toast.promise(swapToken(), {
      loading: "Swapping...",
      success: () => {
        setShowModal(true);
        setShowEnterTokenDetails(true);
        return "Done!";
      },
      error: (err) =>
        err?.shortReason ??
        err?.message ??
        "Something went wrong , Try again later",
    });
  };

  const toggleGraph = () => {
    setShowGraph((pre) => !pre);
  };

  const isValid =
    firstToken &&
    secondToken &&
    parseFloat(firstTokenAmount) &&
    parseFloat(secondTokenAmount) &&
    pair;

  useEffect(() => {
    setPair(null);
    if (firstToken && secondToken) {
      getPair(firstToken, secondToken);
    }
  }, [firstToken, secondToken]);

  useEffect(() => {
    (async () => {
      if (firstToken) setFirstTokenBalance(await getBalance(firstToken));
    })();
  }, [firstToken]);

  useEffect(() => {
    (async () => {
      if (secondToken) setSecondTokenBalance(await getBalance(secondToken));
    })();
  }, [secondToken]);

  useEffect(() => {
    if (pair) {
      if (firstTokenAmount) {
        fetchPrice();
      } else {
        setSecondTokenAmount(0);
      }
    }
  }, [pair?.id, firstTokenAmount]);

  console.log("token list", tokenList);

  return (
    <>
      {showModal && (
        <Modal
          heading="Token swapped successfully"
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      {showEnterTokenDetails && (
        <div
          id="kt_app_sidebar"
          className={!showGraph ? toggleGraphClass.on : toggleGraphClass.off}
          data-kt-drawer-name="app-sidebar"
          data-kt-drawer-activate="{default: true, lg: false}"
          data-kt-drawer-overlay="true"
          data-kt-drawer-width="375px"
          data-kt-drawer-direction="start"
          data-kt-drawer-toggle="#kt_app_sidebar_toggle"
        >
          <div
            className="flex-column-fluid px-4 px-lg-8 py-4"
            id="kt_app_sidebar_nav"
          >
            <nav className="">
              <div className="d-flex align-items-center justify-content-end text-gray-600 dark:text-gray-400 sm:flex">
                <button
                  className="relative inline-flex settings-icon"
                  onClick={toggleGraph}
                >
                  <span className="" title="toggle Graph">
                    {showGraph ? <GraphEnabled /> : <GraphDisabled />}
                  </span>
                </button>
                <button
                  className="relative inline-flex settings-icon ml-10"
                  data-bs-toggle="modal"
                  data-bs-target="#slippage"
                >
                  <span className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-gear"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                    </svg>
                  </span>
                </button>
              </div>
            </nav>
            <div
              data-projection-id="12"
              style={{ opacity: 1, transform: "none" }}
            >
              <div className="mb-5 border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
                <div className="relative flex gap-3 flex-col mt-7">
                  <div className="d-flex justify-content-between">
                    <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
                      Pay
                    </span>
                    {(firstTokenBalance || firstTokenBalance === 0) && (
                      <span
                        onClick={() => {
                          setFirstTokenAmount(firstTokenBalance);
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400"
                      >
                        Available:{" "}
                        <b>{`${new Intl.NumberFormat("en-US").format(
                          firstTokenBalance
                        )}`}</b>{" "}
                      </span>
                    )}
                  </div>

                  <div className="group flex min-h-[70px] rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
                    <div
                      onClick={() => setShow(true)}
                      className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <button
                        className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin"
                        onClick={() => setTokenListModalMode("TOKEN1")}
                      >
                        {/* <img alt="Logo" src="./assets/media/icons/busd.png" className="h-30px" /> */}
                        <span className="ltr:ml-2 rtl:mr-2">
                          {firstToken?.name || "Select"}{" "}
                        </span>
                        <svg
                          width="11"
                          height="6"
                          viewBox="0 0 11 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ltr:ml-1.5 rtl:mr-1.5"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.6635 0.336517C10.9719 0.644826 10.9719 1.14469 10.6635 1.453L6.45302 5.66353C6.14471 5.97184 5.64484 5.97184 5.33653 5.66353L1.12601 1.453C0.817699 1.14469 0.817699 0.644826 1.12601 0.336517C1.43432 0.0282085 1.93418 0.0282085 2.24249 0.336517L5.89478 3.9888L9.54706 0.336517C9.85537 0.0282085 10.3552 0.0282085 10.6635 0.336517Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="flex">
                      <input
                        disabled={!firstToken}
                        type="text"
                        placeholder="0.0"
                        inputMode="decimal"
                        className="rounded-tr-lg rounded-br-lg border-0 exchange-value pb-0.5 text-right text-lg outline-none dark:bg-light-dark"
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
                    <button
                      onClick={() => {
                        const tempName = firstToken;
                        setFirstToken(secondToken);
                        setSecondToken(tempName);
                        setInverted(!inverted);
                      }}
                      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium outline-none transition-all sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 exchange-icon my-5 dark:text-white rounded-full w-8 h-8"
                    >
                      <span className="">
                        <svg
                          viewBox="0 0 13 14"
                          fill="#fff"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-auto w-3"
                        >
                          <path
                            d="M7.42422 2.96288C7.68877 3.22743 8.11769 3.22743 8.38223 2.96288L9.03226 2.31285L9.03226 11.5161C9.03226 11.8903 9.33555 12.1935 9.70968 12.1935C10.0838 12.1935 10.3871 11.8903 10.3871 11.5161L10.3871 2.31285L11.0371 2.96288C11.3017 3.22743 11.7306 3.22743 11.9951 2.96288C12.2597 2.69833 12.2597 2.26941 11.9951 2.00486L10.1887 0.198412C9.92414 -0.0661372 9.49522 -0.0661371 9.23067 0.198412L7.42422 2.00486C7.15967 2.26941 7.15967 2.69833 7.42422 2.96288Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M3.16129 11.6871L3.81132 11.0371C4.07586 10.7726 4.50478 10.7726 4.76933 11.0371C5.03388 11.3017 5.03388 11.7306 4.76933 11.9951L2.96288 13.8016C2.69833 14.0661 2.26941 14.0661 2.00486 13.8016L0.198412 11.9951C-0.0661371 11.7306 -0.0661372 11.3017 0.198412 11.0371C0.46296 10.7726 0.891878 10.7726 1.15643 11.0371L1.80645 11.6871L1.80645 2.48387C1.80645 2.10974 2.10974 1.80645 2.48387 1.80645C2.858 1.80645 3.16129 2.10974 3.16129 2.48387L3.16129 11.6871Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
                      Receive (Estimated)
                    </span>
                    {(secondTokenBalance || secondTokenBalance === 0) && (
                      <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
                        Available:{" "}
                        <b>{`${new Intl.NumberFormat("en-US").format(
                          secondTokenBalance
                        )}`}</b>{" "}
                      </span>
                    )}
                  </div>

                  <div className="group flex min-h-[70px] rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
                    <div
                      onClick={() => setShow(true)}
                      className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <button
                        onClick={() => setTokenListModalMode("TOKEN2")}
                        className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin"
                      >
                        {/* <img alt="Logo" src="assets/media/icons/usdc.png" className="h-30px" /> */}
                        <span className="ltr:ml-2 rtl:mr-2">
                          {secondToken?.name || "Select"}{" "}
                        </span>
                        <svg
                          width="11"
                          height="6"
                          viewBox="0 0 11 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ltr:ml-1.5 rtl:mr-1.5"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.6635 0.336517C10.9719 0.644826 10.9719 1.14469 10.6635 1.453L6.45302 5.66353C6.14471 5.97184 5.64484 5.97184 5.33653 5.66353L1.12601 1.453C0.817699 1.14469 0.817699 0.644826 1.12601 0.336517C1.43432 0.0282085 1.93418 0.0282085 2.24249 0.336517L5.89478 3.9888L9.54706 0.336517C9.85537 0.0282085 10.3552 0.0282085 10.6635 0.336517Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </button>
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

                  <TokenModal
                    show={show}
                    tokenListModalMode={tokenListModalMode}
                    close={() => setShow(false)}
                    tokenList={tokenList}
                    firstToken={firstToken}
                    secondToken={secondToken}
                    setToken={setToken}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center mb-10">
                {pair === -1 ? (
                  <span className="mb-1.5 block text-lg uppercase text-danger">
                    No Liquidity Pool
                  </span>
                ) : price ? (
                  <>
                    <span className="mb-1.5 block text-lg uppercase text-gray-600 dark:text-gray-400">
                      1 {firstToken?.symbol} = {price} {secondToken?.symbol}
                    </span>
                    <span
                      onClick={fetchPrice}
                      className="mb-1.5 ml-10 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#fff"
                        className="bi bi-arrow-clockwise"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                        ></path>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path>
                      </svg>
                    </span>
                  </>
                ) : null}
              </div>
              <DisplayButton>
                {firstTokenBalance !== 0 ? (
                  <button
                    disabled={!isValid}
                    onClick={() => {
                      setShowEnterTokenDetails(false);
                    }}
                    className="btn btn-primary w-100"
                  >
                    Swap
                  </button>
                ) : (
                  <button disabled className="btn btn-primary w-100">
                    You Don't have {firstToken?.symbol}
                  </button>
                )}
              </DisplayButton>

              <div className="separator separator-dashed my-5"></div>
              <div className="flex flex-col gap-4 xs:gap-[18px]">
                <div className="d-flex align-items-center justify-content-between text-gray-300">
                  <span className="font-medium">Slippage Tolerance</span>
                  <span>{formatFloat(slippage, 2, 10)}%</span>
                </div>
                {secondTokenAmount && (
                  <div className="d-flex align-items-center justify-content-between text-gray-300">
                    <span className="font-medium">Min. Received</span>
                    <span>
                      {getAmountOutMin()} {secondToken?.symbol}
                    </span>
                  </div>
                )}
              </div>
              <br />
            </div>
          </div>
        </div>
      )}

      {!showEnterTokenDetails && (
        <ConfirmSwap
          isSubmitting={isSubmitting}
          getAmountOutMin={getAmountOutMin}
          firstToken={firstToken}
          secondToken={secondToken}
          firstTokenAmount={firstTokenAmount}
          secondTokenAmount={secondTokenAmount}
          handleSwapToken={handleSwapToken}
          setShowEnterTokenDetails={setShowEnterTokenDetails}
        />
      )}
      <Slippage
        tolValue={slippage}
        setSlippage={setSlippage}
        deadlineValue={deadline}
        setDeadline={setDeadline}
      />
    </>
  );
};

export default SwapToken;
