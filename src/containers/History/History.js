import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStructuredSelector } from "reselect";

import Wrapper from "../../components/Wrapper/Wrapper";
import TxHistory from "../../components/TxHistory/TxHistory";
import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../contexts/AppContext/app.context";

import {
  updateHistoryList,
  updateHistorySearchItem,
} from "../../redux/txhistory-list-reducer/history-list.actions";
import {
  selectFilterHistoryList,
  selectHistorySearchItem,
} from "../../redux/txhistory-list-reducer/history-list.selector";

import {
  fetchDexHistory,
  getRecentTransactionHash,
} from "../../services/rell_api.get.services";

import { TX_LIMIT } from "../../utils/constant";
import { Render } from "../../components/Wrapper/ConditionalRender";
import { SearchIcon } from "../../components/svg/Search";
import { ConnectInfo } from "../../components/UI/DisplayConnectInfo";

const History = () => {
  const dispatch = useDispatch();

  const { chromia_account, metamaskAccount } = useContext(AppContext);
  const blockchain = useContext(BlockchainContext);

  // const [txHistory, setTxHistory] = useState([]);
  const [txSize, setTxSize] = useState(0);
  const [page, setPage] = useState(1);

  const { searchHistoryItem } = useSelector(
    createStructuredSelector({ searchHistoryItem: selectHistorySearchItem })
  );

  const txHistory = useSelector(
    selectFilterHistoryList(searchHistoryItem || "")
  );

  console.log('history', txHistory)

  const loadTransactionHistory = async () => {
    let dexHistory = await fetchDexHistory({
      blockchain: blockchain,
      accountId: chromia_account?.id,
      offset: (page - 1) * TX_LIMIT,
      limit: TX_LIMIT,
      metamaskAccount: metamaskAccount
    });
    console.log("dexHistory :", dexHistory.list);

    setTxSize(dexHistory.size);

    dispatch(updateHistoryList([...dexHistory.list]));

    //setTxHistory(dex_history.reverse())
  };

  const updatePage = (isNext) => {
    if (isNext) {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (chromia_account) {
      loadTransactionHistory();
    }
  }, [chromia_account?.id, page]);

  return (
    <Wrapper>
      <div className="flex-column flex-row-fluid" id="kt_app_wrapper">
        <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
          <div className="d-flex flex-column flex-column-fluid">
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-0">
              <div
                id="kt_app_toolbar_container"
                className="app-container container-xxl d-flex flex-stack"
              >
                <div className="page-title d-flex flex-column justify-content-center me-3">
                  <h1 className="page-heading d-flex text-dark fw-bold fs-1 flex-column justify-content-center my-0">
                    Transaction History
                  </h1>
                </div>
              </div>
            </div>

            <div id="kt_app_content" className="app-content flex-column-fluid">
              <div
                id="kt_app_content_container"
                className="app-container container-xxl"
              >
                <div className="card" style={{ height: "42rem" }}>
                  <div className="card-header border-0 pt-6">
                    <div
                      className="card-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div className="d-flex align-items-center position-relative my-1">
                        <Render condition={txHistory?.length > 0 || searchHistoryItem?.length !== 0}>
                          <span className="svg-icon svg-icon-1 position-absolute ms-6">
                            <SearchIcon />
                          </span>
                          <input
                            type="text"
                            data-kt-user-table-filter="search"
                            className="form-control form-control-solid w-100 ps-14"
                            placeholder="Search Transaction"
                            value={searchHistoryItem}
                            onChange={(e) =>
                              dispatch(updateHistorySearchItem(e.target.value))
                            }
                          />
                        </Render>
                      </div>
                      {chromia_account !== null ? (
                        <div
                          onClick={loadTransactionHistory}
                          style={{ cursor: "pointer" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            style={{ height: "1.2rem" }}
                          >
                            <path
                              d="M89.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L370.3 160H320c-17.7 0-32 14.3-32 32s14.3 32 32 32H447.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L398.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C57.2 122 39.6 150.7 28.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM23 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L109.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H32.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {chromia_account == null && (
                    <ConnectInfo message={"No transaction info available"} />
                  )}
                  {chromia_account !== null && txHistory.length === 0 && (
                    <ConnectInfo.NotFound
                      message={"No transaction info available!"}
                    />
                  )}
                  {chromia_account !== null && txHistory.length > 0 && (
                    <TxHistory
                      txHistory={txHistory}
                      prevPage={() => updatePage(false)}
                      currentPage={page}
                      nextPage={() => updatePage(true)}
                      txSize={txSize}
                      limit={TX_LIMIT}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default History;
