import { useEffect, useState } from "react";
import Card from "../../components/Card";
import useEthereum from "../../ethereum/useEthereum";
import { Button } from "@mui/material";
import styles from "../../styles/Button.module.css";
import BackButton from "../../components/BackButton";
import FormVerifyProduct from "../../components/Forms/FormVerifyProduct";

const index = () => {
  const { contract, connectWallet } = useEthereum();
  const [formSelected, setFormSelected] = useState("");
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  const backContent = (
    <div>
    <BackButton onClick={()=>{setFlip(false);}}></BackButton>
    {formSelected==='Verify Product' && <FormVerifyProduct contract={contract}/>}
    {formSelected==='Transfer Ownership' && <FormVerifyProduct contract={contract}/>}
    {formSelected==='Mark Product As Stolen' && <FormVerifyProduct contract={contract}/>}
    </div>
  );
  const frontContent = (
    <div>
      <Button
        className={styles.btn}
        onClick={() => {
          setFlip(true);
          setFormSelected("Verify Product");
        }}
      >
        Verify Product
      </Button>
      <Button
        className={styles.btn}
        onClick={() => {
          setFlip(true);
          setFormSelected("Transfer Ownership");
        }}
      >
        Transfer Ownership
      </Button>
      <Button
        className={styles.btn}
        onClick={() => {
          setFlip(true);
          setFormSelected("Mark Product As Stolen");
        }}
      >
        Mark Product As Stolen
      </Button>
    </div>
  );
  return (
    <div 
    style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card flip={flip} backContent={backContent} frontContent={frontContent} />
    </div>
  );
};

export default index;
