import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { AppContext } from "../../contexts/AppContext/app.context";
import { ConnectWallet } from "../UI/Connect";
import Header from "../Header/Header";
import {
  depositIdo,
  getIdoStatus,
  getUserDetails,
} from "../../services/ido.services/ido.services";

function Stake() {
  const { chromia_account } = React.useContext(AppContext);

  const [idoState, setIdoState] = useState({
    ido_id: 1,
    owner: "",
    new_owner: "",
    chr_address: "",
    wallet: "",
    glean_whitelist_fixed_busd_allowed: 0,
    total_investment: 0,
    total_chr_expected: 0,
    sale_open_for_everyone: false,
    per_user_after_open_for_all: 0,
    total_no_of_investors: 0,
    paused: false,
  });

  const [userState, setUserState] = useState({
    id: "",
    account: null,
    is_glean_whitelisted: false,
    is_participant: false,
    is_fcfs_participant: false,
    amount_allowed: 0,
    investment_amount: 0,
  });

  const fetchIdoStatus = async () => {
    try {
      const res = await getIdoStatus({
        metamaskAccount: true,
        idoId: 1,
      });
      console.log(res);
      if (res) {
        setIdoState((prevState) => ({
          ...prevState,
          ...res,
        }));
      }
    } catch (error) {
      console.error("IDO Error:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await getUserDetails({
        metamaskAccount: true,
        userId: chromia_account.id,
      });
      if (res) {
        console.log(res);
        setUserState((prevState) => ({
          ...prevState,
          ...res,
        }));
      }
    } catch (error) {
      console.error("IDO Error:", error);
    }
  };

  useEffect(() => {
    fetchIdoStatus();
    fetchUserDetails();
  }, []);

  console.log(chromia_account?.id);

  if (!chromia_account?.id) {
    return (
      <>
        <div
          style={{
            height: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ConnectWallet />
        </div>
      </>
    );
  }

  const depositAmount = async () => {
    try {
      console.log("clicked");
      const res = await depositIdo({
        accountID: chromia_account.id,
        amount: userState?.amount_allowed || 200,
        idoId: 1,
        metamaskAccount: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProgressPercentage = () => {
    const totalInvestment = Number(idoState?.total_investment);
    const totalExpected = Number(idoState?.total_chr_expected);

    if (totalInvestment && totalExpected > 0) {
      return ((totalInvestment / totalExpected) * 100).toFixed(2);
    }
    return "0";
  };
  
  return (
    <div>
      <Header />
      <div className="d-flex flex-row">
        <div class="col-xl-3 col-lg-4 col-md-6 ido-listing ml-10">
          <div>
            <div class="market-container">
              <div className="row layout-top-spacing">
                <div className="stake-card">
                  <div className="stake-header">
                    <div className="stake-title-container">
                      <h3 style={{ color: "grey" }}>Chromaway</h3>
                      <p>IDO Staking Pool</p>
                    </div>
                    <img
                      src="./assets/media/favicon.png.png"
                      alt="Token Logo"
                      className="stake-logo"
                    />
                  </div>

                  <div className="progress-container">
                    <div className="progress-header">
                      <span>Token Balance</span>
                      <span>1,500 CHR</span>
                    </div>
                    <p>{getProgressPercentage()} %</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                  <input
                    type="text"
                    style={{ width: "60px", margin: "4px" }}
                    value={userState?.amount_allowed || 200}
                  />
                  {userState.is_glean_whitelisted ? (
                    <>
                      {userState.is_participant ? (
                        idoState.sale_open_for_everyone &&
                        userState.investment_amount === 200 ? (
                          <button
                            onClick={depositAmount}
                            className="approve-button"
                          >
                            Deposit Again
                          </button>
                        ) : (
                          <p>Already Deposited</p>
                        )
                      ) : (
                        <button
                          onClick={depositAmount}
                          className="approve-button"
                        >
                          Deposit
                        </button>
                      )}
                    </>
                  ) :
                  idoState.sale_open_for_everyone ? (
                    userState.is_participant ? (
                      <p>Already Deposited</p>
                    ) : (
                      <button
                        onClick={depositAmount}
                        className="approve-button"
                      >
                        Deposit
                      </button>
                    )
                  ) : (
                    <p>Not whitelisted</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatsCard idoData={idoState} userData={userState} />
      </div>
    </div>
  );
}

export default Stake;
