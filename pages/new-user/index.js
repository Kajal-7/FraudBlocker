import React, { useState, useEffect } from 'react'
import Card from '../../components/Card'
import FormCustomer from '../../components/Forms/FormCustomer'
import FormRetailer from '../../components/Forms/FormRetailer'
import FormManufacturer from '../../components/Forms/FormManufacturer'
import { Button } from '@mui/material';
import BackButton from '../../components/BackButton'
import useEthereum from '../../ethereum/useEthereum'
import styles from '../../styles/Button.module.css'

const index = () => {

  const {contract,connectWallet} = useEthereum();
  useEffect(()=>{connectWallet()},[])

    const [formSelected, setFormSelected] = useState('');
    const [flip, setFlip] = useState(false);


    const backContent = (
      <div>
        <BackButton onClick={()=>setFlip(false)}/>
        {formSelected==='Customer' &&  <FormCustomer contract={contract}/>}
        {formSelected==='Retailer' &&  <FormRetailer contract={contract}/>}
        {formSelected==='Manufacturer' &&  <FormManufacturer contract={contract}/>}
      </div>
    )

    const frontContent = (
      <div>
        <Button
          className={styles.btn}
          onClick={() => {
            setFlip(true)
            setFormSelected('Customer')
          }}
        >
          Customer
        </Button>
        <br/>
        <Button
          className={styles.btn}
          onClick={() => {
            setFlip(true)
            setFormSelected('Manufacturer')
          }}
        >
          Manufacturer
        </Button>
        <br/>
        <Button
          className={styles.btn}
          onClick={() => {
            setFlip(true)
            setFormSelected('Retailer')
          }}
        >
          Retailer
        </Button>
      </div>
    )

  return (
    <div style={{height: "100vh", display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Card flip={flip} frontContent={frontContent} backContent={backContent}/>
    </div>
  )
}

export default index