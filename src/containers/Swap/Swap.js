import React, { useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";
import { AppContext } from "../../contexts/AppContext/app.context";
import {
  fetchTokenListByAccount,
  getAllTokens,
} from "../../services/rell_api.get.services";

import { updateModalTokenList } from "../../redux/modal-list-reducer/modal-list.actions";

import Wrapper from "../../components/Wrapper/Wrapper";
import SwapToken from "../../components/Swap/SwapToken";
import SwapGraph from "../../components/Swap/SwapGraph";

const Swap = () => {
  const dispatch = useDispatch();

  const { chromia_account, metamaskAccount } = useContext(AppContext);
  const blockchain = useContext(BlockchainContext);

  const [pair, setPair] = useState(null);
  const [inverted, setInverted] = useState(false);
  const [showGraph, setShowGraph] = useState(true);

  const loadTokenList = async () => {
    const tokenBalances = await fetchTokenListByAccount({
      blockchain: blockchain,
      accountId: chromia_account?.id,
    });

    dispatch(updateModalTokenList([...tokenBalances]));
  };

  const getAllTokenList = async () => {
    const tokenBalance = await getAllTokens({
      blockchain: blockchain,
      metamaskAccount: metamaskAccount
    });

    console.log("tokens...", tokenBalance);

    dispatch(updateModalTokenList(tokenBalance));
  };

  useEffect(() => {
    getAllTokenList();
  }, [chromia_account?.id]);

  useEffect(() => {
    if (pair) setShowGraph(true);
    else setShowGraph(false);
  }, [pair]);

  return (
    <Wrapper>
      <div
        className="app-wrapper flex-column flex-row-fluid "
        id="kt_app_wrapper"
      >
        <SwapToken
          showGraph={showGraph}
          setShowGraph={setShowGraph}
          pair={pair}
          setPair={setPair}
          inverted={inverted}
          setInverted={setInverted}
        />
        {showGraph && (
          <SwapGraph key={pair?.id} pair={pair} inverted={inverted} />
        )}
      </div>
    </Wrapper>
  );
};

export default Swap;
