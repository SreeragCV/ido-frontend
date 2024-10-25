import React from "react";

const Pagination = ({ currentPage, prevPage, nextPage, poolSize, limit }) => {
  let isFirstPage = currentPage === 1;
  
  let isLastPage =
    currentPage === Math.ceil(poolSize / limit) || poolSize === 0;
  return (
    <div className="row">
      <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"></div>
      <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
        <div
          className="dataTables_paginate paging_simple_numbers"
          id="kt_subscriptions_table_paginate"
        >
          <ul className="pagination">
            <li
              className={`paginate_button page-item previous ${
                isFirstPage ? "disabled" : ""
              }`}
              id="kt_subscriptions_table_previous"
            >
              <button
                onClick={prevPage}
                aria-controls="kt_subscriptions_table"
                data-dt-idx="0"
                tabIndex="0"
                className="page-link"
              >
                <i className="previous"></i>
              </button>
            </li>
            {!isFirstPage && (
              <li className="paginate_button page-item">
                <button
                  onClick={prevPage}
                  aria-controls="kt_subscriptions_table"
                  tabIndex={currentPage - 1}
                  className="page-link"
                >
                  {currentPage - 1}
                </button>
              </li>
            )}
            <li className="paginate_button page-item active">
              <button
                aria-controls="kt_subscriptions_table"
                tabIndex="0"
                className="page-link"
              >
                {currentPage}
              </button>
            </li>
            {!isLastPage && (
              <li className="paginate_button page-item ">
                <button
                  onClick={nextPage}
                  aria-controls="kt_subscriptions_table"
                  tabIndex={currentPage + 1}
                  className="page-link"
                >
                  {currentPage + 1}
                </button>
              </li>
            )}
            <li
              className={`paginate_button page-item next ${
                isLastPage ? " disabled" : ""
              }`}
              id="kt_subscriptions_table_next"
            >
              <button
                onClick={nextPage}
                aria-controls="kt_subscriptions_table"
                data-dt-idx="3"
                tabIndex="0"
                className="page-link"
              >
                <i className="next"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
