import React from "react";

const Footer = () => {
    return (
        <div id="kt_app_footer" className="app-footer">
            <div className="app-container container-xxl d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                <div className="text-dark order-2 order-md-1">
                    <span className="text-muted fw-semibold me-1">2022&copy;</span>
                    <a href="https://chromiaswap.exchange/" target="_blank" className="text-gray-300 text-hover-primary">ChromiaSwap Exchange</a>
                </div>
                <ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
                    <li className="menu-item">
                        <a href="#" target="_blank" className="menu-link px-2">Telegram</a>
                    </li>
                    <li className="menu-item">
                        <a href="#" target="_blank" className="menu-link px-2">Twitter</a>
                    </li>
                    <li className="menu-item">
                        <a href="#" target="_blank" className="menu-link px-2">Linkedin</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Footer;