import { useContext, useEffect, useState } from "react";

import { getRecentTransactionHash } from "../../services/rell_api.get.services";

import { AppContext } from "../../contexts/AppContext/app.context";

import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";

import { BLOCKCHAIN_RID } from "../../utils/constant";

import CopyAllIcon from "@mui/icons-material/CopyAll";
import { toast } from "react-hot-toast";

const Modal = ({
  heading = "Transaction Submitted",
  message = "",
  showModal,
  setShowModal,
}) => {
  const [txRid, setTxRid] = useState("");
  const [brid, setBrid] = useState("");
  const [loading, setLoading] = useState(true);

  const { chromia_account, metamaskAccount } = useContext(AppContext);

  const blockchain = useContext(BlockchainContext);

  const getTxHash = async () => {
    if (!showModal) return;
    console.log("getting tx hash");
    try {
      let txInfo = await getRecentTransactionHash({
        blockchain: blockchain,
        accountId: chromia_account?.id,
        metamaskAccount: metamaskAccount,
      });
      setBrid(txInfo[0].toString("hex"));
      setTxRid(txInfo[1].toString('hex'));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txRid);

    toast.success("Tx_rid Copied to clipboard");
  };
  useEffect(() => {
    getTxHash();

    return () => {
      setTxRid("");
    };
  }, []);

  return (
    <>
      {showModal && (
        <div
          class="modal fade show"
          id="swap-confirmed"
          tabindex="-1"
          aria-labelledby="SwapConfirmed"
          aria-modal="true"
          role="dialog"
          style={{ display: "block", paddingLeft: "0px" }}
        >
          <div class="modal-dialog modal-dialog-centered">
            <div
              class="modal-content "
              style={{
                zIndex: 1000,
                border: "2px solid white",
              }}
            >
              <div class="modal-header">
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div
                style={{
                  borderRadius: "15px",
                }}
                class="modal-body  d-flex justify-content-center align-items-center flex-column"
              >
                <img
                  alt="confirmation"
                  class="h-200px"
                  src="assets/media/icons/confirmation.png"
                />
                <br />
                <h4 class="modals-title  mb-0">{heading}</h4>
                <div class="d-flex align-items-center justify-content-center text-gray-500 mt-1 fs-5">
                  <span class="font-medium">{message}</span>
                </div>
                <br />
                {txRid && (
                  <>
                    <a
                      href={`https://explorer-testnet.chromia.com/${brid}/tx/${txRid}`}
                      target="_blank"
                      rel="noreferrer"
                      class="btn btn-lg btn-flex align-items-center btn-color-gray-700 btn-active-color-primary fw-bold"
                      style={{ background: "#000000" }}
                    >
                      <span>View on Explorer</span>
                    </a>
                    <br />
                    <span
                      style={{
                        color: "white",
                      }}
                    >
                      Copy Transaction ID{" "}
                      <CopyAllIcon
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={copyToClipboard}
                      />
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Modal };
