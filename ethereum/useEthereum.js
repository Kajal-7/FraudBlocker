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
            const acc = await provider.send("eth_requestAccounts", []);
            console.log('Accounts => ',acc)

            // if metamask account changed reload the window
            // can add functions for network and chain change also
            window.ethereum.on("accountsChanged", () => {
              window.location.reload();
            });
  
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const productAuthenticationContract = new ethers.Contract(
              '0x7660a28495A9447A7B9577943F1970EE9F9D1ba7',
              contractJSON.abi,
              signer
            )
           
            const _user = await productAuthenticationContract.whoIsTheUser(address)
          
            console.log(address,_user)
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