import { Web3Provider } from "@ethersproject/providers";
import { NODE_ADDRESS } from "../constant";

const { createClient } = require("postchain-client");
const { createConnection } = require("@chromia/ft4");

const url = NODE_ADDRESS;

export const client = createClient({
  nodeURLPool: url,
  blockchainIID: 0,
});

export const connection = createConnection(client);
//takes message return form the rell backend and signs it and returns the address and signature
export const signMessageAndGetAddress = async (signMessage) => {
  const provider = new Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const signature = await signer.signMessage(signMessage);
  return { address, signature };
};
