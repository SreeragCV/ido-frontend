import { Blockchain } from 'ft3-lib';
import DirectoryService from './directory-service';

import { BLOCKCHAIN_RID } from '../constant';
import { createKeyStoreInteractor, createWeb3ProviderEvmKeyStore } from '@chromia/ft4';
import { client as Client } from './metamask-connect';

const blockchainRID = BLOCKCHAIN_RID;
const chainId = Buffer.from(
  blockchainRID,
  'hex'
);

let session = null
const getSession = async (accountId, newInstance = false) => {
  if (session && !newInstance) return session

  const client = await Client

  const store = await createWeb3ProviderEvmKeyStore(window.ethereum)
  const { getLoginManager } = createKeyStoreInteractor(
    client,
    store
  );
  if (!accountId) throw new Error("Account id is required")

  // this allows to login with the account id and get the session and use it for the blockchain calls, and mainly we need to call metamask login only once, and then we can use the session for all the blockchain calls
  session = await getLoginManager().login({
    accountId: accountId,
  });
  console.log('accountId', accountId)
  return session
}




export default Blockchain.initialize(
  chainId,
  new DirectoryService()
);

export { getSession };