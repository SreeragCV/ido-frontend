import React, { useState, useEffect, useContext } from "react";
import moment from "moment/moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Footer from "../Footer/Footer";
import { SERVER_ADDRESS } from "../../utils/constant";
import { ConnectInfo } from "../UI/DisplayConnectInfo";
import { AppContext } from "../../contexts/AppContext/app.context";
import { Loader } from "../UI/Loader";
import axios from "axios";

const durations = ["24H", "1W", "1M", "1Y"];

const SwapGraph = ({ pair, inverted }) => {
  const [history, setHistory] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("24H");

  const getXAxisFormat = (duration) => {
    switch (duration) {
      case "24H":
        return "h:mmA";
      case "1W":
      case "1M":
      case "1Y":
        return "MMM D";
    }
  };

  const getDurationDetail = (duration) => {
    switch (duration) {
      case "24H":
        return "Past 24 Hours";
      case "1W":
        return "Past 1 Week";
      case "1M":
        return "Past 1 Month";
      case "1Y":
        return "Past 1 Year";
    }
  };

  const getDiff = (duration, inverted) => {
    let diff = 0;
    if (history[duration]) {
      const latest = history[duration][history[duration].length - 1]?.price;
      const oldest = history[duration][0]?.price;
      if (latest && oldest)
        if (inverted) {
          diff = 1 / latest - 1 / oldest;
        } else {
          diff = latest - oldest;
        }
    }
    return diff;
  };

  const getPrice = (duration, inverted) => {
    const historyData = history[duration];
    if (historyData) {
      if (inverted && historyData[0]?.price) {
        return 1 / historyData[0]?.price;
      }
      return historyData[0]?.price;
    }
  };

  const fetchData = async (duration) => {
    setLoading(true);
    try {
      const pairId = pair?.id;

      const url = `${SERVER_ADDRESS}/history?pairId=${pairId}&duration=${duration}`;

      const data = await axios.get(url);

      console.log(data, "data");
      if (data.data === "") throw new Error("No data for ");
      const xAxisFormat = getXAxisFormat(duration);
      setHistory({
        ...history,
        [duration]: data.data?.map((e) => {
          // const t = moment(e?.timestamp).local().format("h:mmA")
          // console.log(t)
          return {
            timestampLocal: moment(e?.timestamp).local().format(xAxisFormat),
            timestampUTC: moment(e?.timestamp)
              .utc()
              .format("MMM D, YYYY, h:mm A (z)"),
            price:
              e?.reserve1["$numberDecimal"] / e?.reserve2["$numberDecimal"],
          };
        }),
      });
      setError(null);
      console.log(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!history[duration] && pair) {
      fetchData(duration);
    }
  }, [pair?.id, duration, inverted]);

  const durationElements = durations.map((element, i) => (
    <li key={`durationElement_${i}`} className="nav-item" role="presentation">
      <button
        className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light fw-bold px-4 me-1 ${
          duration === element ? "active" : ""
        }`}
        data-bs-toggle="tab"
        id="kt_charts_widget_11_tab_1"
        aria-selected="false"
        tabIndex="-1"
        role="tab"
        onClick={() => setDuration(element)}
      >
        {element}
      </button>
    </li>
  ));

  const CustomTooltip = ({ payload, label, active }) => {
    console.log(payload, "payload");

    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "rgb(230, 158, 175)",
            padding: "0.5rem",
            borderRadius: "1rem",
          }}
        >
          <p className="label">{payload[0]?.payload?.timestampLocal}</p>

          <div style={{ display: "flex" }}>
            <p className="intro">
              {inverted ? pair?.asset2?.symbol : pair?.asset1?.symbol} :
            </p>
            <p
              className="desc"
              style={{ marginLeft: 5 }}
            >{`${new Intl.NumberFormat("en-US").format(
              payload[0]?.value || 101
            )}`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const { chromia_account } = useContext(AppContext);
  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
      <div className="d-flex flex-column flex-column-fluid">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-xxl"
          >
            <div className="row gy-5 g-xl-10">
              <div className="col-xl-12 mb-5 mb-xl-12">
                {pair && (
                  <div className="card card-flush h-xl-100">
                    <div className="card-header pt-5">
                      <h3 className="card-title align-items-start d-flex align-items-center">
                        <span className="card-label fw-bold text-dark ml-10">
                          <b>
                            {inverted
                              ? pair?.asset2?.symbol
                              : pair?.asset1?.symbol}
                            /
                            <span className="text-gray-400">
                              {" "}
                              {inverted
                                ? pair?.asset1?.symbol
                                : pair?.asset2?.symbol}
                            </span>
                          </b>
                        </span>
                      </h3>
                      <div className="card-toolbar">
                        <ul className="nav" id="kt_chart_widget_11_tabs">
                          {durationElements}
                        </ul>

                        <button
                          className="relative inline-flex settings-icon ml-10"
                          onClick={() => fetchData(duration)}
                        >
                          <span className="">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-arrow-clockwise"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                              />
                              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* {history[duration]?.length > 0 && (
                      <div className="card-header">
                        <div className="mb-2">
                          <span className="fs-2hx fw-bold d-block text-white me-2 mb-2 lh-1 ls-n2">
                            {`${new Intl.NumberFormat("en-US").format(
                              getPrice(duration, inverted)
                            )}`}{" "}
                            {inverted
                              ? pair?.asset1?.symbol
                              : pair?.asset2?.symbol}
                          </span>
                        </div>
                      </div>
                    )} */}

                    {history[duration]?.length > 0 && (
                      <div className="card-body pb-0 pt-4">
                        <ResponsiveContainer width="100%" height={400}>
                          <AreaChart
                            width={800}
                            height={200}
                            data={
                              inverted
                                ? history[duration]?.map((e) => {
                                    return { ...e, price: 1 / e?.price };
                                  })
                                : history[duration]
                            }
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0,
                            }}
                          >
                            <defs>
                              <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#e69eaf66"
                                  stopOpacity={0.4}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#e69eaf66"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              vertical={false}
                              strokeDasharray="3"
                              opacity={0.3}
                            />
                            <XAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#565674" }}
                              dataKey="timestampLocal"
                              interval={Math.floor(
                                history[duration]?.length / 5
                              )}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#565674" }}
                            />
                            <Tooltip
                              content={
                                <CustomTooltip payload={[{ value: 2 }]} />
                              }
                            />
                            <Area
                              type="monotone"
                              dataKey="price"
                              activeDot={{ stroke: "#e69eaf", strokeWidth: 3 }}
                              stroke="#e69eaf"
                              strokeWidth="3"
                              fillOpacity={1}
                              fill="url(#colorUv)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {(history[duration]?.length === 0 || error) && (
                      <div
                        className="card-body pb-0 pt-4"
                        style={{ height: "34rem" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <img
                            alt="chromia logo"
                            src="./assets/media/icons/chr.svg"
                            style={{ height: "5rem" }}
                          />
                          <h3 style={{ padding: "1rem" }}>
                            {!error
                              ? "No data " + duration
                              : "No data " + duration}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {loading && (
                  <div
                    className="card-body pb-0 pt-4"
                    style={{ height: "34rem" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <Loader />
                    </div>
                  </div>
                )}

                {!pair && (
                  <div className="card card-flush" style={{ height: "38rem" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      {!pair && chromia_account?.id && (
                        <>
                          <img
                            alt="chromia logo"
                            src="./assets/media/icons/chr.svg"
                            style={{ height: "5rem" }}
                          />
                          <h3 style={{ padding: "1rem" }}>Select a pair</h3>
                        </>
                      )}
                      <ConnectInfo
                        message={
                          "Please connect your wallet and select the pair to view swap graph"
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SwapGraph;
