import { useContext } from "react";
import { ConnectWallet } from "./Connect";
import { AppContext } from "../../contexts/AppContext/app.context";

const ConnectInfo = ({ icon = null, message, showConnectBtn = true }) => {
  const { chromia_account } = useContext(AppContext);

  return (
    <>
      {chromia_account?.id ? null : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60%",
            gap: "1rem",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "lightblue",
            }}
          >
            {message}
          </span>
          {/* <span className="svg-icon svg-icon-1 position-absolute ms-6">
          {icon}
        </span> */}
          {showConnectBtn ? <ConnectWallet /> : null}
        </div>
      )}
    </>
  );
};

const NotFound = ({ message, icon = null }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60%",
          gap: "1rem",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "lightblue",
          }}
        >
          {message}
        </span>
        {/* <span className="svg-icon svg-icon-1 position-absolute ms-6">
          {icon}
        </span> */}
      </div>
    </>
  );
};

ConnectInfo.NotFound = NotFound;

export { ConnectInfo };
