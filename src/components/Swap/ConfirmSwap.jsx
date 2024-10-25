import { Render } from "../Wrapper/ConditionalRender";

/* eslint-disable jsx-a11y/anchor-is-valid */
const ConfirmSwap = ({
  setShowEnterTokenDetails,
  handleSwapToken,
  secondTokenAmount,
  firstTokenAmount,
  firstToken,
  isSubmitting,
  getAmountOutMin,
  secondToken,
}) => {
  return (
    <>
      <div>
        <div
          className="app-wrapper flex-column flex-row-fluid"
          id="kt_app_wrapper"
        >
          <div
            id="kt_app_sidebar"
            className="app-sidebar app-sidebar-1 flex-column"
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
                <div className="d-flex align-items-center justify-content-between text-gray-600 dark:text-gray-400 sm:flex">
                  <div className="d-flex align-items-center">
                    <a
                      href="#"
                      className="text-white"
                      onClick={() => {
                        setShowEnterTokenDetails(true);
                      }}
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
                    </a>
                    <span className="fs-4 block text-lg uppercase text-white ml-10 fw-bold">
                      Swap Amount
                    </span>
                  </div>
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
                style={{ opacity: "1", transform: "none" }}
              >
                <div className="mb-5 border-gray-200 pb-5 dark:border-gray-800 xs:mb-7 xs:pb-6">
                  <div className="relative flex gap-3 flex-col mt-7">
                    <div className="mb-3">
                      <div className="gap-4 xs:gap-[18px]">
                        <div className="text-gray-500">
                          <span className="font-medium">You Pay</span>
                          <br />
                          <div className="d-flex align-items-center">
                            <span className="fs-4 text-white">
                              {firstTokenAmount} {firstToken?.symbol}
                            </span>
                            <img
                              alt="Logo"
                              src="./assets/media/icons/chr.svg"
                              className="h-30px ml-10"
                            />
                          </div>
                        </div>
                      </div>
                      <br />
                      <div className="gap-4 xs:gap-[18px]">
                        <div className="text-gray-500">
                          <span className="font-medium">You Receive</span>
                          <br />
                          <div className="d-flex align-items-center">
                            <span className="fs-4 text-white">
                              {Number(secondTokenAmount).toFixed(5)}{" "}
                              {secondToken?.symbol}
                            </span>
                            <img
                              alt="Logo"
                              src="./assets/media/icons/chr.svg"
                              className="h-30px ml-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 xs:gap-[18px]">
                      <span className="font-medium text-gray-600">
                        Output is estimated. You will receive at least 300.16
                        USDC or the transaction will revert
                      </span>
                    </div>

                    <div className="separator separator-dashed my-5"></div>
                    <div className="flex flex-col gap-4 xs:gap-[18px]">
                      <div className="d-flex align-items-center justify-content-between text-gray-300">
                        <span className="font-medium">Price</span>
                        <span>
                          {firstTokenAmount} {firstToken?.symbol} per{" "}
                          {Number(secondTokenAmount).toFixed(5)}{" "}
                          {secondToken?.symbol}{" "}
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between text-gray-300">
                        <span className="font-medium">Min. Received</span>
                        <span>
                          {getAmountOutMin()} {secondToken?.symbol}
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between text-gray-300">
                        <span className="font-medium">Price Impact</span>
                        <span>0.03%</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between text-gray-300">
                        <span className="font-medium">
                          Liquidity Provider Fee
                        </span>
                        <span>0.35 BUSD</span>
                      </div>
                    </div>
                    <br />
                    <Render condition={!isSubmitting}>
                      <button
                        onClick={handleSwapToken}
                        type="submit"
                        href="#"
                        className="btn btn-primary w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#swap-confirmed"
                      >
                        Confirm Swap
                      </button>
                    </Render>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ConfirmSwap };
