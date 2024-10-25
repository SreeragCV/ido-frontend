import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import { createPoll } from "../../services/poll.services";
import { parseISO, getUnixTime } from "date-fns";
import toast from "react-hot-toast";
import { DisplayButton } from "../UI/DisplayButton";
import { AppContext } from "../../contexts/AppContext/app.context";
import { getWhitelistUsers } from "../../services/rell_api.get.services";

function CreatePoll() {
  const [isChecked, setIsChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [titleImage, setTitleImage] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const [whiteListUsers, setWhitListUsers] = useState([]);
  const { chromia_account } = React.useContext(AppContext);

  const [dateTime, setDateTime] = useState("");

  const [buttonVisible, setButtonVisible] = useState(true);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  useEffect(() => {
    if (
      options[options.length - 1] !== "" &&
      options[options.length - 2] !== ""
    ) {
      setOptions([...options, ""]);
    }

    if (
      options.length > 2 &&
      options[options.length - 2] === "" &&
      options[options.length - 1] === ""
    ) {
      setOptions(options.slice(0, -1));
    }
    (async () => {
      setWhitListUsers(await getWhitelistUsers());
    })();
  }, [options,chromia_account?.id]);

  useEffect(() => {
    setOptions(["", ""]);
  }, [isChecked]);

  async function handleSubmit(e) {
    e.preventDefault();
    const filledOptions = options.filter((option) => option !== "");
    console.log("options", filledOptions);
    console.log("title", title);
    console.log("image", titleImage);

    const date = parseISO(dateTime);

    // Convert to Unix timestamp (in seconds)
    const unixTimestamp = getUnixTime(date) * 1000;

    console.log(`Unix Timestamp: ${unixTimestamp}`);

    await createPoll({
      title,
      options: filledOptions,
      deadline: unixTimestamp,
      titleImage,
      metamaskAccount: true,
    });
  }

  const onSubmit = async (data) => {
    setButtonVisible(false);
    await toast.promise(handleSubmit(data), {
      loading: "Creating Poll",
      success: () => {
        return "Done!";
      },
      error: (err) => {
        setButtonVisible(true);
        return (
          err?.shortReason ??
          err?.message ??
          "Something went wrong , Try again later"
        );
      },
    });
    setButtonVisible(true);
  };

  if(!chromia_account?.id) return <>

<Header />
<div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <h1>Please Connect to wallet</h1>
        </div>

  </>

  return (
    <>
      <Header />
      {whiteListUsers.includes(chromia_account?.id.toString('hex')?.toLowerCase()) ? (
        <div className="flex-column flex-row-fluid" id="kt_app_wrapper">
          <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
            <div className="d-flex flex-column flex-column-fluid">
              <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-0">
                <div
                  id="kt_app_toolbar_container"
                  className="app-container container-xxl d-flex flex-stack"
                >
                  <div className="page-title d-flex flex-column justify-content-center me-3">
                    <h1 className="page-heading d-flex text-dark fw-bold fs-1 flex-column justify-content-center my-4">
                      Create Poll
                    </h1>
                  </div>
                </div>
              </div>

              <div
                id="kt_app_content"
                className="app-content flex-column-fluid"
              >
                <div
                  id="kt_app_content_container"
                  className="app-container container-xxl"
                >
                  <div className="d-flex flex-column flex-lg-row">
                    <div className="flex-lg-row-fluid mb-10 mb-lg-0">
                      <div className="card">
                        <div className="card-body p-12">
                          <form
                            onSubmit={onSubmit}
                            action=""
                            id="kt_invoice_form"
                          >
                            <div className="">
                              <h3 className="page-heading d-flex text-dark fw-bold fs-1 flex-column justify-content-center my-4">
                                Create Your Poll
                              </h3>
                              <span className="fs-6 text-gray-700">
                                Tell us the basic details about the poll you are
                                creating...
                              </span>
                            </div>

                            <div className="separator separator-dashed my-10"></div>
                            <div className="mb-0">
                              <div className="column gx-10 mb-5">
                                <div className="col-lg-10">
                                  <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                    Title
                                  </label>
                                  <div className="mb-2">
                                    <input
                                      type="text"
                                      value={title}
                                      className="form-control form-control-solid"
                                      onChange={(e) => setTitle(e.target.value)}
                                    />
                                  </div>
                                  <br />
                                </div>
                                <div className="col-lg-10">
                                  <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                    Title Image
                                  </label>
                                  <div className="mb-5">
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        setTitleImage(e.target.value)
                                      }
                                      className="form-control form-control-solid"
                                    />
                                  </div>
                                  <br />
                                </div>
                                <div className="col-lg-10">
                                  <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                    Poll End date
                                  </label>
                                  <div className="mb-5">
                                    <input
                                      type="date"
                                      min={
                                        new Date().toISOString().split("T")[0]
                                      }
                                      onChange={(e) =>
                                        setDateTime(e.target.value)
                                      }
                                      className="form-control form-control-solid"
                                    />
                                  </div>
                                  <br />
                                </div>
                                <div
                                  className="col-lg-6 d-flex"
                                  style={{ gap: "6px" }}
                                >
                                  <label
                                    id="option-check"
                                    className="form-label fs-6 fw-bold text-gray-700 mb-3"
                                  >
                                    Add Options
                                  </label>
                                  <div className="mb-5">
                                    <input
                                      type="checkbox"
                                      name="option-check"
                                      id="option-check"
                                      className="custom-checkbox"
                                      onChange={(e) =>
                                        setIsChecked(e.target.checked)
                                      }
                                    />
                                  </div>
                                  <br />
                                </div>
                                {isChecked &&
                                  options?.map((option, index) => (
                                    <div className="col-lg-10" key={index}>
                                      <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                                        Option {index + 1}
                                      </label>
                                      <div className="mb-5">
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) =>
                                            handleOptionChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          className="form-control form-control-solid"
                                        />
                                      </div>
                                      <br />
                                    </div>
                                  ))}
                                <div className="d-flex justify-content-center">
                                  {buttonVisible && (
                                    <DisplayButton>
                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                      >
                                        Create
                                      </button>
                                    </DisplayButton>
                                  )}
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
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <h1>You are not whiteListed</h1>
        </div>
      )}
    </>
  );
}

export default CreatePoll;
