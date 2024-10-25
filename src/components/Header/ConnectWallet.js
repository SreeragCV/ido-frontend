import React from "react";
import { NavLink } from "react-router-dom";
import { SSO, User } from "ft3-lib";
import { useNavigate } from "react-router-dom";

import { getMinifiedAddress } from "../../utils/util.functions";
import {
  setStoredAccount,
  deleteStoredAccount,
} from "../../utils/blockchain/account-storage";
import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../contexts/AppContext/app.context";
import { Padding } from "@mui/icons-material";

const ConnectWallet = () => {
  const blockchain = React.useContext(BlockchainContext);
  const { chromia_account, setCurrentProvider } = React.useContext(AppContext);
  const navigate = useNavigate();

  const login = () => {
    const successUrl = `${window.location.origin}`;
    const cancelUrl = `${window.location.origin}`;

    const user = User.generateSingleSigUser();
    setStoredAccount({ user });

    new SSO(blockchain).initiateLogin(successUrl, cancelUrl);

    setCurrentProvider({
      chromia: true,
      metamask: false,
    });
  };

  const logout = async () => {
    await new SSO(blockchain).logout();
    deleteStoredAccount();
    navigate(0);
  };

  React.useEffect(() => {
    //console.log('chromia_account', chromia_account)
  }, [chromia_account]);

  return (
    <div className="d-flex align-items-center menu-mob">
      {chromia_account != null && (
        <div>
          <div
            className="m-0"
            onClick={() => {
              navigator.clipboard.writeText(chromia_account.id.toString("hex"));
            }}
          >
            <div
              className="btn btn-flex bg-body btn-color-gray-700 btn-active-color-primary fw-bold"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
            >
              <p style={{ margin: "0px 0.5rem 0px 0.25rem" }}>
                {getMinifiedAddress(chromia_account.id.toString("hex"))}
              </p>

              <div
                onClick={logout}
                className="btn btn-flex bg-body btn-color-gray-700 btn-active-color-danger fw-bold"
                style={{ marginLeft: "10px", background: "#ff0022" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {chromia_account == null && (
        <div className="m-0" onClick={login}>
          <div
            style={{
              border: '1px solid white',
              paddingLeft: '2.5rem',
              textAlign: 'center'

            }}
            className="btn btn-flex bg-body btn-color-gray-700 btn-active-color-primary fw-bold"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
          >
            <span

              className="svg-icon svg-icon-6 svg-icon-muted me-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-wallet2"
                viewBox="0 0 16 16"
              >
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
              </svg>
            </span>
            Chromia
          </div>
        </div>
      )}

      <NavLink to="/" className="d-flex d-lg-none">
        <img
          alt="Logo"
          src="./assets/media/logo.png"
          className="h-30px theme-dark-show"
        />
      </NavLink>
    </div>
  );
};

export default ConnectWallet;
