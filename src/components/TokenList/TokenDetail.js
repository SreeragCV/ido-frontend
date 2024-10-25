import React from "react";

const TokenDetail = () => {
  return (
    <div
      id="kt_app_sidebar"
      className="app-sidebar app-sidebar-1 flex-column"
      data-kt-drawer-name="app-sidebar"
      data-kt-drawer-activate="{default: true, lg: false}"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="275px"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_app_sidebar_toggle"
    >
      <div
        className="flex-column-fluid px-4 px-lg-8 py-4"
        id="kt_app_sidebar_nav"
      >
        <div
          id="kt_app_sidebar_nav_wrapper"
          className="d-flex flex-column hover-scroll-y pe-4 me-n4"
          data-kt-scroll="true"
          data-kt-scroll-activate="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
          data-kt-scroll-wrappers="#kt_app_sidebar, #kt_app_sidebar_nav"
          data-kt-scroll-offset="5px"
        >
          <div className="d-flex mb-3 mb-lg-6">
            <div className="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4 me-6">
              <span className="fs-6 text-gray-500 fw-bold">Net Worth</span>
              <div className="fs-1 fw-bold text-success">$14,350</div>
            </div>
            <div className="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4">
              <span className="fs-6 text-gray-500 fw-bold">Staked Balance</span>
              <div className="fs-1 fw-bold text-danger">$8,029</div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-300 fw-bold mb-8">Token Details</h3>
            <div
              className="row row-cols-2 align-items-center row-cols-lg-3"
              data-kt-buttons="true"
              data-kt-buttons-target="[data-kt-button]"
            >
              <div className="col mb-4">
                <a
                  className="btn btn-icon btn-outline btn-bg-light btn-active-light-primary btn-flex flex-column flex-center w-90px h-90px border-gray-200"
                  data-kt-button="true"
                >
                  <span className="mb-2">
                    <img
                      src="./assets/media/icons/chr.svg"
                      className="img-fluid h-30px"
                    />
                  </span>
                  <span className="fs-6 fw-bold">Chromia</span>
                </a>
              </div>
              <div className="mb-4">
                <div className="d-flex flex-column">
                  <a
                    href="#"
                    className="text-gray-300 text-hover-primary mb-1 fs-2"
                  >
                    My Holdings
                  </a>
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "max-content" }}
                  >
                    <span className="fs-2 fw-bold text-white">$299.14</span>
                    <span className="text-gray-600 ml-10 fs-4">1.01 BNB</span>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <h3 className="text-gray-300 fw-bold mb-8">Token Info</h3>
            <div className="row">
              <div className="col-span-1 d-flex align-items-center justify-content-between">
                <div className="fs-4 text-gray-700">Market cap</div>
                <div className="text-sm md:text-base d-flex align-items-center">
                  <span className="fs-3 text-gray-700">46.91B</span>
                  <span className="mr-2 md:ml-2">
                    <div className="text-critical text-sm ml-10 text-danger">
                      -1.11%
                    </div>
                  </span>
                </div>
              </div>
              <div className="separator separator-dashed my-3"></div>

              <div className="col-span-1 d-flex align-items-center justify-content-between">
                <div className="fs-4 text-gray-700">Total volume</div>
                <div className="text-sm md:text-base d-flex align-items-center">
                  <span className="fs-3 text-gray-700">552.53M</span>
                </div>
              </div>
              <div className="separator separator-dashed my-3"></div>
              <div className="col-span-1 d-flex align-items-center justify-content-between">
                <div className="fs-4 text-gray-700">Circulating supply</div>
                <div className="text-sm md:text-base d-flex align-items-center">
                  <span className="fs-3 text-gray-700">163.28M</span>
                </div>
              </div>
              <div className="separator separator-dashed my-3"></div>
              <div className="col-span-1 d-flex align-items-center justify-content-between">
                <div className="fs-4 text-gray-700">All-time low</div>
                <div className="text-sm md:text-base d-flex align-items-center">
                  <span className="fs-3 text-gray-700">$0.04</span>
                </div>
              </div>
              <div className="separator separator-dashed my-3"></div>
              <div className="col-span-1 d-flex align-items-center justify-content-between">
                <div className="fs-4 text-gray-700">All-time high</div>
                <div className="text-sm md:text-base d-flex align-items-center">
                  <span className="fs-3 text-gray-700">$686.31</span>
                </div>
              </div>
              <div className="separator separator-dashed my-3"></div>
              <div className="col-span-1 d-flex align-items-center justify-content-between">
                {/* <div className="fs-4 text-gray-700">Volume / Market cap</div>
                <div className="text-sm md:text-base d-flex align-items-center">
                  <span className="fs-3 text-gray-700">0.0118</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
