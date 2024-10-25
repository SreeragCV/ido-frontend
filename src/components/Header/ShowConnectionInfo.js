import React from 'react'
import { NavLink } from 'react-router-dom';

import { getMinifiedAddress } from '../../utils/util.functions';
import axios from '../../lib/axios';

import { client as Client, signMessageAndGetAddress } from '../../utils/blockchain/metamask-connect';

import { AppContext } from '../../contexts/AppContext/app.context';
import { queryParticipantByID } from '../../services/rell_api.get.services';
import { op } from 'ft3-lib';
import { getSession } from '../../utils/blockchain/blockchain';
import { Modal } from '../UI/ConnectModal';


const ShowConnectionInfo = () => {

    const { setMetamaskAccount, setAccount, chromia_account, setCurrentProvider,
        currentProvider, metamaskAccount, setLoading
    } = React.useContext(AppContext);

    const [showModal, setShowModal] = React.useState(false);

    const [accountChanged, setAccountChanged] = React.useState(false);

    const connect = async (getNewSession = false) => {
        setLoading(true)
        setAccountChanged(false)
        try {

            const client = await Client

            let msgToSign = await client.query(
                {
                    name: 'auth.get_message_to_sign',
                }
            )
            const accountsEth = await window.ethereum.request({ method: 'eth_requestAccounts' });

            // returns the corresponding chromia account id for the metamask account
            let accounts = await queryParticipantByID(accountsEth[0].replace('0x', ''), client)
            console.log('accounts', accounts)
            if (!!accounts.length) {
                //if account exists, getSession login   user and returning the session
                await getSession(accounts[0]?.toString('hex'), getNewSession)

                setAccount({ id: accounts[0]?.toString('hex')?.toUpperCase() })

                setMetamaskAccount(accountsEth[0].toString('hex'))

                setCurrentProvider(
                    {
                        chromia: false,
                        metamask: true
                    }
                )

                return
            }
            let { address, signature } = await signMessageAndGetAddress(msgToSign)


            await axios.post('/cretate-account', {
                address: address,
                signature: signature
            })

            accounts = await queryParticipantByID(accountsEth[0].replace('0x', ''), client)

            let session = await getSession(accounts[0]?.toString('hex'), getNewSession)

            await session.call(op("add_user", accounts[0]?.toString('hex')));

            setCurrentProvider(
                {
                    chromia: false,
                    metamask: true
                }
            )

            setAccount({ id: accounts[0]?.toString('hex')?.toUpperCase() })
            setMetamaskAccount(accountsEth[0].toString('hex'))


            console.log('Done!!')

        } catch (err) {
            console.log(err)
            // alert('Something went wrong while connecting to metamask')

        }
        finally {
            window.ethereum.on("accountsChanged", async () => {
                setAccountChanged(pre => !pre)
                const accountsEth = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('acccount changed')
                setMetamaskAccount(accountsEth[0].toString('hex'))
            })
            setLoading(false)
        }

    }
    const logout = () => {
        localStorage.clear()
        setMetamaskAccount(null)
        setAccount(null)
        setCurrentProvider({
            chromia: false,
            metamask: false
        })

    }




    React.useEffect(() => {
        if (currentProvider.metamask) {
            connect(false)
        }
    }, [])

    React.useEffect(() => {
        if (currentProvider.metamask && metamaskAccount && accountChanged) {
            connect(true)
        }
    }, [metamaskAccount])
    return (
        <>
            <Modal setShowModal={setShowModal} showModal={showModal} heading=" Choose Provider" message="You need to connect any one of wallet to continue" />
            <div className="d-flex align-items-center menu-mob">
                {chromia_account != null && (
                    <div>
                        <div
                            className="m-0"
                            onClick={() => {
                                navigator.clipboard.writeText(chromia_account?.id?.toString());
                            }}
                        >
                            <div
                                className="btn btn-flex bg-body btn-color-gray-700 btn-active-color-primary fw-bold"
                                data-kt-menu-trigger="click"
                                data-kt-menu-placement="bottom-end"
                            >
                                <p style={{ margin: "0px 0.5rem 0px 0.25rem" }}>
                                    {getMinifiedAddress(chromia_account?.id?.toString("hex"))}
                                </p>

                                <div
                                    onClick={logout}
                                    className="btn btn-flex bg-body btn-color-gray-700 btn-active-color-danger fw-bold"
                                    style={{ marginLeft: "10px", background: "#ff0022" }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                                        <line x1="12" y1="2" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {chromia_account == null && (
                    <div className="m-0" onClick={
                        () => {
                            setShowModal(true)
                        }
                    }>
                        <div
                            className="btn btn-flex bg-body btn-color-gray-700 btn-active-color-primary fw-bold"
                            data-kt-menu-trigger="click"
                            data-kt-menu-placement="bottom-end"
                            style={{
                                border: '2px solid white'
                            }}
                        >
                            <span className="svg-icon svg-icon-6 svg-icon-muted me-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-wallet2"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
                                </svg>
                            </span>
                            Connect
                        </div>
                    </div>
                )}

                <NavLink to="/" className="d-flex d-lg-none">
                    <img
                        alt="Logo"
                        src="./assets/media/logo.png"
                        className="h-30px theme-dark-show"
                    />
                </NavLink>
            </div>

        </>
    )
}

export { ShowConnectionInfo }