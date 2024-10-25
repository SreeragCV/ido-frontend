import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper/Wrapper";
import { ConnectWallet } from "../UI/Connect";
import { AppContext } from "../../contexts/AppContext/app.context";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import { getIdoStatus } from "../../services/ido.services/ido.services";

const IdoDashBoard = () => {
  const { chromia_account } = React.useContext(AppContext);

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
  return (
    <>
      <div class="main-content">
        <div className="row layout-top-spacing">
          <Header />
          <PoolItems to="/chromia-ido/libre" />
        </div>
      </div>
    </>
  );
};

function PoolItems({ to }) {
  const { chromia_account } = React.useContext(AppContext);

  const [idoState, setIdoState] = useState({
    ido_id: 1,
    owner: "",
    new_owner: "",
    chr_address: "",
    glean_whitelist_fixed_busd_allowed: 0,
    total_investment: 0,
    total_chr_expected: 0,
    sale_open_for_everyone: false,
    per_user_after_open_for_all: 0,
    total_no_of_investors: 0,
    paused: false,
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

  useEffect(() => {
    fetchIdoStatus();
  }, [chromia_account.id]);

  const getProgressPercentage = () => {
    const totalInvestment = Number(idoState?.total_investment);
    const totalExpected = Number(idoState?.total_chr_expected);

    if (totalInvestment && totalExpected && totalExpected > 0) {
      return ((totalInvestment / totalExpected) * 100).toFixed(2);
    }
    return "0";
  };

  return (
    <div>
      <Link to={to} class="col-xl-3 col-lg-4 col-md-6 ido-listing ml-10">
        <div>
          <div class="market-container">
            <div className="row layout-top-spacing">
              <div className="pools-grid">
                <div className="pool-card">
                  <div className="pool-card-header">
                    <span className="pool-status">Open</span>
                    <img
                      src="/placeholder.png"
                      alt="IDO Logo"
                      className="pool-logo"
                    />
                    <h3 className="pool-title">Libre</h3>
                    <div className="pool-rate">1 BUSD = 7.692 CHR</div>

                    <div className="progress-container">
                      <div className="progress-header">
                        <span>Total Raise</span>
                        <span>
                          {idoState?.total_investment
                            ? `${idoState?.total_investment} CHR`
                            : "0"}
                        </span>
                      </div>
                      <p>{getProgressPercentage()} %</p>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${getProgressPercentage()}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="progress-header">
                      <span>Total expected CHR</span>
                      <span>{idoState?.total_chr_expected} CHR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default IdoDashBoard;
