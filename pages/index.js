import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useEthereum from '../ethereum/useEthereum';
import PopUp from "../components/PopUp";



function Homepage() {
  const {connectWallet, address, error} = useEthereum();

  useEffect(() => {
    connectWallet();
  },[]);

  return (
    <>
      {error ? <PopUp message={error} /> : 
      <h1>Hello! You are at Homepage</h1>  
      }
      
    </>
  );
}

export default Homepage;
