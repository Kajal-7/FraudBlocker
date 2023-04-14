import React, { useState } from 'react'
import Card from '../../components/Card'
import FormCustomer from '../../components/FormCustomer'
import FormRetailer from '../../components/FormRetailer'
import FormManufacturer from '../../components/FormManufacturer'
import { Button } from '@mui/material';
import BackButton from '../../components/BackButton';

const index = () => {

    const [formSelected, setFormSelected] = useState('Customer');
    const [flip, setFlip] = useState(false);

    const backContent = (
      <div>
        <BackButton onClick={()=>setFlip(false)}/>
        {formSelected==='Customer' &&  <FormCustomer/>}
        {formSelected==='Retailer' &&  <FormRetailer/>}
        {formSelected==='Manufacturer' &&  <FormManufacturer/>}
      </div>
    )

    const frontContent = (
      <div>
        <Button
          onClick={() => {
            setFlip(true)
            setFormSelected('Customer')
          }}
        >
          Customer
        </Button>
        <Button
          onClick={() => {
            setFlip(true)
            setFormSelected('Manufacturer')
          }}
        >
          Manufacturer
        </Button>
        <Button
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