  import { SingleSignatureAuthDescriptor } from "ft3-lib";

export const getStoredAccount = () => {
  const storage = JSON.parse(localStorage.getItem("ft3_account"));
  if (storage) {
    // render and return storage
    return {
      user: {
        keyPair: {
          privKey: Buffer(storage.user.keyPair.privKey),
          pubKey: Buffer(storage.user.keyPair.pubKey),
        },
        authDescriptor: new SingleSignatureAuthDescriptor(
          Buffer(storage.user.keyPair.pubKey),
          ["T"]
        ),
      },
    };
  }
  console.log("NO ACCOUNT HAD BEEN FOUND");
  return null;
};

export const setStoredAccount = ({ user, account }) => {
  localStorage.setItem(
    "ft3_account",
    JSON.stringify({
      user,
      account,
    })
  );
};

export const deleteStoredAccount = () => {
  //   localStorage.removeItem("ft3_account");
  //   localStorage.removeItem("chromia_account");
  localStorage.clear();
};
