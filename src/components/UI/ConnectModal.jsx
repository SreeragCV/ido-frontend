import { useContext, useEffect, useState } from "react";


import { AppContext } from "../../contexts/AppContext/app.context";

import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";
import ConnectWallet from "../Header/ConnectWallet";
import { ConnectMetamask } from "../Header/ConnectMetamask";


const Modal = ({
    heading = "Transaction Submitted",
    message = "",
    showModal,
    setShowModal,

}) => {
    const [txRid, setTxRid] = useState("");
    const [loading, setLoading] = useState(true);

    const { chromia_account, currentProvider } = useContext(AppContext);

    const blockchain = useContext(BlockchainContext);



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
                    style={{
                        display: "block",
                        paddingLeft: "0px"
                    }}
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
                                    width: "100%",
                                    height: "100%",
                                    padding: "2rem",
                                    borderRadius: "15px",
                                }}
                                class="modal-body  d-flex justify-content-center align-items-center flex-column"
                            >
                                <h4 class="modals-title  mb-0">{heading}</h4>
                                <div class="d-flex align-items-center justify-content-center text-gray-500 mt-1 fs-5">
                                    <span class="font-medium">{message}</span>
                                </div>
                                <br />
                                {/* {!currentProvider.metamask && <ConnectWallet />}
                                <br /> */}
                                {!currentProvider.chromia && <ConnectMetamask setShowModal={setShowModal} />}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export { Modal };
