import React, { useState } from "react";
import { MAX_BET_LIMIT } from "../../utils/constant";
import { addAnswerForPoll, voteForPoll } from "../../services/poll.services";
import toast from "react-hot-toast";
import { AppContext } from "../../contexts/AppContext/app.context";

function MarketDetailsModal({ heading, setShowModal, showModal, marketData ,fetPolls}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [betAmount, setBetAmount] = useState(0);
  const [error, setError] = useState("");

  const { chromia_account } = React.useContext(AppContext);

  const isAdmin =
    marketData?.account?.toString("hex")?.toUpperCase() === chromia_account?.id;
  console.log("chromia_account", isAdmin);

  const [buttonVisible, setButtonVisible] = useState(true);

  const handleOptionClick = (option, type) => {
    setSelectedType(type);
    setSelectedOption(option);
    setBetAmount(0);
    setError("");
  };

  const increaseBet = () => {
    if (betAmount < MAX_BET_LIMIT) {
      setBetAmount((prev) => prev + 1);
      setError("");
    } else {
      setError(`Bet cannot exceed ${MAX_BET_LIMIT}`);
    }
  };

  const decreaseBet = () => {
    if (betAmount > 0) {
      setBetAmount((prev) => prev - 1);
      setError("");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log(value);

    if (value === "") {
      setBetAmount("");
      setError("");
      return;
    }
    const parsedValue = parseInt(value, 10);
    // If value is a valid number and within the limit
    if (!isNaN(parsedValue)) {
      if (parsedValue <= MAX_BET_LIMIT) {
        setBetAmount(parsedValue);
        setError("");
      } else {
        setError(`Bet cannot exceed ${MAX_BET_LIMIT}`);
      }
    }
  };

  async function handleSubmit() {
    if (!selectedOption?.id) toast.error("Please select an option to bet on");
    if(!betAmount) {
     
      throw new Error("Bet amount should be greater than 0")
    }
    if (selectedType === "Yes") {
      console.log("AMOUNt----", betAmount);

      await voteForPoll({
        isYesVote: true,
        voteID: selectedOption?.id,
        metamaskAccount: true,
      });
      await fetPolls()

    } else {
      await voteForPoll({
        isYesVote: false,
        voteID: selectedOption?.id,
        metamaskAccount: true,
      });
      await fetPolls()
    }
  }

  const handleActualAnswer = async () => {
    if (!selectedOption?.id) toast.error("Please select an option to bet on");

    await addAnswerForPoll({
      metamaskAccount: true,
      pollId: marketData?.id,
      optionId: selectedOption?.id,
    });
  };

  const handleAnswerSubmit = async (data) => {
    setButtonVisible(false);
    await toast.promise(handleActualAnswer(data), {
      loading: "Adding Answer..",
      success: () => {
        return "Done!";
      },
      error: (err) =>{
        setButtonVisible(true);

       return err?.shortReason ??
        err?.message ??
        "Something went wrong , Try again later"},
    });
    setButtonVisible(true);
  };

  const onSubmit = async (data) => {
    setButtonVisible(false);
    await toast.promise(handleSubmit(data), {
      loading: "Betting..",
      success: () => {
        return "Done!";
      },
      error: (err) =>{

      setButtonVisible(true);

      return  err?.shortReason ??
        err?.message ??
        "Something went wrong , Try again later"
      
      }
    });
  };

  return (
    <>
      {showModal && (
        <div
          className="modal fade show"
          id="market-details"
          tabIndex="-1"
          aria-labelledby="MarketDetails"
          aria-modal="true"
          role="dialog"
          style={{ display: "block", paddingLeft: "0px" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "900px",
              width: "90%",
              height: "500px",
            }}
          >
            <div
              className="modal-content"
              style={{
                zIndex: 1000,
                border: "2px solid white",
                height: "95%",
              }}
            >
              <div className="modal-header">
                <div className="header-image">
                  <img
                    style={{
                      width: "100%",
                      borderRadius: "50%",
                    }}
                    src={marketData?.title_image}
                    alt="poll"
                  />
                </div>
                <h2>{marketData?.title || "Market Details"}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div
                style={{
                  borderRadius: "15px",
                  padding: "20px",
                }}
                className="modal-body"
              >
                {marketData?.options?.length && (
                  <h4 className="modals-title mb-3">Options:</h4>
                )}
                <div className="options-list">
                  {marketData?.options?.map((option, index) => (
                    <div
                      key={index}
                      className="option-item d-flex justify-content-between align-items-center mb-2"
                    >
                      <span className="option-name">{option?.option_text}</span>
                      <div
                        className="option-actions"
                        style={{ display: "flex", gap: "10px" }}
                      >
                        <button
                          className={`btn-choose yes-btn ${
                            selectedOption === option?.option_text
                              ? "active"
                              : ""
                          }`}
                          style={{
                            width: "90px",
                            padding: "10px 15px",
                            fontSize: "14px",
                          }}
                          onClick={() => handleOptionClick(option, "Yes")}
                        >
                          Bet Yes
                        </button>
                     
                      </div>
                    </div>
                  ))}
                </div>
                {marketData?.options?.length === 0 && (
                  <div
                    className="d-flex"
                    style={{
                      justifyContent: "center",
                      marginTop: "38px",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="btn-choose yes-btn"
                      style={{
                        width: "140px",
                        padding: "10px 20px",
                        fontSize: "14px",
                      }}
                    >
                      Bet Yes
                    </button>
                    <button
                      className="btn-choose no-btn"
                      style={{
                        width: "140px",
                        padding: "10px 20px",
                        fontSize: "14px",
                      }}
                    >
                      Bet No
                    </button>
                  </div>
                )}

                {selectedOption && (
                  <>
                    <div className="bet-input mt-3 d-flex justify-content-center flex-col align-items-center">
                      <h3 className="mb-5">{selectedOption?.option_text}</h3>
                      <div
                        className="bet-controls d-flex align-items-center"
                        style={{ gap: "10px" }}
                      >
                        <button
                          onClick={decreaseBet}
                          className="btn"
                          style={{
                            fontSize: "20px",
                            padding: "2px 16px",
                            backgroundColor: "grey",
                          }}
                        >
                          -
                        </button>
                        <input
                          className="form-control form-control-solid"
                          value={betAmount}
                          onChange={handleInputChange}
                        />
                        <button
                          onClick={increaseBet}
                          className="btn"
                          style={{
                            fontSize: "20px",
                            padding: "2px 16px",
                            backgroundColor: "grey",
                          }}
                        >
                          +
                        </button>
                      </div>
                      {buttonVisible && (
                        <button
                          className={`bet-btn ${
                            selectedType === "Yes" ? "yes-btn" : "no-btn"
                          } mt-4`}
                          onClick={onSubmit}
                        >
                          Bet {selectedType}
                        </button>
                      )}
                    </div>
                  </>
                )}

                <div className="market-info mt-4">
                  {/* <p className="text-muted">
                    Volume: ${marketData?.volume || "1.0b"}
                  </p>
                  <p className="text-muted">
                    Participants: {marketData?.participants || "96,121"}
                  </p> */}

                  {selectedOption && isAdmin && !marketData?.isComplete && (
                    <center>
                      <div
                        style={{
                          color: "white",
                        }}
                      >
                        <h3>
                          make bet{" "}
                          <span
                            style={{
                              color: "yellow",
                            }}
                          >
                            {" "}
                            {selectedOption?.option_text}{" "}
                          </span>
                          as answer for the poll
                        </h3>
                      </div>
                      {buttonVisible && (
                        <button
                          className={`bet-btn ${
                            selectedType === "Yes" ? "yes-btn" : "no-btn"
                          } mt-4`}
                          onClick={handleAnswerSubmit}
                        >
                          Make it answer
                        </button>
                      )}
                    </center>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MarketDetailsModal;
