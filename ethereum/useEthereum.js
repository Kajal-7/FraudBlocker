import {ethers} from 'ethers';
import {useState } from "react";
import contractJSON from './ProductAuthentication.json';

function useEthereum(){
    const [address, setAddress]= useState();
    const [error, setError] = useState(null);
    
    //Function to connect metamask wallet
    const connectWallet = async () => {
        try {
          const { ethereum } = window;
          if (ethereum) {
           
            const provider = new ethers.providers.Web3Provider(ethereum);
            // find the account this will open metamask 
            await provider.send("eth_requestAccounts", []);

            // if metamask account changed reload the window
            // can add functions for network and chain change also
            window.ethereum.on("accountsChanged", () => {
              window.location.reload();
            });
  
            
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const productAuthenticationContract = new ethers.Contract(
              "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              contractJSON.abi,
              signer
            );
            
            setAccount(address);
            // console.log(productAuthenticationContract);
          } else {
            setError('Please install metamask to continue')
          }
        } catch (err) {
          console.log(err);
        }
      };

    return {
        connectWallet,
        address,
        error
        
    }
};

export default useEthereum;