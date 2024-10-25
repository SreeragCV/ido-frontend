import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStructuredSelector } from "reselect";

import { updateModalTokenList } from "../../redux/modal-list-reducer/modal-list.actions";
import { updatePoolList } from "../../redux/pool-list-reducer/pool-list.actions";
import { selectModalTokens } from "../../redux/modal-list-reducer/modal-list.selectors";
import { selectPools } from "../../redux/pool-list-reducer/pool-list.selectors";

import Wrapper from "../../components/Wrapper/Wrapper";
import LiquidityTable from "./LiquidityTable";
import CreateLiquidity from "../../components/Liquidity/LiquidityActions/CreateLiquidity";
import ManageLiquidity from "./ManageLiquidity/ManageLiquidity";
import Footer from "../../components/Footer/Footer";

import { AppContext } from "../../contexts/AppContext/app.context";
import BlockchainContext from "../../contexts/BlockchainContext/blockchain.context";
import {
  fetchTokenListByAccount,
  fetchPools,
  getAllTokens,
} from "../../services/rell_api.get.services";

import { POOL_LIMIT } from "../../utils/constant";

const Liquidity = () => {
  const dispatch = useDispatch();

  const { chromia_account, metamaskAccount } = useContext(AppContext);
  const blockchain = useContext(BlockchainContext);

  //const [poolList, setPoolList] = useState([])
  const [page, setPage] = useState(1);
  const [poolSize, setPoolSize] = useState(0);
  const [pool, setPool] = useState(0);

  const { tokenList } = useSelector(
    createStructuredSelector({ tokenList: selectModalTokens })
  );

  const { poolList } = useSelector(
    createStructuredSelector({ poolList: selectPools })
  );

  const loadTokenList = async () => {
    const tokenBalances = await fetchTokenListByAccount({
      blockchain: blockchain,
      accountId: chromia_account?.id,
    });

    console.log('tokens 1', tokenBalances)

    dispatch(updateModalTokenList([...tokenBalances]));
  };

  const getAllTokenList = async () => {
    const tokenBalance = await getAllTokens({
      blockchain: blockchain,
      metamaskAccount: metamaskAccount
    });
    dispatch(updateModalTokenList(tokenBalance));
  };

  const getPairs = async () => {
    let pools = await fetchPools({
      blockchain: blockchain,
      accountId: chromia_account?.id,
      offset: (page - 1) * POOL_LIMIT,
      limit: POOL_LIMIT,
      metamaskAccount: metamaskAccount
    });

    setPoolSize(pools?.size);

    dispatch(updatePoolList([...pools.list]));
    //setPoolList(pools.list);
  };

  const updatePage = (isNext) => {
    if (isNext) {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    getAllTokenList();
  }, [chromia_account?.id]);

  useEffect(() => {
    if (chromia_account) {
      getPairs();
    }
  }, [chromia_account?.id, page]);

  console.log("poolList", poolList);

  return (
    <Wrapper>
      <div
        className="app-wrapper-2 flex-column flex-row-fluid"
        id="kt_app_wrapper"
      >
        <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
          <LiquidityTable
            poolList={poolList}
            poolSize={poolSize}
            prevPage={() => updatePage(false)}
            currentPage={page}
            nextPage={() => updatePage(true)}
            pool={pool}
            selectPoolHandler={setPool}
            limit={POOL_LIMIT}
          />
          <Footer />
        </div>

        {pool ? (
          <ManageLiquidity
            getPairs={getPairs}
            selectPoolHandler={setPool}
            pair={pool}
            tokenList={tokenList}
            loadTokenList={loadTokenList}
          />
        ) : (
          <CreateLiquidity getPairs={getPairs} loadTokenList={loadTokenList} />
        )}
      </div>
    </Wrapper>
  );
};

export default Liquidity;
