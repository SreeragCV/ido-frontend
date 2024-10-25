//lnger

export const VAULT_URL = "https://vault-testnet.chromia.com";
const BRID_SEVER = "http://localhost:3010/get-brid";
// const BRID_SEVER = 'https://agegy5geef.execute-api.ap-south-1.amazonaws.com/get-brid'

// let BRID = '189C96B9373BCB777D8F63745956B8D59734B689F7DAB04D6E09CB32D0C53C57'
// let BRID = "41C78B4E7BEFD46BD4673D86AD6A877A670F723A21C0ACB43D9DF28DEE80FBC3";
let BRID = "2E1C5D5133C8A0B534194406183742B6C28606003102AB4C102D1FE37638B528";

export const AUTH_SERVER_URL = "http://localhost:8080";
// export const AUTH_SERVER_URL = "https://nqzlbgkax7.execute-api.ap-south-1.amazonaws.com/";

const getBrid = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", BRID_SEVER, false);
  try {
    xhr.send();

    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      BRID = data.brid;
    } else {
      alert("Having an issue with Fetching Block chain RID , so app wont work");
    }
  } catch (e) {
    alert("Having an issue with Fetching Block chain RID , so app wont work");
  }
};
// getBrid()

export const BLOCKCHAIN_RID = BRID;

// export const NODE_ADDRESS ="https://g2u94h9ka4.execute-api.ap-south-1.amazonaws.com";

export const NODE_ADDRESS = "http://localhost:7740";
// export const NODE_ADDRESS = "http://localhost:7740";

export const SERVER_ADDRESS = "http://localhost:3010";

// export const SERVER_ADDRESS =
//   "https://rfeio9ku98.execute-api.ap-south-1.amazonaws.com";

export const GENERATE_SOURCEMAP = false;

export const chainId = Buffer.from(BLOCKCHAIN_RID, "hex");

export const DECIMAL_REGEX = /^\d{1,}(\.\d{0,18})?$/;

export const TX_LIMIT = 5;

export const POOL_LIMIT = 5;

export const MAX_BET_LIMIT = 10000;

