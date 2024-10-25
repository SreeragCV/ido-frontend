import React, { useContext } from "react";
import { AppContext } from "../../../contexts/AppContext/app.context";
import { getMinifiedAddress } from "../../../utils/util.functions";
import { ConnectInfo } from "../../UI/DisplayConnectInfo";

const Table = ({ poolList, selectPoolHandler, poolVal }) => {
  const { chromia_account } = useContext(AppContext);
  return (
    <div className="table-responsive" style={{ height: "400px" }}>
      <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
        <thead>
          <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
            <th
              className="min-w-125px sorting"
              tabindex="0"
              aria-controls="kt_subscriptions_table"
              rowspan="1"
              colspan="1"
              aria-label="Customer: activate to sort column ascending"
              style={{ width: "154.375px" }}
            >
              Pool
            </th>
            <th
              className="min-w-125px sorting"
              tabindex="0"
              aria-controls="kt_subscriptions_table"
              rowspan="1"
              colspan="1"
              aria-label="Product: activate to sort column ascending"
              style={{ width: "158.35px" }}
            >
              My Liquidity
            </th>
            <th
              className="text-end min-w-70px sorting_disabled"
              rowspan="1"
              colspan="1"
              aria-label="Actions"
              style={{ width: "119.25px" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 fw-semibold">
          {poolList.length > 0 &&
            chromia_account?.id &&
            poolList.map((pool, index) => (
              <tr className={`${index % 2 === 0 ? "even" : "odd"}`} key={index}>
                <td className="d-flex align-items-center border-0 mt-2">
                  <div className="">
                    <img
                      src="./assets/media/icons/chr.svg"
                      alt=""
                      className="h-20px"
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="text-gray-300 fs-4  ml-10 mb-0">
                      {getMinifiedAddress(pool?.id.toString('hex'))}
                    </div>
                  </div>
                </td>
                <td className="fs-4">
                  {" "}
                  {`${new Intl.NumberFormat("en-US").format(
                    pool?.amount1
                  )}`}{" "}
                  {pool?.asset1?.symbol} /
                  {`${new Intl.NumberFormat("en-US").format(pool?.amount2)}`}{" "}
                  {pool?.asset2?.symbol}
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-light btn-active-light-primary btn-sm"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    onClick={() => selectPoolHandler(pool)}
                    style={{ cursor: "pointer" }}
                    disabled={poolVal !== 0}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {poolList.length === 0 && chromia_account?.id && (
        <ConnectInfo.NotFound message="No pool data available" />
      )}
      {!chromia_account?.id && (
        <ConnectInfo message={"Connect to view your liquidity"} />
      )}
    </div>
  );
};

export default Table;
