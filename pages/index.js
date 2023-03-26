import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useEthereum from '../ethereum/useEthereum';



function Homepage() {
  const {connectWallet, account} = useEthereum();

  useEffect(() => {
    connectWallet();
  },[]);

  return (
    <div>
      <h1>Hello! You are at Homepage</h1>
    </div>
  );
}

export default Homepage;
