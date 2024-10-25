import { DirectoryServiceBase, ChainConnectionInfo } from 'ft3-lib';
import { BLOCKCHAIN_RID, NODE_ADDRESS } from '../constant';

const chainList = [

  // Our local chain
  new ChainConnectionInfo(
    Buffer.from(
      BLOCKCHAIN_RID,
      'hex'
    ),
    NODE_ADDRESS,
  ),
];

export default class DirectoryService extends DirectoryServiceBase {
  constructor() {
    super(chainList);
  }
}