import React from "react";
import Table from "../../components/Liquidity/LiquidityTable/Table";
import Pagination from "../../components/Liquidity/LiquidityTable/Pagination";

const LiquidityTable = ({
  poolList,
  poolSize,
  prevPage,
  currentPage,
  nextPage,
  pool,
  selectPoolHandler,
  limit,
}) => {
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-lg-0">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-xxl d-flex flex-stack"
        >
          <div className="page-title d-flex flex-column justify-content-center me-3">
            <h1 className="page-heading d-flex text-dark fw-bold fs-1 flex-column justify-content-center my-0">
              My Liquidity
            </h1>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-xxl"
        >
          <div className="card">
            <div className="card-body pt-0">
              <div
                id="kt_subscriptions_table_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
              >
                <Table
                  poolList={poolList}
                  selectPoolHandler={selectPoolHandler}
                  poolVal={pool}
                />

                {poolList.length > 0 && poolSize > 5 ? (
                  <Pagination
                    currentPage={currentPage}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    poolSize={poolSize}
                    limit={limit}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityTable;
