import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useEthereum from "../ethereum/useEthereum";
import PopUp from "../components/PopUp";
import Image from "next/image";
import { Grid, Button, Typography } from "@mui/material";

function Homepage() {
  const { connectWallet, address, error } = useEthereum();

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
     <div style={{margin: "20px 40px"}}>
     <Grid className="grid" container spacing={2}>
          <Grid item lg={6}>
            <div>
              <Typography style={{margin: "20px 0px"}}variant="h2">
                About Us
              </Typography>
              <Typography style={{margin: "20px 0px"}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              </Typography>
                <Button
                  variant="outlined"
                  sx={{ boxShadow: 0 }}
                >
                  Get Started
                </Button>
            </div>
          </Grid>
          <Grid item lg={6}>
            <Image src={require("../assets/gsSvg.svg")} alt="Get Started Svg"></Image>
          </Grid>
        </Grid>
    </div>
      {error && <PopUp message={error} />}
    </div>
  );
}

export default Homepage;
