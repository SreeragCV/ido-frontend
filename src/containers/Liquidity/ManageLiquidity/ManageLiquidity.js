import React from "react";
import Slippage from "../../../components/Liquidity/LiquidityActions/Slippage";
import AddLiquidity from "../../../components/Liquidity/LiquidityActions/AddLiquidity";
import RemoveLiquidity from "../../../components/Liquidity/LiquidityActions/RemoveLiquidity";

const ManageLiquidity = ({
  selectPoolHandler,
  pair,
  tokenList,
  getPairs,
  loadTokenList,
}) => {
  const [isAdd, setIsAdd] = React.useState(true);
  const [slippage, setSlippage] = React.useState(1);
  const [deadline, setDeadline] = React.useState();

  return (
    <>
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
            <div className="d-flex align-items-center justify-content-between text-white mt-2">
              <div
                href="liquidity.html"
                className="text-white"
                onClick={() => selectPoolHandler(0)}
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
              </div>
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
              </div>
            </div>
          </nav>
          <div
            data-projection-id="12"
            style={{ opacity: 1, transform: "none" }}
          >
            <div className="mb-5 border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
              <div className="relative flex gap-3 flex-col mt-7">
                <div className="add-remove-tabs">
                  <ul>
                    <li
                      className={`tab-item ${isAdd && "active"}`}
                      onClick={() => setIsAdd(true)}
                      target-wrapper="first-dynamic-table"
                      target-tab="add"
                    >
                      Add
                    </li>
                    <li
                      className={`tab-item ${!isAdd && "active"}`}
                      onClick={() => setIsAdd(false)}
                      target-wrapper="first-dynamic-table"
                      target-tab="remove"
                    >
                      Remove
                    </li>
                  </ul>
                  <div id="first-dynamic-table">
                    {pair ? (
                      isAdd ? (
                        <AddLiquidity
                          pair={pair}
                          getPairs={getPairs}

                          tokenList={tokenList}
                          slippage={slippage}
                          deadline={deadline}
                          loadTokenList={loadTokenList}
                        />
                      ) : (
                        <RemoveLiquidity
                          getPairs={getPairs}
                          pair={pair}
                          tokenList={tokenList}
                          slippage={slippage}
                          deadline={deadline}
                          loadTokenList={loadTokenList}
                        />
                      )
                    ) : null}
                    <div className="separator separator-dashed my-5"></div>
                    {!isAdd && (
                      <div className="flex flex-col gap-4 xs:gap-[18px]">
                        <span className="font-medium text-gray-600">
                          By adding Liquidity, you will earn fees proportional
                          to your share of the pool on all trades for this pair.
                          Fees are added to the pool in real time and can be
                          claimed when you withdraw your Liquidity.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

export default ManageLiquidity;
