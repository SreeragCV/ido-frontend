import React from "react";
import { NavLink } from "react-router-dom";

import { ShowConnectionInfo } from "./ShowConnectionInfo";

const Header = () => {
    return (
        <div id="kt_app_header" className="app-header" data-kt-sticky="true" data-kt-sticky-activate-="true" data-kt-sticky-name="app-header-sticky" data-kt-sticky-offset="{default: '100px', lg: '100px'}">
            <div className="app-container container-fluid d-flex align-items-stretch justify-content-between" id="kt_app_header_container">
                <div className="app-header-wrapper d-flex flex-grow-1 align-items-stretch justify-content-between" id="kt_app_header_wrapper">
                    <div className="app-header-menu app-header-mobile-drawer align-items-start align-items-lg-center w-82" data-kt-drawer="true" data-kt-drawer-name="app-header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_header_menu_toggle" data-kt-swapper="true" data-kt-swapper-mode="{default: 'append', lg: 'prepend'}" data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}">
                        <div className="d-flex flex-stack px-4 px-lg-6 py-3 py-lg-8 d-none d-lg-block" id="kt_app_sidebar_logo">
                            <a href="#">
                                <img alt="Logo" src="./assets/media/logo.png" className="h-20px h-lg-45px theme-light-show" />
                                <img alt="Logo" src="./assets/media/logo.png" className="h-20px h-lg-45px theme-dark-show" />
                            </a>
                        </div>
                        <div className="menu menu-rounded menu-column menu-lg-row menu-active-bg menu-state-primary menu-title-gray-700 menu-arrow-gray-400 menu-bullet-gray-400 my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0 menu-ml-30" id="#kt_header_menu" data-kt-menu="true">
                            <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                <NavLink to="/">
                                    <span className="menu-link">
                                        <span className="menu-title">IDO</span>
                                    </span>
                                </NavLink>
                            </div>
                            <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                {/* <NavLink to="/create-poll">
                                    <span className="menu-link">
                                        <span className="menu-title">Create Poll</span>
                                    </span>
                                </NavLink> */}
                            </div>
                            {/* <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                <NavLink to="/create-token" >
                                    <span className="menu-link">
                                        <span className="menu-title">Create Token</span>
                                    </span>
                                </NavLink>
                            </div> */}
                            {/* <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                <NavLink to="/token-list">
                                    <span className="menu-link">
                                        <span className="menu-title">Token List</span>
                                    </span>
                                </NavLink>
                            </div> */}
                            {/* <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2">
                                <NavLink to="/history">
                                    <span className="menu-link">
                                        <span className="menu-title">History</span>
                                    </span>
                                </NavLink>
                            </div> */}
                        </div>
                    </div>

                    <ShowConnectionInfo />

                    <div className="app-navbar flex-shrink-0">
                        <div className="app-navbar-item d-lg-none ms-2 me-n3" title="Show header menu">
                            <div className="btn btn-icon btn-color-gray-600 btn-active-color-primary" id="kt_app_header_menu_toggle">
                                <span className="svg-icon svg-icon-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 11H3C2.4 11 2 10.6 2 10V9C2 8.4 2.4 8 3 8H13C13.6 8 14 8.4 14 9V10C14 10.6 13.6 11 13 11ZM22 5V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4V5C2 5.6 2.4 6 3 6H21C21.6 6 22 5.6 22 5Z" fill="currentColor" />
                                        <path opacity="0.3" d="M21 16H3C2.4 16 2 15.6 2 15V14C2 13.4 2.4 13 3 13H21C21.6 13 22 13.4 22 14V15C22 15.6 21.6 16 21 16ZM14 20V19C14 18.4 13.6 18 13 18H3C2.4 18 2 18.4 2 19V20C2 20.6 2.4 21 3 21H13C13.6 21 14 20.6 14 20Z" fill="currentColor" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Header;