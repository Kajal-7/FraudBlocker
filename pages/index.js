import contractJSON from '../ethereum/ProductAuthentication.json';
import { useEffect, useState } from "react";
import { ethers } from "ethers";



function Homepage() {
  const [account, setAccount]= useState();
  const [signer, setSigner] = useState();
  const [ourContract, setOurContract]= useState();
  const [provider, setProvider] = useState();

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          // find the account this will open metamask and get the account
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          // if metamask account changed reload the window
          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          // can add functions for network and chain change also

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const productAuthenticationContract = new ethers.Contract(
            "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            contractJSON.abi,
            signer
          );

          setAccount(account);
          setProvider(provider);
          setSigner(signer);
          setOurContract(productAuthenticationContract);
          console.log(account);
          console.log(productAuthenticationContract);
        } else {
          alert("Install Metamask");
        }
      } catch (err) {
        console.log(err);
      }
    };
    connectWallet();
  },[]);
  return (
    <div>
      <h1>Hello! You are at Homepage</h1>
    </div>
  );
}

export default Homepage;
