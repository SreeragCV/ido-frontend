import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { gtx } from "postchain-client";

import { getMinifiedAddress } from "../../utils/util.functions";

import Pagination from "../Liquidity/LiquidityTable/Pagination";

import LinkIcon from "@mui/icons-material/Link";

const TxHistory = ({
  txHistory,
  prevPage,
  currentPage,
  nextPage,
  txSize,
  limit,
}) => {
  let tx = [...txHistory];
  tx.sort((a, b) => b.timestamp - a.timestamp);

  console.log(tx, "transaction history");
  return (
    <div
      className="card-body py-4 table-responsive text-nowrap"
      style={{ height: "400px" }}
    >
      <table
        className="table align-middle table-row-dashed fs-6 gy-5"
        id="kt_table_users"
      >
        <thead>
          <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
            <th className="min-w-125px">Transaction Id</th>
            <th className="min-w-125px">Hash</th>
            <th className="min-w-125px">Age</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 fw-semibold">
          {tx.map((history, index) => {
            let transaction = gtx.deserialize(
              Buffer.from(history.tx_data, "hex")
            );
            return (
              <tr key={`tokenListRow${index}`}>
                <td className="d-flex align-items-center">
                  <div className="d-flex flex-column">
                    <a
                      href={`https://explorer-testnet.chromia.com/${transaction?.blockchainRID?.toString(
                        "hex"
                      )}/tx/${history.tx_rid.toString('hex')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 text-hover-primary mb-1 fs-2"
                    >
                      {history.tx_rid && getMinifiedAddress(history.tx_rid.toString('hex'))}{" "}
                      <LinkIcon
                        style={{
                          marginLeft: "5px",
                        }}
                      />
                    </a>
                  </div>
                </td>
                <td className="fs-3">
                  {history.tx_hash && getMinifiedAddress(history.tx_hash.toString('hex'))}
                </td>

                <td className="fs-2 text-white">
                  {formatDistanceToNow(history?.timestamp)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {txHistory.length > 0 && txSize > 5 ? ( // display pagination if txHistory is not empty and txSize is greater than 5
        <Pagination
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          poolSize={txSize}
          limit={limit}
        />
      ) : null}
    </div>
  );
};

export default TxHistory;
