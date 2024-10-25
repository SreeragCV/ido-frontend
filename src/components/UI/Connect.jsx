import { useState } from "react";

import { Modal } from "./ConnectModal";

const ConnectWallet = () => {
  const [showModal, setShowModal] = useState(false);

  const login = () => {
    setShowModal(true)
  };

  return (
    <>
      <Modal setShowModal={setShowModal} showModal={showModal} heading=" Choose Provider" message="You need to connect any one of wallet to continue" />

      <div>
        <button
        type="button"
          onClick={login}
          style={{
            background: "#cc91f0",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
            border: "none",
            cursor: "pointer",
          }}
        >
          Connect to Wallet
        </button>
      </div>
    </>
  );
};

export { ConnectWallet };
