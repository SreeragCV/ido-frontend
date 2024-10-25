/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { roundFloat } from "../../utils/util.functions";

const List = ({ tokenList, totalValue }) => {

    console.log("totalValue", totalValue);
    return (

        <tbody className="text-gray-600 fw-semibold">
            {
                tokenList.map((token, index) =>
                (<tr key={`tokenListRow${index}`}>
                    <td className="d-flex align-items-center">
                        <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                            <a href="#">
                                <div className="symbol-label">
                                    <img src="./assets/media/icons/chr.svg" alt="" className="w-100" />
                                </div>
                            </a>
                        </div>
                        <div className="d-flex flex-column">
                            <a href="#" className="text-gray-800 text-hover-primary mb-1 fs-2">{token?.name}</a>
                            <span>${token?.symbol}</span>
                        </div>
                    </td>
                    <td className="fs-3">{roundFloat(parseFloat(token?.amount) * 100 / totalValue, 2)}%</td>
                    <td>
                        <div className="badge badge-light fw-bold fs-3">$0.0</div>
                    </td>
                    <td className="fs-2 text-white">$ {`${new Intl.NumberFormat("en-US").format(token?.amount)}`}</td>
                </tr>
                )
                )
            }
        </tbody>

    );
}

export default List;