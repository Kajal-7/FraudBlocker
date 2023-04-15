import {ethers} from 'ethers';
import {useState } from "react";
import contractJSON from './ProductAuthentication.json';

function useEthereum(){
    const [account, setAccount]= useState(null);
    const [error, setError] = useState(null);
    const [contract, setContract] = useState();
    const [user, setUser] = useState(null);
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
              '0x5FbDB2315678afecb367f032d93F642f64180aa3',
              contractJSON.abi,
              signer
            )
           
            const _user = await productAuthenticationContract.whoIsTheUser(address)
          
          
            setUser(_user)
            setAccount(address)
            setContract(productAuthenticationContract);
          } else {
            setError('Please install metamask to continue')
          }
        } catch (err) {
          console.log('Error',err);
        }
      };

    

    return {
        connectWallet,
        account,
        error,
        contract,
        user,
        
    }
};

export default useEthereum;