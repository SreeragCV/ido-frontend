import React, { useEffect, useState } from "react";
import {
  getPollOptionsById,
  getPollResult,
} from "../../services/rell_api.get.services";
import MarketDetailsModal from "./MarketDetailsModal";
import {
  calculatePollPercentages,
  isCurrentDateGreaterThan,
} from "../../utils/util.functions";
import { AppContext } from "../../contexts/AppContext/app.context";

const PollMarketCard = ({
  onClick,
  data,
  fetPolls,

  setSelectedMarketData,

  percantageData = { yesPercantage: "60%", noPercantage: "40%" },
}) => {

  
  const { chromia_account } = React.useContext(AppContext);

  const [options, setOptions] = useState([]);

  const [votes, setVotes] = useState([]);

  const isPollActive = isCurrentDateGreaterThan(data?.end_date);

  const [showModal, setShowModal] = useState(false);

  const [totalVotes, setTotalVotes] = useState(0);
  function handleClick(data) {
    setSelectedMarketData(data);
    setShowModal(true);
  }

  const fetchOptionsForPoll = async () => {
    let res = await getPollOptionsById({
      metamaskAccount: true,
      pollId: data?.id,
    });
    const pollResult = await getPollResult({
      metamaskAccount: true,
      pollId: data?.id,
    });

    setVotes(pollResult);

    console.log(pollResult,"result")
    

    const totalVotes = pollResult.reduce(
      (sum, voteObj) => sum + Number(voteObj.votes),
      0
    );

    setTotalVotes(totalVotes);
    setOptions(res);
  };

  useEffect(() => {
    fetchOptionsForPoll();
  }, []);


  return (
    <>
      {showModal && (
        <MarketDetailsModal
          setShowModal={setShowModal}
          showModal={showModal}
          fetPolls={fetPolls}
          marketData={{
            options,
            id: data?.id,
            title: data?.title,
            title_image: data?.title_image,
            account: data?.data?.creator,
            isComplete: !!data?.data?.is_resolved,
            rightAnswer: data?.data?.right_answer,
          }}
        />
      )}

      <div className="card-poll" onClick={() => handleClick(data)}>
        <div className="card-header-poll">
          <div className="header-content">
            <div className="header-image">
              <img
                style={{
                  width: "100%",
                  borderRadius: "50%",
                }}
                src={data?.title_image}
                alt="poll"
              />
            </div>
            <h2 onClick={onClick} className="header-title">
              {data?.title}
            </h2>
          </div>
          {isPollActive ? (
            <h6
              style={{
                padding: ".3rem .5rem",
                width: "max-content",
                background: "red",
                borderRadius: "10px",
                marginTop: "1rem",
              }}
            >
              inactive
            </h6>
          ) : (
            <h6
              style={{
                padding: ".3rem .5rem",
                width: "max-content",
                background: "green",
                borderRadius: "10px",
                marginTop: "1rem",
              }}
            >
              active
            </h6>
          )}
        </div>
        <div className="card-content">
          <div className="scroll-area">
            {options?.length > 0 ? (
              options.map((option, index) => {
                const vote = calculatePollPercentages(
                  totalVotes,
                  votes[index]?.votes ?? 0
                );

                return (
                  <div key={index} className="middle-row">
                    <span className="middle-name">{option.option_text}</span>
                    <div className="middle-right-poll">
                      <div className="middle-buttons">
                        <button className="btn-choose yes-btn" >
                          <span>{vote?.percentage}</span>
                          <span>%</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
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
          </div>
        </div>
        {/* <div className="card-footer-poll">
          <span>$1.0b Vol.</span>
          <span>96,121</span>
        </div> */}
      </div>
    </>
  );
};

export default PollMarketCard;
