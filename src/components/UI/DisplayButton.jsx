import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext/app.context";
import { ConnectWallet } from "./Connect";

// displays actual button or connect wallet button
function DisplayButton({ children }) {
  const { chromia_account } = useContext(AppContext);
  return <>{chromia_account?.id ? children : <ConnectWallet  />}</>;
}

export { DisplayButton };
