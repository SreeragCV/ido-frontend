import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createStructuredSelector } from "reselect";

import {
  selectModalTokens,
  selectFilterModalList,
  selectSearchModalTokenName,
} from "../../../redux/modal-list-reducer/modal-list.selectors";

import BlockchainContext from "../../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../../contexts/AppContext/app.context";
import {
  getMinifiedAddress,
  adjustSlippage,
  getDeadlineInMillis,
} from "../../../utils/util.functions";
import {
  getPairInfoFunc,
  addLiquidityFunc,
  fetchPriceFunc,
} from "../../../services/rell_post.services/liquidity.service";

import Slippage from "./Slippage";
import TokenModal from "../../TokenList/TokenModal/TokenModal";
import { DisplayButton } from "../../UI/DisplayButton";
import { Modal } from "../../UI/Modal";
import { fetchTokenBalanceByAccount } from "../../../services/rell_api.get.services";
import { Render } from "../../Wrapper/ConditionalRender";

const CreateLiquidity = ({ getPairs, loadTokenList }) => {
  const blockchain = useContext(BlockchainContext);
  const { chromia_account, pageLoaded, metamaskAccount } = useContext(AppContext);

  const [tokenListModalMode, setTokenListModalMode] = useState("hidden");
  const [firstToken, setFirstToken] = useState(null);
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [firstTokenBalance, setFirstTokenBalance] = useState("");
  const [secondToken, setSecondToken] = useState(null);
  const [secondTokenAmount, setSecondTokenAmount] = useState();
  const [secondTokenBalance, setSecondTokenBalance] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [deadline, setDeadline] = useState();
  const [pair, setPair] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(true);

  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { searchToken } = useSelector(
    createStructuredSelector({ searchToken: selectSearchModalTokenName })
  );

  const { allList } = useSelector(
    createStructuredSelector({ allList: selectModalTokens })
  );
  //let tokenList = [];

  //console.log('tokens', allList)

  const tokenList = useSelector(selectFilterModalList(searchToken || ""));

  const setToken1Amount = (e) => {
    let amount = +e.target.value;
    if (isNaN(amount)) {
      setFirstTokenAmount(0);
      return;
    }
    if (amount !== 0) {
      setFirstTokenAmount(amount);
    }
  };

  const setToken2Amount = (e) => {
    let amount = +e.target.value;

    if (isNaN(amount)) {
      setSecondTokenAmount(0);
      return;
    }

    if (amount !== 0) {
      setSecondTokenAmount(amount);
    }
  };

  const setToken = (token) => {
    if (tokenListModalMode === "TOKEN1") {
      setFirstToken(token);
    }

    if (tokenListModalMode === "TOKEN2") {
      setSecondToken(token);
    }
  };

  const refresh = () => {
    setTokenListModalMode("hidden");
    setFirstToken(null);
    setSecondToken(null);
    setFirstTokenAmount(null);
    setFirstTokenBalance(null);
    setSecondTokenAmount(null);
    setSecondTokenBalance(null);
    getPairs();
    // loadTokenList();
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
      //toast.error("pool does not exist for this pair");
      console.log("getPair err : ", err);
    }
  };

  const getBalance = async (token) => {
    //console.log("recalculating balance")
    const assetBalance = allList.find(
      (element) => element?.id.toString("hex") === token?.id.toString("hex")
    );

    let res = await fetchTokenBalanceByAccount({
      blockchain: blockchain,
      accountId: chromia_account?.id,
      assetId: token?.id,
      metamaskAccount: metamaskAccount
    });
    if (!res) {
      return 0;
    }
    return assetBalance?.amount;
  };

  const addLiquidity = async () => {
    setButtonVisible(false);
    try {
      const amountAMin = adjustSlippage(firstTokenAmount, slippage);
      const amountBMin = adjustSlippage(secondTokenAmount, slippage);

      await addLiquidityFunc({
        blockchain: blockchain,
        asset1Id: firstToken?.id,
        asset2Id: secondToken?.id,
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
      console.log(err, "error from  create liquidity");
      throw err;
    } finally {
      setButtonVisible(true);
    }
  };

  const createLiquidity = async () => {
    await toast.promise(addLiquidity(), {
      loading: "Creating liquidity",
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
        });

        setSecondTokenAmount(parseFloat(priceTuple?.quote).toFixed(18));
      } catch (err) {
        console.log(err);
        toast(err.shortReason);
      }
    }
  };

  const isValid = () => {
    //console.log('boolean',(+firstTokenAmount <= +firstTokenBalance) , (+secondTokenAmount <= +secondTokenBalance))
    if (pair) {
      return (
        firstTokenAmount &&
        secondTokenAmount &&
        parseFloat(firstTokenAmount) &&
        parseFloat(secondTokenAmount) &&
        +firstTokenAmount <= +firstTokenBalance &&
        +secondTokenAmount <= +secondTokenBalance
      );
    } else {
      return (
        firstToken &&
        secondToken &&
        parseFloat(firstTokenAmount) &&
        parseFloat(secondTokenAmount) &&
        +firstTokenAmount <= +firstTokenBalance &&
        +secondTokenAmount <= +secondTokenBalance &&
        Math.sqrt(firstTokenAmount * secondTokenAmount) > 1000
      );
    }
  };

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

  useEffect(() => {
    console.log("runnig");

    // loadTokenList();
  }, []);

  if (allList.length == 0) {
    return (
      <div
        id="kt_app_sidebar"
        className="app-sidebar app-sidebar-2 flex-column"
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <h3 style={{ color: "white", padding: "1rem" }}>No tokens</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <Modal
          heading="Liquidity added"
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}

      <div
        id="kt_app_sidebar"
        className="app-sidebar app-sidebar-2 flex-column"
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
              <button
                className="relative inline-flex settings-icon ml-10"
                onClick={refresh}
              >
                <span className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-clockwise"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                    />
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
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
              <span className="mb-1.5 mt-7 block text-xs uppercase text-gray-600 dark:text-gray-400">
                Select a Pair
              </span>
              <div className="relative flex gap-3 align-items-center justify-content-between">
                <div onClick={() => setShow(true)}>
                  <div className="group flex min-h-[70px] rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
                    <div
                      className="liquidity-token border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <button
                        className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin"
                        onClick={() => setTokenListModalMode("TOKEN1")}
                      >
                        {/* <img alt="Logo" src="./assets/media/icons/busd.png" className="h-30px" /> */}
                        <span className="ltr:ml-2 rtl:mr-2">
                          {firstToken?.name || "Select Token"}{" "}
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
                  </div>
                </div>
                <div className="d-flex justify-content-center z-[1] -mt-4 -ml-4 rounded-full shadow-large dark:bg-gray-600">
                  <button className="relative inline-flex mt-10 shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium outline-none transition-all sm:text-sm text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 exchange-icon text-gray-900 my-5 dark:text-white rounded-full w-8 h-8">
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
                          fill-rule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
                <div onClick={() => setShow(true)}>
                  <div className="group flex min-h-[70px] rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
                    <div
                      className="liquidity-token border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <button
                        className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin"
                        onClick={() => setTokenListModalMode("TOKEN2")}
                      >
                        {/* <img alt="Logo" src="./assets/media/icons/usdc.png" className="h-30px" /> */}
                        <span className="ltr:ml-2 rtl:mr-2">
                          {secondToken?.name || "Select Token"}{" "}
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
                  </div>
                </div>

                <TokenModal
                  show={show}
                  close={() => setShow(false)}
                  tokenList={tokenList}
                  firstToken={firstToken}
                  secondToken={secondToken}
                  setToken={setToken}
                />
              </div>

              {firstToken && (
                <>
                  <div
                    className="d-flex justify-content-end"
                    style={{ marginTop: "2rem" }}
                  >
                    <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
                      Available:{" "}
                      <b>{`${new Intl.NumberFormat("en-US").format(
                        firstTokenBalance
                      )}`}</b>{" "}
                    </span>
                  </div>

                  <div className="group flex min-h-[70px] mb-5 rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600">
                      <span className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin">
                        {/* <img alt="Logo" src="assets/media/icons/busd.png" className="h-30px" /> */}
                        <span className="ltr:ml-2 rtl:mr-2">
                          {firstToken?.symbol}
                        </span>
                      </span>
                    </div>
                    <div
                      className="flex"
                      title="Amount cannot be 0 or more than token balance"
                    >
                      <input
                        disabled={!firstToken}
                        type="text"
                        placeholder="0.0"
                        inputMode="decimal"
                        className="w-full rounded-tr-lg rounded-br-lg border-0 exchange-value pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
                        value={firstTokenAmount}
                        onChange={(e) => {
                          if (!isNaN(e.target.value)) setToken1Amount(e);
                          else setToken1Amount(0);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {secondToken && (
                <>
                  <div
                    className="d-flex justify-content-end"
                    style={{ marginTop: "2rem" }}
                  >
                    <span className="mb-1.5 block text-xs uppercase text-gray-600 dark:text-gray-400">
                      Available:{" "}
                      <b>{`${new Intl.NumberFormat("en-US").format(
                        secondTokenBalance
                      )}`}</b>{" "}
                    </span>
                  </div>

                  <div className="group flex min-h-[70px] mb-5 rounded-lg border border-gray-200 transition-colors duration-200 hover:border-gray-900 dark:border-gray-700 dark:hover:border-gray-600">
                    <div className="min-w-[80px] border-r border-gray-200 p-3 transition-colors duration-200 group-hover:border-gray-900 dark:border-gray-700 dark:group-hover:border-gray-600">
                      <span className="d-flex align-items-center font-medium outline-none dark:text-gray-100 exchange-coin">
                        {/* <img alt="Logo" src="assets/media/icons/busd.png" className="h-30px" /> */}
                        <span className="ltr:ml-2 rtl:mr-2">
                          {secondToken?.symbol}
                        </span>
                      </span>
                    </div>
                    <div
                      className="flex"
                      title="Amount cannot be 0 or more than token balance"
                    >
                      <input
                        disabled={!secondToken}
                        type="text"
                        placeholder="0.0"
                        inputMode="decimal"
                        className="w-full rounded-tr-lg rounded-br-lg border-0 exchange-value pb-0.5 text-right text-lg outline-none focus:ring-0 dark:bg-light-dark"
                        value={secondTokenAmount}
                        onChange={(e) => {
                          if (!isNaN(e.target.value)) setToken2Amount(e);
                          else setToken2Amount(0);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {pair && (
              <>
                <div className="d-flex justify-content-between">
                  <span className="mb-1.5 block text-lg uppercase text-gray-600 dark:text-gray-600">
                    Pool
                  </span>
                  <span className="mb-1.5 ml-10 mr-10 cursor-pointer">
                    <div className="d-flex mb-2">
                      <span className="mb-1.5 block text-lg uppercase text-white fs-4">
                        {getMinifiedAddress(pair?.id)}
                      </span>
                    </div>
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-10">
                  <span className="mb-1.5 block text-lg uppercase text-gray-600 dark:text-gray-600">
                    Total Liquidity
                  </span>
                  <span className="mb-1.5 ml-10 mr-10 cursor-pointer">
                    <div className="d-flex mb-2">
                      <span className="mb-1.5 block text-lg uppercase text-white fs-4">
                        {pair?.amount1} {firstToken?.symbol}
                      </span>
                    </div>
                    <div className="d-flex">
                      <span className="mb-1.5 block text-lg uppercase text-white fs-4">
                        {pair?.amount2} {secondToken?.symbol}
                      </span>
                    </div>
                  </span>
                </div>
              </>
            )}
            <DisplayButton>
              {firstTokenBalance !== 0 ? (
                <Render condition={buttonVisible}>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={!isValid()}
                    onClick={createLiquidity}
                  >
                    Add Liquidity
                  </button>
                </Render>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled
                >
                  {`Insufficient ${firstToken?.symbol} Balance`}
                </button>
              )}
            </DisplayButton>
            {firstTokenAmount &&
              secondTokenAmount &&
              +firstTokenAmount > 0 &&
              +secondTokenAmount > 0 &&
              Math.sqrt(firstTokenAmount * secondTokenAmount) <= 1000 ? (
              <p style={{ color: "red" }}>Incorrect Balance Ratio</p>
            ) : null}
            <div className="separator separator-dashed my-5"></div>
            <div className="flex flex-col gap-4 xs:gap-[18px]">
              <span className="font-medium text-gray-600">
                By adding Liquidity, you will earn fees proportional to your
                share of the pool on all trades for this pair. Fees are added to
                the pool in real time and can be claimed when you withdraw your
                Liquidity
              </span>
            </div>
          </div>
        </div>
      </div>

      <Slippage
        tolValue={slippage}
        setSlippage={setSlippage}
        deadlineValue={deadline}
        setDeadline={setDeadline}
      />
    </>
  );
};

export default CreateLiquidity;
