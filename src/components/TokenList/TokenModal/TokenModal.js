/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectSearchModalTokenName } from "../../../redux/modal-list-reducer/modal-list.selectors";
import { updateModalSearchToken } from "../../../redux/modal-list-reducer/modal-list.actions";

import "./TokenModal.css";
import { AppContext } from "../../../contexts/AppContext/app.context";

const TokenModal = ({
  show,
  close,
  tokenList,
  firstToken,
  secondToken,
  setToken,
}) => {
  const dispatch = useDispatch();

  const { chromia_account } = useContext(AppContext);


  const { searchToken } = useSelector(
    createStructuredSelector({ searchToken: selectSearchModalTokenName })
  );

  tokenList = [...tokenList];

  let userAccountId = chromia_account?.id.toString("hex");

  tokenList.sort((a, b) => {
    if (
      a.accountId?.toString().toLowerCase() === userAccountId &&
      b.accountId.toString().toLowerCase() !== userAccountId
    ) {
      return -1; // Move a to the front of the array
    } else if (
      a?.accountId?.toString()?.toLowerCase() !== userAccountId &&
      b?.accountId?.toString()?.toLowerCase() === userAccountId
    ) {
      return 1; // Move b to the front of the array
    } else {
      return 0; // Leave the order unchanged
    }
  });

  console.log("tokenList ///", tokenList)

  if (!show) {
    return null;
  }

  return (
    <div className="token_modal" onClick={close}>
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modals-title  mb-0" id="exampleModalLabel">
              Select a Token
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={close}
            ></button>
          </div>
          <div className="modal-body">
            <div className="relative">
              <svg
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon left-6 h-full text-gray-700"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.3851 12.4457C8.73488 14.5684 4.85544 14.4013 2.39866 11.9445C-0.237379 9.3085 -0.237379 5.03464 2.39866 2.3986C5.0347 -0.23744 9.30856 -0.23744 11.9446 2.3986C14.4014 4.85538 14.5685 8.73481 12.4458 11.3851L17.6014 16.5407C17.8943 16.8336 17.8943 17.3085 17.6014 17.6014C17.3085 17.8943 16.8337 17.8943 16.5408 17.6014L11.3851 12.4457ZM3.45932 10.8839C1.40907 8.83363 1.40907 5.50951 3.45932 3.45926C5.50957 1.40901 8.83369 1.40901 10.8839 3.45926C12.9327 5.50801 12.9342 8.82875 10.8885 10.8794C10.8869 10.8809 10.8854 10.8823 10.8839 10.8839C10.8824 10.8854 10.8809 10.8869 10.8794 10.8884C8.82882 12.9341 5.50807 12.9326 3.45932 10.8839Z"
                  fill="currentColor"
                ></path>
              </svg>
              <input
                type="search"
                placeholder="Enter the token name"
                className="w-full search-input border-y border-x-0 border-dashed border-gray-200 py-3.5 pl-14 pr-6 text-sm focus:border-gray-300 focus:ring-0 dark:border-gray-700 dark:bg-light-dark-1 focus:dark:border-gray-600"
                value={searchToken}
                onChange={(e) =>
                  dispatch(updateModalSearchToken(e.target.value))
                }
              />
            </div>

            {tokenList.length == 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <p style={{ color: "white", padding: "0.5rem" }}>No Token</p>
              </div>
            )}

            <ul role="listbox" className="min-h-[200px] py-3 search-list">
              {tokenList.length > 0 &&
                tokenList.map((token, index) =>
                  firstToken == null && secondToken == null ? (
                    <li
                      key={index}
                      role="listitem"
                      tabindex={index}
                      className="flex text-white cursor-pointer items-center gap-2 py-3 px-6 outline-none hover:bg-gray-100 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-900 selected-token"
                      onClick={() => {
                        setToken(token);
                        dispatch(updateModalSearchToken(""));
                        close();
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_482_323)">
                          <path
                            d="M23.6395 14.9029C22.0368 21.3315 15.5257 25.2438 9.09643 23.6407C2.66976 22.038 -1.24259 15.5266 0.360877 9.09839C1.96285 2.66908 8.47392 -1.24363 14.9014 0.359089C21.3303 1.96184 25.2423 8.47401 23.6395 14.9029Z"
                            fill="#F7931A"
                          ></path>
                          <path
                            d="M8.05281 14.0208C7.98757 14.1828 7.8222 14.4258 7.44944 14.3335C7.46259 14.3526 6.49247 14.0946 6.49247 14.0946L5.83887 15.6017L7.55219 16.0289C7.87094 16.1087 8.18333 16.1924 8.49082 16.2711L7.94593 18.4589L9.26105 18.787L9.80067 16.6225C10.1599 16.72 10.5087 16.81 10.8499 16.8947L10.3121 19.0491L11.6288 19.3772L12.1736 17.1936C14.4188 17.6185 16.107 17.4471 16.8176 15.4165C17.3902 13.7815 16.7891 12.8384 15.6079 12.2234C16.4681 12.025 17.1161 11.4592 17.289 10.2903C17.5278 8.69355 16.3121 7.83518 14.6497 7.26255L15.189 5.09955L13.8723 4.77143L13.3474 6.87741C13.0012 6.79116 12.6457 6.70978 12.2925 6.62915L12.8212 4.50927L11.5054 4.18115L10.9658 6.34338C10.6792 6.27813 10.398 6.2136 10.125 6.14575L10.1265 6.13899L8.31076 5.68562L7.96049 7.09186C7.96049 7.09186 8.93737 7.31574 8.91674 7.3296C9.45 7.46273 9.54636 7.81558 9.53026 8.09536L8.05281 14.0208ZM14.2807 14.5086C13.8739 16.1436 11.121 15.2597 10.2285 15.0381L10.9515 12.1398C11.844 12.3625 14.706 12.8035 14.2807 14.5086ZM14.688 10.2667C14.3167 11.7539 12.0255 10.9983 11.2823 10.8131L11.9378 8.18431C12.681 8.36956 15.0746 8.7153 14.688 10.2667Z"
                            fill="white"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_482_323">
                            <rect width="24" height="24" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="token-list">
                        <span className="uppercase">{token?.name}</span>
                        <span>
                          {`${new Intl.NumberFormat("en-US").format(
                            token?.amount
                          )}`}{" "}
                          {token?.symbol}
                        </span>
                      </div>
                    </li>
                  ) : (
                    ((firstToken !== null &&
                      token?.name !== firstToken?.name &&
                      secondToken == null) ||
                      (secondToken !== null &&
                        token?.name !== secondToken?.name &&
                        firstToken == null) ||
                      (secondToken !== null &&
                        token?.name !== secondToken?.name &&
                        token?.name !== firstToken?.name &&
                        firstToken !== null)) && (
                      <li
                        key={index}
                        role="listitem"
                        tabindex={index}
                        className="flex cursor-pointer items-center gap-2 py-3 px-6 outline-none hover:bg-gray-100 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-900 text-white selected-token"
                        onClick={() => {
                          setToken(token);
                          dispatch(updateModalSearchToken(""));
                          close();
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_482_323)">
                            <path
                              d="M23.6395 14.9029C22.0368 21.3315 15.5257 25.2438 9.09643 23.6407C2.66976 22.038 -1.24259 15.5266 0.360877 9.09839C1.96285 2.66908 8.47392 -1.24363 14.9014 0.359089C21.3303 1.96184 25.2423 8.47401 23.6395 14.9029Z"
                              fill="#F7931A"
                            ></path>
                            <path
                              d="M8.05281 14.0208C7.98757 14.1828 7.8222 14.4258 7.44944 14.3335C7.46259 14.3526 6.49247 14.0946 6.49247 14.0946L5.83887 15.6017L7.55219 16.0289C7.87094 16.1087 8.18333 16.1924 8.49082 16.2711L7.94593 18.4589L9.26105 18.787L9.80067 16.6225C10.1599 16.72 10.5087 16.81 10.8499 16.8947L10.3121 19.0491L11.6288 19.3772L12.1736 17.1936C14.4188 17.6185 16.107 17.4471 16.8176 15.4165C17.3902 13.7815 16.7891 12.8384 15.6079 12.2234C16.4681 12.025 17.1161 11.4592 17.289 10.2903C17.5278 8.69355 16.3121 7.83518 14.6497 7.26255L15.189 5.09955L13.8723 4.77143L13.3474 6.87741C13.0012 6.79116 12.6457 6.70978 12.2925 6.62915L12.8212 4.50927L11.5054 4.18115L10.9658 6.34338C10.6792 6.27813 10.398 6.2136 10.125 6.14575L10.1265 6.13899L8.31076 5.68562L7.96049 7.09186C7.96049 7.09186 8.93737 7.31574 8.91674 7.3296C9.45 7.46273 9.54636 7.81558 9.53026 8.09536L8.05281 14.0208ZM14.2807 14.5086C13.8739 16.1436 11.121 15.2597 10.2285 15.0381L10.9515 12.1398C11.844 12.3625 14.706 12.8035 14.2807 14.5086ZM14.688 10.2667C14.3167 11.7539 12.0255 10.9983 11.2823 10.8131L11.9378 8.18431C12.681 8.36956 15.0746 8.7153 14.688 10.2667Z"
                              fill="white"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_482_323">
                              <rect width="24" height="24" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                        <div className="token-list">
                          <span className="uppercase">
                            {token?.name}
                          </span>
                          <span>
                            {`${new Intl.NumberFormat("en-US").format(
                              token?.amount
                            )}`}{" "}
                            {token?.symbol}
                          </span>
                        </div>
                      </li>
                    )
                  )
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
