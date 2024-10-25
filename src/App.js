import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoadingOverlay from "react-loading-overlay";

import { BlockchainProvider } from "./contexts/BlockchainContext/blockchain.context";
import { AppContextProvider } from "./contexts/AppContext/app.context";

import CreateToken from "./components/CreateToken/CreateToken";
import TokenList from './containers/TokenList/TokenList';
import Liquidity from './containers/Liquidity/Liquidity';
import Swap from './containers/Swap/Swap';
import History from './containers/History/History';

import CreatePoll from "./components/CreatePoll/CreatePoll";
import MarketPage from "./components/CreatePoll/MarketPage";
import IdoDashBoard from "./components/IDO/IdoDashBoard";
import { Ido } from "./pages/Ido";


LoadingOverlay.propTypes = undefined

function App() {
  const runScript = () => {
    if (window.$) {
      let script = document.createElement("script");
      script.src = "/assets/plugins/global/plugins.bundle.js";
      script.async = true;
      script.crossorigin = "anonymous";
      document.head.appendChild(script);

      script = document.createElement("script");
      script.src = "/assets/js/scripts.bundle.js";
      script.async = true;
      script.crossorigin = "anonymous";
      document.head.appendChild(script);

      script = document.createElement("script");
      // script.src = "/assets/js/widgets.bundle.js";
      script.async = true;
      script.crossorigin = "anonymous";
      document.head.appendChild(script);

      script = document.createElement("script");
      // script.src = "/assets/js/custom/widgets.js";
      script.async = true;
      script.crossorigin = "anonymous";
      document.head.appendChild(script);
    } else {
      // Load Jquey in to window
      const script = document.createElement("script");
      // script.src = "/assets/js/custom/widgets.js";
      script.async = true;
      script.crossorigin = "anonymous";
      document.head.appendChild(script);

      // wait 50 milliseconds and try again.
      window.setTimeout(runScript, 50);
    }
  };

  React.useEffect(() => {
    runScript();
  }, []);

  return (
    <div className="App">
      <body
        id="kt_app_body"
        data-kt-app-sidebar-enabled="true"
        data-kt-app-sidebar-fixed="true"
        data-kt-app-sidebar-push-header="true"
        data-kt-app-sidebar-push-toolbar="true"
        data-kt-app-sidebar-push-footer="true"
        data-kt-app-toolbar-enabled="true"
        className="app-default"
      >
        <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
          <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
            <Toaster position="top-center" reverseOrder={false} />

            <BlockchainProvider>
              <AppContextProvider>

                <BrowserRouter>

                  <Routes>

                  {/* <Route path="/history" exact element={<History />} />
                    <Route path="/swap" exact element={<Swap />} />
                    <Route path="/liquidity" exact element={<Liquidity />} />
                    <Route path="/create-token" exact element={<CreateToken />} />
                    <Route path="/token-list" exact element={<TokenList />} />
                    <Route path="/" element={<CreateToken />} /> */}
                    {/* <Route path="/" element={<MarketPage />} />
                    <Route path="create-poll" element={<CreatePoll/>}/> */}
                    <Route path="/" element={<IdoDashBoard/>}/>
                    <Route path="/chromia-ido/:id" element={<Ido/>}/>

                  </Routes>


                </BrowserRouter>
              </AppContextProvider>
            </BlockchainProvider>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
