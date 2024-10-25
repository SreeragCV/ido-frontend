import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Footer from '../Footer';

const durations = ["24H", "1W", "1M", "1Y"]

const SwapPriceChangeChart = ({ pair }) => {

	const [history, setHistory] = useState({})
	const [duration, setDuration] = useState('24H')
	const [inverted, setInverted] = useState(false)

	const getXAxisFormat = (duration) => {
		switch (duration) {
			case '24H':
				return "h:mmA"
			case "1W":
			case "1M":
			case "1Y":
				return "MMM D"
		}
	}

	const getDurationDetail = (duration) => {
		switch (duration) {
			case '24H':
				return "Past 24 Hours"
			case "1W":
				return "Past 1 Week"
			case "1M":
				return "Past 1 Month"
			case "1Y":
				return "Past 1 Year"
		}
	}

	const getDiff = (duration, inverted) => {
		let diff = 0
		if (history[duration]) {
			const latest = history[duration][history[duration].length - 1]?.price
			const oldest = history[duration][0]?.price
			if (latest && oldest)
				if (inverted) {
					diff = 1 / latest - 1 / oldest
				} else {
					diff = latest - oldest
				}
		}
		return diff
	}

	const getPrice = (duration, inverted) => {
		const historyData = history[duration]
		if (historyData) {
			if (inverted && historyData[0]?.price) {
				return 1 / historyData[0]?.price
			}
			return historyData[0]?.price
		}
	}
	const fetchData = async (duration) => {
		try {
			console.log(process.env.REACT_APP_ACCUMULATOR_ADDRESS)
			const pairId = pair?.id
			const url = `${process.env.REACT_APP_ACCUMULATOR_ADDRESS}/history?pairId=${pairId}&duration=${duration}`;
			const response = await fetch(url)
			const data = await response.json()
			const xAxisFormat = getXAxisFormat(duration)
			setHistory({
				...history, [duration]: data.map(e => {
					// const t = moment(e?.timestamp).local().format("h:mmA")
					// console.log(t)
					return { timestampLocal: moment(e?.timestamp).local().format(xAxisFormat), timestampUTC: moment(e?.timestamp).utc().format("MMM D, YYYY, h:mm A (z)"), price: e?.reserve1 * Math.random() / e?.reserve2 * Math.random() }
				})
			})
			console.log(data)
		} catch (err) {
			console.error(err);
		}
	}
	useEffect(() => {
		if (!history[duration] && pair) {
			fetchData(duration)
		}
	}, [pair?.id, duration])

	const durationElements = durations.map((element, i) => (
		<li key={`durationElement_${i}`} className="nav-item" role="presentation" >
			<button
				className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light fw-bold px-4 me-1 ${duration === element ? "active" : ""}`}
				data-bs-toggle="tab" id="kt_charts_widget_11_tab_1"
				aria-selected="false" tabIndex="-1" role="tab"
				onClick={() => setDuration(element)}>
				{element}
			</button>
		</li >
	))

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {

			return (
				<div className="apexcharts-theme-light apexcharts-tooltip apexcharts-active">
					<div className="apexcharts-tooltip-title" style={{ fontFamily: "inherit", fontSize: "12px" }}>{payload[0]?.payload?.timestampUTC}</div>
					<div className="apexcharts-tooltip-series-group apexcharts-active" style={{ order: 1, display: "flex" }}>
						<span className="apexcharts-tooltip-marker" style={{ backgroundColor: "rgb(230, 158, 175)" }}></span>
						<div className="apexcharts-tooltip-text" style={{ fontFamily: "inherit", fontSize: "12px" }}>
							<div className="apexcharts-tooltip-y-group">
								<span className="">{inverted ? pair?.asset2?.symbol : pair?.asset1?.symbol} :</span>
								<span className="">{payload[0]?.value}</span>
							</div>
						</div>
					</div>
				</div>
			);

		}
		return null;
	};

	return (
		<div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ display: 'hidden' }}>
			<div className="d-flex flex-column flex-column-fluid">

				<div id="kt_app_content" className="app-content flex-column-fluid">
					<div id="kt_app_content_container" className="app-container container-xxl">
						<div className="row gy-5 g-xl-10">
							<div className="col-xl-12 mb-5 mb-xl-12">
								<div className="card card-flush h-xl-100">
									<>
										{pair &&
											<>
												<div className="card-header pt-5">
													<h3 className="card-title align-items-start d-flex align-items-center">
														<span className="d-flex align-items-center">
															{/* <img alt="Logo" src="assets/media/icons/busd.png" className="h-30px" /> */}
															{/* <img alt="Logo" src="assets/media/icons/usdc.png" className="h-30px" /> */}
														</span>

														<span className="card-label fw-bold text-dark ml-10"><b>{inverted ? pair?.asset2?.symbol : pair?.asset1?.symbol}/<span className="text-gray-400"> {inverted ? pair?.asset1?.symbol : pair?.asset2?.symbol}</span></b> </span>
														<button onClick={() => setInverted(!inverted)} className="relative inline-flex shrink-0 items-center justify-center overflow-hidden text-center text-xs font-medium outline-none transition-all sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 exchange-icon my-5 dark:text-white rounded-full w-8 h-8">
															<span className="">
																<svg viewBox="0 0 24 25" fill="#fff" width="20px" xmlns="http://www.w3.org/2000/svg" className="h-auto w-4">
																	<path fill-rule="evenodd" clip-rule="evenodd" d="M18.86 4.86003L21.65 7.65003C21.84 7.84003 21.84 8.16003 21.64 8.35003L18.85 11.14C18.54 11.46 18 11.24 18 10.79V9.00003H4C3.45 9.00003 3 8.55003 3 8.00003C3 7.45003 3.45 7.00003 4 7.00003H18V5.21003C18 4.76003 18.54 4.54003 18.86 4.86003ZM5.14001 19.14L2.35001 16.35C2.16001 16.16 2.16001 15.84 2.36001 15.65L5.15001 12.86C5.46001 12.54 6.00001 12.76 6.00001 13.21V15H20C20.55 15 21 15.45 21 16C21 16.55 20.55 17 20 17H6.00001V18.79C6.00001 19.24 5.46001 19.46 5.14001 19.14Z"></path>
																</svg>
															</span>
														</button>

													</h3>

													<div className="card-toolbar">
														<ul className="nav" id="kt_chart_widget_11_tabs" role="tablist">
															{durationElements}
														</ul>
													</div>
												</div>
												{history[duration]?.length > 0 &&
													<div className="card-header">
														<div className="mb-2">
															<span className="fs-2hx fw-bold d-block text-white me-2 mb-2 lh-1 ls-n2">{getPrice(duration, inverted)} {inverted ? pair?.asset1?.symbol : pair?.asset2?.symbol}</span>
															<span className="fs-6 fw-semibold text-gray-400">`{getDiff(duration, inverted)}` {inverted ? pair?.asset1?.symbol : pair?.asset2?.symbol}
																<b className="text-white"> {getDurationDetail(duration)}</b> </span>
														</div>
													</div>
												}
											</>

										}

										<div className="card-body pb-0 pt-4">
											<ResponsiveContainer width="100%" height={400}>
												<AreaChart
													width={800}
													height={200}
													data={inverted ? history[duration]?.map(e => { return { ...e, price: 1 / e.price } }) : history[duration]}
													margin={{
														top: 10,
														right: 30,
														left: 0,
														bottom: 0,
													}}
												>
													<defs>
														<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
															<stop offset="5%" stopColor="#e69eaf66" stopOpacity={0.4} />
															<stop offset="95%" stopColor="#e69eaf66" stopOpacity={0} />
														</linearGradient>
													</defs>
													<CartesianGrid vertical={false} strokeDasharray="3" opacity={0.3} />
													<XAxis tickLine={false} axisLine={false} tick={{ fill: "#565674" }} dataKey="timestampLocal" interval={Math.floor(history[duration]?.length / 5)} />
													<YAxis tickLine={false} axisLine={false} tick={{ fill: "#565674" }} />
													<Tooltip content={<CustomTooltip />} />
													<Area type="monotone" dataKey="price" activeDot={{ stroke: '#e69eaf', strokeWidth: 3 }} stroke="#e69eaf" strokeWidth="3" fillOpacity={1} fill="url(#colorUv)" />
												</AreaChart>
											</ResponsiveContainer>
										</div>
										{/* <CustomTooltip /> */}
									</>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div >
	);
}

export default SwapPriceChangeChart;