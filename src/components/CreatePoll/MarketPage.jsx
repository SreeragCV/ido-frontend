import React, { useEffect, useState } from "react";
import PollMarketCard from "./PollMarketCard";
import Header from "../Header/Header";
import MarketDetailsModal from "./MarketDetailsModal";
import { getAllPolls } from "../../services/rell_api.get.services";
import { Loader } from "../UI/Loader";
import { AppContext } from "../../contexts/AppContext/app.context";
import { ConnectWallet } from "../UI/Connect";

const data = [
  {
    title: "Presidential Election",
    options: ["Kamala Harris", "Donald Trump", "Obama"],
  },
  {
    title: "Premier League Winner",
    options: ["Kamala Harris", "Donald Trump", "Obama"],
  },
  {
    title: "Virginia Presidential Election Winner",
    options: ["Kamala Harris", "Donald Trump", "Obama"],
  },
  {
    title: "What will Trump say during Wisconsin speech?",
    options: ["Kamala Harris", "Donald Trump", "Obama"],
  },
  {
    title: "Presidential Election",
    options: ["Kamala Harris", "Donald Trump", "Obama"],
  },
  {
    title: "Nasrallah remains Hezbollah leader through Oct 31?",
    options: ["Kamala Harris", "Donald Trump", "Obama"],
  },
  {
    title: "Presidential Election",
    options: ["Kamala Harris", "Donald Trump", "Obama"],
  },
  {
    title: "Will Israel invade Lebanon before November?",
    options: [],
  },
];

function MarketPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMarketData, setSelectedMarketData] = useState(null);

  const { chromia_account } = React.useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  function handleClick(data) {
    setSelectedMarketData(data);
    setShowModal(true);
  }

  const fetPolls = async () => {
    setLoading(true);

    try {
      const res = await getAllPolls({ metamaskAccount: true });

      console.log(res, "result from fetch polls");

      setData(res);
    } catch (e) {
      console.log(e, "error fetching");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetPolls();
  }, [chromia_account?.id]);
  console.log(selectedMarketData);

  if(!chromia_account?.id){

    return <>
    <div style={{
      height:'70vh',
      display:'flex',
      alignItems:'center',
      justifyContent:'center'
    }}>

   
      <ConnectWallet/>
      </div>
    </>
  }

  return (
    <div>
      <Header />

      {loading ? (
        <>
        <div style={{
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          height:'70vh',
        
        }}>

       
        <Loader />
        </div> 
        </>
      ) : (
        <div className="market-container">
          {data?.length ? (
            data?.map((marketData, index) => {
              return (
                <PollMarketCard
                fetPolls={fetPolls}
                  setSelectedMarketData={setSelectedMarketData}
                  key={index}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  onClick={() => handleClick(marketData)}
                  data={marketData}
                />
              );
            })
          ) : (
            <center>
              <h1>No polls Found</h1>
            </center>
          )}
        </div>
      )}
    </div>
  );
}

export default MarketPage;
