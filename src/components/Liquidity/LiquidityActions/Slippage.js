import React from "react";

const Slippage = ({
    tolValue,
    setSlippage,
    deadlineValue,
    setDeadline,
}) => {

    const toleranceValues = [0.1, 0.5, 1, 1.5];

    return (
        <div className="modal fade" id="slippage" tabindex="-1" aria-labelledby="slippageLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modals-title  mb-0" id="slippageLabel">Slippage Tolerance</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <ul role="listbox" className="min-h-[200px] py-3 search-list d-flex">
                            {
                                toleranceValues.map((value, index) => (

                                    <li key={index} role="listitem" tabindex={index} className={`slippage-amount cursor-pointer gap-2 py-3 px-6 outline-none hover:bg-gray-100 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-900 ${(value == tolValue) ? "slippage-amount-active" : ""}`}
                                        onClick={() => setSlippage(value)}>
                                        <span className="uppercase">{value}%</span>
                                    </li>
                                ))
                            }

                            <div className="relative">
                                <input type="search" placeholder=">1:50%" className="w-full search-input slippage-input border-y border-x-0 border-dashed border-gray-200 py-3.5 pl-14 pr-6 text-sm focus:border-gray-300 focus:ring-0 dark:border-gray-700 dark:bg-light-dark-1 focus:dark:border-gray-600"
                                    value={toleranceValues.includes(tolValue) ? "" : tolValue}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isNaN(val) || parseFloat(val) > 100) {

                                        } else {
                                            if (!val) {
                                                setSlippage(1)
                                            } else {
                                                setSlippage(val)
                                            }
                                        }
                                    }} />
                            </div>
                        </ul>
                        <br />
                        <h4 className="modals-title mb-0">Transaction Deadline</h4>
                        <br />
                        <div className="d-flex align-items-center">
                            <input type="search" placeholder="20" className="search-input slippage-input border-y border-x-0 border-dashed border-gray-200 py-3.5 pl-14 pr-6 text-sm focus:border-gray-300 focus:ring-0 dark:border-gray-700 dark:bg-light-dark-1 focus:dark:border-gray-600"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (isNaN(val) || parseFloat(val) > 30) {

                                    } else {
                                        setDeadline(val)
                                    }
                                }} />
                            <h5 className="modals-title ml-10">Min</h5>
                        </div>
                        <br /><br />
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Slippage;