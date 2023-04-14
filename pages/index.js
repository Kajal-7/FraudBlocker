import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useEthereum from "../ethereum/useEthereum";
import PopUp from "../components/PopUp";
import Image from "next/image";
import { Grid, Button, Typography, AppBar, Toolbar } from "@mui/material";
import { useRouter } from "next/router";

function Homepage() {
  const { connectWallet, error, user } = useEthereum();

  const router  = useRouter()

  useEffect(() => {
    connectWallet();   
  }, []);

  function handleClick() {
    if (user === null) {
      alert('Connect metamask')
    } 
    else if (user === 'new') router.push('/new-user')
    else if (user === 'customer') router.push('/customer')
    else if(user === "retailer") router.push('/retailer')
    else router.push('/manufacturer')
    
  }

  const styleGsBtn = {
    marginTop: "50px",
    fontSize: "18px",
    fontWeight: "400",
    boxShadow: 0,
    bgcolor: "#029C54",
    '&:hover': {
      backgroundColor: "#3BBB53",
    },
  };
  const styleHelpBtn = {
    marginRight: "20px",
    fontSize: "18px",
    fontWeight: "400",
    boxShadow: 0,
    bgcolor: "#FF6F4F",
    '&:hover': {
      backgroundColor: "#FF6341",
    },
  };

  return (
    <div>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#070707" }}>
        <Toolbar sx={{ margin: "20px 40px 20px 32px" }}>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Logo
          </Typography>
          <Button
            variant="contained"
            sx={styleHelpBtn}
          >
            Help
          </Button>
        </Toolbar>
      </AppBar>
      {/* Body */}
      <div style={{ margin: "20px 40px" }}>
        <Grid className="grid" container spacing={2}>
          <Grid item lg={6}>
            <div>
              <Typography sx={{ margin: "20px 0px" }} variant="h2">
                About Us
              </Typography>
              <Typography sx={{ margin: "20px 0px", color: "#DAC6FB" }}>
                Description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore
              </Typography>
              <Button
                variant="contained"
                sx={styleGsBtn}
                onClick={handleClick}
              >
                Get Started
              </Button>
            </div>
          </Grid>
          <Grid item lg={6}>
            <Image
              src={require("../assets/gsSvg.svg")}
              alt="Get Started Svg"
            ></Image>
          </Grid>
        </Grid>
      </div>
      {error && <PopUp message={error} />}
    </div>
  );
}

export default Homepage;
