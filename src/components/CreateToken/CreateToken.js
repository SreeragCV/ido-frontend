import React, { useContext, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../contexts/AppContext/app.context";
import { chainId } from "../../utils/constant";
import Wrapper from "../Wrapper/Wrapper";
import {
  getExistingToken,
  registerNewToken,
  giveBalance,
} from "../../services/rell_post.services/create_token.service";
import { DisplayButton } from "../UI/DisplayButton";
import { Modal } from "../UI/Modal";
import { th } from "date-fns/locale";

const CreateToken = () => {
  const blockchain = useContext(BlockchainContext);
  const { chromia_account, pageLoaded, metamaskAccount } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);

  const [buttonVisible, setButtonVisible] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const createOrGetTokenId = async (tokenName, symbol) => {
    try {
      let obj = {};

      const existingToken = await getExistingToken({
        blockchain: blockchain,
        tokenName: tokenName,
        metamaskAccount: metamaskAccount,
      });

      if (existingToken?.length === 0) {
        const newToken = await registerNewToken({
          blockchain: blockchain,
          tokenName: tokenName,
          symbol: symbol,
          chainId: chainId,
          metamaskAccount: metamaskAccount
        });
        console.log('token', newToken)
        //return newToken?.id

        obj = {
          id: newToken?.id,
          exist: "no",
        };
      } else {
        obj = {
          id: null,
          exist: "yes",
        };
      }
      //console.log('existingToken', existingToken);
      return obj;

      //return existingToken[0].id
    } catch (err) {
      console.log("createOrGetTokenId", JSON.stringify(err));
      toast.error(err);
    }
  };

  const createTokenCallback = async (data) => {
    try {
      //console.log("Data", data)
      const token = await createOrGetTokenId(
        data?.tokenName,
        data?.tokensymbol
      );

      if (token?.exist == "no") {
        await giveBalance({
          blockchain: blockchain,
          accountId: chromia_account.id,
          tokenId: token.id,
          initialSupply: data?.initialSupply,
          metamaskAccount: metamaskAccount,
        });

        resetAsyncForm();
        return true;
      } else {
        throw new Error("Token already exist");
      }
    } catch (err) {
      console.log("createTokenCallback", JSON.stringify(err));
      throw err;
    }
  };

  const resetAsyncForm = async () => {
    reset({ tokenName: "", tokensymbol: "", initialSupply: "" });
  };

  const onSubmit = async (data) => {
    setButtonVisible(false);
    await toast.promise(createTokenCallback(data), {
      loading: "Creating token...",
      success: () => {
        setShowModal(true);
        return "Done!";
      },
      error: (err) =>
        err?.shortReason ??
        err?.message ??
        "Something went wrong , Try again later",
    });
    setButtonVisible(true);
  };

  return (
    <Wrapper>
      {showModal && (
        <Modal
          heading="Token created successfully"
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      <div className="flex-column flex-row-fluid" id="kt_app_wrapper">
        <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
          <div className="d-flex flex-column flex-column-fluid">
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-0">
              <div
                id="kt_app_toolbar_container"
                className="app-container container-xxl d-flex flex-stack"
              >
                <div className="page-title d-flex flex-column justify-content-center me-3">
                  <h1 className="page-heading d-flex text-dark fw-bold fs-1 flex-column justify-content-center my-0">
                    Create a Token
                  </h1>
                </div>
              </div>
            </div>

            <div id="kt_app_content" className="app-content flex-column-fluid">
              <div
                id="kt_app_content_container"
                className="app-container container-xxl"
              >
                <div className="d-flex flex-column flex-lg-row">
                  <div className="flex-lg-row-fluid mb-10 mb-lg-0">
                    <div className="card">
                      <div className="card-body p-12">
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          action=""
                          id="kt_invoice_form"
                        >
                          <div className="">
                            <h3 className="page-heading d-flex text-dark fw-bold fs-1 flex-column justify-content-center my-0">
                              Basic Token Information
                            </h3>
                            <span className="fs-6 text-gray-700">
                              Tell us the basics about the token you are
                              Building
                            </span>
                          </div>

                          <div className="separator separator-dashed my-10"></div>
                          <div className="mb-0">
                            <div className="row gx-10 mb-5">
                              <div className="col-lg-6">
                                <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                  Token Name
                                </label>
                                <div className="mb-5">
                                  <input
                                    disabled={
                                      chromia_account?.id ? false : true
                                    }
                                    type="text"
                                    id="tokenname"
                                    className="form-control form-control-solid"
                                    placeholder="Choose a name for your token (eg ChromiaSwap) 1-64 characters"
                                    {...register("tokenName", {
                                      required: true,
                                    })}
                                  />
                                </div>
                                <br />
                              </div>
                              <div className="col-lg-6">
                                <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                  Token Symbol
                                </label>
                                <div className="mb-5">
                                  <input
                                    type="text"
                                    disabled={
                                      chromia_account?.id ? false : true
                                    }
                                    id="tokensymbol"
                                    className="form-control form-control-solid"
                                    placeholder="Enter Token Ticker 1-16 characters"
                                    {...register("tokensymbol", {
                                      required: true,
                                    })}
                                  />
                                </div>
                                <br />
                              </div>
                              <div className="col-lg-6">
                                <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                  Initial Supply
                                </label>
                                <div className="mb-5">
                                  <input
                                    type="number"
                                    id="initialSupply"
                                    step="any"
                                    disabled={
                                      chromia_account?.id ? false : true
                                    }
                                    min="1"
                                    className="form-control form-control-solid"
                                    placeholder="Insert the initial supply of tokens available. Will be put into your account"
                                    title="Supply cannot be more than 10^19"
                                    {...register("initialSupply", {
                                      required: true,
                                      maxLength: 20,
                                    })}
                                    onKeyDown={(e) => {
                                      if (
                                        e.code === "Minus" ||
                                        e.code === "Period"
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                  />
                                </div>
                                <br />
                              </div>

                              {chromia_account?.id && (
                                <div className="col-lg-6">
                                  <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                    Recipient Address
                                  </label>
                                  <div
                                    className="mb-5"
                                    style={{ marginTop: "10px" }}
                                  >
                                    <span className="fs-6 text-white">
                                      {chromia_account &&
                                        chromia_account?.id.toString("hex")}
                                    </span>
                                  </div>
                                  <br />
                                </div>
                              )}
                              <div className="col-lg-12 d-flex justify-content-center">
                                {buttonVisible ? (
                                  <DisplayButton>
                                    <button
                                      disabled={!isValid}
                                      type="submit"
                                      className={`btn ${isValid ? "btn-primary" : "btn-light"
                                        } submit-details `}
                                    >
                                      <span className="svg-icon svg-icon-3">
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M15.43 8.56949L10.744 15.1395C10.6422 15.282 10.5804 15.4492 10.5651 15.6236C10.5498 15.7981 10.5815 15.9734 10.657 16.1315L13.194 21.4425C13.2737 21.6097 13.3991 21.751 13.5557 21.8499C13.7123 21.9488 13.8938 22.0014 14.079 22.0015H14.117C14.3087 21.9941 14.4941 21.9307 14.6502 21.8191C14.8062 21.7075 14.9261 21.5526 14.995 21.3735L21.933 3.33649C22.0011 3.15918 22.0164 2.96594 21.977 2.78013C21.9376 2.59432 21.8452 2.4239 21.711 2.28949L15.43 8.56949Z"
                                            fill="currentColor"
                                          ></path>
                                          <path
                                            opacity="0.3"
                                            d="M20.664 2.06648L2.62602 9.00148C2.44768 9.07085 2.29348 9.19082 2.1824 9.34663C2.07131 9.50244 2.00818 9.68731 2.00074 9.87853C1.99331 10.0697 2.04189 10.259 2.14054 10.4229C2.23919 10.5869 2.38359 10.7185 2.55601 10.8015L7.86601 13.3365C8.02383 13.4126 8.19925 13.4448 8.37382 13.4297C8.54839 13.4145 8.71565 13.3526 8.85801 13.2505L15.43 8.56548L21.711 2.28448C21.5762 2.15096 21.4055 2.05932 21.2198 2.02064C21.034 1.98196 20.8409 1.99788 20.664 2.06648Z"
                                            fill="currentColor"
                                          ></path>
                                        </svg>
                                      </span>
                                      Submit Details
                                    </button>
                                  </DisplayButton>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CreateToken;
